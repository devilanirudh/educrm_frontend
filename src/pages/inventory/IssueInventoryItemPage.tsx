import React from 'react';
import { Box, Typography, Alert } from '@mui/material';
import { useInventory } from '../../hooks/useInventory';
import IssueInventoryItemForm from '../../components/inventory/IssueInventoryItemForm';
import { useNavigate } from 'react-router-dom';

const IssueInventoryItemPage: React.FC = () => {
  const navigate = useNavigate();
  const { createIssue, isCreatingIssue } = useInventory();

  const handleSubmit = (values: any) => {
    createIssue(values, {
      onSuccess: () => {
        navigate('/inventory');
      },
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Issue Inventory Item
      </Typography>
      {isCreatingIssue && <Alert severity="info">Issuing item...</Alert>}
      <IssueInventoryItemForm onSubmit={handleSubmit} />
    </Box>
  );
};

export default IssueInventoryItemPage;