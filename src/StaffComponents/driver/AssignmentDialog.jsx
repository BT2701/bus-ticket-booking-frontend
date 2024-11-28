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

function AssignmentDialog({ open, onClose, driver }) {
  const [driverId, setDriverId] = useState(-1);
  const [busId, setBusId] = useState("");
  const [busDetails, setBusDetails] = useState({
    busnumber: "",
    imgName: "",
    category: ""
  });
  const [busList, setBusList] = useState([]);
  const [page, setPage] = useState(0); // Thêm trạng thái trang
  const [hasMore, setHasMore] = useState(true); // Để kiểm tra xem còn dữ liệu để tải hay không
  const [loading, setLoading] = useState(false); // Để theo dõi trạng thái tải
  const [error, setError] = useState("");

  useEffect(() => {
    loadBuses();
  }, [page]);

  const loadBuses = async () => {
    if (loading) return; // Nếu đang tải, không gọi thêm
    setLoading(true);
    try {
      const response = await ApiService.get(`/api/buslist?pageNo=${page}&pageSize=10&sortBy=id&sortDir=asc`);
      if (response.content.length > 0) {
        setBusList(prevBuses => [...prevBuses, ...response.content]);
      } else {
        setHasMore(false); // Không còn dữ liệu để tải
      }
    } catch (err) {
      setError("Không thể lấy danh sách xe vì: " + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (driver) { 
      setDriverId(driver.id);
    }
  }, [driver]);

  const handleBusSelectChange = (event) => {
    const selectedBusId = event.target.value;
    setBusId(selectedBusId);
    const selectedBus = busList.find(bus => bus.id === selectedBusId);
    if (selectedBus) {
      setBusDetails({
        busnumber: selectedBus.busnumber,
        imgName: selectedBus.img,
        category: selectedBus.category.name,
      });
    } else {
      setBusDetails({
        busnumber: "",
        imgName: "",
        category: ""
      });
    }
  };

  const handleScroll = (event) => {
    const bottom = event.target.scrollHeight === event.target.scrollTop + event.target.clientHeight;
    if (bottom && hasMore) {
      setPage(prevPage => prevPage + 1); // Tải thêm dữ liệu khi cuộn xuống cuối
    }
  };

  const handleClickClose = () => {
    setBusId("");
    setBusDetails({
      busnumber: "",
      imgName: "",
      category: ""
    });
    onClose();
  };

  const handleSubmit = async () => {
    if (!driverId || !busId) {
      setError("Cần nhập ID tài xế và ID xe.");
      return;
    }

    try {
      const response = await ApiService.post("/api/assignDriverToBus", {
        driverId,
        busId,
      });
      console.log(response);
      notificationWithIcon("success", "Gán tài xế", "Gán tài xế thành công!");
      onClose();
    } catch (err) {
      console.log((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message));
      setError("Không thể gán tài xế vì: " + ((typeof err === 'string') ? err : (err?.response?.data?.message || err?.message)));
    }
  };

  return (
    <Dialog open={open} onClose={handleClickClose}>
      <DialogTitle>Gán tài xế cho xe</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="ID tài xế"
          type="text"
          fullWidth
          variant="outlined"
          value={driverId}
          InputProps={{
            readOnly: true,
          }}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Chọn ID xe</InputLabel>
          <Select
            value={busId}
            onChange={handleBusSelectChange}
            label="Chọn ID xe"
            onScroll={handleScroll} // Thêm sự kiện onScroll
          >
            {busList.map(bus => (
              <MenuItem key={bus.id} value={bus.id}>
                {bus.id}
              </MenuItem>
            ))}
            {loading && <MenuItem disabled>Đang tải...</MenuItem>}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Biển số xe"
          type="text"
          fullWidth
          variant="outlined"
          value={busDetails.busnumber}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          margin="dense"
          label="Loại xe"
          type="text"
          fullWidth
          variant="outlined"
          value={busDetails.category}
          InputProps={{
            readOnly: true,
          }}
        />
        {busDetails.imgName !== "" && (
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <img
              src={`http://localhost:8080/api/buses/img/${busDetails.imgName}`} 
              alt="Bus"
              style={{ width: "200px", height: "200px", marginTop: "10px", objectFit: "cover" }}
            />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickClose}>Hủy</Button>
        <Button onClick={handleSubmit}>Gán</Button>
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

export default AssignmentDialog;
