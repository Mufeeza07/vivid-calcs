export const calculateShearScrewStrength = (inputs: any) => {
  const updated = { ...inputs }

  const k1Values = {
    PERMANENT_ACTION: 0.57,
    ROOF_LIVE_LOAD_DISTRIBUTED: 0.77,
    ROOF_LIVE_LOAD_CONCENTRATED: 0.86,
    FLOOR_LIVE_LOADS_DISTRIBUTED: 0.69,
    FLOOR_LIVE_LOADS_CONCENTRATED: 0.77,
    PERMANENT_LONG_TERM_IMPOSED_ACTION: 0.57,
    PERMANENT_WIND_IMPOSED_ACTION: 1.14,
    PERMANENT_WIND_ACTION_REVERSAL: 1.14,
    PERMANENT_EARTHQUAKE_IMPOSED_ACTION: 1.14,
    FIRE: 0.77
  }

  const screwJDValues = {
    JD1: [1720, 2560, 3570, 4720, 6000, 7380, 10550],
    JD2: [1280, 1950, 2700, 3570, 4520, 5560, 7950],
    JD3: [1010, 1520, 2120, 2800, 3570, 4380, 6270],
    JD4: [710, 1080, 1520, 2020, 2530, 3130, 4480],
    JD5: [510, 780, 1080, 1420, 1790, 2220, 3170],
    JD6: [370, 570, 780, 1010, 1310, 1620, 2290]
  }

  const screwIndexMap = {
    SIZE_4: 0,
    SIZE_6: 1,
    SIZE_8: 2,
    SIZE_10: 3,
    SIZE_12: 4,
    SIZE_14: 5,
    SIZE_18: 6
  }

  if (inputs.load) {
    updated.k13 =
      inputs.load === 'PARALLEL_TO_GRAINS'
        ? 1
        : inputs.load === 'PERPENDICULAR_TO_GRAINS'
          ? 0.6
          : 0
  }

  if (inputs.loadType) {
    updated.k1 = k1Values[inputs.loadType as keyof typeof k1Values] || 0
  }

  if (inputs.category) {
    updated.phi =
      inputs.category === 'AFFECTED_AREA_LESS_25M2'
        ? 0.85
        : inputs.category === 'AFFECTED_AREA_GREATER_25M2'
          ? 0.8
          : inputs.category === 'POST_DISASTER_BUILDING'
            ? 0.75
            : 0
  }

  if (inputs.screwSize) {
    const shankMap = {
      SIZE_4: 2.47,
      SIZE_6: 3.45,
      SIZE_8: 4.17,
      SIZE_10: 4.88,
      SIZE_12: 5.59,
      SIZE_14: 6.3,
      SIZE_18: 7.72
    }
    updated.shankDiameter =
      shankMap[inputs.screwSize as keyof typeof shankMap] || 0
  }

  const screwIdx = screwIndexMap[inputs.screwSize as keyof typeof screwIndexMap]
  if (inputs.jdType && screwIdx !== undefined) {
    const jdArray = screwJDValues[inputs.jdType as keyof typeof screwJDValues]
    if (jdArray) {
      updated.screwJD = jdArray[screwIdx] / 1000
    }
  }

  updated.designLoad =
    updated.k13 *
    updated.screwJD *
    updated.phi *
    updated.k14 *
    updated.k16 *
    updated.k17 *
    updated.k1
  updated.screwPenetration = updated.shankDiameter * 7
  updated.firstTimberThickness = updated.shankDiameter * 10

  return updated
}

export const calculateUpliftScrewStrength = (inputs: any) => {
  const updated = { ...inputs }

  const qkValues = {
    JD1: [81, 102, 125, 147, 168, 189, 232],
    JD2: [62, 79, 97, 112, 127, 145, 178],
    JD3: [48, 62, 73, 87, 100, 112, 137],
    JD4: [37, 46, 56, 66, 75, 85, 104],
    JD5: [29, 37, 44, 52, 60, 68, 83],
    JD6: [23, 29, 35, 41, 46, 52, 64]
  }

  const screwIndexMap = {
    SIZE_4: 0,
    SIZE_6: 1,
    SIZE_8: 2,
    SIZE_10: 3,
    SIZE_12: 4,
    SIZE_14: 5,
    SIZE_18: 6
  }

  if (inputs.load) {
    updated.k13 =
      inputs.load === 'PARALLEL_TO_GRAINS'
        ? 1
        : inputs.load === 'PERPENDICULAR_TO_GRAINS'
          ? 0.6
          : 0
  }

  if (inputs.category) {
    updated.phi =
      inputs.category === 'AFFECTED_AREA_LESS_25M2'
        ? 0.85
        : inputs.category === 'AFFECTED_AREA_GREATER_25M2'
          ? 0.8
          : inputs.category === 'POST_DISASTER_BUILDING'
            ? 0.75
            : 0
  }

  if (inputs.screwSize) {
    const shankMap = {
      SIZE_4: 2.47,
      SIZE_6: 3.45,
      SIZE_8: 4.17,
      SIZE_10: 4.88,
      SIZE_12: 5.59,
      SIZE_14: 6.3,
      SIZE_18: 7.72
    }
    updated.shankDiameter =
      shankMap[inputs.screwSize as keyof typeof shankMap] || 0
  }

  const screwIdx = screwIndexMap[inputs.screwSize as keyof typeof screwIndexMap]
  if (inputs.jdType && screwIdx !== undefined) {
    const jdArray = qkValues[inputs.jdType as keyof typeof qkValues]
    if (jdArray) {
      updated.qk = jdArray[screwIdx]
    }
  }

  updated.designLoad =
    (updated.k13 * updated.phi * updated.lp * updated.qk) / 1000

  return updated
}
