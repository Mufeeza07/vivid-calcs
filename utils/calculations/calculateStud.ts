import { sectionOptions } from '../unit-values/dropdownValues'

const safeNumber = (value: number): number => {
  return isFinite(value) && !isNaN(value) ? value : 0
}

export const checkIsCombining = (sectionName: string): boolean => {
  return sectionOptions.some(
    opt =>
      opt.value === sectionName &&
      opt.label.toLowerCase().includes('combining compression and bending')
  )
}

export const calculateStudDesign = (inputs: any) => {
  const {
    ag,
    g,
    ixx,
    iyy,
    lex,
    ley,
    j,
    cb,
    yr,
    iw,
    lez,
    by,
    fy,
    depth,
    fol,
    fod,
    cs,
    ctf,
    isCombining,
    c,
    cr,
    cl,
    cw,
    phi,
    ri,
    lb,
    dl,
    tw
  } = inputs

  const updated = { ...inputs }

  //   updated.rx = parseFloat(Math.sqrt(ixx / ag).toFixed(8))

  updated.e = isCombining ? 200000 : 203000

  updated.rx = safeNumber(Math.sqrt(ixx / ag))
  updated.ry = safeNumber(Math.sqrt(iyy / ag))

  updated.r01 = safeNumber(
    Math.sqrt(
      Math.pow(updated.rx, 2) + Math.pow(updated.ry, 2) + Math.pow(yr, 2)
    )
  )

  updated.beta = safeNumber(1 - Math.pow(yr / updated.r01, 2))

  updated.fox = safeNumber(
    (Math.pow(3.14, 2) * updated.e) / Math.pow(lex / updated.rx, 2)
  )

  updated.foy = safeNumber(
    (Math.pow(3.14, 2) * updated.e) / Math.pow(ley / updated.ry, 2)
  )

  updated.foz = safeNumber(
    ((g * j) / (ag * Math.pow(updated.r01, 2))) *
      (1 + (Math.pow(3.14, 2) * updated.e * iw) / (g * j * Math.pow(lez, 2)))
  )

  updated.foxz = safeNumber(
    (1 / (2 * updated.beta)) *
      (updated.fox +
        updated.foz -
        Math.sqrt(
          Math.pow(updated.fox + updated.foz, 2) -
            4 * updated.beta * updated.fox * updated.foz
        ))
  )

  updated.foc = safeNumber(Math.min(updated.fox, updated.foxz))

  updated.lemda = safeNumber(Math.sqrt(fy / updated.foc))

  updated.mo = safeNumber(
    isCombining
      ? cb * ag * updated.r01 * Math.sqrt(updated.foy * updated.foz)
      : ((cs *
          Math.sqrt(
            Math.pow(by * 0.5, 2) +
              (Math.pow(updated.r01, 2) * updated.foz) / updated.fox
          ) +
          by * 0.5) *
          updated.fox *
          ag *
          cs) /
          ctf
  )

  // updated.mo = safeNumber(
  //   ((cs *
  //     Math.sqrt(
  //       Math.pow(by * 0.5, 2) +
  //         (Math.pow(updated.r01, 2) * updated.foz) / updated.fox
  //     ) +
  //     by * 0.5) *
  //     updated.fox *
  //     ag *
  //     cs) /
  //     ctf
  // )

  updated.fn1 = safeNumber(Math.pow(Math.pow(0.658, updated.lemda), 2) * fy)

  updated.fn2 = safeNumber((0.877 / Math.pow(updated.lemda, 2)) * fy)

  updated.fn = updated.lemda < 1.5 ? updated.fn1 : updated.fn2

  const zxf: Record<string, number | 'CALCULATE'> = {
    '70x41x0.75_unlipped_combining': 'CALCULATE',
    '70x41x0.75_lipped_combining': 1026.87,
    '70x41x0.75_lipped_tension': 1580,
    '70x41x0.75_lipped_compression': 1580,
    '70x41x0.95_unlipped_combining': 'CALCULATE',
    '90x41x0.75_lipped_combining': 'CALCULATE',
    '90x41x0.75_unlipped_tension': 1410,
    '90x41x0.95_lipped_tension': 1410,
    '90x41x0.95_lipped_compression': 3175,
    '90x41x0.95_lipped_combining': 'CALCULATE'
  }

  const zxfValues = zxf[inputs.sectionName]

  if (zxfValues === 'CALCULATE') {
    updated.zxf = safeNumber(ixx / (depth * 0.5))
  } else if (typeof zxfValues === 'number') {
    updated.zxf = zxfValues
  } else {
    updated.zxf = 0
  }

  updated.my = safeNumber(updated.zxf * fy)

  updated.mol = updated.zxf * fol
  updated.mod = updated.zxf * fod

  updated.mbe = safeNumber(
    updated.mo < 0.56 * updated.my
      ? updated.mo
      : updated.mo < 2.78 * updated.my
        ? 1.1111 * updated.my * (1 - (0.278 * updated.my) / updated.mo)
        : updated.my
  )

  updated.lemdaL = safeNumber(Math.sqrt(updated.mbe / updated.mol))
  updated.lemdaD = safeNumber(Math.sqrt(updated.my / updated.mod))
  updated.mbl = safeNumber(
    updated.lemdaL < 0.776
      ? updated.mbe
      : (1 - 0.15 * Math.pow(updated.mol / updated.mbe, 0.4)) *
          Math.pow(updated.mol / updated.mbe, 0.4) *
          updated.mbe
  )

  updated.mbd = safeNumber(
    updated.lemdaD < 0.673
      ? updated.my
      : Math.pow(1 - 0.22 * (updated.mod / updated.my), 0.5) *
          Math.pow(updated.mod / updated.my, 0.5) *
          updated.my
  )

  updated.iox = safeNumber(
    3.14 * updated.rx * Math.sqrt(updated.e / updated.fn)
  )
  updated.ioy = safeNumber(
    3.14 * updated.ry * Math.sqrt(updated.e / updated.fn)
  )

  updated.checkX = safeNumber(lex / (1.1 * updated.iox))
  updated.checkY = safeNumber(ley / (1.1 * updated.ioy))

  updated.gammaX = safeNumber(0.65 + (0.35 * lex) / (1.1 * updated.iox))
  updated.gammaY = safeNumber(0.65 + (0.35 * ley) / (1.1 * updated.ioy))

  updated.phixM = safeNumber(
    (0.9 * Math.min(updated.mbe, updated.mbl, updated.mbd)) / 1000000
  )

  updated.phixRb = safeNumber(
    (phi *
      Math.pow(tw, 2) *
      fy *
      (1 - cr * Math.sqrt(ri / tw)) *
      (1 + cl * Math.sqrt(lb / tw)) *
      (1 - cw * Math.sqrt(dl / tw))) /
      1000
  )

  return updated
}
