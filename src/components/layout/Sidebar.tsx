/**
 * Sidebar navigation component
 */

import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Collapse, Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../store';
import {
  Dashboard,
  School,
  People,
  Class,
  Assignment,
  Quiz,
  Payment,
  VideoCall,
  LibraryBooks,
  DirectionsBus,
  Hotel,
  Event,
  Web,
  Contacts,
  Analytics,
  Chat,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, sidebarCollapsed } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const [openSections, setOpenSections] = React.useState<string[]>(['academic']);

  const handleSectionToggle = (section: string) => {
    setOpenSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

  // Menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      {
        text: 'Dashboard',
        icon: <Dashboard />,
        path: '/dashboard',
      },
    ];

    const adminItems = [
      {
        text: 'Academic',
        icon: <School />,
        children: [
          { text: 'Students', icon: <People />, path: '/students' },
          { text: 'Teachers', icon: <People />, path: '/teachers' },
          { text: 'Classes', icon: <Class />, path: '/classes' },
          { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
          { text: 'Exams', icon: <Quiz />, path: '/exams' },
        ],
      },
      {
        text: 'Management',
        icon: <Analytics />,
        children: [
          { text: 'Fees & Payments', icon: <Payment />, path: '/fees' },
          { text: 'Live Classes', icon: <VideoCall />, path: '/live-classes' },
          { text: 'Library', icon: <LibraryBooks />, path: '/library' },
          { text: 'Transport', icon: <DirectionsBus />, path: '/transport' },
          { text: 'Hostel', icon: <Hotel />, path: '/hostel' },
          { text: 'Events', icon: <Event />, path: '/events' },
        ],
      },
      {
        text: 'System',
        icon: <Web />,
        children: [
          { text: 'CMS', icon: <Web />, path: '/cms' },
          { text: 'CRM', icon: <Contacts />, path: '/crm' },
          { text: 'Reports', icon: <Analytics />, path: '/reports' },
          { text: 'Communication', icon: <Chat />, path: '/communication' },
        ],
      },
    ];

    const teacherItems = [
      {
        text: 'Teaching',
        icon: <School />,
        children: [
          { text: 'My Classes', icon: <Class />, path: '/classes' },
          { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
          { text: 'Exams', icon: <Quiz />, path: '/exams' },
          { text: 'Live Classes', icon: <VideoCall />, path: '/live-classes' },
        ],
      },
      { text: 'Students', icon: <People />, path: '/students' },
      { text: 'Library', icon: <LibraryBooks />, path: '/library' },
    ];

    const studentItems = [
      { text: 'My Classes', icon: <Class />, path: '/classes' },
      { text: 'Assignments', icon: <Assignment />, path: '/assignments' },
      { text: 'Exams', icon: <Quiz />, path: '/exams' },
      { text: 'Live Classes', icon: <VideoCall />, path: '/live-classes' },
      { text: 'Library', icon: <LibraryBooks />, path: '/library' },
      { text: 'Events', icon: <Event />, path: '/events' },
    ];

    const parentItems = [
      { text: 'My Children', icon: <People />, path: '/students' },
      { text: 'Fees & Payments', icon: <Payment />, path: '/fees' },
      { text: 'Communication', icon: <Chat />, path: '/communication' },
      { text: 'Events', icon: <Event />, path: '/events' },
    ];

    switch (user?.role) {
      case 'admin':
      case 'super_admin':
        return [...baseItems, ...adminItems];
      case 'teacher':
        return [...baseItems, ...teacherItems];
      case 'student':
        return [...baseItems, ...studentItems];
      case 'parent':
        return [...baseItems, ...parentItems];
      default:
        return baseItems;
    }
  };

  const renderMenuItem = (item: any, level: number = 0) => {
    if (item.children) {
      const isOpen = openSections.includes(item.text.toLowerCase());
      return (
        <React.Fragment key={item.text}>
          <ListItem
            button
            onClick={() => handleSectionToggle(item.text.toLowerCase())}
            sx={{
              pl: 2 + level * 2,
              minHeight: 48,
              backgroundColor: 'transparent',
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            {!sidebarCollapsed && (
              <>
                <ListItemText primary={item.text} />
                {isOpen ? <ExpandLess /> : <ExpandMore />}
              </>
            )}
          </ListItem>
          <Collapse in={isOpen && !sidebarCollapsed} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child: any) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    return (
      <ListItem
        key={item.text}
        button
        onClick={() => handleNavigation(item.path)}
        sx={{
          pl: 2 + level * 2,
          minHeight: 48,
          backgroundColor: isActive(item.path) ? 'action.selected' : 'transparent',
          borderRight: isActive(item.path) ? 3 : 0,
          borderColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: isActive(item.path) ? 'primary.main' : 'inherit' }}>
          {item.icon}
        </ListItemIcon>
        {!sidebarCollapsed && (
          <ListItemText
            primary={item.text}
            sx={{ color: isActive(item.path) ? 'primary.main' : 'inherit' }}
          />
        )}
      </ListItem>
    );
  };

  const drawer = (
    <Box sx={{ overflow: 'auto', height: '100%' }}>
      {/* Logo/Title */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <School sx={{ mr: sidebarCollapsed ? 0 : 2, color: 'primary.main' }} />
        {!sidebarCollapsed && (
          <Typography variant="h6" noWrap component="div" color="primary">
            E-School
          </Typography>
        )}
      </Box>

      {/* Navigation */}
      <List>
        {getMenuItems().map(item => renderMenuItem(item))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={sidebarOpen}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarCollapsed ? 70 : 280,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;
