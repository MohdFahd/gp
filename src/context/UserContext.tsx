
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user types
export type UserRole = 'visitor' | 'super-admin' | 'sub-admin' | 'secretary';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  requestedRole: UserRole | null;
  setRequestedRole: React.Dispatch<React.SetStateAction<UserRole | null>>;
  updateUserProfile: (userData: Partial<User>) => void;
  performSearch: (query: string) => any[];
  clearNotifications: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'clinicRequest' | 'appointment' | 'system';
  read: boolean;
  timestamp: Date;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Default demo users
const demoUsers = {
  'super-admin': {
    id: '1',
    name: 'أحمد محمد',
    email: 'admin@clinic.com',
    role: 'super-admin' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=0D8ABC&color=fff'
  },
  'sub-admin': {
    id: '2',
    name: 'محمد علي',
    email: 'subadmin@clinic.com',
    role: 'sub-admin' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=محمد+علي&background=06B6D4&color=fff'
  },
  'secretary': {
    id: '3',
    name: 'سارة أحمد',
    email: 'secretary@clinic.com',
    role: 'secretary' as UserRole,
    avatar: 'https://ui-avatars.com/api/?name=سارة+أحمد&background=0EA5E9&color=fff'
  }
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [requestedRole, setRequestedRole] = useState<UserRole | null>(null);

  // Check for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('clinicUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load saved notifications
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string dates back to Date objects
        const notificationsWithDates = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error("Error parsing notifications:", error);
        setNotifications([]);
      }
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('clinicUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('clinicUser');
    }
  }, [user]);
  
  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('clinicUser');
  };

  const switchRole = (role: UserRole) => {
    if (role === 'visitor') {
      logout();
      return;
    }
    
    // Instead of directly switching, set the requested role that will be used during login
    setRequestedRole(role);
    logout(); // Log out the current user to force login
  };
  
  // Update user profile
  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('clinicUser', JSON.stringify(updatedUser));
    }
  };

  const addNotification = (notification: Notification) => {
    // Ensure the notification has an ID
    const notificationWithId = notification.id ? 
      notification : 
      { ...notification, id: Date.now().toString() };
      
    setNotifications(prev => [notificationWithId, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('userNotifications');
  };
  
  // Search functionality
  const performSearch = (query: string) => {
    if (!query.trim()) return [];
    
    // Get data from localStorage
    const clinics = JSON.parse(localStorage.getItem('clinics') || '[]');
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    
    // Search in clinics
    const matchedClinics = clinics.filter((clinic: any) => 
      clinic.name.toLowerCase().includes(query.toLowerCase()) ||
      clinic.doctorName.toLowerCase().includes(query.toLowerCase()) ||
      clinic.specialization.toLowerCase().includes(query.toLowerCase())
    );
    
    // Search in appointments
    const matchedAppointments = appointments.filter((appointment: any) => 
      appointment.patientName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.clinicName.toLowerCase().includes(query.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(query.toLowerCase())
    );
    
    // Search in prescriptions
    const matchedPrescriptions = prescriptions.filter((prescription: any) => 
      prescription.patientName.toLowerCase().includes(query.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(query.toLowerCase()) ||
      (prescription.medications && prescription.medications.some((med: any) => 
        med.name.toLowerCase().includes(query.toLowerCase())
      ))
    );
    
    // Return combined results
    return [
      ...matchedClinics.map((c: any) => ({ ...c, type: 'clinic' })),
      ...matchedAppointments.map((a: any) => ({ ...a, type: 'appointment' })),
      ...matchedPrescriptions.map((p: any) => ({ ...p, type: 'prescription' }))
    ];
  };

  const value = {
    user,
    setUser,
    logout,
    switchRole,
    isAuthenticated: !!user,
    notifications,
    addNotification,
    markNotificationRead,
    requestedRole,
    setRequestedRole,
    updateUserProfile,
    performSearch,
    clearNotifications,
  };

  // Make addNotification available globally for components that can't use the context
  // This helps with the prescription form that needs to create notifications
  (window as any).addNotification = addNotification;

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
