import React, { useState, useEffect } from 'react';
import { Button, ProgressBar } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import { CheckCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './notificationDialog.css';

const NotificationDialog = ({ message, isOpen, onClose, type, onConfirm, onCancel, progress }) => {
  const [progressValue, setProgressValue] = useState(progress || 0);

  useEffect(() => {
    if (progress > 0) {
      const interval = setInterval(() => {
        setProgressValue(prev => {
          if (prev < 100) return prev + 1;
          clearInterval(interval);
          return prev;
        });
      }, 50); // Increase progress bar every 50ms
    }
  }, [progress]);

  // Define the icons based on notification type
  const icons = {
    success: <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '30px' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff', fontSize: '30px' }} />,
    warning: <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '30px' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f', fontSize: '30px' }} />
  };

  const getDialogClass = () => {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'error':
        return 'alert-danger';
      case 'warning':
        return 'alert-warning';
      case 'info':
        return 'alert-info';
      default:
        return 'alert-primary';
    }
  };

  const renderButtons = () => {
    if (type === 'warning') {
      return (
        <div>
          <Button variant="secondary" onClick={onCancel} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button variant="primary" style={{ height: '40px' }} onClick={onConfirm}>
            Ok
          </Button>
        </div>
      );
    }
    return (
      <Button variant="primary" onClick={onClose}>
        <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
        Close
      </Button>
    );
  };

  return (
    <CSSTransition in={isOpen} timeout={300} classNames="dialog" unmountOnExit>
      <div className="notification-overlay" style={styles.overlay}>
        <div className={`notification-dialog ${getDialogClass()}`} style={styles.dialog}>
          {icons[type]} {/* Display the appropriate icon */}
          <p style={{ textAlign: 'center' }}>{message}</p> {/* Center align the text */}

          {progress > 0 && (
            <ProgressBar animated now={progressValue} label={`${progressValue}%`} />
          )}

          {renderButtons()}
        </div>
      </div>
    </CSSTransition>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '400px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease-out',
  },
};

export default NotificationDialog;
