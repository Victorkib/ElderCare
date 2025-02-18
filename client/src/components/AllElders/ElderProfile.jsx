import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Dialog,
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
import PersonAddIcon from '@mui/icons-material/PersonAdd'; // New import
import AssignCaregiverModal from '../custom/AssignCaregiverModal';
import EditProfilePhoto from '../custom/EditProfilePhoto';
// import { Upload } from '@mui/icons-material';

const ElderProfile = () => {
  const [elderData, setElderData] = useState();
  const [upcomingEvents, setUpcomongEvents] = useState();
  const { elderId } = useParams();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [showCaregiverModal, setShowCaregiverModal] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');

  const fetchElderData = async () => {
    try {
      const response = await apiRequest.get(
        `/elders/getSingleElder/${elderId}`
      );
      if (response.status) {
        setElderData(response.data.elder);
        setUpcomongEvents(response.data.upcomingEvents);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to fetch elder data'
      );
    }
  };
  useEffect(() => {
    fetchElderData();
  }, []);

  const handleAssignSuccess = async () => {
    await fetchElderData();
    toast.success('Updated!');
  };

  const handleEditImage = (photo) => {
    setIsEditingImage(true);
    setCurrentPhoto(photo);
  };

  const handlePhotoUpdated = async () => {
    await fetchElderData(); // Refresh the data
    setIsEditingImage(false); // Close the edit mode
  };

  // Sample data - replace with actual API calls
  const elder = {
    ...elderData,
    upcomingEvents,
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
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 4,
          bgcolor: theme.palette.background.paper,
          mt: { xs: 2, sm: 6, md: 10 },
        }}
      >
        {/* Profile Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton
                onClick={() => {
                  if (elder.photo) {
                    handleEditImage(elder.photo);
                  } else {
                    handleEditImage(''); // Fallback in case there's no image
                  }
                }}
                size="small"
              >
                <Edit fontSize="small" />
              </IconButton>
            }
          >
            <Avatar
              src={elder.photo}
              sx={{
                width: { xs: 80, sm: 100, md: 120 },
                height: { xs: 80, sm: 100, md: 120 },
                mb: { xs: 2, sm: 0 },
                mr: { sm: 4 },
              }}
            >
              {elder.firstName[0]}
              {elder.lastName[0]}
            </Avatar>
          </Badge>

          <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
              {elder.firstName} {elder.lastName}
              <IconButton
                onClick={() => setIsEditing(!isEditing)}
                sx={{ ml: 2 }}
              >
                <Edit fontSize="small" />
              </IconButton>
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Chip label={`Age: ${age}`} variant="outlined" size="small" />
              <Chip
                label={elder.status}
                color={
                  elder.status === 'active'
                    ? 'success'
                    : elder.status === 'inactive'
                    ? 'warning'
                    : 'default'
                }
                size="small"
              />
              <Chip
                icon={getMobilityIcon()}
                label={elder.mobilityStatus.replace(/-/g, ' ')}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>
        {/* Quick Stats Panel */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {[
            { title: 'Room Number', value: elder.roomNumber, color: 'primary' },
            {
              title: 'Daily Adherence',
              value: '85%',
              color: 'secondary',
              progress: true,
            },
            {
              title: 'Upcoming Events',
              value: elder?.upcomingEvents?.length,
              color: 'info',
            },
            {
              title: 'Care Team',
              value: elderData.assignedCaregivers.length,
              color: 'success',
              action: (
                <Button
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setShowCaregiverModal(true)}
                  sx={{ mt: 1 }}
                >
                  Add Caregiver
                </Button>
              ),
            },
          ].map((stat, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Paper
                sx={{
                  p: 2,
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {stat.title}
                </Typography>
                {stat.progress ? (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{ height: 10, borderRadius: 5, my: 1 }}
                    />
                    <Typography variant="h6" color={stat.color}>
                      {stat.value}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography variant="h5" color={stat.color}>
                      {stat.value}
                    </Typography>
                    {stat.action}
                  </>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        {/* Tabbed Sections */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': { minWidth: { xs: 'auto', sm: 120 } },
          }}
        >
          <Tab label="Overview" icon={<AccessTime />} iconPosition="start" />
          <Tab label="Medical" icon={<LocalHospital />} iconPosition="start" />
          <Tab label="Care" icon={<Favorite />} iconPosition="start" />
          <Tab
            label="Contacts"
            icon={<ContactEmergency />}
            iconPosition="start"
          />
          <Tab label="Documents" icon={<Description />} iconPosition="start" />
          <Tab label="Schedule" icon={<Schedule />} iconPosition="start" />
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
                  sx={{ mt: 2, width: { xs: '100%', sm: 'auto' } }}
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
                <Grid item xs={12} sm={6}>
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
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Medications Section */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" gutterBottom>
                    Current Medications
                  </Typography>
                  <List dense>
                    {elder.medications?.map((med, index) => (
                      <ListItem key={index} disablePadding>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Medication />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={med} />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {/* Chronic Conditions */}
                <Grid item xs={12} sm={6}>
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
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </Box>
                </Grid>

                {/* Cognitive Status */}
                <Grid item xs={12} sm={6}>
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
                    {[
                      'Previous Hospitalizations',
                      'Surgical History',
                      'Family History',
                    ].map((title, index) => (
                      <Grid item xs={12} sm={4} key={index}>
                        <Paper sx={{ p: 2, height: '100%' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            {title}
                          </Typography>
                          <List dense>
                            {elder[title.toLowerCase().replace(' ', '')]?.map(
                              (item, idx) => (
                                <ListItem key={idx} disablePadding>
                                  <ListItemText primary={item} />
                                </ListItem>
                              )
                            )}
                          </List>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}

          {tabValue === 2 && (
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
                          <Typography variant="body2">
                            Wake:{' '}
                            {elder.preferredDailySchedule?.wakeTime ||
                              'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            Bed:{' '}
                            {elder.preferredDailySchedule?.bedTime ||
                              'Not specified'}
                          </Typography>
                          <Typography variant="body2">
                            Meals:{' '}
                            {elder.preferredDailySchedule?.mealTimes?.join(
                              ', '
                            ) || 'Not specified'}
                          </Typography>
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

                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Activity Preferences
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {elder.preferredDailySchedule?.activityPreferences?.map(
                    (activity) => (
                      <Chip
                        key={activity}
                        label={activity}
                        variant="outlined"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          )}

          {tabValue === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Emergency Contacts
                </Typography>
                <List dense>
                  {elder.emergencyContacts?.map((contact, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          {contact.name[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={contact.name}
                        secondary={
                          <Box component="div">
                            <Typography variant="body2">
                              {contact.relationship}
                            </Typography>
                            <Typography variant="body2">
                              Phone: {contact.phone}
                            </Typography>
                            {contact.email && (
                              <Typography variant="body2">
                                Email: {contact.email}
                              </Typography>
                            )}
                            {contact.isLegalGuardian && (
                              <Chip
                                label="Legal Guardian"
                                size="small"
                                color="primary"
                                sx={{ mt: 1 }}
                              />
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
                  {elder?.assignedCaregivers?.length > 0 &&
                    elder.assignedCaregivers?.map((member, index) => (
                      <ListItem key={index}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {member?.name[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={member?.name}
                          secondary={member?.specialization}
                        />
                      </ListItem>
                    ))}
                </List>
              </Grid>
            </Grid>
          )}

          {tabValue === 4 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" gutterBottom>
                  Insurance Information
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="body1" gutterBottom>
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
                              <Avatar sx={{ bgcolor: 'info.main' }}>
                                {icon}
                              </Avatar>
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

          {tabValue === 5 && (
            <Box sx={{ textAlign: 'center', p: { xs: 2, sm: 4 } }}>
              <ScheduleIcon
                sx={{
                  fontSize: { xs: 60, sm: 80 },
                  color: 'text.secondary',
                  mb: 2,
                }}
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
                    state: { elderId: elderData._id ? elderData._id : elderId },
                  })
                }
                sx={{ width: { xs: '100%', sm: 'auto' } }}
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
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: 20 },
            display: 'flex',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            color="error"
            startIcon={<Notifications />}
            size="large"
          >
            Emergency Alert
          </Button>
        </Box>
        {/* New: AssignCaregiverModal */}
        <AssignCaregiverModal
          isOpen={showCaregiverModal}
          onClose={() => setShowCaregiverModal(false)}
          elderId={elderId}
          onAssignSuccess={handleAssignSuccess}
        />
        <Dialog open={isEditingImage} onClose={() => setIsEditingImage(false)}>
          <EditProfilePhoto
            userId={elderId}
            currentPhoto={currentPhoto}
            onPhotoUpdated={() => {
              handlePhotoUpdated();
              setIsEditingImage(false); // Close after update
            }}
          />
        </Dialog>
        <ToastContainer />
      </Paper>
    );
  }
};

export default ElderProfile;
