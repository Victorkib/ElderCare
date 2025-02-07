import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <IconButton
      onClick={() => navigate(-1)} // Navigate back to the previous page
      sx={{
        bgcolor: 'primary.main', // Background color
        color: 'white', // Icon color
        '&:hover': {
          bgcolor: 'primary.dark', // Darker shade on hover
          transform: 'scale(1.1)', // Subtle zoom effect on hover
        },
        '&:active': {
          transform: 'scale(0.95)', // Slight press effect
        },
        transition: 'all 0.2s ease-in-out', // Smooth animation
        zIndex: 1000, // Keeps the button above other elements
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth

        // Responsive sizing and positioning
        width: { xs: '40px', sm: '48px' }, // Scales size for smaller screens
        height: { xs: '40px', sm: '48px' }, // Scales size for smaller screens
      }}
    >
      <ArrowBackIcon sx={{ fontSize: { xs: '20px', sm: '24px' } }} />{' '}
      {/* Responsive icon size */}
    </IconButton>
  );
};

export default BackButton;
