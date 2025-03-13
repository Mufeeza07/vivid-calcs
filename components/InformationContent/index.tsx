import { Box, Typography } from '@mui/material'
import { NailModuleContent } from '../Content'

interface Props {
  moduleName: string
}

const InformationContent = ({ moduleName }: Props) => {
  const renderContent = () => {
    switch (moduleName) {
      case 'nail':
        return <NailModuleContent />

      default:
        return (
          <Typography variant='body2'>
            No support content available for this module yet.
          </Typography>
        )
    }
  }

  return <Box>{renderContent()}</Box>
}

export default InformationContent

{
  /* <Box mt={2}>
        <img src="/images/bolt-info.png" alt="Bolt Info" width="100%" />
      </Box> */
}
