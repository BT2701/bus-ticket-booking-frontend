import "./Auth.css";

import { LockOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input
} from 'antd';
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import ApiService from "../Utils/apiService";
import { useUserContext } from "../../Context/UserProvider";
import { setSessionAccessAndRefreshToken, setSessionUser } from "../Utils/authentication";
import notificationWithIcon from "../Utils/notification";

const ResetPassword =()=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state: user, dispatch } = useUserContext();
    const location = useLocation();
    // eslint-disable-next-line no-use-before-define
    const resetToken = getQueryParameter('resetToken');

    const onFinish = (values) => {
        setLoading(true);

        // Lấy token từ URL
        const payload = {
            resetToken: resetToken,
            password: values.password,
            confirmPassword: values.confirmPassword
        };
        
        ApiService.put('/api/customers/forgotPassword', payload)
            .then((response) => {
                console.log(response);
                form.resetFields();
                navigate("/login");
            })
            .catch((err) => {
                notificationWithIcon('error', 'Lỗi', 'Không thể khôi phục mật khẩu của bạn với lỗi : ' +  (err?.response?.data?.result?.error?.message || err?.message));
            })
            .finally(() => { 
                setLoading(false);
            });
    };

    const getQueryParameter = (param) => {
        const searchParams = new URLSearchParams(location.search);
        return searchParams.get(param);
    };

    if(!resetToken || resetToken === "") {
        return <Navigate to="/login" />
    }

    return(
        <div style={{ width: '400px', margin: '100px auto' }}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Nhập mật khẩu mới</h3>
            <Form
                form={form}
                className='ResetPassword-form'
                initialValues={{ remember: true }}
                name='beach-resort-ResetPassword-form'
                onFinish={onFinish}
            >
                <Form.Item
                name='password'
                rules={[
                    {
                        required: true,
                        message: 'Hãy nhập mật khẩu mới!'
                    },
                    {
                        min: 6,
                        message: 'Mật khẩu mới phải có ít nhất 6 ký tự!',
                    }
                ]}
                >
                <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Mật khẩu mới'
                    size='large'
                />
                </Form.Item>

                <Form.Item
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                    {
                        required: true,
                        message: 'Hãy nhập lại mật khẩu mới!'
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                    })
                ]}
                >
                <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Mật khẩu'
                    size='large'
                />
                </Form.Item>


                <Form.Item>
                <Button
                    className='ResetPassword-form-button'
                    htmlType='submit'
                    type='primary'
                    size='large'
                    block
                    loading={loading}
                    disabled={loading}
                >
                    Đổi mật khẩu
                </Button>
                </Form.Item>
            </Form>
            </div>
    );
};
export default ResetPassword;