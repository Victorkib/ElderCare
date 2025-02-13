import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';

const CaregiverManagement = () => {
  // State management
  const [caregivers, setCaregivers] = useState([
    {
      id: 1,
      name: 'Jane Smith',
      qualification: 'Registered Nurse',
      experience: '5 years',
      specialization: 'Geriatric Care',
      contactNumber: '123-456-7890',
      email: 'jane.smith@example.com',
      availability: 'Full-time',
      assignedElders: ['John Doe', 'Mary Johnson'],
      status: 'Active',
    },
  ]);

  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Sample data for dropdowns
  const qualifications = [
    'Registered Nurse',
    'Licensed Practical Nurse',
    'Certified Nursing Assistant',
    'Home Health Aide',
  ];
  const availabilityOptions = ['Full-time', 'Part-time', 'On-call'];
  const eldersList = [
    'John Doe',
    'Mary Johnson',
    'Robert Brown',
    'Patricia Davis',
  ];

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    qualification: '',
    experience: '',
    specialization: '',
    contactNumber: '',
    email: '',
    availability: '',
    assignedElders: [],
    status: 'Active',
  });

  // Handler functions
  const handleAddCaregiver = () => {
    setCaregivers([...caregivers, { ...formData, id: caregivers.length + 1 }]);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      qualification: '',
      experience: '',
      specialization: '',
      contactNumber: '',
      email: '',
      availability: '',
      assignedElders: [],
      status: 'Active',
    });
  };

  const handleEditCaregiver = () => {
    setCaregivers(
      caregivers.map((cg) =>
        cg.id === selectedCaregiver.id ? { ...formData } : cg
      )
    );
    setIsEditModalOpen(false);
    setSelectedCaregiver(null);
  };

  const handleDeleteCaregiver = (id) => {
    setCaregivers(caregivers.filter((cg) => cg.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const CaregiverForm = ({ isEdit }) => (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Qualification</InputLabel>
            <Select
              value={formData.qualification}
              label="Qualification"
              onChange={(e) =>
                setFormData({ ...formData, qualification: e.target.value })
              }
            >
              {qualifications.map((qual) => (
                <MenuItem key={qual} value={qual}>
                  {qual}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Experience"
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Specialization"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Contact Number"
            value={formData.contactNumber}
            onChange={(e) =>
              setFormData({ ...formData, contactNumber: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="email"
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Availability</InputLabel>
            <Select
              value={formData.availability}
              label="Availability"
              onChange={(e) =>
                setFormData({ ...formData, availability: e.target.value })
              }
            >
              {availabilityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="On Leave">On Leave</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Assigned Elders
          </Typography>
          <Grid container spacing={1}>
            {eldersList.map((elder) => (
              <Grid item xs={6} key={elder}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.assignedElders.includes(elder)}
                      onChange={(e) => {
                        const updatedElders = e.target.checked
                          ? [...formData.assignedElders, elder]
                          : formData.assignedElders.filter((e) => e !== elder);
                        setFormData({
                          ...formData,
                          assignedElders: updatedElders,
                        });
                      }}
                    />
                  }
                  label={elder}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ width: '100%', p: 3, marginTop: '60px' }}>
      <Card>
        <CardHeader
          title="Caregiver Management"
          subheader="Manage your caregiving staff and their assignments"
          action={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Caregiver
            </Button>
          }
        />
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Qualification</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Assigned Elders</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caregivers.map((caregiver) => (
                  <TableRow key={caregiver.id}>
                    <TableCell>{caregiver.name}</TableCell>
                    <TableCell>{caregiver.qualification}</TableCell>
                    <TableCell>{caregiver.experience}</TableCell>
                    <TableCell>{caregiver.availability}</TableCell>
                    <TableCell>
                      <Chip
                        label={caregiver.status}
                        color={getStatusColor(caregiver.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{caregiver.assignedElders.join(', ')}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setFormData(caregiver);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCaregiver(caregiver.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton size="small">
                        <EventIcon />
                      </IconButton>
                      <IconButton size="small">
                        <AssignmentIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Caregiver Dialog */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New Caregiver</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details of the new caregiver below
          </DialogContentText>
          <CaregiverForm isEdit={false} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddCaregiver}>
            Add Caregiver
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Caregiver Dialog */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Caregiver</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Modify the caregiver's details below
          </DialogContentText>
          <CaregiverForm isEdit={true} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditCaregiver}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CaregiverManagement;
