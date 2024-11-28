import React, { useEffect, useState } from 'react';
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

function AddBusDialog({ open, onClose }) {
  const [newBus, setNewBus] = useState({
    busnumber: "",
    driver: "",
    category: "",
    img: null, 
  });
  const [drivers, setDrivers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Lấy dữ liệu tài xế và loại xe từ API khi component được mount
  useEffect(() => {
    const fetchDriversAndCategories = async () => {
      try {
        const driversResponse = await ApiService.get("/api/drivers");
        const categoriesResponse = await ApiService.get("/api/categories");
        setDrivers(driversResponse?.content || []); 
        setCategories(categoriesResponse || []); 
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };
    fetchDriversAndCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewBus({ ...newBus, [name]: value });
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setNewBus({ ...newBus, img: event?.target?.files[0] });
    }
  };

  const validateForm = () => {
    const { busnumber, driver, category, img } = newBus;

    if (!busnumber || !driver || !category || !img) {
      return "Tất cả các trường đều phải được điền!";
    }

    return null;
  };

  const handleClickClose = () => {
    setNewBus({
      busnumber: "",
      driver: "",
      category: "",
      img: null, 
    })
    onClose();
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const formData = new FormData();
    formData.append("busnumber", newBus?.busnumber);
    formData.append("driverId", newBus?.driver);
    formData.append("categoryId", newBus?.category);
    formData.append("img", newBus?.img);

    try {
      const response = await ApiService.post("/api/buses", formData);
      console.log(response);
      notificationWithIcon("success", "Thêm xe", "Thêm xe thành công!");
      handleClickClose();
    } catch (err) {
      console.log((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message));
      setError("Không thể thêm xe vì: " + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Thêm xe mới</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          name="busnumber"
          label="Số xe"
          type="text"
          fullWidth
          variant="outlined"
          value={newBus?.busnumber}
          onChange={handleChange}
        />

        {/* Select cho tài xế */}
        <FormControl fullWidth margin="dense">
          <InputLabel id="driver-select-label">Tài xế</InputLabel>
          <Select
            labelId="driver-select-label"
            id="driver-select"
            name="driver"
            value={newBus?.driver}
            onChange={handleChange}
          >
            {drivers?.map((driver) => (
              <MenuItem key={driver.id} value={driver?.id}>
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
            name="category"
            value={newBus?.category}
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
        {newBus?.img && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={URL.createObjectURL(newBus?.img)}
              alt="Bus avatar"
              style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>Hủy</Button>
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

export default AddBusDialog;