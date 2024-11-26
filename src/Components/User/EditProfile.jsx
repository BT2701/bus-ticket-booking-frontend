import {
    EnvironmentOutlined, PhoneOutlined, UserOutlined
  } from '@ant-design/icons';
  import {
    Button, DatePicker, Form, Input, Modal
  } from 'antd';
  import React, { useEffect, useState } from 'react';
  import "./Profile.css";
import { TransferDatePicker } from '../Utils/TransferDate';
import dayjs from 'dayjs';
import { useUserContext } from '../../Context/UserProvider';
import { setSessionAccessAndRefreshToken, setSessionUser, setSessionUserKeyAgainstValue } from '../Utils/authentication';
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile =({ isLoginPage, editProfileModal, setEditProfileModal })=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { state: user, dispatch } = useUserContext();
    const navigate = useNavigate();

    console.log(user);

    useEffect(() => {
        form.setFieldsValue({
            name: user?.name || "",
            phone: user?.phone || "",
            birth: dayjs(user?.birth) || "",
            address: user?.address || "",
            email: user?.email || ""
        });
    }, [form, user]);

    const onFinish = (values) => {
        setLoading(true);
        const formattedDOB = TransferDatePicker(values.birth);
        const payload = {
            ...values,
            birth: formattedDOB
        };

        if(isLoginPage) {
            axios.put('http://localhost:8080/api/customers/oauth2-update-infor-on-first-login', payload, { withCredentials: true })
                .then((response) => {
                    setLoading(false);

                    const res = response.data;
                    // console.log(res);

                    // Đặt giá trị từ res.data
                    const userData = res?.data;
                    setSessionAccessAndRefreshToken(userData?.access_token, userData?.refresh_token);

                    const user = {
                        id: userData?.id,
                        name: userData?.name,
                        phone: userData?.phone,
                        birth: userData?.birth,
                        address: userData?.address,
                        email: userData?.email
                    };
                    // console.log(user);

                    dispatch({
                        type: 'SET_USER',
                        payload: user
                    });
                    setSessionUser(user);

                    form.resetFields();
                    notificationWithIcon('success', 'Update', 'Cập nhật thông tin thành công !');
                    setEditProfileModal(false);
                    navigate("/profile");
                })
                .catch((err) => {
                    setLoading(false);
                    notificationWithIcon('error', 'Lỗi', 'Không thể chỉnh sửa tài khoản vì : ' + (err?.response?.data?.message || err?.message));
                    console.error(err)
                })
                .finally(() => { 
                    setLoading(false);
                });
        } else {
            ApiService.put('/api/customers/' + user?.id, payload)
                .then((response) => {
                    setLoading(false);
                    dispatch({
                        type: 'SET_USER',
                        payload: response?.data
                    });
                    setSessionUserKeyAgainstValue('id', response?.data?.id);
                    setSessionUserKeyAgainstValue('name', response?.data?.name);
                    setSessionUserKeyAgainstValue('email', response?.data?.email);
                    setSessionUserKeyAgainstValue('phone', response?.data?.phone);
                    setSessionUserKeyAgainstValue('birth', response?.data?.birth);
                    setSessionUserKeyAgainstValue('address', response?.data?.address);
    
                    form.resetFields();
                    notificationWithIcon('success', 'Update', 'Cập nhật thông tin thành công !');
                    setEditProfileModal(false);
                })
                .catch((err) => {
                    setLoading(false);
                    notificationWithIcon('error', 'Lỗi', 'Không thể chỉnh sửa tài khoản vì : ' + (err?.response?.data?.message || err?.message));
                })
                .finally(() => { 
                    setLoading(false);
                });
        }
    };


    // cancel updating infor after login by oauth2 
    const [cancelWarningVisible, setCancelWarningVisible] = useState(false);
    const handleCancel = () => {
        if (isLoginPage) {
            setCancelWarningVisible(true); 
            return;
        }
        setEditProfileModal(false);
    };
    const confirmCancel = () => {
        axios.post('http://localhost:8080/api/customers/oauth2-logout', {}, { withCredentials: true })
            .then(() => {
                dispatch({
                    type: 'LOGOUT_USER'
                });
                notificationWithIcon('warning', 'Hủy cập nhật thông tin', 'Bạn đã hủy bổ sung cập nhật thông tin vì vậy bạn sẽ phải đăng nhập lại!');
            })
            .catch(err => {
                notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất: ' + err.message);
            })
            .finally(() => {
                setCancelWarningVisible(false); 
                setEditProfileModal(false);    
            });
    };
    const cancelWarning = () => {
        setCancelWarningVisible(false); 
    };

    return(
        <>
            <Modal
                title={isLoginPage ? (<p style={{color: "red"}}>Bạn cần bổ sung đầy đủ thông tin cá nhân trước khi thực hiện bất cứ hành động nào!</p>) : 'Sửa thông tin'}
                open={editProfileModal}
                onOk={() => setEditProfileModal(false)}
                onCancel={handleCancel}
                footer={[]}
                width={800}
                >
                    <Form
                        form={form}
                        className='login-form'
                        name='create-new-user'
                        onFinish={onFinish}
                        layout='vertical'
                    >
                    <Form.Item
                        label='Email'
                        name='email'
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền đầy đủ email!',
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className='site-form-item-icon' />}
                            placeholder='Email'
                            size='large'
                            type='text'
                            allowClear
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        label='Họ và tên'
                        name='name'
                        rules={[
                            {
                            required: true,
                            message: 'Vui lòng điền đầy đủ họ và tên!',
                            }
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className='site-form-item-icon' />}
                            placeholder='Họ và tên'
                            size='large'
                            type='text'
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item
                        label='Số điện thoại'
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
                        type='text'
                        allowClear
                        />
                    </Form.Item>
                    <Form.Item
                        className='w-full md:w-1/2'
                        label='Ngày sinh'
                        name='birth'
                        rules={[
                            {
                                required: true,
                                message: 'Hãy chọn ngày sinh của bạn!',
                            },
                            {
                                validator: (_, value) => {
                                    console.log(TransferDatePicker(value))
                                    // Kiểm tra nếu giá trị không hợp lệ
                                    if (!value || !value.isValid() || TransferDatePicker(value) === "1900-01-01") {
                                        return Promise.reject(new Error('Ngày sinh không hợp lệ!'));
                                    }
                                    return Promise.resolve();
                                }
                            }
                        ]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder='Chọn ngày sinh của bạn'
                            format='YYYY-MM-DD'
                            size='large'
                            allowClear
                            disabledDate={(current) => {
                                // Hạn chế chọn ngày từ năm 1900 đến hiện tại
                                return current && (current.year() < 1900 || current.isAfter(dayjs()));
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        className='w-full'
                        label='Địa chỉ'
                        name='address'
                        rules={[{
                            required: true,
                            message: 'Hãy nhập địa chỉ của bạn!'
                        }]}
                    >
                        <Input
                        prefix={<EnvironmentOutlined className='site-form-item-icon' />}
                        placeholder='địa chỉ'
                        size='large'
                        type='text'
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

            <Modal
                title="Cảnh báo"
                open={cancelWarningVisible}
                onCancel={cancelWarning}
                footer={[
                    <Button key="cancel" onClick={cancelWarning}>
                        Không đồng ý
                    </Button>,
                    <Button key="confirm" type="primary" onClick={confirmCancel}>
                        Đồng ý
                    </Button>,
                ]}
            >
                Bạn phải cập nhật thông tin trước khi thực hiện các hành động tiếp theo! <br />
                Bạn vẫn muốn hủy đăng nhập?
            </Modal>
        </>
    );
};
export default EditProfile;