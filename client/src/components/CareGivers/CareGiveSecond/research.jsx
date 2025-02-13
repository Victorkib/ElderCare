import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
  Pagination,
  Card,
  CardContent,
  Divider,
  Tooltip,
  Badge,
  Stack,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  WorkHistory as WorkHistoryIcon,
  Language as LanguageIcon,
  ContactEmergency as ContactEmergencyIcon,
} from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

// Available languages for selection
const AVAILABLE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Chinese',
  'Japanese',
  'Korean',
  'Arabic',
  'Russian',
  'Portuguese',
];

const Research = () => {
  // State management
  const [caregivers, setCaregivers] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-0123',
      specialization: 'Geriatric Care',
      certification: 'Certified Nursing Assistant',
      availability: 'Full-time',
      assignedElders: ['John Doe', 'Mary Johnson'],
      status: 'Active',
      yearsOfExperience: 5,
      languages: ['English', 'Spanish'],
      emergencyContact: {
        name: 'Bob Smith',
        phone: '555-0124',
        relation: 'Spouse',
      },
    },
  ]);

  const [page, setPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    certification: '',
    availability: '',
    yearsOfExperience: '',
    languages: [],
    emergencyContact: {
      name: '',
      phone: '',
      relation: '',
    },
  });

  // Filter and search caregivers
  const filteredCaregivers = useMemo(() => {
    return caregivers.filter((cg) => {
      const matchesStatus =
        filterStatus === 'all' || cg.status.toLowerCase() === filterStatus;
      const matchesSearch =
        searchQuery === '' ||
        cg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cg.specialization.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [caregivers, filterStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredCaregivers.length / ITEMS_PER_PAGE);
  const paginatedCaregivers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredCaregivers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCaregivers, page]);

  // Handler functions
  const handleOpenDialog = (caregiver = null) => {
    if (caregiver) {
      setFormData(caregiver);
      setSelectedCaregiver(caregiver);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        certification: '',
        availability: '',
        yearsOfExperience: '',
        languages: [],
        emergencyContact: {
          name: '',
          phone: '',
          relation: '',
        },
      });
      setSelectedCaregiver(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCaregiver(null);
  };

  const handleSubmit = () => {
    if (selectedCaregiver) {
      setCaregivers(
        caregivers.map((cg) =>
          cg.id === selectedCaregiver.id ? { ...formData, id: cg.id } : cg
        )
      );
      setSnackbar({
        open: true,
        message: 'Caregiver updated successfully',
        severity: 'success',
      });
    } else {
      setCaregivers([
        ...caregivers,
        { ...formData, id: Date.now(), status: 'Active' },
      ]);
      setSnackbar({
        open: true,
        message: 'Caregiver added successfully',
        severity: 'success',
      });
    }
    handleCloseDialog();
  };

  const handleDeleteCaregiver = (id) => {
    setCaregivers(caregivers.filter((cg) => cg.id !== id));
    setSnackbar({
      open: true,
      message: 'Caregiver deleted successfully',
      severity: 'warning',
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setCaregivers(
      caregivers.map((cg) => (cg.id === id ? { ...cg, status: newStatus } : cg))
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on leave':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Confirm delete dialog state
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    open: false,
    caregiverId: null,
  });

  // Handler for delete confirmation
  const handleDeleteConfirm = () => {
    if (deleteConfirmDialog.caregiverId) {
      handleDeleteCaregiver(deleteConfirmDialog.caregiverId);
      setDeleteConfirmDialog({ open: false, caregiverId: null });
    }
  };

  return (
    <Box sx={{ p: 3, marginTop: '60px' }}>
      {/* Header and Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Caregiver Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Caregiver
        </Button>
      </Box>

      {/* Filter and Search */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Search Caregivers"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="on leave">On Leave</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Caregiver List */}
      <List>
        {paginatedCaregivers.map((caregiver) => (
          <ListItem key={caregiver.id} sx={{ mb: 2, boxShadow: 1 }}>
            <ListItemAvatar>
              <Avatar>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={caregiver.name}
              secondary={
                <>
                  <Typography variant="body2">{caregiver.email}</Typography>
                  <Typography variant="body2">{caregiver.phone}</Typography>
                  <Typography variant="body2">
                    {caregiver.specialization}
                  </Typography>
                </>
              }
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Chip
                label={caregiver.status}
                color={getStatusColor(caregiver.status)}
              />
              <IconButton onClick={() => handleOpenDialog(caregiver)}>
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() =>
                  setDeleteConfirmDialog({
                    open: true,
                    caregiverId: caregiver.id,
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Enhanced Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          elevation: 24,
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <PersonIcon />
          {selectedCaregiver ? 'Edit Caregiver' : 'Add New Caregiver'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({ ...formData, specialization: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Certification"
                value={formData.certification}
                onChange={(e) =>
                  setFormData({ ...formData, certification: e.target.value })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Availability</InputLabel>
                <Select
                  value={formData.availability}
                  label="Availability"
                  onChange={(e) =>
                    setFormData({ ...formData, availability: e.target.value })
                  }
                >
                  <MenuItem value="Full-time">Full-time</MenuItem>
                  <MenuItem value="Part-time">Part-time</MenuItem>
                  <MenuItem value="On-call">On-call</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={formData.yearsOfExperience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    yearsOfExperience: e.target.value,
                  })
                }
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                multiple
                options={AVAILABLE_LANGUAGES}
                value={formData.languages}
                onChange={(_, newValue) =>
                  setFormData({ ...formData, languages: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Languages"
                    placeholder="Select languages"
                  />
                )}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      size="small"
                      key={option}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
                Emergency Contact
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Emergency Contact Name"
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      name: e.target.value,
                    },
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Emergency Contact Phone"
                value={formData.emergencyContact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      phone: e.target.value,
                    },
                  })
                }
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Emergency Contact Relation"
                value={formData.emergencyContact.relation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      relation: e.target.value,
                    },
                  })
                }
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            sx={{
              minWidth: 100,
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
            }}
          >
            {selectedCaregiver ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmDialog.open}
        onClose={() =>
          setDeleteConfirmDialog({ open: false, caregiverId: null })
        }
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this caregiver? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setDeleteConfirmDialog({ open: false, caregiverId: null })
            }
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
          elevation={6}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Research;
