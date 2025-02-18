import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Button,
  Alert,
  Stack,
} from '@mui/material';
import {
  Shield,
  Users,
  AlertTriangle,
  FileText,
  Key,
  Clock,
  Database,
  ScrollText,
  ChevronDown,
  Info,
} from 'lucide-react';

const TermsAndConditions = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const SectionHeader = ({ icon: Icon, text }) => (
    <Stack direction="row" spacing={2} alignItems="center">
      <Icon size={24} />
      <Typography variant="h6" component="span">
        {text}
      </Typography>
    </Stack>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4, marginTop: '15px' }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Terms and Conditions
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Elderly Care System (ECS)
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            Please read these terms carefully before using the Elderly Care
            System
          </Alert>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <SectionHeader
                icon={FileText}
                text="1. Acceptance and Definitions"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>
                These Terms and Conditions govern your use of the Elderly Care
                System (ECS), a comprehensive healthcare management platform. By
                accessing or using the ECS, you agree to be bound by these
                terms.
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                1.1 Definitions
              </Typography>
              <Typography paragraph>
                - "Service" refers to the Elderly Care System platform - "User"
                includes elderly users, caregivers, healthcare providers, and
                administrators - "Content" refers to all information, data, and
                materials uploaded to the system
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <SectionHeader
                icon={Users}
                text="2. User Roles and Access Rights"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                2.1 Elderly Users
              </Typography>
              <Typography paragraph>
                - Right to access personal health information and daily
                schedules - Ability to view and acknowledge reminders - Option
                to provide feedback on care received
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                2.2 Caregivers
              </Typography>
              <Typography paragraph>
                - Authorization to input and update health data - Responsibility
                for maintaining accurate records - Obligation to respect privacy
                and confidentiality - Duty to respond to alerts and
                notifications promptly
              </Typography>

              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                2.3 Healthcare Providers
              </Typography>
              <Typography paragraph>
                - Authority to review and update medical records -
                Responsibility for accurate medical advice - Obligation to
                maintain professional standards
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleChange('panel3')}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <SectionHeader icon={Shield} text="3. Privacy and Security" />
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>3.1 Data Protection</Typography>
              <Typography paragraph>
                All personal and health data is protected using
                industry-standard encryption protocols. We comply with HIPAA
                regulations and applicable data protection laws.
              </Typography>

              <Typography paragraph>3.2 Access Controls</Typography>
              <Typography paragraph>
                - Multi-factor authentication for sensitive operations - Regular
                security audits and monitoring - Automatic session timeouts -
                IP-based access restrictions
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel4'}
            onChange={handleChange('panel4')}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <SectionHeader
                icon={AlertTriangle}
                text="4. Liability and Disclaimers"
              />
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>4.1 Service Limitations</Typography>
              <Typography paragraph>
                - The ECS is a support tool, not a replacement for professional
                medical care - We do not guarantee 100% system uptime - Users
                must maintain backup emergency contact methods
              </Typography>

              <Typography paragraph>4.2 User Responsibilities</Typography>
              <Typography paragraph>
                Users are responsible for: - Maintaining accurate contact
                information - Reporting system issues promptly - Following
                recommended security practices - Verifying critical health
                information
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            expanded={expanded === 'panel5'}
            onChange={handleChange('panel5')}
          >
            <AccordionSummary expandIcon={<ChevronDown />}>
              <SectionHeader icon={Database} text="5. Data Management" />
            </AccordionSummary>
            <AccordionDetails>
              <Typography paragraph>5.1 Data Retention</Typography>
              <Typography paragraph>
                - Health records retained for 7 years minimum - Activity logs
                maintained for 2 years - Regular backups performed daily - Data
                export available upon request
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography color="text.secondary" gutterBottom>
            Last Updated: February 14, 2025
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              startIcon={<Info />}
              onClick={() => window.print()}
            >
              Print Terms
            </Button>
            <Button
              variant="outlined"
              startIcon={<ScrollText />}
              onClick={() => window.scrollTo(0, 0)}
            >
              Back to Top
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default TermsAndConditions;
