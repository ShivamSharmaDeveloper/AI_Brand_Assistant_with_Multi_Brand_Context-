import { useEffect, useRef } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: { xs: 2, sm: 3 },
        }}
      >
        {!messages.length && !loading && (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Start a conversation to build your brand identity.
              <br />
              Try: &quot;I want a fitness brand for young professionals&quot;
            </Typography>
          </Box>
        )}

        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} content={msg.content} />
        ))}

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Assistant is thinking...
            </Typography>
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>
    </Paper>
  );
}
