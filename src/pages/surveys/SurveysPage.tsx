import React, { useState } from 'react';
import { Box, Typography, Paper, Button, ButtonGroup, Alert } from '@mui/material';
import SurveyBuilder from '../../components/surveys/SurveyBuilder';
import SurveyViewer from '../../components/surveys/SurveyViewer';
import { defaultForm } from '../../config/defaultForm';

const SurveysPage: React.FC = () => {
  const [mode, setMode] = useState<'builder' | 'viewer'>('builder');
  // In a real app, this JSON would be saved and fetched from a database.
  const [formJson, setFormJson] = useState(defaultForm);
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  const handleSave = (json: any) => {
    setFormJson(json);
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          Form & Survey Management
        </Typography>
        <ButtonGroup variant="outlined">
          <Button
            onClick={() => setMode('builder')}
            variant={mode === 'builder' ? 'contained' : 'outlined'}
          >
            Builder
          </Button>
          <Button
            onClick={() => setMode('viewer')}
            variant={mode === 'viewer' ? 'contained' : 'outlined'}
          >
            Preview
          </Button>
        </ButtonGroup>
      </Box>

      {showSaveAlert && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Form definition saved! Switch to Preview mode to see your changes.
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {mode === 'builder' ? (
          <SurveyBuilder initialJson={formJson} onSave={handleSave} />
        ) : (
          <SurveyViewer json={formJson} />
        )}
      </Paper>
    </Box>
  );
};

export default SurveysPage;