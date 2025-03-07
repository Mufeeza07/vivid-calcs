import { parallelLoadTable, perpendicularLoadTable } from '@/data/boltTables'

export const calculateBoltStrength = (inputs: any) => {
  const { phi, k1, k16, k17, qsk, load, jdType, timberThickness, boltSize } =
    inputs

  let updatedState = { ...inputs }

  if (inputs.category) {
    updatedState.phi =
      inputs.category === 'AFFECTED_AREA_LESS_25M2'
        ? 0.85
        : inputs.category === 'AFFECTED_AREA_GREATER_25M2'
          ? 0.8
          : inputs.category === 'POST_DISASTER_BUILDING'
            ? 0.75
            : 0
  }

  const table =
    load === 'PARALLEL_TO_GRAINS' ? parallelLoadTable : perpendicularLoadTable

  if (jdType && timberThickness && boltSize) {
    const thicknessRow = table[jdType]?.[timberThickness]
    if (thicknessRow) {
      updatedState.qsk = thicknessRow[boltSize]
        ? thicknessRow[boltSize] / 1000
        : 0
    } else {
      updatedState.qsk = 0
    }
  }

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

  if (inputs.loadType) {
    updatedState.k1 = k1Values[inputs.loadType] || 0
  }

  // Calculate Design Strength
  updatedState.designStrength = phi * k1 * k16 * k17 * qsk

  return updatedState
}
