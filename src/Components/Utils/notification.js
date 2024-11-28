import React, { useEffect, useState } from 'react';
import { notification, Progress } from 'antd';
import { CheckCircleOutlined, InfoCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const notificationWithIcon = (type, title, msg) => {
  const icons = {
    success: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    info: <InfoCircleOutlined style={{ color: '#1890ff' }} />,
    warning: <ExclamationCircleOutlined style={{ color: '#faad14' }} />,
    error: <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
  };

  const duration = 3; // duration in seconds

  const NotificationContent = () => {
    const [percent, setPercent] = useState(100);

    useEffect(() => {
      const interval = setInterval(() => {
        setPercent(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            return 0;
          }
          return prev - (100 / (duration * 10));
        });
      }, 100);

      return () => clearInterval(interval);
    }, []);

    return (
      <div>
        <div>{msg}</div>
        {/* <Progress percent={percent} showInfo={false} strokeWidth={2} /> */}
        <Progress percent={percent} showInfo={false} size={2} />
      </div>
    );
  };

  notification[type]({
    message: title,
    description: <NotificationContent />,
    icon: icons[type],
    placement: 'topRight',
    duration: duration
  });
};

export default notificationWithIcon;
