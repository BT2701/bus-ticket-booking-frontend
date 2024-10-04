import {
    EnvironmentOutlined, PhoneOutlined, UserOutlined
  } from '@ant-design/icons';
  import {
    Button, DatePicker, Form, Input, Modal
  } from 'antd';
  import React, { useEffect, useState } from 'react';
  import "./Profile.css";
import { convertTimestampToDate, TransferDatePicker } from '../Utils/TransferDate';
import dayjs from 'dayjs';
import { useUserContext } from '../../Context/UserProvider';
import { setSessionUserKeyAgainstValue } from '../Utils/authentication';
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification';

const EditProfile =({ editProfileModal, setEditProfileModal })=>{
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const { state: user, dispatch } = useUserContext();

    // set form data from API data
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
        console.log(payload);

        ApiService.put('/api/customers/' + user?.id, payload)
            .then((response) => {
                setLoading(false);
                dispatch({
                    type: 'SET_USER',
                    payload: response
                });
                setSessionUserKeyAgainstValue('id', response?.data?.id);
                setSessionUserKeyAgainstValue('name', response?.data?.name);
                setSessionUserKeyAgainstValue('email', response?.data?.email);
                setSessionUserKeyAgainstValue('phone', response?.data?.phone);
                setSessionUserKeyAgainstValue('birth', response?.data?.birth);
                setSessionUserKeyAgainstValue('address', response?.data?.address);

                form.resetFields();
                setEditProfileModal(false);
            })
            .catch((err) => {
                setLoading(false);
                notificationWithIcon('error', 'Lỗi', 'Không thể chỉnh sửa tài khoản với lỗi : ' +  (err?.response?.data?.result?.error?.message || err?.message));
            })
            .finally(() => { 
                setLoading(false);
            });
    };

    return(
        <Modal
            title='Sửa thông tin'
            open={editProfileModal}
            onOk={() => setEditProfileModal(false)}
            onCancel={() => setEditProfileModal(false)}
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
                    ]}
                >
                    <DatePicker
                    style={{ width: '100%' }}
                    placeholder='Chọn ngày sinh của bạn'
                    format='YYYY-MM-DD'
                    size='large'
                    allowClear
                    />
                </Form.Item>

                <Form.Item
                    className='w-full'
                    label='Địa chỉ'
                    name='address'
                    rules={[{
                        required: true,
                        message: 'Please input your Address!'
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
    );
};
export default EditProfile;