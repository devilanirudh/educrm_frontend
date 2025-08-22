import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useLibrary } from '../../hooks/useLibrary';
import IssueBookForm from '../../components/library/IssueBookForm';
import { useNavigate } from 'react-router-dom';

const IssueBookPage: React.FC = () => {
  const navigate = useNavigate();
  const { createIssue, isCreatingIssue } = useLibrary();

  const handleSubmit = (values: any) => {
    createIssue(values, {
      onSuccess: () => {
        navigate('/library');
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Issue Book
      </Typography>
      {isCreatingIssue && <Alert severity="info">Issuing book...</Alert>}
      <IssueBookForm onSubmit={handleSubmit} />
    </Box>
  );
};

export default IssueBookPage;