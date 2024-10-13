import { useState } from "react";
import "./Auth.css"
import {
    LockOutlined, MailOutlined, PhoneOutlined, UserOutlined
  } from '@ant-design/icons';
  import {
    Button, DatePicker, Form, Input
  } from 'antd';
import { Link, Navigate, useNavigate } from "react-router-dom";
import { TransferDatePicker } from "../Utils/TransferDate";
import { useUserContext } from "../../Context/UserProvider";
import ApiService from "../Utils/apiService";
import notificationWithIcon from "../Utils/notification";

const { TextArea } = Input;

const Register =()=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state: user } = useUserContext();

    const onFinish = (values) => {
        const formattedDOB = TransferDatePicker(values.birth);
        const payload = {
            ...values,
            birth: formattedDOB
        };
        console.log(payload);
        setLoading(true);
      
        ApiService.post('/api/customers/register', payload)
            .then((response) => {
                setLoading(false);
                form.resetFields();
                notificationWithIcon('success', 'Register', 'Đăng ký tài khoản thành công!');
                navigate("/login");
            })
            .catch((err) => {
                setLoading(false);
                notificationWithIcon('error', 'Lỗi', 'Không thể đăng ký tài khoản vì : ' + (err?.response?.data?.message || err?.message));
            }).finally(() => {
                setLoading(false);
            })
    };

    if(user?.id) {
        return <Navigate to="/profile" />
    }

    return(
        <div style={{ width: '400px', margin: '50px auto' }}>
            <h3 style={{ textAlign: "center", fontWeight: "bold" }}>Đăng ký</h3>
            <Form
                form={form}
                className='registration-form'
                style={{ padding: '20px 0' }}
                initialValues={{ remember: true }}
                name='beach-resort-registration-form'
                onFinish={onFinish}
            >
                <Form.Item
                name='name'
                rules={[
                    {
                    required: true,
                    message: 'Vui lòng điền đầy đủ họ và tên!',
                    },
                ]}
                >
                <Input
                    prefix={<UserOutlined className='site-form-item-icon' />}
                    placeholder='Họ và tên'
                    size='large'
                    allowClear
                />
                </Form.Item>

                <Form.Item
                name='email'
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập email!',
                    },
                    {
                    type: 'email',
                    message: 'Email không hợp lệ!',
                    },
                ]}
                >
                <Input
                    prefix={<MailOutlined className='site-form-item-icon' />}
                    placeholder='Email'
                    size='large'
                    allowClear
                />
                </Form.Item>

                <Form.Item
                name='phone'
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập số điện thoại của bạn!',
                    },
                    {
                    pattern: /^[0-9]{10}$/,
                    message: 'Số điện thoại phải bao gồm 10 số!',
                    },
                ]}
                >
                <Input
                    prefix={<PhoneOutlined className='site-form-item-icon' />}
                    placeholder='Số điện thoại'
                    size='large'
                    allowClear
                    type='tel'
                />
                </Form.Item>

                <Form.Item
                name='birth'
                rules={[
                    {
                    required: true,
                    message: 'Hãy chọn ngày sinh của bạn!',
                    },
                ]}
                >
                <DatePicker
                    style={{ width: '100%' }}
                    placeholder='Chọn ngày sinh'
                    size='large'
                    allowClear
                />
                </Form.Item>

                {/* <Form.Item
                name='gender'
                rules={[
                    {
                    required: true,
                    message: 'Hãy chọn giới tính của bạn!',
                    },
                ]}
                >
                    <Select placeholder='-- giới tính --' size='large' allowClear>
                        <Select.Option value='nam'>Nam</Select.Option>
                        <Select.Option value='nu'>Nữ</Select.Option>
                    </Select>
                </Form.Item> */}

                <Form.Item
                name='address'
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập địa chỉ của bạn!',
                    },
                ]}
                >
                <TextArea
                    placeholder='Địa chỉ'
                    size='large'
                    allowClear
                    rows={2}
                />
                </Form.Item>

                <Form.Item
                name='password'
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập mật khẩu!',
                    },
                    {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                    }
                ]}
                >
                <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Mật khẩu'
                    size='large'
                    allowClear
                />
                </Form.Item>

                <Form.Item
                name='confirmPassword'
                dependencies={['password']}
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập lại mật khẩu!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                        },
                    }),
                ]}
                >
                <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Nhập lại mật khẩu'
                    size='large'
                    allowClear
                />
                </Form.Item>

                <Form.Item>
                <Button
                    style={{ marginTop: '10px' }}
                    className='registration-form-button'
                    htmlType='submit'
                    type='primary'
                    size='large'
                    block
                    loading={loading}
                    disabled={loading}
                >
                    Đăng ký
                </Button>
                </Form.Item>

                <Link className='btn-login-registration' to='/login'>
                Hoặc đăng nhập tại đây!
                </Link>
            </Form>
            </div>
    );
};
export default Register;