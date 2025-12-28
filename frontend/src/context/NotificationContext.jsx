import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMyRequests } from '../api/property';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const stored = JSON.parse(localStorage.getItem('appNotifications') || '[]');
    setNotifications(stored);
    setUnreadCount(stored.filter(n => !n.read).length);
  };

  // Check for new property status updates
  const checkPropertyUpdates = async (token) => {
    if (!token) return;
    
    try {
      const res = await getMyRequests(token);
      const requests = res.data || [];
      
      // Get last checked timestamp
      const lastChecked = localStorage.getItem('lastNotificationCheck') || '0';
      const lastCheckedTime = new Date(parseInt(lastChecked));
      
      // Find requests that changed status recently
      const recentUpdates = requests.filter(req => {
        const updatedAt = new Date(req.updatedAt || req.createdAt);
        return updatedAt > lastCheckedTime && req.status !== 'pending';
      });
      
      if (recentUpdates.length > 0) {
        const existingNotifications = JSON.parse(localStorage.getItem('appNotifications') || '[]');
        
        recentUpdates.forEach(req => {
          // Check if notification already exists
          const exists = existingNotifications.find(n => n.id === req._id && n.type === 'property_status');
          if (!exists) {
            const notification = {
              id: req._id,
              type: 'property_status',
              title: req.status === 'approved' ? '✅ Property Approved!' : '❌ Property Rejected',
              message: req.status === 'approved' 
                ? `Your property "${req.title}" has been approved and is now live!`
                : `Your property "${req.title}" was rejected. Please review and resubmit.`,
              timestamp: new Date().toISOString(),
              read: false,
              propertyId: req._id
            };
            existingNotifications.unshift(notification);
          }
        });
        
        localStorage.setItem('appNotifications', JSON.stringify(existingNotifications));
        localStorage.setItem('lastNotificationCheck', Date.now().toString());
        loadNotifications();
      } else {
        localStorage.setItem('lastNotificationCheck', Date.now().toString());
      }
    } catch (err) {
      console.error('Failed to check property updates:', err);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now().toString(),
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false
    };
    
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    localStorage.setItem('appNotifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('appNotifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('appNotifications', JSON.stringify(updated));
    setUnreadCount(0);
  };

  const clearNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    localStorage.setItem('appNotifications', JSON.stringify(updated));
    setUnreadCount(updated.filter(n => !n.read).length);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    localStorage.setItem('appNotifications', '[]');
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAllNotifications,
        checkPropertyUpdates,
        loadNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
