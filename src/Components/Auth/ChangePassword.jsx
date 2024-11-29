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
import { removeSessionAndLogoutUser } from '../Utils/authentication';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserProvider';

const ChangePassword =({ changePasswordModal, setChangePasswordModal, isPasswordNull, setIsPasswordNull })=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { dispatch } = useUserContext();

    const navigate = useNavigate();
    const onFinish = (values) => {
        setLoading(true);
        // console.log(values);

        if (isPasswordNull) {
            const payload = {
                password: values?.newPassword
            }

            ApiService.post('/api/customers/oauth2-create-password', payload)
                .then((response) => {
                    notificationWithIcon('success', 'Thành công', 'Tạo mật khẩu thành công !');
                    form.resetFields();

                    setIsPasswordNull(false);
                    setChangePasswordModal(false);
                })
                .catch((err) => {
                    setLoading(false);
                    console.log(err)
                    notificationWithIcon('error', 'Lỗi', 'Không tạo mật khẩu thành công vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
                })
                .finally(() => { 
                    setLoading(false);
                });

            return;
        } 

        ApiService.put('/api/customers/updatePassword', values)
            .then((response) => {
                notificationWithIcon('success', 'Thành công', 'Thay đổi mật khẩu thành công !');
                form.resetFields();

                Modal.confirm({
                    title: 'Bạn có muốn đăng xuất toàn bộ không (bao gồm phiên đăng nhập của bạn)?',
                    okText: 'Có',
                    cancelText: 'Không',
                    onOk: () => {
                        ApiService.post('/api/customers/logoutAll')
                            .then(() => {
                                removeSessionAndLogoutUser();
                                dispatch({
                                    type: 'LOGOUT_USER'
                                });
                                notificationWithIcon('success', 'Thành công', 'Đăng xuất toàn bộ thành công!');
                                navigate("/login");
                            })
                            .catch((err) => {
                                notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất toàn bộ: ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
                            });
                    },
                });

                setChangePasswordModal(false);
            })
            .catch((err) => {
                setLoading(false);
                notificationWithIcon('error', 'Lỗi', 'Không thể thay đổi mật khẩu vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
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
                {
                    !isPasswordNull && (
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

                    )
                }
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
                        {
                            isPasswordNull ? "Tạo mật khẩu" : "Cập nhật"
                        }
                    </Button>
                </Form.Item>
                </Form>
            </Modal>
    );
};
export default ChangePassword;