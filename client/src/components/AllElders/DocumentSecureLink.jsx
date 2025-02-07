// components/DocumentSecureLink.jsx
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  //   Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Description, Close, Download } from '@mui/icons-material';

const DocumentSecureLink = ({ documentUrl }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = documentUrl.split('/').pop();
      link.click();
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Description />}
        onClick={() => setOpen(true)}
      >
        View Document
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Document Viewer
          <IconButton
            onClick={() => setOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <iframe
              src={documentUrl}
              style={{ width: '100%', height: '500px', border: 'none' }}
              title="Document Viewer"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleDownload}
            disabled={loading}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DocumentSecureLink;
