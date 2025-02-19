import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  AlertTitle,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import DescriptionIcon from '@mui/icons-material/Description';
import PhotoIcon from '@mui/icons-material/Photo';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import { TailSpin } from 'react-loader-spinner';

const DeletionConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  itemName,
  loading = false,
  elder,
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');
  const contentRef = useRef(null);

  // Scroll to top when the dialog opens
  useEffect(() => {
    if (open && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [open]);

  const handleConfirmation = () => {
    if (confirmationText.trim().toLowerCase() !== itemName.toLowerCase()) {
      setError(`Please type "${itemName}" to confirm deletion`);
      return;
    }
    setError('');
    onConfirm();
  };

  const handleClose = () => {
    setConfirmationText('');
    setError('');
    onClose();
  };

  const dataToBeDeleted = [
    {
      icon: <PersonRemoveIcon color="error" />,
      primary: 'Resident Profile',
      secondary: 'All personal and demographic information',
    },
    {
      icon: <MedicalInformationIcon color="error" />,
      primary: 'Health Records',
      secondary: 'All health logs and medication records',
    },
    {
      icon: <EventBusyIcon color="error" />,
      primary: 'Events & Appointments',
      secondary: 'All scheduled events and appointments',
    },
    {
      icon: <DescriptionIcon color="error" />,
      primary: 'Documents',
      secondary: 'Insurance, legal, and medical documents',
    },
    {
      icon: <PhotoIcon color="error" />,
      primary: 'Media Files',
      secondary: 'Profile picture and uploaded documents',
    },
    {
      icon: <GroupRemoveIcon color="error" />,
      primary: 'Caregiver Assignments',
      secondary: 'All caregiver relationships and assignments',
    },
    {
      icon: <StickyNote2Icon color="error" />,
      primary: 'Notes & Records',
      secondary: 'All care notes and daily records',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-dialog-title"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="delete-dialog-title" sx={{ m: 0, p: 2 }}>
        <div
          style={{ display: 'flex', alignItems: 'center', color: '#dc2626' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Critical: Resident Deletion
        </div>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers ref={contentRef}>
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Warning: Permanent Data Deletion</AlertTitle>
          This action will permanently delete ALL of the following data
          associated with {itemName}. This action cannot be undone.
        </Alert>

        <List dense>
          {dataToBeDeleted.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.primary}
                  secondary={item.secondary}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
              </ListItem>
              {index < dataToBeDeleted.length - 1 && (
                <Divider variant="inset" component="li" />
              )}
            </React.Fragment>
          ))}
        </List>

        <Typography variant="body1" sx={{ mt: 3, mb: 2 }} color="error">
          To confirm deletion, please type <strong>"{itemName}"</strong> below:
        </Typography>

        <TextField
          autoFocus
          fullWidth
          value={confirmationText}
          onChange={(e) => {
            setConfirmationText(e.target.value);
            setError('');
          }}
          placeholder={`Type ${itemName} here`}
          error={!!error}
          helperText={error}
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirmation}
          disabled={loading || !confirmationText}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
        >
          {loading ? 'Deleting...' : 'Permanently Delete All Data'}
        </Button>
      </DialogActions>
      {loading && (
        <div className="loader-overlay">
          <TailSpin
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
    </Dialog>
  );
};

export default DeletionConfirmationDialog;
