import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    TextField,
    FormControl,
    InputLabel,
} from "@mui/material";
import { getDistance } from "geolib";
import ApiService from "../../Components/Utils/apiService";

const AddRouteDialog = ({ show, onClose }) => {
    const [startLocation, setStartLocation] = useState(null);
    const [endLocation, setEndLocation] = useState(null);
    const [distance, setDistance] = useState("");
    const [travelTime, setTravelTime] = useState("");
    const [locations, setLocations] = useState([]);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const speed = 60; // km/h

    useEffect(() => {
        const fetchData = async () => {
            const response = await ApiService.get("/api/route/station");
            if (response) {
                console.log("location", response);
                setLocations(response);
            }
        };
        fetchData();
    }, []);

    const addRoute = async (from, to, distance, duration) => {
        const response = await ApiService.post("/api/route", {
            from: from,
            to: to,
            distance: distance,
            duration: duration,
        });
        if (response) {
            console.log("Route added successfully");
            onClose();
        }
    };

    // Function to fetch coordinates from a location name (address)
    const getCoordinatesFromAddress = async (address) => {
        try {
            const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=YOUR_GOOGLE_API_KEY`);
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                const { lat, lng } = data.results[0].geometry.location;
                return { latitude: lat, longitude: lng };
            }
            return null;
        } catch (error) {
            console.error("Error fetching coordinates:", error);
            return null;
        }
    };

    const calculateDistanceAndTime = async (start, end) => {
        if (start && end) {
            // Get coordinates for start and end locations
            const startLocation = locations.find((location) => location.id === start);
            const endLocation = locations.find((location) => location.id === end);

            if (!startLocation || !endLocation) {
                console.error("Invalid locations");
                return;
            }

            // Fetch coordinates for start and end locations based on their address
            const startCoords = await getCoordinatesFromAddress(startLocation.address);
            const endCoords = await getCoordinatesFromAddress(endLocation.address);

            if (!startCoords || !endCoords) {
                console.error("Unable to fetch coordinates for one or both locations");
                return;
            }

            const distanceValue = getDistance(startCoords, endCoords) / 1000; // Convert to km

            setDistance(`${Math.floor(distanceValue)} km`);
            setTravelTime(`${Math.floor(distanceValue / speed)} giờ`);
        }
    };

    const handleStartChange = (event) => {
        setStartLocation(event.target.value);
        calculateDistanceAndTime(event.target.value, endLocation);
    };

    const handleEndChange = (event) => {
        setEndLocation(event.target.value);
        calculateDistanceAndTime(startLocation, event.target.value);
    };

    return (
        <Dialog open={show} onClose={onClose}>
            <DialogTitle>Chọn địa điểm và thông tin di chuyển</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Địa điểm xuất phát</InputLabel>
                    <Select
                        value={startLocation}
                        onChange={handleStartChange}
                        label="Địa điểm xuất phát"
                    >
                        {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                                {location.name + " - " + location.address}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Địa điểm đến</InputLabel>
                    <Select
                        value={endLocation}
                        onChange={handleEndChange}
                        label="Địa điểm đến"
                    >
                        {locations.map((location) => (
                            <MenuItem key={location.id} value={location.id}>
                                {location.name + " - " + location.address}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Khoảng cách"
                    value={distance}
                    disabled
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Thời gian di chuyển"
                    value={travelTime}
                    disabled
                    fullWidth
                    margin="normal"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Hủy
                </Button>
                <Button
                    onClick={() => addRoute(startLocation, endLocation, distance, travelTime)}
                    color="primary"
                    variant="contained"
                >
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddRouteDialog;
