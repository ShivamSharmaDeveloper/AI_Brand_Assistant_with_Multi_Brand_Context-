import { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatInput({ onSend, disabled }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setMessage('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: 1,
        alignItems: 'flex-end',
        pt: 2,
      }}
    >
      <TextField
        fullWidth
        multiline
        maxRows={4}
        placeholder="Describe your brand idea or ask for refinements..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size="small"
      />
      <Button
        type="submit"
        variant="contained"
        disabled={disabled || !message.trim()}
        sx={{ minWidth: { xs: 48, sm: 100 }, height: 40 }}
      >
        <SendIcon sx={{ display: { xs: 'block', sm: 'none' } }} />
        <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Send
        </Box>
      </Button>
    </Box>
  );
}
