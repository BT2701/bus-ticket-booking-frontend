import React from 'react';
import { Button } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import './notificationDialog.css';

const NotificationDialog = ({ message, isOpen, onClose }) => {
  return (
    <CSSTransition
      in={isOpen}
      timeout={300}
      classNames="dialog"
      unmountOnExit
    >
      <div className="notification-overlay" style={styles.overlay}>
        <div className="notification-dialog" style={styles.dialog}>
          <p>{message}</p>
          <Button onClick={onClose} variant="primary">
            <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
            Close
          </Button>
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
