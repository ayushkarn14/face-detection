import React from "react";
import logo from "../Images/logo.jpg";
function Navbar(props) {
    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="/" alt="preview">
                    <img
                        src={logo}
                        alt="Logo"
                        width="30"
                        height="30"
                        className="d-inline-block align-text-top"
                    />
                    &nbsp; Face Detection
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
