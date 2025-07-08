import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Button,
} from '@mui/material';
import {
  Save as SaveIcon,
  GetApp as DownloadIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useTaxStore } from '../store/taxStore';
import TaxpayerInfoSection from './sections/TaxpayerInfoSection';
import W2Section from './sections/W2Section';
import IncomeSection from './sections/IncomeSection';
import DependentsSection from './sections/DependentsSection';
import TaxCalculationSummary from './TaxCalculationSummary';

const TaxReturnForm: React.FC = () => {
  const { calculationResults, resetReturn } = useTaxStore();
  
  const handleSave = () => {
    // Data is automatically saved to localStorage via Zustand persist
    alert('Your progress has been saved locally!');
  };
  
  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    alert('PDF download coming soon!');
  };
  
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetReturn();
    }
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Federal Tax Calculator - 2024 Tax Year
          </Typography>
          <Button
            color="inherit"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button
            color="inherit"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            disabled={!calculationResults}
            sx={{ mr: 1 }}
          >
            Download PDF
          </Button>
          <IconButton
            color="inherit"
            onClick={handleReset}
            title="Reset Form"
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
          {/* Main Form Column */}
          <Box sx={{ flex: { xs: 1, lg: 2 } }}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              {/* Form Header */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                  Form 1040
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  U.S. Individual Income Tax Return
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tax Year 2024
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              {/* Personal Information */}
              <TaxpayerInfoSection />
              
              <Divider sx={{ my: 4 }} />

              {/* Income Section */}
              <IncomeSection />
              
              <Divider sx={{ my: 4 }} />

              {/* W-2 Forms */}
              <W2Section />
              
              <Divider sx={{ my: 4 }} />

              {/* Dependents */}
              <DependentsSection />
            </Paper>
          </Box>

          {/* Calculation Summary Sidebar */}
          <Box sx={{ flex: { xs: 1, lg: 1 }, minWidth: { lg: '400px' } }}>
            <TaxCalculationSummary />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TaxReturnForm; 