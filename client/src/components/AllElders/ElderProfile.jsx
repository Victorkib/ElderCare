import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Typography,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Grid,
  Chip,
  Button,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  LinearProgress,
} from '@mui/material';
import {
  Edit,
  AccessTime,
  LocalHospital,
  ContactEmergency,
  Description,
  Schedule,
  Notifications,
  Favorite,
  Medication,
  AccessibilityNew,
  Language,
  Restaurant,
} from '@mui/icons-material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BathtubIcon from '@mui/icons-material/Bathtub';
// import HistoryIcon from '@mui/icons-material/History';
import ChurchIcon from '@mui/icons-material/Church';
import ElderSchedulePreview from './ElderSchedulePreview';
// import {
//   getElderProfile,
//   updateElderProfile,
//   uploadDocument,
// } from '../services/elderService';
import DocumentSecureLink from './DocumentSecureLink';
import { toast, ToastContainer } from 'react-toastify';
import apiRequest from '../../utils/api';
import { TailSpin } from 'react-loader-spinner';
// import { Upload } from '@mui/icons-material';

const ElderProfile = () => {
  const location = useLocation();
  const [elderData, setElderData] = useState(
    location?.state?.elderData || null
  );
  const [upcomingEvents, setUpcomongEvents] = useState();
  const { elderId } = useParams();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElderData = async () => {
      if (!elderData && elderId) {
        try {
          const response = await apiRequest.get(
            `/elders/getSingleElder/${elderId}`
          );
          if (response.status) {
            setElderData(response.data.elder);
            setUpcomongEvents(response.data.upcomingEvents);
            console.log('elderData: ', response.data);
          }
        } catch (error) {
          toast.error(
            error.response?.data?.message || 'Failed to fetch elder data'
          );
        }
      }
    };

    fetchElderData();
  }, [elderData, elderId]);

  // Sample data - replace with actual API calls
  const elder = {
    ...elderData,
    upcomingEvents,
    careTeam: [
      { name: 'Nurse Jane', role: 'Primary Care' },
      { name: 'Dr. Smith', role: 'Physician' },
    ],
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getMobilityIcon = () => {
    switch (elder.mobilityStatus) {
      case 'requires-walker':
        return <AccessibilityNew fontSize="small" />;
      case 'requires-wheelchair':
        return <AccessibilityNew fontSize="small" />;
      case 'bed-ridden':
        return <Favorite fontSize="small" />;
      default:
        return <AccessibilityNew fontSize="small" />;
    }
  };

  // Add these new helper functions
  const getCarePreferenceDetail = (preference) => {
    const preferences =
      elder.personalCarePreferences?.[preference] || 'Not specified';
    return `${
      preference.charAt(0).toUpperCase() + preference.slice(1)
    }: ${preferences}`;
  };

  const documentCategories = {
    legal: { label: 'Legal Documents', icon: <Description /> },
    medical: { label: 'Medical Records', icon: <LocalHospital /> },
    insurance: { label: 'Insurance Papers', icon: <Description /> },
  };

  const birthDate = new Date(elder.dateOfBirth);
  const age = isNaN(birthDate.getTime())
    ? 'N/A'
    : new Date().getFullYear() - birthDate.getFullYear();

  if (!elderData) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h5">
          {!elderData && (
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
        </Typography>
      </Box>
    );
  } else {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          mt: 10,
        }}
      >
        {/* Profile Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                onClick={() => console.log('Edit photo')}
                size="small"
              >
                <Edit fontSize="small" />
              </IconButton>
            }
          >
            <Avatar src={elder.photo} sx={{ width: 120, height: 120, mr: 4 }}>
              {elder.firstName[0]}
              {elder.lastName[0]}
            </Avatar>
          </Badge>

          <Box>
            <Typography variant="h3" component="h1">
              {elder.firstName} {elder.lastName}
              <IconButton
                onClick={() => setIsEditing(!isEditing)}
                sx={{ ml: 2 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
              <Chip label={`Age: ${age}`} variant="outlined" />
              <Chip
                label={elder.status}
                color={
                  elder.status === 'active'
                    ? 'success'
                    : elder.status === 'inactive'
                    ? 'warning'
                    : 'default'
                }
              />
              <Chip
                icon={getMobilityIcon()}
                label={elder.mobilityStatus.replace(/-/g, ' ')}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>

        {/* Quick Stats Panel */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Room Number</Typography>
              <Typography variant="h4" color="primary">
                {elder.roomNumber}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Daily Adherence</Typography>
              <LinearProgress
                variant="determinate"
                value={85}
                sx={{ height: 10, borderRadius: 5, my: 1 }}
              />
              <Typography variant="body2">85% Completed</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Upcoming</Typography>
              <Typography variant="h4" color="secondary">
                3
              </Typography>
              <Typography variant="body2">Appointments</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">Care Team</Typography>
              <Typography variant="h4" color="info">
                {elder.careTeam.length}
              </Typography>
              <Typography variant="body2">Members</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tabbed Sections */}
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable">
          <Tab label="Overview" icon={<AccessTime />} />
          <Tab label="Medical" icon={<LocalHospital />} />
          <Tab label="Care Preferences" icon={<Favorite />} />
          <Tab label="Contacts" icon={<ContactEmergency />} />
          <Tab label="Documents" icon={<Description />} />
          <Tab label="Schedule" icon={<Schedule />} />
        </Tabs>

        <Box sx={{ pt: 3 }}>
          {tabValue === 0 && (
            <Grid container spacing={3}>
              {/* Personal Details Column */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Language />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Languages"
                      secondary={[
                        elder.primaryLanguage,
                        ...elder.otherLanguages,
                      ].join(', ')}
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <Restaurant />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Dietary Restrictions"
                      secondary={elder.dietaryRestrictions.join(', ') || 'None'}
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Schedule Preview Column */}
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Today{`'`}s Schedule Preview
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <ElderSchedulePreview events={elder.upcomingEvents} />
                <Button
                  variant="contained"
                  startIcon={<Schedule />}
                  onClick={() =>
                    navigate(`/scheduler`, {
                      state: {
                        elderId: elderData._id ? elderData._id : elderId,
                      },
                    })
                  }
                  sx={{ mt: 2 }}
                >
                  View Full Schedule
                </Button>
              </Grid>
            </Grid>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Medical Overview
              </Typography>
              <Grid container spacing={3}>
                {/* Allergies Section */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Allergies
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {elder.allergies?.map((allergy) => (
                      <Chip
                        key={allergy}
                        label={allergy}
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Medications Section */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Current Medications
                  </Typography>
                  <List dense>
                    {elder.medications?.map((med, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar>
                            <Medication />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={med} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Chronic Conditions */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Chronic Conditions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {elder.chronicConditions?.map((condition) => (
                      <Chip
                        key={condition}
                        label={condition}
                        color="warning"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Cognitive Status */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Cognitive Status
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <AccessibilityNew color="primary" />
                    <Typography>
                      {elder.cognitiveStatus || 'Not specified'}
                    </Typography>
                  </Box>
                </Grid>

                {/* Medical History */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Medical History
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Previous Hospitalizations
                        </Typography>
                        <List dense>
                          {elder.previousHospitalizations?.map((hosp, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={hosp} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Surgical History
                        </Typography>
                        <List dense>
                          {elder.surgicalHistory?.map((surgery, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={surgery} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1">
                          Family History
                        </Typography>
                        <List dense>
                          {elder.familyHistory?.map((history, idx) => (
                            <ListItem key={idx}>
                              <ListItemText primary={history} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 2 && ( // Care Preferences Tab
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Daily Preferences
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Preferred Schedule"
                      secondary={
                        <Box component="div">
                          <div>
                            Wake:{' '}
                            {elder.preferredDailySchedule?.wakeTime ||
                              'Not specified'}
                          </div>
                          <div>
                            Bed:{' '}
                            {elder.preferredDailySchedule?.bedTime ||
                              'Not specified'}
                          </div>
                          <div>
                            Meals:{' '}
                            {elder.preferredDailySchedule?.mealTimes?.join(
                              ', '
                            ) || 'Not specified'}
                          </div>
                        </Box>
                      }
                    />
                  </ListItem>

                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ChurchIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Religious Preferences"
                      secondary={elder.religion || 'Not specified'}
                    />
                  </ListItem>
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Personal Care
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List dense>
                  {['bathing', 'dressing', 'grooming'].map((preference) => (
                    <ListItem key={preference}>
                      <ListItemAvatar>
                        <Avatar>
                          <BathtubIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={getCarePreferenceDetail(preference)}
                      />
                    </ListItem>
                  ))}
                </List>

                <Typography variant="h6" sx={{ mt: 2 }}>
                  Activity Preferences
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {elder.preferredDailySchedule?.activityPreferences?.map(
                    (activity) => (
                      <Chip
                        key={activity}
                        label={activity}
                        variant="outlined"
                      />
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && ( // Contacts Tab
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Emergency Contacts
                </Typography>
                <List dense>
                  {elder.emergencyContacts?.map((contact, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{contact.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={
                          <Box component="div">
                            <div>{contact.relationship}</div>
                            <div>Phone: {contact.phone}</div>
                            {contact.email && <div>Email: {contact.email}</div>}
                            {contact.isLegalGuardian && (
                              <Chip label="Legal Guardian" size="small" />
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Care Team
                </Typography>
                <List dense>
                  {elder.careTeam?.map((member, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{member.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={member.name}
                        secondary={member.role}
                      />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}

          {tabValue === 4 && ( // Documents Tab
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Insurance Information
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body1">
                    Provider: {elder.insuranceInfo?.provider || 'Not specified'}
                  </Typography>
                  <Typography variant="body1">
                    Policy #:{' '}
                    {elder.insuranceInfo?.policyNumber || 'Not specified'}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                {Object.entries(documentCategories).map(
                  ([key, { label, icon }]) => (
                    <Box key={key} sx={{ mb: 3 }}>
                      <Typography variant="h6" gutterBottom>
                        {label}
                      </Typography>
                      <List dense>
                        {elder[`${key}Documents`]?.map((doc, idx) => (
                          <ListItem key={idx}>
                            <ListItemAvatar>
                              <Avatar>{icon}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={doc.split('/').pop()}
                              secondary={
                                <DocumentSecureLink documentUrl={doc} />
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )
                )}
              </Grid>
            </Grid>
          )}

          {tabValue === 5 && ( // Schedule Tab
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <ScheduleIcon
                sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Full Schedule Management
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Click below to view and manage the complete schedule
              </Typography>
              <Button
                variant="contained"
                startIcon={<Schedule />}
                onClick={() =>
                  navigate(`/scheduler`, {
                    state: {
                      elderId: elderData._id ? elderData._id : elderId,
                    },
                  })
                }
              >
                Open Schedule Manager
              </Button>
            </Box>
          )}
        </Box>

        {/* Emergency Quick Actions */}
        <Box
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<Notifications />}
          >
            Emergency Alert
          </Button>
        </Box>

        <ToastContainer />
      </Paper>
    );
  }
};

export default ElderProfile;
