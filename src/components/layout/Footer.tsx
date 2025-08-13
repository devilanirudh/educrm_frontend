/**
 * Footer component
 */

import React from 'react';
import { Box, Typography, Link, Divider } from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {currentYear} E-School Management Platform. All rights reserved.
        </Typography>
        
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Link
            href="/privacy"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            Privacy Policy
          </Link>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
          <Link
            href="/terms"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            Terms of Service
          </Link>
          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
          <Link
            href="/support"
            color="text.secondary"
            underline="hover"
            variant="body2"
          >
            Support
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
