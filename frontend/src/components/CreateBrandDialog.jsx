import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

export default function CreateBrandDialog({ open, onClose, onCreate, loading }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleClose = () => {
    setName('');
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Brand name is required');
      return;
    }
    setError('');
    await onCreate(trimmed);
    setName('');
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Brand</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Brand Name"
          placeholder="e.g. Fitness Brand"
          fullWidth
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          error={!!error}
          helperText={error}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
