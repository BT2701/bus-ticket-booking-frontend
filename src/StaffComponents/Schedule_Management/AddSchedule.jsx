import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTripDialog = ({ show, onClose, onSave, tripToEdit }) => {
    const [newTrip, setNewTrip] = useState({ from: '', to: '', departureTime: '', status: 'Pending' });

    useEffect(() => {
        if (tripToEdit) {
            setNewTrip(tripToEdit);
        }
    }, [tripToEdit]);

    const handleAddTrip = () => {
        onSave(newTrip);
        setNewTrip({ from: '', to: '', departureTime: '', status: 'Pending' });
    };

    if (!show) return null;

    return (
        <div className="modal show" tabIndex="-1" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{tripToEdit ? 'Edit Trip' : 'Add Trip'}</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <input
                            type="text"
                            placeholder="From"
                            value={newTrip.from}
                            onChange={(e) => setNewTrip({ ...newTrip, from: e.target.value })}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="To"
                            value={newTrip.to}
                            onChange={(e) => setNewTrip({ ...newTrip, to: e.target.value })}
                            className="form-control mb-2"
                        />
                        <input
                            type="text"
                            placeholder="Departure Time"
                            value={newTrip.departureTime}
                            onChange={(e) => setNewTrip({ ...newTrip, departureTime: e.target.value })}
                            className="form-control mb-2"
                        />
                    </div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>Close</button>
                        <button
                            className="btn btn-primary"
                            onClick={handleAddTrip}
                        >
                            {tripToEdit ? 'Save' : 'Add'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTripDialog;
