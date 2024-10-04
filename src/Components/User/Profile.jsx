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

const Profile =()=>{
    const [editProfileModal, setEditProfileModal] = useState(false);
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

            alert(response);
            navigate("/profile");
        })
        .catch((err) => {
            setError(err?.response?.data?.result?.error?.message || err?.message);
            notificationWithIcon('error', 'Lỗi', 'Không thể đăng xuất tài khoản với lỗi : ' +  (err?.response?.data?.result?.error?.message || err?.message));
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
                        Edit Profile
                </Button>
                <Button style={{ marginTop: '10px', marginRight: '20px' }}
                    onClick={handleLogout}
                    color="danger" 
                    variant="solid"
                    size="large"
                >
                    Logout
                </Button>
            </div>

            {/* profile edit modal component */}
            {editProfileModal && (
                <EditProfile
                    editProfileModal={editProfileModal}
                    setEditProfileModal={setEditProfileModal}
                />
            )}
        </div>
    );
};
export default Profile;