import { frictionAngleMapping } from '@/data/pileTable'

export const calculatePileStrength = (inputs: any) => {
  const updated = { ...inputs }

  const {
    frictionAngle,
    pileHeight,
    pileDiameter,
    soilDensity,
    safetyFactor,
    ks,
    cohension,
    nq,
    nc,
    reductionStrength
  } = updated

  // Friction Angle → Factor, Nc, Nq
  if (frictionAngle) {
    const angle = parseFloat(frictionAngle)
    updated.factor = parseFloat(
      (0.5 * Math.PI * Math.tan((angle * Math.PI) / 180)).toFixed(5)
    )

    const mapping = frictionAngleMapping[angle]
    if (mapping) {
      updated.nc = mapping.nc
      updated.nq = mapping.nq
    } else {
      updated.nc = 0
      updated.nq = 0
    }
  }

  // Friction Resistance A-S and M-H
  if (
    safetyFactor &&
    soilDensity &&
    pileHeight &&
    ks &&
    updated.factor &&
    pileDiameter
  ) {
    const frictionResistanceAS =
      (safetyFactor *
        soilDensity *
        pileHeight *
        ks *
        updated.factor *
        pileDiameter *
        pileHeight) /
      1_000_000_000

    const effectivePileHeight =  pileHeight - 1500
    const frictionResistanceMH =
      (safetyFactor *
        soilDensity *
        pileHeight *
        ks *
        updated.factor *
        pileDiameter *
        effectivePileHeight) /
      1_000_000_000

    updated.frictionResistanceAS = parseFloat(frictionResistanceAS.toFixed(2))
    updated.frictionResistanceMH = parseFloat(frictionResistanceMH.toFixed(2))
  }

  // Weight
  if (pileHeight && pileDiameter) {
    const weight =
      (0.9 * 24 * Math.pow(pileDiameter, 2) * Math.PI * pileHeight) /
      4_000_000_000
    updated.weight = parseFloat(weight.toFixed(2))
  }

  // End Bearing
  if (
    reductionStrength &&
    pileDiameter &&
    updated.nc &&
    cohension &&
    updated.nq &&
    pileHeight &&
    soilDensity
  ) {
    const diameterFactor = (pileDiameter / 2000) ** 2
    const term1 = 1.3 * updated.nc * cohension
    const term2 = (updated.nq * pileHeight * soilDensity) / 1000
    const term3 = (0.3 * soilDensity * pileDiameter * 11.7) / 1000

    const endBearing =
      reductionStrength * Math.PI * diameterFactor * (term1 + term2 + term3)

    updated.endBearing = parseFloat(endBearing.toFixed(2))
  }

  // Final Results
  const totalUpliftResistance =
    updated.weight * 0.9 + (updated.frictionResistanceAS || 0)
  const totalPileCapacityAS =
    (updated.frictionResistanceAS || 0) + (updated.endBearing || 0)
  const totalPileCapacityMH =
    (updated.frictionResistanceMH || 0) + (updated.endBearing || 0)

  return {
    ...updated,
    totalUpliftResistance: parseFloat(totalUpliftResistance.toFixed(2)),
    totalPileCapacityAS: parseFloat(totalPileCapacityAS.toFixed(2)),
    totalPileCapacityMH: parseFloat(totalPileCapacityMH.toFixed(2))
  }
}
