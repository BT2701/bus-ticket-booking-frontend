import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Schedule =()=>{
    const [schedules, setSchedules]= useState(null);

    const loadDatas = ()=>{
        const fetchData= async()=>{
            try {
                const results= await axios.get("http://localhost:8080/api/schedules");
                setSchedules(results.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }
    
    useEffect(loadDatas,[]);

    return (
        <div className="schedule-container">
            <table>
                <thead>
                    <th>bus</th>
                    <th>route</th>
                    <th>departure</th>
                    <th>arrival</th>
                    <th>price</th>
                </thead>
                <tbody>
                    {schedules.length===0?(<p>no value</p>):(schedules.map((schedule)=>(
                        <tr>
                            <td>{schedule?.bus.id}</td>
                            <td>{schedule?.route.id}</td>
                            <td>{schedule?.departure}</td>
                            <td>{schedule?.arrival}</td>
                            <td>{schedule?.price}</td>

                        </tr>
                    )))}
                </tbody>
            </table>
        </div>
    );

};
export default Schedule;