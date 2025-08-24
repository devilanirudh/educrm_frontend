/**
 * Header component
 */

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  AccountCircle,
  Settings,
  Logout,
  DarkMode,
  LightMode,
  Cached,
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, useAppDispatch } from '../../store';
import { toggleSidebar, toggleTheme } from '../../store/uiSlice';
import { logout } from '../../store/authSlice';
import { authService, tokenUtils } from '../../services/auth';
import { useUnreadCount } from '../../hooks/useNotifications';
import NotificationsDropdown from '../common/NotificationsDropdown';


interface HeaderProps {
  onMobileMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  console.log('🏗️ Header component rendering...');
  
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme } = useSelector((state: RootState) => state.ui);

  // Notifications state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: unreadCount = { count: 0 }, error: unreadCountError } = useUnreadCount();
  
  // Show demo count if API fails
  const displayCount = unreadCountError ? 2 : unreadCount.count;
  
  console.log('🔔 Notifications state:', { notificationsOpen, displayCount, unreadCountError });
  
  // Track notifications state changes
  useEffect(() => {
    console.log('🔔 Notifications state changed to:', notificationsOpen);
  }, [notificationsOpen]);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    console.log('🚪 Logout button clicked');
    
    try {
      // Call backend logout endpoint (optional, but good practice)
      console.log('📡 Calling backend logout...');
      await authService.logout();
      console.log('✅ Backend logout successful');
    } catch (error) {
      console.log('❌ Backend logout failed, continuing with client logout:', error);
    }
    
    // Clear Redux store (this will also clear localStorage via redux-persist)
    console.log('🗑️ Clearing Redux store...');
    dispatch(logout());

    // Clear localStorage tokens (backup)
    console.log('🗑️ Clearing localStorage tokens...');
    tokenUtils.clearTokens();
    
    // Close menu
    handleClose();
    
    // Navigate to login page
    console.log('🔄 Navigating to login page...');
    navigate('/login');
    
    console.log('✅ Logout complete!');
  };

  const handleSwitchRole = async () => {
    try {
      const newRole = user?.role === 'super_admin' ? 'admin' : 'super_admin';
      const response = await authService.switchRole(newRole);
      tokenUtils.setTokens(response.access_token, tokenUtils.getRefreshToken() || '');
      window.location.reload(); // Reload to apply new role
    } catch (error) {
      console.error('Failed to switch role', error);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleNotificationsToggle = () => {
    console.log('🔔 Bell icon clicked! Current state:', notificationsOpen);
    setNotificationsOpen(!notificationsOpen);
    console.log('🔔 Setting notifications open to:', !notificationsOpen);
  };

  const handleNotificationsClose = () => {
    setNotificationsOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
      <Toolbar>
        {/* Menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={() => {
            dispatch(toggleSidebar());
            onMobileMenuToggle();
          }}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Title */}
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          E-School Management
        </Typography>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme toggle */}
          <IconButton onClick={handleThemeToggle} color="inherit">
            {theme === 'dark' ? <LightMode /> : <DarkMode />}
          </IconButton>

          {/* Test button */}
          <button 
            onClick={() => alert('Test button clicked!')}
            style={{ 
              border: '2px solid blue', 
              padding: '8px', 
              margin: '0 4px',
              backgroundColor: 'yellow'
            }}
          >
            TEST
          </button>

          {/* Notifications */}
          <IconButton 
            color="inherit"
            onClick={(e) => {
              alert('🔔 Bell icon clicked!'); // Simple test
              console.log('🔔 IconButton clicked!', e);
              e.preventDefault();
              e.stopPropagation();
              handleNotificationsToggle();
            }}
            aria-label="notifications"
            sx={{ 
              border: '2px solid red', // Debug border
              '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.2)' } // Debug hover
            }}
          >
            <Badge badgeContent={displayCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User menu */}
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            {user?.profile_picture ? (
              <Avatar
                src={user.profile_picture}
                alt={user.first_name}
                sx={{ width: 32, height: 32 }}
              />
            ) : (
              <AccountCircle />
            )}
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <Box>
                <Typography variant="subtitle2">
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role?.replace('_', ' ')}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
                        {(user?.role === 'super_admin' || user?.role === 'admin') && (
                          <MenuItem onClick={handleSwitchRole}>
                            <Cached sx={{ mr: 2 }} />
                            Switch to {user?.role === 'super_admin' ? 'Admin' : 'Super Admin'}
                          </MenuItem>
                        )}
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
      </AppBar>

    {/* Notifications Dropdown */}
    <NotificationsDropdown 
      isOpen={notificationsOpen} 
      onClose={handleNotificationsClose} 
    />
  </>
  );
};

export default Header;
