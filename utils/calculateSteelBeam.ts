export const calculateSteelBeam = (inputs: any) => {
  const {
    beamSpan,
    floorLoadWidth,
    roofLoadWidth,
    wallHeight,
    pointFloorLoadArea,
    pointRoofLoadArea,
    floorDeadLoad,
    roofDeadLoad,
    floorLiveLoad,
    wallLoad,
    steelUdlWeight,
    steelPointWeight
  } = inputs

  const updated = { ...inputs }

  updated.udlDeadLoad =
    (floorLoadWidth * floorDeadLoad +
      roofLoadWidth * roofDeadLoad +
      wallHeight * wallLoad) /
    1000

  updated.udlLiveLoad =
    (floorLoadWidth * floorLiveLoad + roofLoadWidth * 0.25) / 1000

  updated.pointDeadLoad =
    pointFloorLoadArea * floorDeadLoad + pointRoofLoadArea * roofDeadLoad

  updated.pointLiveLoad =
    pointFloorLoadArea * floorLiveLoad + pointRoofLoadArea * 0.25

  updated.udlServiceLoad =
    updated.udlDeadLoad + updated.udlLiveLoad * 0.7 + steelUdlWeight

  updated.pointServiceLoad =
    updated.pointDeadLoad + updated.pointLiveLoad + steelPointWeight

  updated.deflectionLimit = Math.min(beamSpan / 500, 10)

  updated.momentOfInertia =
    (0.013021 * updated.udlServiceLoad * Math.pow(beamSpan, 4)) /
      (200000 * updated.deflectionLimit) +
    (0.020833 * updated.pointServiceLoad * 1000 * Math.pow(beamSpan, 3)) /
      (200000 * updated.deflectionLimit)

  updated.moment =
    ((1.2 * updated.udlDeadLoad + 1.5 * updated.udlLiveLoad) *
      Math.pow(beamSpan, 2)) /
      8000000 +
    ((1.2 * updated.pointDeadLoad + 1.5 * updated.pointLiveLoad) * beamSpan) /
      4000

  return updated
}
