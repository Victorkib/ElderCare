import { useState, useEffect } from 'react';
import axios from 'axios';
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
  Avatar,
  Grid,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import Pagination from 'react-js-pagination';
import apiRequest from '../../../utils/api';
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';
// import 'react-js-pagination/dist/Pagination.css';

const ClaudeCaregiverManagement = () => {
  const [caregivers, setCaregivers] = useState([
    {
      _id: 1,
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
    // Add more caregivers as needed
  ]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const caregiversPerPage = 2;
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchCaregivers();
  }, [pageNumber, filterStatus]);

  const fetchCaregivers = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get('/caregivers', {
        params: {
          page: pageNumber,
          limit: caregiversPerPage,
          status: filterStatus === 'all' ? null : filterStatus,
        },
      });
      setCaregivers(response.data.caregivers);
      setTotalItems(response.data.total);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || 'Failed to fetch caregivers',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (selectedCaregiver) {
        await apiRequest.put(`/caregivers/${selectedCaregiver._id}`, formData);
        setSnackbar({
          open: true,
          message: 'Caregiver updated successfully',
          severity: 'success',
        });
      } else {
        await apiRequest.post('/caregivers', formData);
        setSnackbar({
          open: true,
          message: 'Caregiver added successfully',
          severity: 'success',
        });
      }
      fetchCaregivers();
      handleCloseDialog();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || 'Failed to submit caregiver',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCaregiver = async (id) => {
    setLoading(true);
    try {
      await apiRequest.delete(`/caregivers/${id}`);
      setSnackbar({
        open: true,
        message: 'Caregiver deleted successfully',
        severity: 'warning',
      });
      fetchCaregivers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error?.response?.data?.message || 'Failed to delete caregiver',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (caregiver) => {
    navigate(`/profile/${caregiver._id}`);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await apiRequest.patch(`/caregivers/${id}/status`, {
        status: newStatus,
      });
      setSnackbar({
        open: true,
        message: 'Caregiver status updated successfully',
        severity: 'success',
      });
      fetchCaregivers();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update caregiver status',
        severity: 'error',
      });
    }
  };

  const displayCaregivers =
    caregivers &&
    caregivers?.map((caregiver) => (
      <Paper key={caregiver._id} sx={{ mb: 2 }}>
        <ListItem>
          <Grid container spacing={2}>
            <Grid item>
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
            </Grid>
            <Grid item xs={12} sm container>
              <Grid item xs container direction="column" spacing={2}>
                <Grid item xs>
                  <Typography variant="h6">{caregiver.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {caregiver.email} | {caregiver.phone}
                  </Typography>
                  <Typography variant="body2">
                    Specialization: {caregiver.specialization}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {caregiver.languages.map((lang) => (
                      <Chip
                        key={lang}
                        label={lang}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    Assigned Elders: {caregiver.assignedElders?.join(', ')}
                  </Typography>
                </Grid>
              </Grid>
              <Grid item>
                <FormControl sx={{ minWidth: 120, mr: 2 }}>
                  <Select
                    value={caregiver.status}
                    size="small"
                    onChange={(e) =>
                      handleStatusChange(caregiver._id, e.target.value)
                    }
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="On Leave">On Leave</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  onClick={() => handleProfileClick(caregiver)}
                  color="primary"
                >
                  <PersonIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleOpenDialog(caregiver)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleDeleteCaregiver(caregiver._id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </ListItem>
      </Paper>
    ));

  return (
    <Box sx={{ p: 1, marginTop: '60px' }}>
      {/* Header Section */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h4" gutterBottom>
              Caregiver Management
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{ mr: 2 }}
            >
              Add Caregiver
            </Button>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Filter Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on leave">On Leave</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Caregivers List */}
      <List>{displayCaregivers}</List>

      {/* Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
        <Pagination
          activePage={pageNumber}
          itemsCountPerPage={caregiversPerPage}
          totalItemsCount={totalItems}
          pageRangeDisplayed={5}
          onChange={(page) => setPageNumber(page)}
          itemClass="page-item"
          linkClass="page-link"
          prevPageText="Previous"
          nextPageText="Next"
        />
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedCaregiver ? 'Edit Caregiver' : 'Add New Caregiver'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
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
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Languages</InputLabel>
                <Select
                  multiple
                  value={formData.languages}
                  onChange={(e) =>
                    setFormData({ ...formData, languages: e.target.value })
                  }
                  renderValue={(selected) => selected.join(', ')}
                >
                  <MenuItem value="English">English</MenuItem>
                  <MenuItem value="Swahili">Swahili</MenuItem>
                  <MenuItem value="French">French</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
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
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCaregiver ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
    </Box>
  );
};

export default ClaudeCaregiverManagement;
