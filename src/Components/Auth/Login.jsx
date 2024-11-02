import "./Auth.css";

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input
} from 'antd';
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ApiService from "../Utils/apiService";
import { useUserContext } from "../../Context/UserProvider";
import { setSessionAccess, setSessionAccessAndRefreshToken, setSessionUser } from "../Utils/authentication";
import notificationWithIcon from "../Utils/notification";

const Login =()=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state: user, dispatch } = useUserContext();

    const onFinish = (values) => {
        setLoading(true);

        const payload = {
            username: values.email,
            password: values.password
        };
    
        console.log(payload);
        
        ApiService.post('/api/customers/login', payload)
            .then(async (response) => {
                console.log(response);

                if(values.remember) {
                    setSessionAccessAndRefreshToken(response?.data?.access_token, response?.data?.refresh_token);
                } else {
                    setSessionAccess(response?.data?.access_token);
                }

                const userDetail = await ApiService.get('/api/customers/details');
                dispatch({
                    type: 'SET_USER',
                    payload: userDetail?.data
                });
                setSessionUser(userDetail?.data);
                
                console.log(userDetail);

                form.resetFields();
                notificationWithIcon('success', 'Login', 'Đăng nhập thành công!');
                navigate("/profile");
            })
            .catch((err) => {
                console.log(err);
                notificationWithIcon('error', 'Lỗi', 'Tài khoản hoặc mật khẩu không chính xác vì : ' +  (err?.response?.data?.message || err?.message));
            })
            .finally(() => { 
                setLoading(false);
            });
    };


    if(user?.id) {
        return <Navigate to="/profile" />
    }

    return(
        <div style={{ width: '400px', margin: '100px auto' }}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Đăng nhập</h3>
            <Form
                form={form}
                className='login-form'
                initialValues={{ remember: true }}
                name='beach-resort-login-form'
                onFinish={onFinish}
            >
                <Form.Item
                name='email'
                rules={[
                    {
                        required: true,
                        message: 'Hãy nhập email!'
                    },
                    {
                        type: 'email',
                        message: 'Email không hợp lệ!',
                    }
                ]}
                >
                <Input
                    prefix={<MailOutlined className='site-form-item-icon' />}
                    placeholder='Email'
                    size='large'
                />
                </Form.Item>

                <Form.Item
                name='password'
                rules={[
                    {
                        required: true,
                        message: 'Hãy nhập mật khẩu!'
                    },
                    {
                        min: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                    }
                    // {
                    //     pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])/,
                    //     message: 'Mật khẩu phải chứa ít nhất một chữ cái và một chữ số!',
                    // }
                ]}
                >
                <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Mật khẩu'
                    size='large'
                />
                </Form.Item>

                <Form.Item>
                <Form.Item
                    valuePropName='checked'
                    name='remember'
                    noStyle
                >
                    <Checkbox>Nhớ mật khẩu</Checkbox>
                </Form.Item>

                <Link
                    className='btn-forgot-password'
                    to='/forgot'
                >
                    Quên mật khẩu
                </Link>
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
                    Đăng nhập
                </Button>
                </Form.Item>

                <Link
                className='btn-login-registration'
                to='/register'
                >
                Hoặc đăng ký tại đây!
                </Link>
            </Form>
            </div>
    );
};
export default Login;