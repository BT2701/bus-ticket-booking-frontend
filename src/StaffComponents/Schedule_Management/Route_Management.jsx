import { useEffect, useState } from "react";
import AddRouteDialog from "./AddRoute";
import RouteTable from "./RouteTable";
import SearchFilterRoute from "./SearchRoute";

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);  // Store the route being edited
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
        const routeToEdit = routes.find(route => route.id === id);
        setEditingRoute(routeToEdit);  // Set the route data for editing
        setIsEditing(true);
        setShowDialog(true);  // Open dialog for editing
    };

    const handleSaveEdit = (updatedRoute) => {
        setRoutes(routes.map(route => route.id === updatedRoute.id ? updatedRoute : route));
        setShowDialog(false);
        setIsEditing(false);
        setEditingRoute(null);
    };

    const handleDeleteRoute = (id) => {
        setRoutes(routes.filter(route => route.id !== id));
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

    const handleFilter = (filterCriteria) => {
        const filtered = routes.filter(route => {
            return (
                (!filterCriteria.startPoint || route.startPoint.toLowerCase().includes(filterCriteria.startPoint.toLowerCase())) &&
                (!filterCriteria.endPoint || route.endPoint.toLowerCase().includes(filterCriteria.endPoint.toLowerCase())) &&
                (!filterCriteria.distance || route.distance.toString().includes(filterCriteria.distance))
            );
        });
        setFilteredRoutes(filtered);
    };

    return (
        <div className="route-management container my-5">
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '1.5rem', color: '#000' }}>Tuyến Đường</h1>
            <p className="text-success mb-4" style={{ fontSize: '1.1rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý tuyến đường</p>
            <SearchFilterRoute onFilter={handleFilter} />
            <button className="btn mb-4" style={{ backgroundColor: '#90EE90' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#76c776'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#90EE90'} onClick={() => setShowDialogAdd(true)}>Thêm Tuyến Đường</button>
            <AddRouteDialog
                showDialog={showDialog || showDialogAdd}
                setShowDialog={setShowDialogAdd}
                route={isEditing ? editingRoute : newRoute}  // Pass the current route (either new or for editing)
                setRoute={isEditing ? setEditingRoute : setNewRoute}  // Set function depending on add/edit
                handleAddRoute={handleAddRoute}
                handleSaveEdit={handleSaveEdit}
                isEditing={isEditing}
            />
            <RouteTable
                routes={filteredRoutes}
                handleEditRoute={handleEditRoute}
                handleDeleteRoute={handleDeleteRoute}
            />
        </div>
    );
};

export default RouteManagement;
