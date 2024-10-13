import {
    LockOutlined
} from '@ant-design/icons';
import {
    Button, Form, Input, Modal
} from 'antd';
import React, { useState } from 'react';
import "./Auth.css";
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification';

const ChangePassword =({ changePasswordModal, setChangePasswordModal })=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const onFinish = (values) => {
        setLoading(true);
        console.log(values);

        ApiService.put('/api/customers/updatePassword', values)
            .then((response) => {
                notificationWithIcon('success', 'Thành công', 'Thay đổi mật khẩu thành công !');
                form.resetFields();

                Modal.confirm({
                    title: 'Bạn có muốn đăng xuất toàn bộ không?',
                    okText: 'Có',
                    cancelText: 'Không',
                    onOk: () => {
                        // Call the logoutAll API
                        ApiService.post('/api/customers/logoutAll')
                            .then(() => {
                                notificationWithIcon('success', 'Thành công', 'Đăng xuất toàn bộ thành công!');
                            })
                            .catch((err) => {
                                notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất toàn bộ: ' + (err?.response?.data?.message || err?.message));
                            });
                    },
                });

                setChangePasswordModal(false);
            })
            .catch((err) => {
                setLoading(false);
                notificationWithIcon('error', 'Lỗi', 'Không thể thay đổi mật khẩu vì : ' + (err?.response?.data?.message || err?.message));
            })
            .finally(() => { 
                setLoading(false);
            });
    };

    return(
        <Modal
            title='Đổi mật khẩu'
            open={changePasswordModal}
            onOk={() => setChangePasswordModal(false)}
            onCancel={() => setChangePasswordModal(false)}
            footer={[]}
            width={800}
            >
                <Form
                    form={form}
                    className='login-form mt-3'
                    name='create-new-user'
                    onFinish={onFinish}
                    layout='vertical'
                >
                <Form.Item
                name='oldPassword'
                rules={[
                    {
                        required: true,
                        message: 'Vui lòng nhập mật khẩu cũ!',
                        
                    },
                    {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                    }
                ]}
                >
                    <Input.Password
                    prefix={<LockOutlined className='site-form-item-icon' />}
                    placeholder='Mật khẩu cũ'
                    size='large'
                    allowClear
                />
                </Form.Item>
                <Form.Item
                name='newPassword'
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập mật khẩu mới!',
                    },
                    {
                    min: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            const oldPassword = getFieldValue('oldPassword');
                            if (!value || oldPassword !== value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('Mật khẩu mới không được trùng mật khẩu cũ!'));
                        },
                    }),
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
                name='confirmNewPassword'
                dependencies={['newPassword']}
                rules={[
                    {
                    required: true,
                    message: 'Hãy nhập lại mật khẩu mới!',
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
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
                    className='login-form-button mt-4'
                    style={{ width: "100%", margin: "10px auto" }}
                    htmlType='submit'
                    type='primary'
                    size='large'
                    loading={loading}
                    disabled={loading}
                    >
                    Cập nhật
                    </Button>
                </Form.Item>
                </Form>
            </Modal>
    );
};
export default ChangePassword;