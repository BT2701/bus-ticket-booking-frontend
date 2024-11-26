import "./Auth.css";

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import {
  Button, Checkbox, Form, Input
} from 'antd';
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import ApiService from "../Utils/apiService";
import { useUserContext } from "../../Context/UserProvider";
import { getSessionUser, setSessionAccess, setSessionAccessAndRefreshToken, setSessionUser } from "../Utils/authentication";
import notificationWithIcon from "../Utils/notification";
import axios from "axios";
import EditProfile from "../User/EditProfile";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { state: user, dispatch } = useUserContext();
    const [editProfileModal, setEditProfileModal] = useState(false);

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

                if (values.remember) {
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
                
                // console.log(userDetail);

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


    const initialState = {
        id: "",
        name: "",
        phone: "",
        birth: "",
        address: "",
        email: ""
    };
    // dùng useRef để chống re-render 2 lần => tạo 2 lần đăng nhập(2 tokens) => dư thừa 1 token
    const isApiCalled = useRef(false);
    useEffect(() => {
        const userSS = getSessionUser();

        if(!isApiCalled.current && (userSS === null || JSON.stringify(userSS) === JSON.stringify(initialState))) {
            isApiCalled.current = true;

            axios.get("http://localhost:8080/api/customers/oauth2-infor", {withCredentials: true})
                .then(res => {
                    const response = res?.data;
                    console.log(response);
                    if (response) {
                        const user = {
                            id: response?.data?.id,
                            name: response?.data?.name,
                            phone: response?.data?.phone,
                            birth: response?.data?.birth || "01-01-1900",
                            address: response?.data?.address,
                            email: response?.data?.email
                        }
        
                        dispatch({
                            type: 'SET_USER',
                            payload: user
                        });
                        
                        const phoneNumber = response?.data?.phone;
                        // nếu chưa có phonenumber => lần đầu đăng nhập => phải cập nhật thông tin 
                        if(phoneNumber === null || phoneNumber === "") {
                            setEditProfileModal(true);
                        } else {
                            setEditProfileModal(false);
        
                            setSessionUser(user);
                            setSessionAccessAndRefreshToken(response?.data?.access_token, response?.data?.refresh_token);
                        }
                    }
                })
                .catch(err => {
                    console.error(err)
                })
        }

    }, [])
    
    const baseUrl = "http://localhost:8080"
    const handleClickGoogleIcon = () => {
        window.location.href = `${baseUrl}/oauth2/authorization/google`;
    }
    const handleClickFacebookIcon = () => {
        window.location.href = `${baseUrl}/oauth2/authorization/facebook`;
    }
    const handleClickGithubIcon = () => {
        window.location.href = `${baseUrl}/oauth2/authorization/github`;
    }


    if (user?.id && !editProfileModal) {
        return <Navigate to="/profile" />
    }

    return (
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
                    Bạn chưa có tài khoản ư? Đăng ký tại đây!
                </Link>

                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "20px 0",
                    fontWeight: "bold"
                }}>
                    HOẶC
                </div>

                <div style={{ textAlign: 'center' }}>
                    <div className="oauth-buttons">
                        <div className="oauth-btn">
                            <span onClick={handleClickGoogleIcon}>
                                <svg viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
                            </span>
                        </div>
                        <div className="oauth-btn">
                            <span onClick={handleClickFacebookIcon}>
                                <svg viewBox="126.445 2.281 589 589" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"><circle cx="420.945" cy="296.781" r="294.5" fill="#3c5a9a"></circle><path d="M516.704 92.677h-65.239c-38.715 0-81.777 16.283-81.777 72.402.189 19.554 0 38.281 0 59.357H324.9v71.271h46.174v205.177h84.847V294.353h56.002l5.067-70.117h-62.531s.14-31.191 0-40.249c0-22.177 23.076-20.907 24.464-20.907 10.981 0 32.332.032 37.813 0V92.677h-.032z" fill="#ffffff"></path></g></svg>
                            </span>
                        </div>
                        <div className="oauth-btn github-btn">
                            <span onClick={handleClickGithubIcon}>
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github</title> <rect width="24" height="24" fill="none"></rect> <path d="M12,2A10,10,0,0,0,8.84,21.5c.5.08.66-.23.66-.5V19.31C6.73,19.91,6.14,18,6.14,18A2.69,2.69,0,0,0,5,16.5c-.91-.62.07-.6.07-.6a2.1,2.1,0,0,1,1.53,1,2.15,2.15,0,0,0,2.91.83,2.16,2.16,0,0,1,.63-1.34C8,16.17,5.62,15.31,5.62,11.5a3.87,3.87,0,0,1,1-2.71,3.58,3.58,0,0,1,.1-2.64s.84-.27,2.75,1a9.63,9.63,0,0,1,5,0c1.91-1.29,2.75-1,2.75-1a3.58,3.58,0,0,1,.1,2.64,3.87,3.87,0,0,1,1,2.71c0,3.82-2.34,4.66-4.57,4.91a2.39,2.39,0,0,1,.69,1.85V21c0,.27.16.59.67.5A10,10,0,0,0,12,2Z"></path> </g></svg>
                            </span>
                        </div>
                    </div>
                </div>
            </Form>


            {/* profile edit modal component */}
            {editProfileModal && (
                <EditProfile
                    isLoginPage={true}
                    editProfileModal={editProfileModal}
                    setEditProfileModal={setEditProfileModal}
                />
            )}
        </div>
    );
};

export default Login;
