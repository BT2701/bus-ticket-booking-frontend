import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const BusStationsDialog = ({ show, onClose }) => {
  const [busStations, setBusStations] = useState([
    { id: 1, name: "Bến xe Miền Đông", address: "TP. Hồ Chí Minh" },
    { id: 2, name: "Bến xe Giáp Bát", address: "Hà Nội" },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [formData, setFormData] = useState({ name: "", address: "" });

  // Xử lý khi nhấn nút thêm mới
  const handleAddNew = () => {
    setIsEditing(false);
    setFormData({ name: "", address: "" });
    setCurrentStation(null);
  };

  // Xử lý khi nhấn nút sửa
  const handleEdit = (station) => {
    setIsEditing(true);
    setFormData({ name: station.name, address: station.address });
    setCurrentStation(station);
  };

  // Xử lý khi nhấn nút xóa
  const handleDelete = (id) => {
    setBusStations(busStations.filter((station) => station.id !== id));
  };

  // Xử lý thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi submit form
  const handleSubmit = () => {
    if (isEditing && currentStation) {
      setBusStations((prev) =>
        prev.map((station) =>
          station.id === currentStation.id
            ? { ...station, name: formData.name, address: formData.address }
            : station
        )
      );
    } else {
      const newId = Math.max(...busStations.map((s) => s.id), 0) + 1;
      setBusStations((prev) => [
        ...prev,
        { id: newId, name: formData.name, address: formData.address },
      ]);
    }
    setFormData({ name: "", address: "" });
    setIsEditing(false);
    setCurrentStation(null);
  };

  return (
    <Dialog open={show} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Danh sách bến xe</DialogTitle>
      <DialogContent>
        <Button variant="contained" color="primary" onClick={handleAddNew}>
          Thêm mới
        </Button>
        {(isEditing || currentStation === null) && (
          <div style={{ marginTop: "20px" }}>
            <TextField
              label="Tên bến"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: "10px" }}
            >
              {isEditing ? "Cập nhật" : "Thêm"}
            </Button>
          </div>
        )}
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên bến</TableCell>
                <TableCell>Địa chỉ</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {busStations.map((station) => (
                <TableRow key={station.id}>
                  <TableCell>{station.id}</TableCell>
                  <TableCell>{station.name}</TableCell>
                  <TableCell>{station.address}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEdit(station)}
                      style={{ marginRight: "8px" }}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(station.id)}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusStationsDialog;
