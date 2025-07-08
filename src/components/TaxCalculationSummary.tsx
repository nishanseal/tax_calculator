import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as TaxIcon,
} from '@mui/icons-material';
import { useTaxStore } from '../store/taxStore';

const TaxCalculationSummary: React.FC = () => {
  const { calculationResults, w2Forms, dependents } = useTaxStore();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (rate: number): string => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  if (!calculationResults) {
    return (
      <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 24 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
          Tax Calculation Summary
        </Typography>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          Add at least one W-2 form to see your tax calculation
        </Alert>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Status:
          </Typography>
          <Chip
            label={`${w2Forms.length} W-2 form${w2Forms.length !== 1 ? 's' : ''}`}
            color={w2Forms.length > 0 ? 'success' : 'default'}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
          <Chip
            label={`${dependents.length} dependent${dependents.length !== 1 ? 's' : ''}`}
            color={dependents.length > 0 ? 'success' : 'default'}
            size="small"
            sx={{ mr: 1, mb: 1 }}
          />
        </Box>
      </Paper>
    );
  }

  const isRefund = calculationResults.refundOrAmountDue > 0;
  const refundColor = isRefund ? 'success.main' : 'error.main';

  return (
    <Paper elevation={3} sx={{ p: 3, position: 'sticky', top: 24 }}>
      <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
        Tax Calculation Summary
      </Typography>

      {/* Income Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle2" color="text.secondary">
            INCOME
          </Typography>
        </Box>
        
        <Box sx={{ pl: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Adjusted Gross Income</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatCurrency(calculationResults.adjustedGrossIncome)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Standard Deduction</Typography>
            <Typography variant="body2" color="success.main">
              -{formatCurrency(calculationResults.standardDeduction)}
            </Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" fontWeight="medium">Taxable Income</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatCurrency(calculationResults.taxableIncome)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Tax Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TaxIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle2" color="text.secondary">
            TAX CALCULATION
          </Typography>
        </Box>
        
        <Box sx={{ pl: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Income Tax</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatCurrency(calculationResults.incomeTax)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Child Tax Credit</Typography>
            <Typography variant="body2" color="success.main">
              -{formatCurrency(calculationResults.childTaxCredit)}
            </Typography>
          </Box>
          
          {calculationResults.earnedIncomeCredit > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Earned Income Credit</Typography>
              <Typography variant="body2" color="success.main">
                -{formatCurrency(calculationResults.earnedIncomeCredit)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Tax Withheld</Typography>
            <Typography variant="body2" color="success.main">
              -{formatCurrency(calculationResults.totalTaxWithheld)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Final Result */}
      <Box sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">
            {isRefund ? 'Refund' : 'Amount Due'}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: refundColor }}>
            {formatCurrency(Math.abs(calculationResults.refundOrAmountDue))}
          </Typography>
        </Box>
      </Box>

      {/* Tax Rates */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <TrendingUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="subtitle2" color="text.secondary">
            TAX RATES
          </Typography>
        </Box>
        
        <Box sx={{ pl: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">Effective Tax Rate</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatPercentage(calculationResults.effectiveTaxRate)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">Marginal Tax Rate</Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatPercentage(calculationResults.marginalTaxRate)}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Status Chips */}
      <Box sx={{ mt: 3 }}>
        <Chip
          label={`${w2Forms.length} W-2 form${w2Forms.length !== 1 ? 's' : ''}`}
          color="primary"
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
        <Chip
          label={`${dependents.length} dependent${dependents.length !== 1 ? 's' : ''}`}
          color={dependents.length > 0 ? 'success' : 'default'}
          size="small"
          sx={{ mr: 1, mb: 1 }}
        />
      </Box>
    </Paper>
  );
};

export default TaxCalculationSummary; 