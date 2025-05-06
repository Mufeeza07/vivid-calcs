export const categoryOptions = [
  { value: 'AFFECTED_AREA_LESS_25M2', label: 'Affected Area < 25m²' },
  { value: 'AFFECTED_AREA_GREATER_25M2', label: 'Affected Area > 25m²' },
  { value: 'POST_DISASTER_BUILDING', label: 'Post Disaster Building' }
]

export const loadTypeOptions = [
  { value: 'PERMANENT_ACTION', label: 'Permanent Action (Dead Load)' },
  {
    value: 'ROOF_LIVE_LOAD_DISTRIBUTED',
    label: 'Roof Live Load - Distributed'
  },
  {
    value: 'ROOF_LIVE_LOAD_CONCENTRATED',
    label: 'Roof Live Load - Concentrated'
  },
  {
    value: 'FLOOR_LIVE_LOADS_DISTRIBUTED',
    label: 'Floor Live Loads - Distributed'
  },
  {
    value: 'FLOOR_LIVE_LOADS_CONCENTRATED',
    label: 'Floor Live Loads - Concentrated'
  },
  {
    value: 'PERMANENT_LONG_TERM_IMPOSED_ACTION',
    label: 'Permanent and Long-Term Imposed Action'
  },
  {
    value: 'PERMANENT_WIND_IMPOSED_ACTION',
    label: 'Permanent, Wind and Imposed Action'
  },
  {
    value: 'PERMANENT_WIND_ACTION_REVERSAL',
    label: 'Permanent and Wind Action Reversal'
  },
  {
    value: 'PERMANENT_EARTHQUAKE_IMPOSED_ACTION',
    label: 'Permanent, Earthquake and Imposed Action'
  },
  { value: 'FIRE', label: 'Fire' }
]

export const loadDirectionOptions = [
  { value: 'PARALLEL_TO_GRAINS', label: 'Parallel to Grains' },
  { value: 'PERPENDICULAR_TO_GRAINS', label: 'Perpendicular to Grains' }
]

export const jdTypeOptions = ['JD1', 'JD2', 'JD3', 'JD4', 'JD5', 'JD6'].map(
  v => ({
    value: v,
    label: v
  })
)

export const nailDiameterOptions = [2.5, 2.8, 3.15, 3.75, 4.5, 5, 5.6].map(
  v => ({
    value: v,
    label: v.toString()
  })
)

export const typeOptions = [
  { value: 'TIMBER_TO_TIMBER', label: 'Timber to Timber' },
  { value: 'TIMBER_TO_STEEL', label: 'Timber to Steel' }
]

export const timberThicknessOptions = [25, 35, 40, 45, 70, 90, 105, 120].map(
  v => ({
    value: `TT_${v}`,
    label: v.toString()
  })
)

export const boltSizeOptions = [
  'M6',
  'M8',
  'M10',
  'M12',
  'M16',
  'M20',
  'M24',
  'M30',
  'M36'
].map(size => ({ value: size, label: size }))

export const screwSizeOptions = [
  'SIZE_4',
  'SIZE_6',
  'SIZE_8',
  'SIZE_10',
  'SIZE_12',
  'SIZE_14',
  'SIZE_18'
].map(size => ({
  value: size,
  label: size.replace('SIZE_', '')
}))

export const frictionAngleOptions = [
  0, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36
].map(value => ({
  value: value.toString(),
  label: value.toString()
}))

export const sectionOptions = [
  {
    value: '70x41x0.75_unlipped_combining',
    label: '70x41x0.75 unlipped combining compression and bending'
  },
  {
    value: '70x41x0.75_lipped_combining',
    label: '70x41x0.75 lipped combining compression and bending'
  },
  {
    value: '70x41x0.75_lipped_tension',
    label: '70x41x0.75 lipped members in bending weaker axis C in tension'
  },
  {
    value: '70x41x0.75_lipped_compression',
    label: '70x41x0.75 lipped members in bending weaker axis C in compression'
  },
  {
    value: '70x41x0.95_unlipped_combining',
    label: '70x41x0.95 unlipped combining compression and bending'
  },
  {
    value: '90x41x0.75_lipped_combining',
    label: '90x41x0.75 lipped combining compression and bending'
  },
  {
    value: '90x41x0.75_unlipped_tension',
    label: '90x41x0.75 unlipped members in bending weaker axis C in tension'
  },
  {
    value: '90x41x0.95_lipped_tension',
    label: '90x41x0.95 lipped members in bending weaker axis C in tension'
  },
  {
    value: '90x41x0.95_lipped_compression',
    label: '90x41x0.95 lipped members in bending weaker axis C in compression'
  },
  {
    value: '90x41x0.95_lipped_combining',
    label: '90x41x0.95 lipped combining compression and bending'
  }
]
