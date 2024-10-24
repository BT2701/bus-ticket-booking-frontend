import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Typography
} from '@mui/material';
import ApiService from '../../Components/Utils/apiService';

function ScheduleDialog({ open, onClose, driverId }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (driverId && open) {
        setLoading(true); 
        try {
          const response = await ApiService.get(`/api/schedule/driver/${driverId}`);
          setSchedules(response);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu lịch trình:", error);
        } finally {
          setLoading(false); 
        }
      }
    };
    fetchSchedules();
  }, [driverId, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lịch trình của tài xế {driverId}</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : schedules.length === 0 ? ( 
          <Typography variant="h6" align="center" color="textSecondary">
            Hiện lịch trình đang trống
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Khởi hành</TableCell>
                <TableCell>Đến</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Tài xế</TableCell>
                <TableCell>Biển số xe</TableCell>
                <TableCell>Loại xe</TableCell>
                <TableCell>Tuyến đường</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.id}</TableCell>
                  <TableCell>{new Date(schedule.departure).toLocaleString()}</TableCell>
                  <TableCell>{new Date(schedule.arrival).toLocaleString()}</TableCell>
                  <TableCell>{schedule.price} VND</TableCell>
                  <TableCell>{schedule.bus.driver.name}</TableCell>
                  <TableCell>{schedule.bus.busnumber}</TableCell>
                  <TableCell>{schedule.bus.category.name}</TableCell>
                  <TableCell>
                    {schedule.route.from.name} đến {schedule.route.to.name} ({schedule.route.distance} km, {schedule.route.duration})
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ScheduleDialog;
