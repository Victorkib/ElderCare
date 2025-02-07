// components/ElderConflictChecker.jsx
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
  Collapse,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Warning, ExpandMore, ExpandLess } from '@mui/icons-material';
import { format, parseISO } from 'date-fns';

const ElderConflictChecker = ({ events, elders }) => {
  const [open, setOpen] = React.useState(true);
  const [conflicts, setConflicts] = React.useState([]);

  React.useEffect(() => {
    const detectConflicts = () => {
      const elderConflicts = {};

      // Group events by elder
      const elderEvents = events.reduce((acc, event) => {
        event.elderIds.forEach((elderId) => {
          if (!acc[elderId]) acc[elderId] = [];
          acc[elderId].push(event);
        });
        return acc;
      }, {});

      // Check for overlapping events per elder
      Object.entries(elderEvents).forEach(([elderId, events]) => {
        events.sort((a, b) => new Date(a.start) - new Date(b.start));

        for (let i = 1; i < events.length; i++) {
          const prevEnd = new Date(events[i - 1].end);
          const currentStart = new Date(events[i].start);

          if (currentStart < prevEnd) {
            if (!elderConflicts[elderId]) elderConflicts[elderId] = [];
            elderConflicts[elderId].push([events[i - 1], events[i]]);
          }
        }
      });

      return Object.entries(elderConflicts).flatMap(([elderId, pairs]) =>
        pairs.map((pair) => ({
          elder: elders.find((e) => e._id === elderId),
          events: pair,
        }))
      );
    };

    setConflicts(detectConflicts());
  }, [events, elders]);

  return (
    <Box sx={{ mt: 2 }}>
      <ListItem button onClick={() => setOpen(!open)}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: 'warning.main' }}>
            <Warning />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={`Schedule Conflicts (${conflicts.length})`}
          secondary="Potential overlapping events"
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>

      <Collapse in={open}>
        <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
          {conflicts.map((conflict, index) => (
            <Tooltip key={index} title="Double click to resolve" arrow>
              <ListItem
                sx={{ bgcolor: 'error.light' }}
                onDoubleClick={() => {
                  /* Add conflict resolution logic */
                }}
              >
                <ListItemText
                  primary={conflict.elder?.name || 'Unknown Elder'}
                  secondary={
                    <>
                      {conflict.events.map((event, i) => (
                        <span key={i}>
                          {event.title} (
                          {format(parseISO(event.start), 'HH:mm')} -
                          {format(parseISO(event.end), 'HH:mm')})
                          {i < conflict.events.length - 1 ? ' vs ' : ''}
                        </span>
                      ))}
                    </>
                  }
                />
                <Chip
                  label="Conflict"
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default ElderConflictChecker;
