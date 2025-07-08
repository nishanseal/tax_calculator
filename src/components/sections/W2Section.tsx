import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTaxStore } from '../../store/taxStore';
import { W2Info } from '../../tax/types';

const W2Section: React.FC = () => {
  const { w2Forms, addW2Form, updateW2Form, removeW2Form } = useTaxStore();

  const handleAddW2 = () => {
    const newW2: W2Info = {
      employerName: '',
      employerEIN: '',
      wages: 0,
      federalTaxWithheld: 0,
      socialSecurityWages: 0,
      socialSecurityTaxWithheld: 0,
      medicareWages: 0,
      medicareTaxWithheld: 0,
    };
    addW2Form(newW2);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          W-2 Forms - Wages and Tax Statements
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddW2}
        >
          Add W-2
        </Button>
      </Box>

      {w2Forms.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              No W-2 forms added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Click "Add W-2" to add your employment income information
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {w2Forms.map((w2, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    W-2 Form {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => removeW2Form(index)}
                    title="Remove W-2"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Employer Name"
                    value={w2.employerName}
                    onChange={(e) => updateW2Form(index, { employerName: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Employer EIN"
                    value={w2.employerEIN}
                    onChange={(e) => updateW2Form(index, { employerEIN: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Wages (Box 1)"
                    type="number"
                    value={w2.wages || ''}
                    onChange={(e) => updateW2Form(index, { wages: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <TextField
                    fullWidth
                    label="Federal Tax Withheld (Box 2)"
                    type="number"
                    value={w2.federalTaxWithheld || ''}
                    onChange={(e) => updateW2Form(index, { federalTaxWithheld: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <TextField
                    fullWidth
                    label="Social Security Wages (Box 3)"
                    type="number"
                    value={w2.socialSecurityWages || ''}
                    onChange={(e) => updateW2Form(index, { socialSecurityWages: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <TextField
                    fullWidth
                    label="Social Security Tax Withheld (Box 4)"
                    type="number"
                    value={w2.socialSecurityTaxWithheld || ''}
                    onChange={(e) => updateW2Form(index, { socialSecurityTaxWithheld: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <TextField
                    fullWidth
                    label="Medicare Wages (Box 5)"
                    type="number"
                    value={w2.medicareWages || ''}
                    onChange={(e) => updateW2Form(index, { medicareWages: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />

                  <TextField
                    fullWidth
                    label="Medicare Tax Withheld (Box 6)"
                    type="number"
                    value={w2.medicareTaxWithheld || ''}
                    onChange={(e) => updateW2Form(index, { medicareTaxWithheld: parseFloat(e.target.value) || 0 })}
                    inputProps={{ min: 0, step: 0.01 }}
                  />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default W2Section; 