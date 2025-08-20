import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Alert } from '@mui/material';
import { Build, Preview } from '@mui/icons-material';

import { useFormBuilderStore } from '../../store/useFormBuilderStore';
import TopBar from '../../components/form-builder/TopBar';
import FieldPalette from '../../components/form-builder/FieldPalette';
import Canvas from '../../components/form-builder/Canvas';
import PropertyEditor from '../../components/form-builder/PropertyEditor';
import FormRenderer from '../../components/form-builder/FormRenderer';
import type { FormSchema } from '../../types/formBuilder';

const FORM_SCHEMA_LOCAL_STORAGE_KEY = 'e-school-form-schema';

const BuilderView: React.FC = () => {
  const { schema, setSchema } = useFormBuilderStore();
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  useEffect(() => {
    const savedSchemaRaw = localStorage.getItem(FORM_SCHEMA_LOCAL_STORAGE_KEY);
    if (savedSchemaRaw) {
      try {
        const savedSchema = JSON.parse(savedSchemaRaw);
        setSchema(savedSchema);
      } catch (error) {
        console.error('Failed to parse saved form schema:', error);
      }
    }
  }, [setSchema]);

  const handleSave = () => {
    localStorage.setItem(FORM_SCHEMA_LOCAL_STORAGE_KEY, JSON.stringify(schema));
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
      <TopBar onSave={handleSave} />
      {showSaveAlert && (
        <Alert severity="success" sx={{ m: 2 }}>
          Form saved successfully! Switch to the Preview tab to see it in action.
        </Alert>
      )}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <FieldPalette />
        <Canvas />
        <PropertyEditor />
      </Box>
    </Box>
  );
};

const PreviewView: React.FC = () => {
  const [schema, setSchema] = useState<FormSchema | null>(null);
  const [submissionData, setSubmissionData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    const savedSchemaRaw = localStorage.getItem(FORM_SCHEMA_LOCAL_STORAGE_KEY);
    if (savedSchemaRaw) {
      setSchema(JSON.parse(savedSchemaRaw));
    }
  }, []);

  if (!schema) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        No form schema found. Please go to the Builder tab and save a form first.
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <FormRenderer schema={schema} onSubmit={(data) => setSubmissionData(data)} />
      {submissionData && (
        <Paper sx={{ p: 2, mt: 4, backgroundColor: 'grey.100' }}>
          <Typography variant="h6">Submission Data:</Typography>
          <pre>{JSON.stringify(submissionData, null, 2)}</pre>
        </Paper>
      )}
    </Box>
  );
};

const SurveysPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Form & Survey Builder
      </Typography>
      <Paper>
        <Tabs value={tab} onChange={handleTabChange} indicatorColor="primary" textColor="primary">
          <Tab icon={<Build />} iconPosition="start" label="Builder" />
          <Tab icon={<Preview />} iconPosition="start" label="Preview" />
        </Tabs>
        <Box>
          {tab === 0 && <BuilderView />}
          {tab === 1 && <PreviewView />}
        </Box>
      </Paper>
    </Box>
  );
};

export default SurveysPage;