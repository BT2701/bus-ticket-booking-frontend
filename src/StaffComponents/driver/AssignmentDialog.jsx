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
    const [error, setError] = useState("");
  
    useEffect(() => {
      ApiService.get("/api/buslist")
        .then(res => {
          console.log(res);
          setBusList(res);
        })
        .catch((err) => {
          setError("Không thể lấy danh sách xe vì: " + (err?.response?.data?.message || err?.message));
        });
    }, []);
  
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
  
    const handleClickClose = () => {
      onClose();
    };
  
    const handleSubmit = async () => {
      if (!driverId || !busId) {
        setError("Cần nhập ID tài xế và ID xe.");
        return;
      }
  
      // Gọi API để thực hiện việc gán tài xế với xe
      try {
        const response = await ApiService.post("/api/assignDriverToBus", {
          driverId,
          busId,
        });
        console.log(response);
        
        notificationWithIcon("success", "Gán tài xế", "Gán tài xế thành công!");
        onClose();
      } catch (err) {
        console.log(err?.response?.data?.message || err?.message);
        setError("Không thể gán tài xế vì: " + (err?.response?.data?.message || err?.message));
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
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
            >
              {busList.map(bus => (
                <MenuItem key={bus.id} value={bus.id}>
                  {bus.id}
                </MenuItem>
              ))}
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
                src={`http://localhost:8080/api/buses/img/${busDetails.imgName}`} // Cập nhật đường dẫn hình ảnh nếu cần
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