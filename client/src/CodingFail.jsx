import React from 'react';
import './CodingFail.css';
const CodingFail=({ title, description })=>{
    return (
        <div className="coding-fail">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};
export default CodingFail;