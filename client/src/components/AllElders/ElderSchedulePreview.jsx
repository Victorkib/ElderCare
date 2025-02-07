import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Divider,
  useTheme,
  Paper,
} from '@mui/material';
import {
  Medication,
  LocalHospital,
  AccessibilityNew,
  Event,
  NotificationsNone,
  CheckCircleOutline,
  AccessTime,
} from '@mui/icons-material';
import { format } from 'date-fns';

const getEventDetails = (eventType) => {
  switch (eventType) {
    case 'medication':
      return { icon: <Medication />, color: 'purple', label: 'Medication' };
    case 'appointment':
      return {
        icon: <LocalHospital />,
        color: 'primary.main',
        label: 'Appointment',
      };
    case 'activity':
      return { icon: <AccessibilityNew />, color: 'green', label: 'Activity' };
    default:
      return { icon: <Event />, color: 'gray', label: 'Event' };
  }
};

const ElderSchedulePreview = ({ events }) => {
  const theme = useTheme();
  const currentDate = format(new Date(), 'EEEE, MMM d');

  return (
    <Paper
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: theme.palette.grey[100],
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <AccessTime fontSize="small" />
        <Typography variant="subtitle1" component="div">
          Today's Schedule - {currentDate}
        </Typography>
      </Box>

      {events?.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No scheduled events for today
          </Typography>
        </Box>
      ) : (
        <List dense sx={{ maxHeight: 300, overflow: 'auto' }}>
          {events?.map((event, index) => {
            const { icon, color, label } = getEventDetails(event.type);
            const isCompleted = event.status === 'completed';

            return (
              <React.Fragment key={index}>
                <ListItem
                  sx={{
                    transition: 'background-color 0.2s',
                    '&:hover': { bgcolor: theme.palette.action.hover },
                    opacity: isCompleted ? 0.6 : 1,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isCompleted ? theme.palette.grey[400] : color,
                      }}
                    >
                      {icon}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight="500">
                          {event.name}
                        </Typography>
                        <Chip
                          label={label}
                          size="small"
                          variant="outlined"
                          sx={{
                            borderRadius: 1,
                            borderColor: isCompleted
                              ? theme.palette.grey[400]
                              : color,
                            color: isCompleted
                              ? theme.palette.grey[600]
                              : color,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {event.time}
                        </Typography>
                        {event.location && (
                          <Typography variant="caption" color="text.secondary">
                            @ {event.location}
                          </Typography>
                        )}
                      </Box>
                    }
                  />

                  {isCompleted ? (
                    <CheckCircleOutline
                      fontSize="small"
                      sx={{ color: theme.palette.success.main, ml: 1 }}
                    />
                  ) : (
                    <NotificationsNone
                      fontSize="small"
                      sx={{ color: theme.palette.warning.main, ml: 1 }}
                    />
                  )}
                </ListItem>
                {index < events.length - 1 && <Divider variant="inset" />}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
};

export default ElderSchedulePreview;
