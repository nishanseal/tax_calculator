import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  FormControlLabel,
  Checkbox,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useTaxStore } from '../../store/taxStore';
import { Dependent } from '../../tax/types';

const DependentsSection: React.FC = () => {
  const { dependents, addDependent, updateDependent, removeDependent } = useTaxStore();

  const handleAddDependent = () => {
    const newDependent: Dependent = {
      name: '',
      ssn: '',
      relationship: '',
      birthDate: new Date(),
      isQualifyingChild: true,
      isDisabled: false,
    };
    addDependent(newDependent);
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const parseDate = (dateString: string): Date => {
    return new Date(dateString);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Dependents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddDependent}
        >
          Add Dependent
        </Button>
      </Box>

      {dependents.length === 0 ? (
        <Card variant="outlined">
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary" gutterBottom>
              No dependents added yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Add dependents to qualify for Child Tax Credit and other benefits
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={3}>
          {dependents.map((dependent, index) => (
            <Card key={index} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Dependent {index + 1}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => removeDependent(index)}
                    title="Remove Dependent"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={dependent.name}
                    onChange={(e) => updateDependent(index, { name: e.target.value })}
                  />

                  <TextField
                    fullWidth
                    label="Social Security Number"
                    value={dependent.ssn}
                    onChange={(e) => updateDependent(index, { ssn: e.target.value })}
                    inputProps={{ maxLength: 11 }}
                    placeholder="XXX-XX-XXXX"
                  />

                  <TextField
                    fullWidth
                    label="Relationship"
                    value={dependent.relationship}
                    onChange={(e) => updateDependent(index, { relationship: e.target.value })}
                    placeholder="Son, Daughter, etc."
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Birth Date"
                    type="date"
                    value={formatDate(dependent.birthDate)}
                    onChange={(e) => updateDependent(index, { birthDate: parseDate(e.target.value) })}
                    InputLabelProps={{ shrink: true }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dependent.isQualifyingChild}
                        onChange={(e) => updateDependent(index, { isQualifyingChild: e.target.checked })}
                      />
                    }
                    label="Qualifying Child (under 17)"
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dependent.isDisabled}
                        onChange={(e) => updateDependent(index, { isDisabled: e.target.checked })}
                      />
                    }
                    label="Disabled"
                  />
                </Box>

                {dependent.isQualifyingChild && (
                  <Box sx={{ mt: 2, p: 2, backgroundColor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="success.dark">
                      ✓ This dependent may qualify for the $2,000 Child Tax Credit
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DependentsSection; 