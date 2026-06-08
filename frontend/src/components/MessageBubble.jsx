import { Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isUser ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          gap: 1,
          maxWidth: { xs: '90%', sm: '75%' },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: isUser ? 'primary.main' : 'secondary.main',
            color: 'white',
            flexShrink: 0,
          }}
        >
          {isUser ? <PersonIcon fontSize="small" /> : <SmartToyIcon fontSize="small" />}
        </Box>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderRadius: 2,
            bgcolor: isUser ? 'primary.main' : 'grey.100',
            color: isUser ? 'primary.contrastText' : 'text.primary',
            boxShadow: 1,
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, mb: 0.5, opacity: 0.85 }}
          >
            {isUser ? 'You' : 'Assistant'}
          </Typography>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
          >
            {content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
