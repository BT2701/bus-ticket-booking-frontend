import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const NewsItem = ({ article }) => {
    return (<Link to={article.url} target="_blank" className="card mb-3 text-decoration-none" style={{ maxWidth: "800px" }}>
        <div className="row g-0">
            <div className="col-md-4">
                <img src={`${article.image}`} className="img-fluid rounded-start" alt="Hình ảnh tin tức" />
            </div>
            <div className="col-md-8">
                <div className="card-body">
                    <h5 className="card-title">{article.title}</h5>
                    <p className="card-text">
                        {article.description}
                    </p>
                    {/* <p class="card-text">
                 <small class="text-muted">Cập nhật 5 phút trước</small>
             </p> */}
                </div>
            </div>
        </div>
    </Link>)
};

export default NewsItem;
