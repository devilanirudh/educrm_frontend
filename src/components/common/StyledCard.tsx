import React from 'react';
import { Card, CardProps, styled } from '@mui/material';

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  padding: theme.spacing(2),
  height: '100%',
}));

export default StyledCard;