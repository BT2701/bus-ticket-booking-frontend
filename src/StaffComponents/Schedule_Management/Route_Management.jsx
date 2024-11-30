import { useEffect, useState } from "react";
import AddRouteDialog from "./AddRoute";
import RouteTable from "./RouteTable";
import SearchFilterRoute from "./SearchRoute";
import NotificationDialog from "../../sharedComponents/notificationDialog";
import Pagination from "../../sharedComponents/Pagination";
import ApiService from "../../Components/Utils/apiService";
import BusStationsDialog from "./Station_Management";
import notificationWithIcon from "../../Components/Utils/notification";

const RouteManagement = () => {
    const [routes, setRoutes] = useState([]);
    const [filteredRoutes, setFilteredRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialogDelete, setShowDialogDelete] = useState(false); // Trạng thái để hiển thị cảnh báo xóa
    const [routeToDelete, setRouteToDelete] = useState(null); // Lưu trữ id của tuyến đường cần xóa
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [showStations, setShowStations] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        fetchTotal();
        fetchRoutes();
    }, [page]);

    const fetchTotal = async () => {
        const total = await ApiService.get(`/api/route/total`);
        if (total) {
            setTotalItems(total);
        }
    };

    const fetchRoutes = async () => {
        const response = await ApiService.get(`/api/route-management?page=${page}&size=${size}`);
        if (response) {
            setRoutes(response);
            setFilteredRoutes(response);
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setShowStations(true); // Hiển thị dialog
    };

    const handleCloseDialog = () => {
        setShowStations(false); // Đóng dialog
    };
    

    

    const handleDeleteRoute = (id) => {
        setRouteToDelete(id);
        setShowDialogDelete(true); // Mở cảnh báo xóa
    };

    const confirmDeleteRoute = () => {
        setShowDialogDelete(false); // Đóng cảnh báo
        ApiService.delete(`/api/route/${routeToDelete}`).then(() => {
            fetchRoutes();
            fetchTotal();
            notificationWithIcon('success', 'Thành Công', 'Xóa tuyến đường thành công!');
        })
        .catch(() => {
            notificationWithIcon('error', 'Lỗi', 'Xóa tuyến đường thất bại!');
        });
        
    };

    const cancelDeleteRoute = () => {
        setShowDialogDelete(false); // Đóng cảnh báo mà không xóa
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
                (!filterCriteria.startPoint || route.from.name.toLowerCase().includes(filterCriteria.startPoint.toLowerCase())) &&
                (!filterCriteria.endPoint || route.to.name.toLowerCase().includes(filterCriteria.endPoint.toLowerCase())) &&
                (!filterCriteria.distance || route.distance.toString().includes(filterCriteria.distance))
            );
        });
        setFilteredRoutes(filtered);
    };

    return (
        <div className="route-management container my-5">
            <h1 className="text-uppercase fw-bold" style={{ fontSize: '1.5rem', color: '#000' }}>Tuyến Đường
                <button
                    className="btn btn-light "
                    style={{ marginLeft: '0.5em', textAlign: 'center' }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Stations"
                    onClick={handleOpenDialog}
                >
                    <i className="fa fa-bars"></i>
                </button>
            </h1>
            <p className="text-success mb-4" style={{ fontSize: '1.1rem', fontWeight: 'normal', marginTop: '-10px' }}>Quản lý tuyến đường</p>
            <SearchFilterRoute onFilter={handleFilter} />
            <button className="btn mb-4" style={{ backgroundColor: '#90EE90' }} onMouseEnter={(e) => e.target.style.backgroundColor = '#76c776'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#90EE90'} onClick={() => setDialogOpen(true)}>Thêm Tuyến Đường</button>
            <AddRouteDialog
                show={isDialogOpen}
                onClose={() => setDialogOpen(false)}
            />
            <RouteTable
                routes={filteredRoutes}
                handleDeleteRoute={handleDeleteRoute}
            />
            <Pagination
                page={page}
                setPage={setPage}
                totalItems={totalItems}
                itemsPerPage={size}
            />
            <NotificationDialog
                message="Bạn có chắc muốn xóa?"
                isOpen={showDialogDelete}
                onClose={cancelDeleteRoute}
                type="warning"
                onConfirm={confirmDeleteRoute}
                onCancel={cancelDeleteRoute}
            />
            {showStations && (
                <BusStationsDialog show={showStations} onClose={handleCloseDialog} />
            )}
        </div>
    );
};

export default RouteManagement;
