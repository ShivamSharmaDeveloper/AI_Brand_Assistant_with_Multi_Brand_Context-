import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BrandSelector from './components/BrandSelector';
import CreateBrandDialog from './components/CreateBrandDialog';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import {
  fetchBrands,
  fetchBrand,
  createBrand,
  sendChatMessage,
  getErrorMessage,
} from './api/client';

export default function App() {
  const [brands, setBrands] = useState([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  const showError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  const loadBrands = useCallback(async () => {
    try {
      const data = await fetchBrands();
      setBrands(data);
      return data;
    } catch (err) {
      showError(getErrorMessage(err));
      return [];
    }
  }, []);

  const loadBrandContext = useCallback(async (brandId) => {
    if (!brandId) {
      setMessages([]);
      return;
    }
    try {
      const brand = await fetchBrand(brandId);
      setMessages(brand.messages || []);
    } catch (err) {
      showError(getErrorMessage(err));
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      const data = await loadBrands();
      if (data.length > 0) {
        setSelectedBrandId(data[0].id);
      }
      setInitialLoading(false);
    })();
  }, [loadBrands]);

  useEffect(() => {
    if (selectedBrandId) {
      loadBrandContext(selectedBrandId);
    }
  }, [selectedBrandId, loadBrandContext]);

  const handleCreateBrand = async (name) => {
    setLoading(true);
    try {
      const brand = await createBrand(name);
      const updatedBrands = await loadBrands();
      setSelectedBrandId(brand.id);
      setMessages([]);
      setDialogOpen(false);
      setSnackbar({
        open: true,
        message: `Brand "${brand.name}" created successfully`,
        severity: 'success',
      });
    } catch (err) {
      showError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    if (!selectedBrandId) {
      showError('Please select or create a brand first');
      return;
    }

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError('');

    try {
      const { response } = await sendChatMessage(selectedBrandId, message);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      const errMsg = getErrorMessage(err);
      setError(errMsg);
      showError(errMsg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleBrandSelect = (brandId) => {
    setSelectedBrandId(brandId);
    setError('');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 700 }}>
            AI Brand Assistant
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ flex: 1, display: 'flex', flexDirection: 'column', py: 3 }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'center' },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <BrandSelector
              brands={brands}
              selectedBrandId={selectedBrandId}
              onSelect={handleBrandSelect}
              disabled={loading || initialLoading}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={loading || initialLoading}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Create Brand
          </Button>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <ChatWindow messages={messages} loading={loading} />
          <ChatInput
            onSend={handleSendMessage}
            disabled={loading || initialLoading || !selectedBrandId}
          />
        </Box>
      </Container>

      <CreateBrandDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreate={handleCreateBrand}
        loading={loading}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
