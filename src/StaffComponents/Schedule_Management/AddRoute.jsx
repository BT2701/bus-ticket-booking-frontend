const AddRouteDialog = ({ showDialog, setShowDialog, route, setRoute, handleAddRoute, handleSaveEdit, isEditing }) => {
    const handleClose = () => {
        setShowDialog(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoute({ ...route, [name]: value });
    };

    const handleSave = () => {
        if (isEditing) {
            handleSaveEdit(route);
        } else {
            handleAddRoute();
        }
    };

    return (
        <div className={`modal fade ${showDialog ? 'show' : ''}`} style={{ display: showDialog ? 'block' : 'none' }} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{isEditing ? 'Chỉnh Sửa Tuyến Đường' : 'Thêm Tuyến Đường Mới'}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="startPoint" className="form-label">Điểm Xuất Phát</label>
                            <input type="text" className="form-control" id="startPoint" name="startPoint" value={route.startPoint} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="endPoint" className="form-label">Điểm Đến</label>
                            <input type="text" className="form-control" id="endPoint" name="endPoint" value={route.endPoint} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="distance" className="form-label">Khoảng Cách (km)</label>
                            <input type="number" className="form-control" id="distance" name="distance" value={route.distance} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="estimatedTime" className="form-label">Thời Gian Đi Ước Tính</label>
                            <input type="text" className="form-control" id="estimatedTime" name="estimatedTime" value={route.estimatedTime} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>Đóng</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>{isEditing ? 'Lưu' : 'Thêm'}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddRouteDialog;