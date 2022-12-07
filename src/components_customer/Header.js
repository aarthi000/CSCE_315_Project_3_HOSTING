import React from 'react';
import './customerWindowGUI.css'

/**
 * @function 'Header' - Function show the header
 * @param {Array} props - array of properties 
 * @return {void}
 */
export default function Header(props) {
    return (
        <header className="row block-header center">
            <h2 className="welcome">Welcome to Rev's American Grill!</h2>
        </header>
    );
}
