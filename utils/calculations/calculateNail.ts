export type NailInputs = {
  category?: string
  jdType?: string
  load?: string
  loadType?: string
  nailDiameter?: number | string
  k13?: number
  screwJD?: number
  phi?: number
  k1?: number
  k14?: number
  k16?: number
  k17?: number
  type?: string
  jobId?: string
  note?: string
}

export const calculateNailStrength = (inputs: NailInputs) => {
  // console.log('getting called')
  const updated = { ...inputs }

  const phiMap: Record<string, number> = {
    AFFECTED_AREA_LESS_25M2: 0.85,
    AFFECTED_AREA_GREATER_25M2: 0.8,
    POST_DISASTER_BUILDING: 0.75
  }

  if (inputs.category) {
    updated.phi = phiMap[inputs.category] ?? 0
  }

  const k1Values: Record<string, number> = {
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
    updated.k1 = k1Values[inputs.loadType] ?? 0
  }

  if (inputs.load === 'PARALLEL_TO_GRAINS') {
    updated.k13 = 1
  } else if (inputs.load === 'PERPENDICULAR_TO_GRAINS') {
    updated.k13 = 0.6
  }

  const nailDiameterValues = [2.5, 2.8, 3.15, 3.75, 4.5, 5, 5.6]
  const jdTypes = ['JD1', 'JD2', 'JD3', 'JD4', 'JD5', 'JD6']

  const jdValues = [
    [1285, 1565, 1920, 2610, 3570, 4310, 5250],
    [975, 1180, 1445, 1960, 2700, 3245, 3955],
    [765, 930, 1135, 1550, 2125, 2565, 3125],
    [545, 665, 810, 1110, 1520, 1830, 2225],
    [445, 545, 680, 915, 1255, 1505, 1830],
    [340, 415, 500, 695, 945, 1135, 1385]
  ]

  const jdIndex = jdTypes.indexOf(inputs.jdType || '')
  const nailIndex = nailDiameterValues.indexOf(
    parseFloat(inputs.nailDiameter as string)
  )

  if (jdIndex !== -1 && nailIndex !== -1) {
    updated.screwJD = jdValues[jdIndex][nailIndex] / 1000
  }

  const k13 = updated.k13 ?? 0
  const screwJD = updated.screwJD ?? 0
  const phi = updated.phi ?? 0
  const k1 = updated.k1 ?? 0
  const k14 = updated.k14 ?? 1
  const k16 = updated.k16 ?? 1
  const k17 = updated.k17 ?? 1

  const nailDiameter = parseFloat(updated.nailDiameter as string) || 0

  const designLoad = k13 * screwJD * phi * k14 * k16 * k17 * k1
  const screwPenetration = nailDiameter * 7
  const firstTimberThickness = nailDiameter * 10

  return {
    ...updated,
    designLoad,
    screwPenetration,
    firstTimberThickness
  }
}
