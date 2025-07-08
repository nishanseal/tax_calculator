import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useTaxStore } from '../../store/taxStore';
import { FilingStatus } from '../../tax/types';

const TaxpayerInfoSection: React.FC = () => {
  const {
    taxpayerInfo,
    spouseName,
    address,
    updateTaxpayerInfo,
    updateAddress,
    setSpouseName,
  } = useTaxStore();

  const isMarried = taxpayerInfo.filingStatus === FilingStatus.MARRIED_FILING_JOINTLY ||
                   taxpayerInfo.filingStatus === FilingStatus.MARRIED_FILING_SEPARATELY;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Personal Information
      </Typography>
      
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        {/* Filing Status */}
        <FormControl fullWidth>
          <InputLabel>Filing Status</InputLabel>
          <Select
            value={taxpayerInfo.filingStatus}
            label="Filing Status"
            onChange={(e) => updateTaxpayerInfo({ filingStatus: e.target.value as FilingStatus })}
          >
            <MenuItem value={FilingStatus.SINGLE}>Single</MenuItem>
            <MenuItem value={FilingStatus.MARRIED_FILING_JOINTLY}>Married Filing Jointly</MenuItem>
            <MenuItem value={FilingStatus.MARRIED_FILING_SEPARATELY}>Married Filing Separately</MenuItem>
            <MenuItem value={FilingStatus.HEAD_OF_HOUSEHOLD}>Head of Household</MenuItem>
            <MenuItem value={FilingStatus.QUALIFYING_WIDOW}>Qualifying Surviving Spouse</MenuItem>
          </Select>
        </FormControl>

        {/* Age */}
        <TextField
          fullWidth
          label="Your Age"
          type="number"
          value={taxpayerInfo.age}
          onChange={(e) => updateTaxpayerInfo({ age: parseInt(e.target.value) || 0 })}
          inputProps={{ min: 0, max: 120 }}
        />

        {/* Spouse Name (if married) */}
        {isMarried && (
          <TextField
            fullWidth
            label="Spouse's Full Name"
            value={spouseName || ''}
            onChange={(e) => setSpouseName(e.target.value)}
          />
        )}
      </Box>

      {/* Address Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Home Address
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          fullWidth
          label="Street Address"
          value={address.street}
          onChange={(e) => updateAddress({ street: e.target.value })}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, gap: 2 }}>
          <TextField
            fullWidth
            label="City"
            value={address.city}
            onChange={(e) => updateAddress({ city: e.target.value })}
          />

          <TextField
            fullWidth
            label="State"
            value={address.state}
            onChange={(e) => updateAddress({ state: e.target.value })}
            inputProps={{ maxLength: 2 }}
          />

          <TextField
            fullWidth
            label="ZIP Code"
            value={address.zipCode}
            onChange={(e) => updateAddress({ zipCode: e.target.value })}
            inputProps={{ maxLength: 10 }}
          />
        </Box>
      </Box>

      {/* Special Circumstances */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Special Circumstances
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={taxpayerInfo.isBlind}
              onChange={(e) => updateTaxpayerInfo({ isBlind: e.target.checked })}
            />
          }
          label="You are blind"
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={taxpayerInfo.canBeClaimedAsDependent}
              onChange={(e) => updateTaxpayerInfo({ canBeClaimedAsDependent: e.target.checked })}
            />
          }
          label="You can be claimed as a dependent"
        />
      </Box>
    </Box>
  );
};

export default TaxpayerInfoSection;