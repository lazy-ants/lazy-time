import React from 'react';

// Styles
import './style.scss';

const PageHeader = ({ title, children }) => {
    return (
        <div className="header-wrapper">
            <h1 className="header-wrapper__title">{title}</h1>
            <div className="header-wrapper__child">{children}</div>
        </div>
    );
};

export default PageHeader;
