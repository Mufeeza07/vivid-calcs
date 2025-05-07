import JobSelector from '@/components/JobSelector'
import {
  buttonsBarStyle,
  calculateButtonStyle,
  cardStyle,
  dropDownStyle,
  resultFieldStyle,
  saveButtonStyle,
  textFieldStyle
} from '@/styles/moduleStyle'
import { sectionOptions } from '@/utils/unit-values/dropdownValues'
import {
  calculateStudDesign,
  checkIsCombining
} from '@/utils/calculations/calculateStud'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import ConfirmationDialog from '@/components/ConfirmationBox'

const StudCalculator = () => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [inputs, setInputs] = useState({
    jobId: '',
    title: '',
    sectionName: '',
    e: 0,
    g: 80000,
    ag: 0,
    fy: 0,
    ixx: 0,
    iyy: 0,
    iox: 0,
    ioy: 0,
    j: 0,
    iw: 0,
    yr: 0,
    by: 0,
    cb: 0,
    lex: 0,
    ley: 0,
    lez: 0,
    m1: 0,
    m2: 0,
    ctf: 0,
    cs: 0,
    gammaX: 0,
    gammaY: 0,
    rx: 0,
    ry: 0,
    r01: 0,
    beta: 0,
    checkX: 0,
    checkY: 0,
    depth: 0,
    fox: 0,
    foy: 0,
    foz: 0,
    foxz: 0,
    foc: 0,
    mo: 0,
    lemda: 0,
    fn1: 0,
    fn2: 0,
    fn: 0,
    zxf: 0,
    my: 0,
    fol: 0,
    fod: 0,
    mol: 0,
    mod: 0,
    mbe: 0,
    mbl: 0,
    mbd: 0,
    lemdaL: 0,
    lemdaD: 0,
    phixM: '',
    t: 0,
    nce: 0,
    nol: 0,
    ncl: 0,
    ny: 0,
    nod: 0,
    ncd: 0,
    phixNc: '',
    c: 0,
    cr: 0,
    cl: 0,
    cw: 0,
    phi: 0,
    ri: 0,
    lb: 0,
    dl: 0,
    tw: 0,
    note: 0
  })

  const [results, setResults] = useState({
    phixM: null as number | null,
    phixRb: null as number | null,
    phixNc: null as number | null
  })
  const isCombining = useMemo(
    () => checkIsCombining(inputs.sectionName),
    [inputs.sectionName]
  )

  // console.log('isCombig in main ', isCombining)

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = event.target

    setInputs(prev => {
      const updatedValue =
        name === 'jobId' || name === 'title' || name === 'sectionName'
          ? value
          : value === ''
            ? ''
            : parseFloat(value) || 0

      const updatedInputs = { ...prev, [name!]: updatedValue }

      const sectionToCheck =
        name === 'sectionName' ? value : updatedInputs.sectionName

      return calculateStudDesign({
        ...updatedInputs,
        isCombining: checkIsCombining(sectionToCheck)
      })
    })
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const calculateResults = () => {
    const updated = calculateStudDesign(inputs)
    setInputs(updated)
    setResults({
      phixM: updated.phixM ?? null,
      phixRb: updated.phixRb ?? null,
      phixNc: updated.phixNc ?? null
    })
  }
  const handleConfirmSave = () => {}

  return (
    <>
      <ToastContainer autoClose={3000} />
      <Box>
        <Typography
          variant='h5'
          sx={{
            color: '#0288d1',
            backgroundColor: '#1e1e1e',
            textAlign: 'center',
            p: 2,
            border: '1px solid #0288d1',
            borderRadius: 1,
            mb: 2
          }}
        >
          Stud Design Calculator
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', md: 'row' }
          }}
        >
          {/* Left */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Paper sx={cardStyle}>
              <JobSelector
                jobId={inputs.jobId}
                onChange={newJobId =>
                  setInputs(prev => ({ ...prev, jobId: newJobId }))
                }
              />

              <FormControl fullWidth>
                <InputLabel sx={{ color: '#0288d1' }}>Section Name</InputLabel>
                <Select
                  name='sectionName'
                  label='Section Name'
                  value={inputs.sectionName}
                  onChange={handleChange}
                  sx={dropDownStyle()}
                >
                  {sectionOptions.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                name='title'
                label='Title'
                value={inputs.title}
                onChange={handleChange}
                fullWidth
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                type='number'
                name='ag'
                label='Ag (mm²)'
                value={inputs.ag}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='fy'
                label='Fy (mpa)'
                value={inputs.fy}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='ixx'
                label='Ixx (mm⁴)'
                value={inputs.ixx}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='iyy'
                label='Iyy (mm⁴)'
                value={inputs.iyy}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='iw'
                label='Iw (mm⁶)'
                value={inputs.iw}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='j'
                label='J (mm⁴)'
                value={inputs.j}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='yr'
                label='Yr (mm)'
                value={inputs.yr}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              {isCombining ? (
                <TextField
                  type='number'
                  name='cb'
                  label='Cb (mm)'
                  value={inputs.cb}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />
              ) : (
                <TextField
                  type='number'
                  name='by'
                  label='By (mm)'
                  value={inputs.by}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  fullWidth
                  inputProps={{ min: 0 }}
                  sx={textFieldStyle}
                />
              )}
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                type='number'
                name='lex'
                label='Lex (mm)'
                value={inputs.lex}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='ley'
                label='Ley (mm)'
                value={inputs.ley}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='lez'
                label='Lez (mm)'
                value={inputs.lez}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='m1'
                label='M1'
                value={inputs.m1}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='m2'
                label='M2'
                value={inputs.m2}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='ctf'
                label='Ctf'
                value={inputs.ctf}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='cs'
                label='Cs'
                value={inputs.cs}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                sx={textFieldStyle}
              />
            </Paper>

            {isCombining && (
              <Paper sx={cardStyle}>
                <Typography
                  variant='h5'
                  sx={{
                    color: '#0288d1',
                    backgroundColor: '#1e1e1e',
                    textAlign: 'center',
                    p: 2,
                    border: '1px solid #0288d1',
                    borderRadius: 1
                  }}
                >
                  Compression
                </Typography>
                {['t', 'nce', 'nol', 'ncl', 'ny', 'nod', 'ncd'].map(field => (
                  <TextField
                    key={field}
                    name={field}
                    label={field.toUpperCase()}
                    value={inputs[field as keyof typeof inputs]}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    fullWidth
                    sx={textFieldStyle}
                  />
                ))}
              </Paper>
            )}

            <Paper sx={cardStyle}>
              <TextField
                type='number'
                name='depth'
                label='Depth (mm)'
                value={inputs.depth}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='fol'
                label='Fol (mpa)'
                value={inputs.fol}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='fod'
                label='Fod (mpa)'
                value={inputs.fod}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <Typography
                variant='h5'
                sx={{
                  color: '#0288d1',
                  backgroundColor: '#1e1e1e',
                  textAlign: 'center',
                  p: 2,
                  border: '1px solid #0288d1',
                  borderRadius: 1
                }}
              >
                Bearing
              </Typography>

              <TextField
                type='number'
                name='c'
                label='C '
                value={inputs.c}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='cr'
                label='Cr '
                value={inputs.cr}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='cl'
                label='Cl '
                value={inputs.cl}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='cw'
                label='Cw '
                value={inputs.cw}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='phi'
                label='Phi '
                value={inputs.phi}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='ri'
                label='ri'
                value={inputs.ri}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='lb'
                label='lb (mm)'
                value={inputs.lb}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='dl'
                label='dl (mm)'
                value={inputs.dl}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />

              <TextField
                type='number'
                name='tw'
                label='tw (mm)'
                value={inputs.tw}
                onChange={handleChange}
                onFocus={handleFocus}
                fullWidth
                inputProps={{ min: 0 }}
                sx={textFieldStyle}
              />
            </Paper>
          </Box>

          {/* right  */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: { xs: '100%', sm: 'auto' }
            }}
          >
            <Paper sx={cardStyle}>
              <TextField
                name='e'
                label='E (mpa)'
                value={inputs.e}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
              <TextField
                name='g'
                label='G (mpa)'
                value={inputs.g}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='rx'
                label='rx (mm)'
                value={inputs.rx}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='ry'
                label='ry (mm)'
                value={inputs.ry}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='iox'
                label='Iox (mm)'
                value={inputs.iox}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='ioy'
                label='Ioy (mm)'
                value={inputs.ioy}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='checkX'
                label='T-check X'
                value={inputs.checkX}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='checkY'
                label='T-check Y'
                value={inputs.checkY}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='gammaX'
                label='Gamma-X'
                value={inputs.gammaX}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='gammaY'
                label='Gamma-Y'
                value={inputs.gammaY}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='r01'
                label='r01 (mm)'
                value={inputs.r01}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='beta'
                label='Beta'
                value={inputs.beta}
                // onChange={handleChange}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='fox'
                label='Fox (mpa)'
                value={inputs.fox}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='foy'
                label='Foy (mpa)'
                value={inputs.foy}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='foz'
                label='Foz (mpa)'
                value={inputs.foz}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='foxz'
                label='Foxz (mpa)'
                value={inputs.foxz}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='foc'
                label='Foc (mpa)'
                value={inputs.foc}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='lemda'
                label='Lemda'
                value={inputs.lemda}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='mo'
                label='Mo (N-mm)'
                value={inputs.mo}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='fn1'
                label='Fn1 (mpa)'
                value={inputs.fn1}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='fn2'
                label='Fn2 (mpa)'
                value={inputs.fn2}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='fn'
                label='Fn (mpa)'
                value={inputs.fn}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='zxf'
                label='Zxf (mm³)'
                value={inputs.zxf}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='my'
                label='My (N-mm)'
                value={inputs.my}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>

            <Paper sx={cardStyle}>
              <TextField
                name='mol'
                label='Mol (N-mm)'
                value={inputs.mol}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='mod'
                label='Mod (N-mm)'
                value={inputs.mod}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='mbe'
                label='Mbe (N-mm)'
                value={inputs.mbe}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='mbl'
                label='Mbl (N-mm)'
                value={inputs.mbl}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='mbd'
                label='Mbd (N-mm)'
                value={inputs.mbd}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='lemdaL'
                label='Lamda L'
                value={inputs.lemdaL}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />

              <TextField
                name='lemdaD'
                label='Lamda D'
                value={inputs.lemdaD}
                fullWidth
                inputProps={{ readOnly: true }}
                sx={textFieldStyle}
              />
            </Paper>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 2
          }}
        >
          {[
            { label: 'Phix-M (kN-M)', value: results.phixM },
            {
              label: 'Phix-Rb (kN)',
              value: results.phixRb
            },
            ...(isCombining
              ? [{ label: 'Phix-Nc (kN)', value: results.phixNc }]
              : [])
          ].map(({ label, value }) => (
            <TextField
              key={label}
              label={label}
              value={value !== null ? value : ''}
              InputProps={{
                readOnly: true
              }}
              variant='filled'
              fullWidth
              sx={resultFieldStyle}
            />
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <Paper
            elevation={2}
            sx={{
              backgroundColor: '#1e1e1e',
              border: '1px solid #0288d1',
              borderRadius: 1,
              p: 2
            }}
          >
            <Typography
              variant='subtitle1'
              sx={{
                mb: 2,
                fontWeight: 600,
                color: '#0288d1'
              }}
            >
              Notes
            </Typography>

            <TextField
              name='note'
              multiline
              minRows={3}
              maxRows={6}
              fullWidth
              variant='outlined'
              placeholder='Write your notes here...'
              sx={textFieldStyle}
              onChange={handleChange}
              value={inputs.note || ''}
            />
          </Paper>
        </Box>

        <Box sx={buttonsBarStyle}>
          <Button
            variant='contained'
            color='primary'
            onClick={calculateResults}
            sx={calculateButtonStyle}
          >
            Calculate
          </Button>

          <Button
            variant='contained'
            color='secondary'
            // onClick={handleSave}
            sx={saveButtonStyle}
          >
            Save
          </Button>
        </Box>
      </Box>

      <ConfirmationDialog
        open={dialogOpen}
        title='Stud Calculations'
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmSave}
      />
    </>
  )
}

export default StudCalculator
