import React, { useState, useEffect } from 'react';
import {
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';
import ApiService from '../../Components/Utils/apiService';
import notificationWithIcon from '../../Components/Utils/notification';

function UserDialog({ open, onClose, user }) {
  const [newUser, setNewUser] = useState({
    id: '',
    name: '',
    address: '',
    birth: '',
    email: '',
    phone: '',
    role: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setNewUser({
        id: user.id || '',
        name: user.name || '',
        address: user.address || '',
        birth: user.birth ? new Date(user.birth).toISOString().split('T')[0] : '', // Convert birth timestamp to YYYY-MM-DD
        email: user.email || '',
        phone: user.phone || '',
        role: user.role?.name || '',
      });

      console.log(user);
    }
  }, [user]);

  const handleChange = (event) => {
    setNewUser({ ...newUser, [event.target.name]: event.target.value });
  };

  const validateForm = () => {
    const { name, address, birth, email, phone, role } = newUser;

    if (!name || !address || !birth || !email || !phone || !role) {
      return 'Tất cả các trường đều phải được điền!';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email không hợp lệ!';
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return 'Số điện thoại phải có 10 chữ số!';
    }

    const birthDate = new Date(birth);
    if (isNaN(birthDate.getTime())) {
      return 'Ngày sinh không hợp lệ!';
    }

    return null;
  };

  const handleClickClose = () => {
    onClose();
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
    } else {
      const userPayload = {
        name: newUser.name,
        address: newUser.address,
        birth: newUser.birth,
        email: newUser.email,
        phone: newUser.phone,
      }
      console.log(userPayload)
      ApiService.put('/api/customers/updateUserFromAdmin/' + newUser.id, userPayload)
      .then((response) => {
          console.log(response);
          
          // cập nhật role role
          const assignRolePayload = {
            customerId: newUser.id,
            roleName: newUser.role
          }
          console.log(assignRolePayload)
          ApiService.post('/api/roles/assign', assignRolePayload)
          .then((response) => {
              console.log(response);
          })
          .catch((err) => {
              console.log(err?.response?.data?.message || err?.message)
              notificationWithIcon('error', 'Lỗi', 'Không thể cập nhật role cho người dùng vì : ' + (err?.response?.data?.message || err?.message));
              return;
          });


          notificationWithIcon('success', 'Update', 'Cập nhật thông tin người dùng thành công !');
          onClose();
      })
      .catch((err) => {
          console.log(err?.response?.data?.message || err?.message)
          notificationWithIcon('error', 'Lỗi', 'Không thể cập nhật thông tin người dùng vì : ' + (err?.response?.data?.message || err?.message));
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{user ? 'Cập nhật thông tin người dùng' : 'Thêm người dùng mới'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="name"
          label="Họ tên"
          type="text"
          fullWidth
          variant="outlined"
          value={newUser.name}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="address"
          label="Địa chỉ"
          type="text"
          fullWidth
          variant="outlined"
          value={newUser.address}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="birth"
          label="Ngày sinh"
          type="date"
          fullWidth
          variant="outlined"
          value={newUser.birth}
          onChange={handleChange}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          margin="dense"
          name="email"
          label="Email"
          type="email"
          fullWidth
          variant="outlined"
          value={newUser.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="phone"
          label="Số điện thoại"
          type="text"
          fullWidth
          variant="outlined"
          value={newUser.phone}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          name="role"
          label="Cấp quyền"
          select
          value={newUser.role}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        >
          <MenuItem value="ADMIN">ADMIN</MenuItem>
          <MenuItem value="CUSTOMER">CUSTOMER</MenuItem>
          <MenuItem value="STAFF">STAFF</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </DialogActions>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={() => setError('')} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Dialog>
  );
}

export default UserDialog;