import React from 'react';

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose }) => {
  const styles = {
    container: {
      width: '367px',
      height: '734px',
      display: isOpen ? 'flex' : 'none',
      flexDirection: 'column' as const,
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
      zIndex: 1000,
      borderRadius: '40px',
      overflow: 'hidden',
    },
    header: {
      padding: '16px 24px',
      borderBottom: '1px solid #eee',
    },
    title: {
      margin: 0,
      fontSize: '18px',
      fontWeight: 'bold',
    },
    subtitle: {
      margin: '4px 0 16px',
      fontSize: '14px',
      color: '#6c757d',
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '16px',
    },
    tab: {
      padding: '6px 20px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      backgroundColor: '#f1f1f1',
      color: '#6c757d',
    },
    activeTab: {
      backgroundColor: 'white',
      color: 'black',
    },
    content: {
      padding: '16px',
      overflowY: 'auto' as const,
      flex: 1,
    },
    notificationItem: {
      display: 'flex',
      alignItems: 'flex-start',
      paddingBottom: '16px',
      marginBottom: '16px',
      borderBottom: '1px solid #eee',
    },
    profile: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: 'orange',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      color: 'white',
      marginRight: '16px',
    },
    messageContent: {
      flex: 1,
      fontSize: '14px',
    },
    titleWithTime: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '5px',
    },
    notificationTitle: {
      fontSize: '14px',
      fontWeight: 'bold',
      margin: 0,
    },
    timestamp: {
      fontSize: '12px',
      color: '#6c757d',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '18px',
      cursor: 'pointer',
      position: 'absolute' as const,
      top: '16px',
      right: '16px',
    },
  };

  return (
    <div style={styles.container}>
      <button style={styles.closeButton} onClick={onClose}>
        ✕
      </button>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Notification</h2>
        <p style={styles.subtitle}>Get timely updates and alerts when you need them most.</p>
        <div style={styles.tabs}>
          <div style={{ ...styles.tab, ...styles.activeTab }}>All</div>
          <div style={styles.tab}>Unread</div>
        </div>
      </div>
      <div style={styles.content}>
        <div style={styles.notificationItem}>
          <div style={styles.profile}>DR</div>
          <div style={styles.messageContent}>
            <div style={styles.titleWithTime}>
              <h3 style={styles.notificationTitle}>Update on password recovery</h3>
              <span style={styles.timestamp}>Just now</span>
            </div>
            <p>Darlene has updated your password, see detail on <a href="#">timeline</a>.</p>
          </div>
        </div>
        <div style={styles.notificationItem}>
          <div style={styles.profile}>DR</div>
          <div style={styles.messageContent}>
            <div style={styles.titleWithTime}>
              <h3 style={styles.notificationTitle}>Laptop Recovery</h3>
              <span style={styles.timestamp}>2 days ago</span>
            </div>
            <p>Your "request for new laptop" chat is closed. If your problem is not resolved <a href="#">click here</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;