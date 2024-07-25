import React, { useEffect, useState } from 'react';
import { db } from '../db/firebaseconfig';
import { ref, onValue, update, remove } from 'firebase/database';
import './Tables.css';

function Tables() {
    const [orders, setOrders] = useState([]);
    const [tables, setTables] = useState({});
    const [manageMode, setManageMode] = useState(false);
    const [newTableNumber, setNewTableNumber] = useState('');

    useEffect(() => {
        const ordersRef = ref(db, 'orders');
        onValue(ordersRef, (snapshot) => {
            const data = snapshot.val();
            const orderList = [];
            for (let key in data) {
                orderList.push({ id: key, ...data[key] });
            }
            setOrders(orderList);
        });

        const tablesRef = ref(db, 'tables');
        onValue(tablesRef, (snapshot) => {
            setTables(snapshot.val() || {});
        });
    }, []);

    const handleToggleTableAvailability = async (tableNumber) => {
        const currentStatus = tables[tableNumber];
        await update(ref(db, `tables/${tableNumber}`), { available: !currentStatus.available });
    };

    const handleAddTable = async () => {
        if (newTableNumber) {
            await update(ref(db, `tables/${newTableNumber}`), { available: true });
            setNewTableNumber('');
        } else {
            alert('Please enter a table number.');
        }
    };

    const handleDeleteTable = async (tableNumber) => {
        if (window.confirm('Are you sure you want to delete this table?')) {
            await remove(ref(db, `tables/${tableNumber}`));
        }
    };

    const handleCompleteOrder = async (orderId) => {
        await update(ref(db, `orders/${orderId}`), { completed: true });
    };

    return (
        <div className="tables-wrapper">
            <button onClick={() => setManageMode(!manageMode)}>
                {manageMode ? 'View Orders' : 'Manage Tables'}
            </button>
            <br />
            <br />
            {manageMode ? (
                <>
                    <div className="manage-tables">
                        <h2>Manage Tables</h2>
                        <div className="add-table">
                            <input
                                type="number"
                                value={newTableNumber}
                                onChange={(e) => setNewTableNumber(e.target.value)}
                                placeholder="Enter table number"
                            />
                            <button onClick={handleAddTable}>Add Table</button>
                        </div>
                        <div className="table-list">
                            {Object.keys(tables).map((tableNumber) => (
                                <div key={tableNumber} className="table-item">
                                    <span>Table {tableNumber}</span>
                                    <span>{tables[tableNumber].available ? 'Available' : 'Not Available'}</span>
                                    <button onClick={() => handleToggleTableAvailability(tableNumber)}>
                                        Toggle Availability
                                    </button>
                                    <button onClick={() => handleDeleteTable(tableNumber)}>Delete</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <p className="title">Orders</p>
                    <hr className="line" />
                    <div className="orders-list">
                        {orders
                            .filter(order => !order.completed) // Filter orders that are not completed
                            .map((order) => (
                                <div key={order.id} className="order-card">
                                    <p className="order-card-title">Order No: {order.id}</p>
                                    <p className="order-card-subtitle">Table Number: {order.table}</p>
                                    <div className="order-items">
                                        {Object.keys(order.items).map((itemKey) => (
                                            <div key={itemKey} className="order-item">
                                                <p><strong>Item: {itemKey}</strong></p>
                                                <p>Quantity: {order.items[itemKey]}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="complete-order-button" onClick={() => handleCompleteOrder(order.id)}>
                                        Complete Order
                                    </button>
                                </div>
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Tables;
