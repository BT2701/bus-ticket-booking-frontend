import {
  Button, Descriptions, Result, Skeleton
} from 'antd';
import React, { useState, useEffect } from 'react'
import EditProfile from './EditProfile';
import "./Profile.css";
import { useUserContext } from '../../Context/UserProvider';
import { Navigate, useNavigate } from 'react-router-dom';
import { convertTimestampToDate } from '../Utils/TransferDate';
import { removeSessionAndLogoutUser } from '../Utils/authentication';
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
    // const token = getSessionToken();
    // const user = getSessionUser();

    useEffect(() => {
        console.log(user);
    }, [user])

    const handleLogout = () => {
        setLoading(true);

        ApiService.post('/api/customers/logout')
        .then((response) => {
            removeSessionAndLogoutUser();
            dispatch({
                type: 'LOGOUT_USER'
            });

            notificationWithIcon('success', 'Logout', 'Đăng xuất tài khoản thành công!');
            navigate("/profile");
        })
        .catch((err) => {
            setError(err?.response?.data?.message || err?.message);
            notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất tài khoản vì : ' + (err?.response?.data?.message || err?.message));
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
                            {user?.name}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Email'>
                            {user?.email}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Số điện thoại'>
                            {user?.phone}
                            </Descriptions.Item>
    
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Ngày sinh' >
                            {user?.birth && convertTimestampToDate(user?.birth)}
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ fontWeight: 'bold' }} contentStyle={{ textAlign: 'center' }} label='Địa chỉ' >
                            {user?.address}
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
                <Button
                    style={{ marginTop: '10px', marginRight: '20px' }}
                    onClick={() => setChangePasswordModal(true)}
                    shape='default'
                    type='primary'
                    size='large'
                    >
                        Đổi mật khẩu
                </Button>
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
                />
            )}
        </div>
    );
};
export default Profile;