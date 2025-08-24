import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/auth';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import { useUnreadCount } from '../../hooks/useNotifications';
import NotificationsDropdown from '../common/NotificationsDropdown';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HomeIcon, 
  UsersIcon, 
  AcademicCapIcon,
  BookOpenIcon,
  CreditCardIcon,
  VideoCameraIcon,
  TruckIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  CubeIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface TailwindLayoutProps {
  children: React.ReactNode;
}

const TailwindLayout: React.FC<TailwindLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Debug user state
  console.log('🔍 Full user state:', user);
  console.log('🔍 User role from Redux:', user?.role);
  
  // Notifications
  const { data: unreadCount = { count: 0 } } = useUnreadCount();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Notification handlers
  const handleNotificationsToggle = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleNotificationsClose = () => {
    setNotificationsOpen(false);
  };

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Students', href: '/students', icon: UsersIcon },
      { name: 'Teachers', href: '/teachers', icon: AcademicCapIcon },
      { name: 'Classes', href: '/classes', icon: BookOpenIcon },
      { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentListIcon },
      { name: 'Exams', href: '/exams', icon: DocumentTextIcon },
      { name: 'Fees', href: '/fees', icon: CreditCardIcon },
      { name: 'Live Classes', href: '/live-classes', icon: VideoCameraIcon },
      { name: 'Library', href: '/library', icon: BookOpenIcon },
      { name: 'Transport', href: '/transport', icon: TruckIcon },
      { name: 'Hostel', href: '/hostel', icon: BuildingOfficeIcon },
      { name: 'Events', href: '/events', icon: CalendarIcon },
      { name: 'Reports', href: '/reports', icon: ChartBarIcon },
      { name: 'Communication', href: '/communication', icon: ChatBubbleLeftRightIcon },
      { name: 'Inventory', href: '/inventory', icon: CubeIcon },
      { name: 'CMS', href: '/cms', icon: DocumentTextIcon },
      { name: 'CRM', href: '/crm', icon: UserGroupIcon },
      { name: 'Form Builder', href: '/form-builder', icon: CogIcon },
    ];

    // Filter based on user role
    if (user?.role === 'student') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentListIcon },
        { name: 'Exams', href: '/exams', icon: DocumentTextIcon },
        { name: 'Live Classes', href: '/live-classes', icon: VideoCameraIcon },
        { name: 'Library', href: '/library', icon: BookOpenIcon },
        { name: 'Transport', href: '/transport', icon: TruckIcon },
        { name: 'Events', href: '/events', icon: CalendarIcon },
      ];
    }

    if (user?.role === 'teacher') {
      return [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Classes', href: '/classes', icon: BookOpenIcon },
        { name: 'Assignments', href: '/assignments', icon: ClipboardDocumentListIcon },
        { name: 'Exams', href: '/exams', icon: DocumentTextIcon },
        { name: 'Live Classes', href: '/live-classes', icon: VideoCameraIcon },
        { name: 'Reports', href: '/reports', icon: ChartBarIcon },
        { name: 'Communication', href: '/communication', icon: ChatBubbleLeftRightIcon },
      ];
    }

    // For admin and super_admin, add role management
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      baseItems.push({ name: 'Role Management', href: '/role-management', icon: CogIcon });
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      console.log('🔐 Starting Firebase logout...');
      
      // Sign out from Firebase
      await signOut(auth);
      console.log('✅ Firebase sign out successful');
      
      // Clear Redux state
      dispatch(logout());
      console.log('✅ Redux state cleared');
      
      // Navigate to login
      navigate('/login');
      console.log('✅ Navigated to login page');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Even if Firebase logout fails, clear local state and redirect
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          ${sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}
        `}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-surface-200">
              <div className="flex items-center space-x-3">
                {/* Education Icon */}
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-brand-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"/>
                  </svg>
                </div>
                {!sidebarCollapsed && (
                  <h1 className="text-xl font-bold text-brand-600">EduSphere</h1>
                )}
              </div>
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden p-1 text-surface-500 rounded-md hover:bg-surface-100 lg:block"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-surface-500 rounded-md hover:bg-surface-100 lg:hidden"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-colors duration-200
                      ${isActive 
                        ? 'bg-brand-50 text-brand-700 border border-brand-200' 
                        : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className={`
                      w-5 h-5 mr-3 flex-shrink-0
                      ${sidebarCollapsed ? 'lg:mr-0' : ''}
                    `} />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.name}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-surface-200">
              <div className="flex items-center">
                <UserCircleIcon className="w-8 h-8 text-surface-400" />
                {!sidebarCollapsed && (
                  <div className="ml-3">
                    <p className="text-sm font-medium text-surface-900">{user ? `${user.first_name} ${user.last_name}` : 'User'}</p>
                    <p className="text-xs text-surface-500 capitalize">{user?.role || 'user'}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white border-b border-surface-200 backdrop-blur-sm bg-white/80">
            <div className="flex items-center justify-between h-16 px-4">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 text-surface-500 rounded-md hover:bg-surface-100 lg:hidden"
                >
                  <Bars3Icon className="w-5 h-5" />
                </button>
                <h2 className="ml-2 text-lg font-semibold text-surface-900">
                  {navigationItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button 
                  onClick={handleNotificationsToggle}
                  className="relative p-2 text-surface-500 rounded-md hover:bg-surface-100 transition-colors duration-200"
                >
                  <BellIcon className="w-5 h-5" />
                  {unreadCount.count > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount.count}
                    </span>
                  )}
                </button>

                {/* User menu */}
                <div className="relative" ref={userMenuRef}>
                  <button 
                    className="flex items-center p-2 text-surface-500 rounded-md hover:bg-surface-100"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <UserCircleIcon className="w-5 h-5" />
                  </button>
                  
                  {/* User dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-strong border border-surface-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-surface-200">
                        <p className="text-sm font-medium text-surface-900">
                          {user ? `${user.first_name} ${user.last_name}` : 'User'}
                        </p>
                        <p className="text-xs text-surface-500 capitalize">{user?.role || 'user'}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 transition-colors duration-200"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Notifications Dropdown */}
      <NotificationsDropdown 
        isOpen={notificationsOpen} 
        onClose={handleNotificationsClose} 
      />
    </div>
  );
};

export default TailwindLayout;
