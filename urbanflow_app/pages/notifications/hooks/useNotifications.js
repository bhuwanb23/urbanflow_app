import { useState, useEffect, useCallback, useMemo } from 'react';
import { mockNotifications, getNotificationsByFilter, getNotificationsByType, searchNotifications } from '../data/mockNotifications';
import { groupNotificationsByDate } from '../utils/notificationTypes';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('timestamp'); // timestamp, priority, type
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Simulate API call
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      setNotifications(mockNotifications);
      setError(null);
    } catch (err) {
      setError('Failed to fetch notifications');
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Apply type filter
    if (activeType !== 'all') {
      filtered = getNotificationsByType(activeType, filtered);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = searchNotifications(searchQuery, filtered);
    }

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = getNotificationsByFilter(activeFilter, filtered);
    }

    // Sort notifications
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'timestamp':
          comparison = new Date(a.timestamp) - new Date(b.timestamp);
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [notifications, activeFilter, activeType, searchQuery, sortBy, sortOrder]);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    return groupNotificationsByDate(filteredNotifications);
  }, [filteredNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  }, []);

  // Toggle important status
  const toggleImportant = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isImportant: !notification.isImportant }
          : notification
      )
    );
  }, []);

  // Delete notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  }, []);

  // Get notification statistics
  const stats = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead).length;
    const important = notifications.filter(n => n.isImportant).length;
    const today = notifications.filter(n => {
      const today = new Date();
      const notificationDate = new Date(n.timestamp);
      return notificationDate.toDateString() === today.toDateString();
    }).length;

    return { total, unread, important, today };
  }, [notifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setActiveFilter('all');
    setActiveType('all');
    setSearchQuery('');
    setSortBy('timestamp');
    setSortOrder('desc');
  }, []);

  return {
    // State
    notifications: filteredNotifications,
    groupedNotifications,
    loading,
    error,
    activeFilter,
    activeType,
    searchQuery,
    sortBy,
    sortOrder,
    stats,

    // Actions
    setActiveFilter,
    setActiveType,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    markAsRead,
    markAllAsRead,
    toggleImportant,
    deleteNotification,
    refreshNotifications,
    clearSearch,
    resetFilters,
  };
};
