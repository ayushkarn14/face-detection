import React from "react";

function Footer(props) {
    return (
        <footer
            className="text-center"
            style={{
                backgroundColor: "#DDDDDD",
                position: "absolute",
                bottom: "0",
                width: "100vw",
            }}
        >
            <div
                className="text-center p-3"
                style={{ backgroundColor: "#EEEEEE", color: "black" }}
            >
                by Ayush Karn 💜
            </div>
        </footer>
    );
}

export default Footer;
