/**
 * Loading spinner component
 */

import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  color?: 'primary' | 'secondary' | 'inherit';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  message,
  fullScreen = false,
  overlay = false,
  color = 'primary',
}) => {
  const theme = useTheme();

  const LoadingContent = (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      sx={{
        ...(fullScreen && {
          height: '100vh',
          width: '100vw',
        }),
        ...(overlay && {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000,
        }),
      }}
    >
      <CircularProgress size={size} color={color} />
      {message && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: 'center', maxWidth: 300 }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Backdrop
        open={true}
        sx={{
          color: '#fff',
          zIndex: theme.zIndex.modal + 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <CircularProgress size={size} color={color} />
          {message && (
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ textAlign: 'center', maxWidth: 300 }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Backdrop>
    );
  }

  return LoadingContent;
};

export default LoadingSpinner;
