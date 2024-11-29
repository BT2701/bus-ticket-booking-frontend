import {
  Button, Descriptions, Result, Skeleton
} from 'antd';
import React, { useState, useEffect } from 'react'
import EditProfile from './EditProfile';
import "./Profile.css";
import { useUserContext } from '../../Context/UserProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { convertTimestampToDate } from '../Utils/TransferDate';
import { removeSessionAndLogoutUser, setSessionUser } from '../Utils/authentication';
import ApiService from '../Utils/apiService';
import notificationWithIcon from '../Utils/notification';
import ChangePassword from '../Auth/ChangePassword';

const Profile =()=>{
    const [editProfileModal, setEditProfileModal] = useState(false);
    const [changePasswordModal, setChangePasswordModal] = useState(false);
    const { state: user, dispatch } = useUserContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isPasswordNull, setIsPasswordNull] = useState(false);

    useEffect(() => {
        if(user && user?.id !== "") {
            ApiService.get('/api/customers/details')
                .then((res) => {
                    setIsPasswordNull(res?.data?.isPasswordNull || false);

                    dispatch({
                        type: 'SET_USER',
                        payload: res?.data
                    });
                    setSessionUser(res?.data);
                })
                .catch((err) => {
                    console.log(err);
                    notificationWithIcon('error', 'Lỗi', ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
                })
        }
    }, [])

    const handleLogout = () => {
        setLoading(true);

        ApiService.post('/api/customers/logout')
            .then(async (response) => {
                // logout khi dung oauth2
                await ApiService.post('http://localhost:8080/api/customers/oauth2-logout', {});
                
                removeSessionAndLogoutUser();
                dispatch({
                    type: 'LOGOUT_USER'
                });

                notificationWithIcon('success', 'Đăng xuất', 'Đăng xuất tài khoản thành công!');
                navigate("/login");
            })
            .catch((err) => {
                setError((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message));
                notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất tài khoản vì : ' + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
            })
            .finally(() => { 
                setLoading(false);
            });
    }

    if(!user?.id) {
        return <Navigate to="/login" />
    }

    return(
        <div className="profile--container">
            <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: "20px" }}>
                <h2 style={{ fontSize: "25px", fontWeight: "bold" }}>Trang cá nhân</h2>   
            </div>
            <div style={{ padding: "0 150px" }}>
                <Skeleton style={{ padding: "0 50px" }} loading={loading} paragraph={{ rows: 10 }} active avatar>
                    {error !== "" ? (
                        <Result
                            title='Failed to fetch'
                            subTitle={error}
                            status='error'
                        />
                    ) : (
                        <Descriptions
                            bordered
                            column={1}
                        >
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Họ và tên'>
                                {(user?.name || user?.name === "" ) || (<span style={{color: "blue"}}>Chưa cập nhật</span>)}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Email'>
                                {(user?.email || user?.email === "" ) || (<span style={{color: "blue"}}>Chưa cập nhật</span>)}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Số điện thoại'>
                                {(user?.phone || user?.phone === "" ) || (<span style={{color: "blue"}}>Chưa cập nhật</span>)}
                            </Descriptions.Item>
    
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Ngày sinh' >
                                {(user?.birth || user?.birth === "" ) ? convertTimestampToDate(user?.birth) : (<span style={{color: "blue"}}>Chưa cập nhật</span>)}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Địa chỉ' >
                                {(user?.address || user?.address === "" ) || (<span style={{color: "blue"}}>Chưa cập nhật</span>)}
                            </Descriptions.Item>
                        </Descriptions>
                    )}
                </Skeleton>
            </div>

            <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
                <Button
                    style={{ marginTop: '10px', marginRight: '20px' }}
                    onClick={() => setEditProfileModal(true)}
                    shape='default'
                    type='primary'
                    size='large'
                    >
                        Cập nhật thông tin
                </Button>
                {
                    isPasswordNull ? (
                        <Button
                            style={{ marginTop: '10px', marginRight: '20px' }}
                            onClick={() => setChangePasswordModal(true)}
                            shape='default'
                            type='primary'
                            size='large'
                            >
                                Tạo mật khẩu
                        </Button>
                    ) : (
                        <Button
                            style={{ marginTop: '10px', marginRight: '20px' }}
                            onClick={() => setChangePasswordModal(true)}
                            shape='default'
                            type='primary'
                            size='large'
                            >
                                Đổi mật khẩu
                        </Button>
                    )
                }
                
                <Button style={{ marginTop: '10px', marginRight: '20px' }}
                    onClick={handleLogout}
                    color="danger" 
                    variant="solid"
                    size="large"
                >
                    Đăng xuất
                </Button>
            </div>

            {/* profile edit modal component */}
            {editProfileModal && (
                <EditProfile
                    editProfileModal={editProfileModal}
                    setEditProfileModal={setEditProfileModal}
                />
            )}
            {changePasswordModal && (
                <ChangePassword
                    changePasswordModal={changePasswordModal}
                    setChangePasswordModal={setChangePasswordModal}
                    isPasswordNull={isPasswordNull}
                    setIsPasswordNull={setIsPasswordNull}
                />
            )}
        </div>
    );
};
export default Profile;