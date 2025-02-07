import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Grid,
  Tabs,
  Tab,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  LinearProgress,
  Typography,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Today,
  ViewWeek,
  CalendarViewMonth,
  Notifications,
  Medication,
  LocalHospital,
  AccessTime,
  Group,
  Download,
  DragIndicator,
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format, parseISO } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import ElderConflictChecker from './ElderConflictChecker';
import ScheduleTemplateManager from './ScheduleTemplateManager';
import BackButton from '../custom/BackButton';
import apiRequest from '../../utils/api';

// Base URL for the backend API

const ElderScheduler = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { elderId } = location?.state || {};
  const [view, setView] = useState('dayGridMonth');
  const [events, setEvents] = useState([]);
  const [elders, setElders] = useState([]);
  const [selectedElders, setSelectedElders] = useState([]);
  const [openEventModal, setOpenEventModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [recurrencePattern, setRecurrencePattern] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTimes, setReminderTimes] = useState([]);
  const [eventType, setEventType] = useState('medication');
  const [eventTitle, setEventTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch elders and events from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const eldersResponse = await apiRequest.get(`/elders/getAllElders`);
        const eventsResponse = await apiRequest.get(`/events/getAllEvents`);

        // Validate events data
        const validatedEvents = eventsResponse?.data?.map((event) => ({
          _id: event._id || 'N/A',
          title: event.title || 'Untitled Event',
          start: event.start || new Date().toISOString(),
          end: event.end || new Date().toISOString(),
          type: event.type || 'custom',
          elderIds: event.elderIds || [],
          dosage: event.dosage || '',
          instructions: event.instructions || '',
          recurring: event.recurring || 'none',
          reminders: event.reminders || [],
          notes: event.notes || '',
        }));

        setElders(eldersResponse.data);
        setEvents(validatedEvents);

        // Initialize selectedElders with the current elder if elderId is provided
        if (elderId) {
          setSelectedElders([elderId]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [elderId]);

  useEffect(() => {
    if (elderId) {
      setSelectedElders([elderId]);
    }
  }, [elderId]);

  // Handle event creation when a date is clicked on the calendar
  const handleCreateEvent = (info) => {
    setCurrentEvent({
      title: '',
      start: info?.startStr || new Date(),
      end: info?.endStr || new Date(),
      type: 'medication',
      elderIds: selectedElders,
      reminders: [],
      recurring: 'none',
    });
    setStartTime(info?.startStr || new Date());
    setEndTime(info?.endStr || new Date());
    setOpenEventModal(true);
  };

  // Handle saving the event to the backend
  const handleEventUpdate = async () => {
    const newEvent = {
      title: eventTitle,
      start: startTime,
      end: endTime,
      type: eventType,
      elderIds: selectedElders,
      dosage: dosage,
      instructions: instructions,
      recurring: recurrencePattern,
      reminders: remindersEnabled ? reminderTimes : [],
      notes: notes,
    };

    try {
      const response = await apiRequest.post(`/events/createEvent`, newEvent);
      setEvents((prev) => [...prev, response.data]);
      setOpenEventModal(false);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  // Handle tab changes with validation
  const handleTabChange = (newValue) => {
    if (newValue > tabValue) {
      if (tabValue === 0 && (!eventTitle || !startTime || !endTime)) {
        alert('Please fill in all required fields in the Basic Info tab.');
        return;
      }
      if (tabValue === 1 && !recurrencePattern) {
        alert('Please select a recurrence pattern.');
        return;
      }
    }
    setTabValue(newValue);
  };

  // Event type options
  const eventTypeOptions = [
    { value: 'medication', label: 'Medication', icon: <Medication /> },
    { value: 'appointment', label: 'Appointment', icon: <LocalHospital /> },
    { value: 'activity', label: 'Activity', icon: <AccessTime /> },
    { value: 'custom', label: 'Custom Event', icon: <Add /> },
  ];

  const handleEditEvent = (event) => {
    setCurrentEvent(event);
    setEventTitle(event.title);
    setStartTime(event.start);
    setEndTime(event.end);
    setEventType(event.type);
    setSelectedElders(event.elderIds);
    setRecurrencePattern(event.recurring);
    setRemindersEnabled(event.reminders.length > 0);
    setReminderTimes(event.reminders);
    setDosage(event.dosage);
    setInstructions(event.instructions);
    setNotes(event.notes);
    setOpenEventModal(true);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await apiRequest.delete(`/events/${id}`);
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    {
      field: 'start',
      headerName: 'Start Time',
      width: 200,
      valueGetter: (params) => {
        const start = params?.row?.start
          ? new Date(params?.row?.start)
          : new Date();
        return format(start, 'hh:mm a');
      },
    },
    {
      field: 'end',
      headerName: 'End Time',
      width: 200,
      valueGetter: (params) => {
        const end = params?.row?.end ? new Date(params?.row?.end) : new Date();
        return format(end, 'hh:mm a');
      },
    },
    { field: 'type', headerName: 'Type', width: 150 },
    {
      field: 'elders',
      headerName: 'Elders',
      width: 200,
      valueGetter: (params) =>
        params?.row?.elderIds
          ? params?.row?.elderIds?.map((elder) => elder?.firstName).join(', ')
          : 'No elders',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            size="small"
            onClick={() => handleEditEvent(params?.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            sx={{ ml: 1 }}
            onClick={() => handleDeleteEvent(params?.row?._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];
  return (
    <Grid container spacing={3} sx={{ p: 3, mt: 4 }}>
      {/* Left Sidebar */}
      <Grid item xs={12} md={3}>
        <Paper
          sx={{
            p: 2,
            height: { xs: 'auto', md: 'calc(100vh - 150px)' },
            overflowY: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
              '@media (max-width: 600px)': {
                flexDirection: 'column',
                alignItems: 'stretch',
              },
            }}
          >
            <BackButton />
            <Button
              variant="contained"
              sx={{ flexShrink: 0 }}
              startIcon={<Add />}
              onClick={() => handleCreateEvent()}
            >
              New Event
            </Button>
          </Box>

          <ElderConflictChecker events={events} elders={elders} />

          <Divider sx={{ my: 3 }} />

          <ScheduleTemplateManager
            onApplyTemplate={(t) => handleCreateEvent(t)}
          />

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <List dense>
            <ListItem button onClick={() => navigate('/organizedElders')}>
              <ListItemText
                primary="Switch Elder"
                secondary="Change current profile"
              />
            </ListItem>
            <ListItem button onClick={() => window.print()}>
              <ListItemText
                primary="Print Schedule"
                secondary="Generate PDF version"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      {/* Main Calendar Area */}
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            p: 2,
            height: { xs: 'auto', md: 'calc(100vh - 150px)' }, // Fixed height for medium and larger screens
            overflowY: 'auto',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Tabs value={view} onChange={(e, v) => setView(v)}>
              <Tab
                label="Month"
                value="dayGridMonth"
                icon={<CalendarViewMonth />}
              />
              <Tab label="Week" value="timeGridWeek" icon={<ViewWeek />} />
              <Tab label="Day" value="timeGridDay" icon={<Today />} />
            </Tabs>

            <Box>
              <IconButton onClick={() => navigate('/scheduler')}>
                <Group />
              </IconButton>
              <Button startIcon={<Download />}>Export</Button>
            </Box>
          </Box>

          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={view}
            events={events}
            editable={true}
            selectable={true}
            select={handleCreateEvent}
            eventContent={(eventInfo) => {
              // Ensure start and end are valid dates
              const start = new Date(eventInfo.event.start);
              const end = new Date(eventInfo.event.end);

              return (
                <Tooltip
                  title={
                    <Box>
                      <Typography variant="subtitle2">
                        {eventInfo.event.title}
                      </Typography>
                      <Typography variant="body2">
                        Start: {format(start, 'hh:mm a')}
                      </Typography>
                      <Typography variant="body2">
                        End: {format(end, 'hh:mm a')}
                      </Typography>
                      <Typography variant="body2">
                        Type: {eventInfo.event.extendedProps.type}
                      </Typography>
                      <Typography variant="body2">
                        Elders:{' '}
                        {eventInfo?.event?.extendedProps?.elderIds
                          ?.map((eld) => eld?.firstName)
                          .join(', ')}
                      </Typography>
                    </Box>
                  }
                  arrow
                >
                  <Box
                    sx={{
                      p: 0.5,
                      bgcolor:
                        theme.palette.custom[
                          eventInfo.event.extendedProps.type
                        ],
                      color: 'white',
                      borderRadius: 1,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DragIndicator fontSize="small" sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
                        {eventInfo.event.title}
                      </Typography>
                    </Box>
                    {eventInfo.event.extendedProps.elders?.map((eld) => (
                      <Chip
                        key={eld._id}
                        label={eld.firstName}
                        size="small"
                        sx={{ mr: 0.5, mt: 0.5, color: 'black' }}
                      />
                    ))}
                  </Box>
                </Tooltip>
              );
            }}
            height="calc(100vh - 250px)"
          />
        </Paper>
      </Grid>

      {/* Right Sidebar */}
      <Grid item xs={12} md={3}>
        <Paper
          sx={{
            p: 2,
            height: { xs: 'auto', md: 'calc(100vh - 150px)' }, // Fixed height for medium and larger screens
            overflowY: 'auto',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Upcoming (Next 24h)
          </Typography>
          <List dense>
            {events
              .filter(
                (e) =>
                  new Date(e.start) < new Date(Date.now() + 86400000) &&
                  new Date(e.start) > new Date()
              )
              .map((event) => (
                <ListItem
                  key={event._id}
                  sx={{ bgcolor: 'action.hover', mb: 1 }}
                >
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <>
                        {format(parseISO(event.start), 'hh:mm a')}
                        <Chip
                          label={event.type}
                          size="small"
                          sx={{ ml: 1 }}
                          color="primary"
                        />
                      </>
                    }
                  />
                  <Notifications fontSize="small" />
                </ListItem>
              ))}
          </List>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Schedule Health
          </Typography>
          <LinearProgress
            variant="determinate"
            value={75}
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            3 conflicts detected
          </Typography>
        </Paper>
      </Grid>

      {/* Event Management Table - Below the Three Columns */}
      <Grid item xs={12} sx={{ mt: 4 }}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Event Management
          </Typography>
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={events}
              columns={columns}
              getRowId={(row) => row?._id} // Use _id as the unique identifier
              pageSize={5}
              rowsPerPageOptions={[5, 10, 20]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Box>
        </Paper>
      </Grid>

      {/* Event Creation Modal */}
      <Dialog open={openEventModal} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentEvent?.id ? 'Edit Event' : 'Create New Event'}
        </DialogTitle>
        <DialogContent>
          <Tabs value={tabValue} onChange={(e, v) => handleTabChange(v)}>
            <Tab label="Basic Info" />
            <Tab label="Recurrence" />
            <Tab label="Reminders" />
            <Tab label="Advanced" />
          </Tabs>

          <Box sx={{ mt: 2 }}>
            {tabValue === 0 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Event Title"
                    fullWidth
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Start Time"
                    type="datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="End Time"
                    type="datetime-local"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Event Type"
                    fullWidth
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                  >
                    {eventTypeOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {option.icon}
                          <Box sx={{ ml: 1 }}>{option.label}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={elders}
                    getOptionLabel={(elder) => elder.firstName} // Use elder.firstName or elder.name
                    value={elders.filter((elder) =>
                      selectedElders.includes(elder._id)
                    )}
                    onChange={(event, newValue) => {
                      setSelectedElders(newValue.map((elder) => elder._id));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Elders"
                        fullWidth
                        required
                      />
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {tabValue === 1 && (
              <Box>
                <TextField
                  select
                  label="Recurrence Pattern"
                  fullWidth
                  value={recurrencePattern}
                  onChange={(e) => setRecurrencePattern(e.target.value)}
                  required
                >
                  <MenuItem value="none">Does not repeat</MenuItem>
                  <MenuItem value="daily">Daily</MenuItem>
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="custom">Custom...</MenuItem>
                </TextField>
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={remindersEnabled}
                      onChange={(e) => setRemindersEnabled(e.target.checked)}
                    />
                  }
                  label="Enable Reminders"
                />
                <TextField
                  select
                  label="Reminder Times"
                  fullWidth
                  multiple
                  value={reminderTimes}
                  onChange={(e) => setReminderTimes(e.target.value)}
                  disabled={!remindersEnabled}
                >
                  <MenuItem value="15">15 minutes before</MenuItem>
                  <MenuItem value="30">30 minutes before</MenuItem>
                  <MenuItem value="60">1 hour before</MenuItem>
                </TextField>
              </Box>
            )}

            {tabValue === 3 && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Dosage"
                    fullWidth
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Instructions"
                    fullWidth
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    fullWidth
                    multiline
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </Grid>
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleEventUpdate}
            disabled={tabValue < 3}
          >
            Save Event
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default ElderScheduler;
