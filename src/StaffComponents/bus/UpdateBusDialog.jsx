import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import ApiService from '../../Components/Utils/apiService';
import notificationWithIcon from '../../Components/Utils/notification';

function UpdateBusDialog({ open, onClose, busData }) {
  const [editedBus, setEditedBus] = useState({
    id: "",
    busnumber: "",
    driverId: "",
    categoryId: "",
    imgUrl: "",
    img: null,
  });
  const [drivers, setDrivers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Load data khi component được mount
  useEffect(() => {
    console.log(busData)
    const fetchDriversAndCategories = async () => {
      try {
        const driversResponse = await ApiService.get("/api/drivers");
        const categoriesResponse = await ApiService.get("/api/categories");
        setDrivers(driversResponse?.content || []); 
        setCategories(categoriesResponse || []);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tài xế và loại xe:", error);
      }
    };
    fetchDriversAndCategories();
  }, []);

  // Cập nhật editedBus khi dữ liệu busData thay đổi
  useEffect(() => {
    if (busData) {
      setEditedBus({
        id: busData?.id || "",
        busnumber: busData?.busnumber || "",
        driverId: busData?.driver?.id || "",
        categoryId: busData?.category?.id || "",
        imgUrl: busData?.img ? `http://localhost:8080/api/buses/img/${busData?.img}` : ""
      });
    }
  }, [busData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedBus({ ...editedBus, [name]: value });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setEditedBus({ ...editedBus, imgUrl: URL.createObjectURL(event.target.files[0]) ,img: event.target.files[0] });
    }
  };

  const validateForm = () => {
    console.log(editedBus);

    const { busnumber, driverId, categoryId } = editedBus;
    if (!busnumber || !driverId || !categoryId) {
      return "Tất cả các trường đều phải được điền!";
    }
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("busnumber", editedBus?.busnumber);
    formData.append("driverId", editedBus?.driverId);
    formData.append("categoryId", editedBus?.categoryId);
    if(editedBus?.img) {
      formData.append("img", editedBus?.img);
    }

    try {
      const response = await ApiService.put(`/api/buses/${editedBus?.id}`, formData);
      console.log(response);
      notificationWithIcon("success", "Chỉnh sửa xe", "Chỉnh sửa thông tin xe thành công!");
      onClose();
    } catch (err) {
      setError("Không thể chỉnh sửa xe: " + (err?.response?.data?.message || err?.message));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Chỉnh sửa thông tin xe</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="busnumber"
          label="Biển số xe"
          fullWidth
          variant="outlined"
          value={editedBus?.busnumber}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="dense">
          <InputLabel id="driver-select-label">Tài xế</InputLabel>
          <Select
            labelId="driver-select-label"
            id="driver-select"
            name="driverId"
            value={editedBus?.driverId}
            onChange={handleChange}
          >
            {drivers?.map((driver) => (
              <MenuItem key={driver?.id} value={driver?.id}>
                {driver?.name || "Chưa có tên"} - {driver?.phone || "Chưa có số điện thoại"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Select cho loại xe */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="category-select-label">Loại xe</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            name="categoryId"
            value={editedBus?.categoryId}
            onChange={handleChange}
          >
            {categories?.map((category) => (
              <MenuItem key={category?.id} value={category?.id}>
                {category?.name || "Chưa có tên"} - {category?.seat_count || 0} chỗ - {category?.price || 0} VND
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div style={{ display: "flex", alignItems: "center", marginTop: "10px"}}>
          <h4 style={{ margin: "0 10px 0 0" }}>Thêm ảnh xe :</h4>
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {editedBus?.imgUrl && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={editedBus?.imgUrl}
              alt="Bus avatar"
              style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Lưu</Button>
      </DialogActions>
      {error && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={() => setError("")} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Dialog>
  );
}

export default UpdateBusDialog;