import React, { useState } from 'react';
import Bills from './bills/Bills';
import Menu from './menu/Menu';
import Tables from './tables/Tables';
import './AdminPage.css';

function AdminPage() {
    const [tab, setTab] = useState("tables");
    return (
        <div className="admin-page-wrapper">
            <nav className="navbar">
                <p
                    className={`tabs ${tab === "tables" ? "active" : ""}`}
                    onClick={() => { setTab("tables") }}
                >
                    Tables
                </p>
                <p
                    className={`tabs ${tab === "menu" ? "active" : ""}`}
                    onClick={() => { setTab("menu") }}
                >
                    Menu
                </p>
                <p
                    className={`tabs ${tab === "bills" ? "active" : ""}`}
                    onClick={() => { setTab("bills") }}
                >
                    Orders
                </p>
            </nav>
            {
                tab === "tables" ? (
                    <Tables />
                ) : tab === "menu" ? (
                    <Menu />
                ) : (
                    <Bills />
                )
            }
        </div>
    );
}

export default AdminPage