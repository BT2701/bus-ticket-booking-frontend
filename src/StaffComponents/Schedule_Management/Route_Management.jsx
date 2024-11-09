import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import SearchFilterRoute from './SearchFilterRoute';
import AddRouteDialog from './AddRoute';

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRouteId, setEditingRouteId] = useState(null);
    const [showDialogAdd, setShowDialogAdd] = useState(false);
    const [newRoute, setNewRoute] = useState({
        startPoint: '',
        endPoint: '',
        distance: '',
        estimatedTime: '',
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        const fetchedRoutes = [
            { id: 1, startPoint: "Ho Chi Minh", endPoint: "Da Nang", distance: 1000, estimatedTime: "15 hours" },
            { id: 2, startPoint: "Hanoi", endPoint: "Hue", distance: 600, estimatedTime: "10 hours" },
            { id: 3, startPoint: "Da Nang", endPoint: "Ho Chi Minh", distance: 1200, estimatedTime: "18 hours" }
        ];
        setRoutes(fetchedRoutes);
        setFilteredRoutes(fetchedRoutes);
        setLoading(false);
    };

    const handleAddRoute = () => {
        const newRouteDetails = { id: routes.length + 1, ...newRoute };
        setRoutes([...routes, newRouteDetails]);
        setShowDialogAdd(false);
        setNewRoute({
            startPoint: '',
            endPoint: '',
            distance: '',
            estimatedTime: '',
        });
    };

    const handleEditRoute = (id) => {
        setIsEditing(true);
        setEditingRouteId(id);
        setShowDialog(true);
    };

    const handleSaveEdit = (updatedRoute) => {
        setRoutes(routes.map(route => route.id === editingRouteId ? { ...route, ...updatedRoute } : route));
        setShowDialog(false);
        setIsEditing(false);
        setEditingRouteId(null);
    };

    const handleDeleteRoute = (id) => {
        setRoutes(routes.filter(route => route.id !== id));
    };

    const handleFilter = (filterCriteria) => {
        const filtered = routes.filter(route => {
            return (
                (!filterCriteria.startPoint || route.startPoint.toLowerCase().includes(filterCriteria.startPoint.toLowerCase())) &&
                (!filterCriteria.endPoint || route.endPoint.toLowerCase().includes(filterCriteria.endPoint.toLowerCase())) &&
                (!filterCriteria.distance || route.distance.toString().includes(filterCriteria.distance)) &&
                (!filterCriteria.estimatedTime || route.estimatedTime.includes(filterCriteria.estimatedTime))
            );
        });
        setFilteredRoutes(filtered);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="route-management container my-5">
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '2rem', color: '#000' }}>Tuyến Đường</h1>
            <p className="text-success mb-4" style={{ fontSize: '1.2rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý tuyến đường</p>
            {/* <SearchFilterRoute onFilter={handleFilter} /> */}

            <button className="btn btn-primary mb-4" onClick={() => setShowDialogAdd(true)}>Thêm Tuyến Đường Mới</button>
            <AddRouteDialog
                showDialog={showDialogAdd}
                setShowDialog={setShowDialogAdd}
                newRoute={newRoute}
                setNewRoute={setNewRoute}
                handleAddRoute={handleAddRoute}
            />
            <table className="table table-hover table-bordered">
                <thead className="table-success">
                    <tr>
                        <th scope="col">STT</th>
                        <th scope="col">Điểm Xuất Phát</th>
                        <th scope="col">Điểm Đến</th>
                        <th scope="col">Khoảng Cách</th>
                        <th scope="col">Thời Gian Đi Ước Tính</th>
                        <th scope="col">Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredRoutes.map(route => (
                        <tr key={route.id} className="align-middle">
                            <td>{route.id}</td>
                            <td>{route.startPoint}</td>
                            <td>{route.endPoint}</td>
                            <td>{route.distance} km</td>
                            <td>{route.estimatedTime}</td>
                            <td>
                                <button className="btn btn-info btn-sm me-2" onClick={() => handleEditRoute(route.id)}>Sửa</button>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoute(route.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RouteManagement;
