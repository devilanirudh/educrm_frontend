/**
 * Authentication layout component
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme, useMediaQuery } from '@mui/material';
import { School } from '@mui/icons-material';

const AuthLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          display: { xs: 'none', md: 'block' },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 4, md: 8 },
          gap: { xs: 4, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Left side - Branding */}
        {!isMobile && (
          <Box
            sx={{
              flex: 1,
              color: 'white',
              textAlign: 'center',
              maxWidth: 500,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <School sx={{ fontSize: 60, mr: 2 }} />
              <Typography variant="h3" component="h1" fontWeight={700}>
                E-School
              </Typography>
            </Box>
            
            <Typography variant="h5" gutterBottom fontWeight={500} sx={{ mb: 3 }}>
              Complete School Management Platform
            </Typography>
            
            <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
              Streamline your educational institution with our comprehensive platform 
              that integrates E-Learning, Content Management, and Customer Relationship 
              Management in one unified solution.
            </Typography>

            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  E-Learning
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Live classes & assignments
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  CMS
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Content management
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={600}>
                  CRM
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Student & parent relations
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Right side - Auth Form */}
        <Box
          sx={{
            flex: { xs: 'none', md: 1 },
            width: { xs: '100%', sm: 400, md: 450 },
            maxWidth: 450,
          }}
        >
          <Paper
            elevation={24}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              backgroundColor: 'background.paper',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Mobile branding */}
            {isMobile && (
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                    color: 'primary.main',
                  }}
                >
                  <School sx={{ fontSize: 40, mr: 1 }} />
                  <Typography variant="h4" component="h1" fontWeight={700}>
                    E-School
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  School Management Platform
                </Typography>
              </Box>
            )}

            {/* Auth form outlet */}
            <Outlet />
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default AuthLayout;
