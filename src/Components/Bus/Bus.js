import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Buses =()=> {
    const [buslist, setBuslist]= useState([]);
    const loadDatas =()=>{
        const fetchData = async ()=>{
            try {
                const results= await axios.get('http://localhost:8080/api/buslist');
                setBuslist(results.content);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();

    }
    useEffect(loadDatas, []);

    return(
        <div className='container'>
            <table>
                <thead>
                    <th>Bus number</th>
                    <th>Seat count</th>
                    <th>Bus type</th>
                    <th>Driver</th>
                </thead>
                <tbody>
                    {buslist.length===0?(<p>no value</p>):(buslist.map((bus)=>(
                        <tr>
                            <td>{bus?.busnumber}</td>
                            <td>{bus?.seatcount}</td>
                            <td>{bus?.bustype}</td>
                            <td>{bus?.driver.name}</td>
                        </tr>
                    )))}
                </tbody>
            </table>
        </div>

    );

};

export default Buses;