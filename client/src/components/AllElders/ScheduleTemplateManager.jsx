import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Add, Save, Schedule, Description } from '@mui/icons-material'; // Updated import

const ScheduleTemplateManager = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState([
    {
      name: 'Morning Routine',
      events: [
        { type: 'medication', time: '08:00', duration: 15 },
        { type: 'activity', time: '09:00', duration: 60 },
      ],
    },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleSaveTemplate = () => {
    if (newTemplateName) {
      setTemplates((prev) => [
        ...prev,
        {
          name: newTemplateName,
          events: [],
        },
      ]);
      setOpenSaveDialog(false);
      setNewTemplateName('');
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Schedule Templates
      </Typography>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<Description />} // Use a valid icon
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        Apply Template
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {templates.map((template, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              onApplyTemplate(template);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <Schedule />
            </ListItemIcon>
            <ListItemText>{template.name}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      <Button
        variant="text"
        fullWidth
        startIcon={<Save />}
        sx={{ mt: 1 }}
        onClick={() => setOpenSaveDialog(true)}
      >
        Save as Template
      </Button>

      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>Save Current Schedule as Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            fullWidth
            value={newTemplateName}
            onChange={(e) => setNewTemplateName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            startIcon={<Add />}
          >
            Save Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ScheduleTemplateManager;
