import { useState, useMemo, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
  Menu,
  Pagination,
  InputAdornment,
} from '@mui/material';
import {
  Search,
  Add,
  MoreVert,
  CalendarToday,
  Favorite,
  Warning,
  LocalHospital,
} from '@mui/icons-material';
import apiRequest from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

const OrganizedElders = () => {
  // Sample data - in real app, this would come from an API
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [initialElders, setInitialElders] = useState([
    {
      id: 1,
      name: 'Alice Johnson',
      age: 78,
      room: '201A',
      careLevel: 'High',
      primaryCaregiver: 'Sarah Smith',
      lastCheckup: '2024-02-06',
      medications: 4,
      status: 'Stable',
      nextAppointment: '2024-02-10',
      dietaryRestrictions: ['Diabetes', 'Low Sodium'],
      emergencyContact: 'Bob Johnson (Son)',
      phone: '555-0123',
    },
    // Add more sample data as needed
  ]);

  useEffect(() => {
    const fetchOrganizedElderData = async () => {
      setLoading(true);
      try {
        const response = await apiRequest.get('/elders/getEldersData/elders');
        if (response.status) {
          setInitialElders(response.data);
        }
      } catch (error) {
        toast.error(error.response.data.message || 'Error Fetching Elders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizedElderData();
  }, []);

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc',
  });
  const [filters, setFilters] = useState({
    careLevel: 'all',
    status: 'all',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedElder, setSelectedElder] = useState(null);
  console.log('selectedElder: ', selectedElder);

  // Stats data
  const stats = [
    {
      title: 'Total Residents',
      value: initialElders.length,
      icon: Favorite,
      color: '#e91e63',
    },
    {
      title: 'Critical Care',
      value: initialElders.filter((e) => e.careLevel === 'High').length,
      icon: Warning,
      color: '#f44336',
    },
    {
      title: 'Upcoming Checkups',
      value: 3,
      icon: CalendarToday,
      color: '#2196f3',
    },
    {
      title: 'Active Medications',
      value: initialElders.reduce((acc, curr) => acc + curr.medications, 0),
      icon: LocalHospital,
      color: '#4caf50',
    },
  ];

  // Filter and sort logic
  const filteredElders = useMemo(() => {
    return initialElders
      .filter((elder) => {
        const matchesSearch =
          elder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elder.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
          elder.primaryCaregiver
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesCareLevel =
          filters.careLevel === 'all' || elder.careLevel === filters.careLevel;
        const matchesStatus =
          filters.status === 'all' || elder.status === filters.status;

        return matchesSearch && matchesCareLevel && matchesStatus;
      })
      .sort((a, b) => {
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
      });
  }, [initialElders, searchTerm, sortConfig, filters]);

  // Pagination logic
  const totalPages = Math.ceil(filteredElders.length / itemsPerPage);
  const paginatedElders = filteredElders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  // Menu handlers
  const handleMenuOpen = (event, elder) => {
    setAnchorEl(event.currentTarget);
    setSelectedElder(elder);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedElder(null);
  };

  // Get chip color based on status or care level
  const getChipColor = (type, value) => {
    if (type === 'status') {
      switch (value) {
        case 'active':
          return 'success';
        case 'inactive':
          return 'warning';
        case 'deceased':
          return 'error';
        case 'transferred':
          return 'info';
        default:
          return 'default';
      }
    }
    return value === 'High'
      ? 'error'
      : value === 'Medium'
      ? 'warning'
      : 'default';
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Elderly Care Dashboard
          </Typography>
          <Typography color="text.secondary">
            Manage and monitor resident care
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ height: 'fit-content' }}
        >
          Add New Resident
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                <stat.icon sx={{ fontSize: 40, color: stat.color, mr: 2 }} />
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {stat.title}
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by name, room, or caregiver..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Care Level</InputLabel>
              <Select
                value={filters.careLevel}
                label="Care Level"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, careLevel: e.target.value }))
                }
              >
                <MenuItem value="all">All Levels</MenuItem>
                <MenuItem value="High">High Care</MenuItem>
                <MenuItem value="Medium">Medium Care</MenuItem>
                <MenuItem value="Low">Low Care</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="deceased">Deceased</MenuItem>
                <MenuItem value="transferred">Transferred</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button fullWidth variant="outlined" startIcon={<Add />}>
              Export
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Main Table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Care Level</TableCell>
              <TableCell>Primary Caregiver</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Next Appointment</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedElders.map((elder) => (
              <TableRow key={elder.id}>
                <TableCell>{elder.name}</TableCell>
                <TableCell>{elder.age}</TableCell>
                <TableCell>{elder.room}</TableCell>
                <TableCell>
                  <Chip
                    label={elder.careLevel}
                    color={getChipColor('careLevel', elder.careLevel)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{elder.primaryCaregiver}</TableCell>
                <TableCell>
                  <Chip
                    label={elder.status}
                    color={getChipColor('status', elder.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{elder.nextAppointment}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={(e) => handleMenuOpen(e, elder)}>
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Showing {(page - 1) * itemsPerPage + 1} to{' '}
          {Math.min(page * itemsPerPage, filteredElders.length)} of{' '}
          {filteredElders.length} residents
        </Typography>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            navigate(`/elderProfile/${selectedElder.id}`);
          }}
        >
          View Details
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Update Care Plan</MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/scheduler', {
              state: {
                elderId: selectedElder.id,
              },
            });
          }}
        >
          Schedule Checkup
        </MenuItem>
        <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>
          Mark Critical
        </MenuItem>
      </Menu>

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
      <ToastContainer />
    </Box>
  );
};

export default OrganizedElders;
