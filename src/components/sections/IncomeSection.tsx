import React from 'react';
import {
  Box,
  Typography,
  TextField,
} from '@mui/material';
import { useTaxStore } from '../../store/taxStore';

const IncomeSection: React.FC = () => {
  const {
    interestIncome,
    unemploymentCompensation,
    studentLoanInterestPaid,
    estimatedTaxPayments,
    updateIncome,
  } = useTaxStore();

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Other Income & Deductions
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <TextField
          fullWidth
          label="Interest Income"
          type="number"
          value={interestIncome || ''}
          onChange={(e) => updateIncome('interestIncome', parseFloat(e.target.value) || 0)}
          inputProps={{ min: 0, step: 0.01 }}
          helperText="Interest from banks, credit unions, etc."
        />

        <TextField
          fullWidth
          label="Unemployment Compensation"
          type="number"
          value={unemploymentCompensation || ''}
          onChange={(e) => updateIncome('unemploymentCompensation', parseFloat(e.target.value) || 0)}
          inputProps={{ min: 0, step: 0.01 }}
          helperText="Unemployment benefits received"
        />

        <TextField
          fullWidth
          label="Student Loan Interest Paid"
          type="number"
          value={studentLoanInterestPaid || ''}
          onChange={(e) => updateIncome('studentLoanInterestPaid', parseFloat(e.target.value) || 0)}
          inputProps={{ min: 0, step: 0.01, max: 2500 }}
          helperText="Maximum deduction: $2,500"
        />

        <TextField
          fullWidth
          label="Estimated Tax Payments"
          type="number"
          value={estimatedTaxPayments || ''}
          onChange={(e) => updateIncome('estimatedTaxPayments', parseFloat(e.target.value) || 0)}
          inputProps={{ min: 0, step: 0.01 }}
          helperText="Quarterly estimated taxes paid"
        />
      </Box>
    </Box>
  );
};

export default IncomeSection; 