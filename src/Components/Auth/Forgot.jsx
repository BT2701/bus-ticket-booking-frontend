import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./Auth.css";
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification';

const Forgot =()=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        
        ApiService.post('/api/mail/sendEmailToForgotPassword?email=' + values.email)
            .then((response) => {
                form.resetFields();
                notificationWithIcon('success', 'Forgot password', 'Thông tin xác nhập đã được gửi qua email của bạn!');
                setLoading(false);
            })
            .catch((err) => {
              notificationWithIcon('error', 'Lỗi', 'Không thể gửi thông tin xác nhận qua email của bạn vì : ' + (err?.response?.data?.message || err?.message));
            })
            .finally(() => { 
                setLoading(false);
            });
    };
    return(
        <div style={{ width: '400px',margin: '100px auto'  }}>
          <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Quên mật khẩu</h3>
          <Form
            form={form}
            className='login-form'
            style={{ paddingBottom: '50px' }}
            initialValues={{ remember: true }}
            name='beach-resort-forgot-password-form'
            onFinish={onFinish}
          >
            <Form.Item
              name='email'
              rules={[{
                required: true,
                message: 'Vui lòng nhập email của bạn!'
              }]}
            >
              <Input
                prefix={<MailOutlined className='site-form-item-icon' />}
                placeholder='Email'
                size='large'
              />
            </Form.Item>

            <Form.Item>
              <Button
                className='login-form-button'
                htmlType='submit'
                type='primary'
                size='large'
                block
                loading={loading}
                disabled={loading}
              >
                Quên mật khẩu
              </Button>
            </Form.Item>

            <Link
              className='btn-login-registration'
              to='/login'
            >
              Hoặc đăng nhập tại đây!
            </Link>
          </Form>
        </div>
    );
};
export default Forgot;