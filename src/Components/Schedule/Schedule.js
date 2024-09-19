import React, { useState, useEffect } from 'react';
import axios from 'axios';



const Schedule =()=>{
    const [schedules, setSchedules]= useState([]);


    const fetchData= async()=>{
        try {
            const results= await axios.get("http://localhost:8080/api/schedules");
            setSchedules(results.data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(fetchData,[]);

    return (
        <div></div>
    );

};
export default Schedule;