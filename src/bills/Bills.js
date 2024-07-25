import React, { useEffect, useState } from 'react';
import { db } from '../db/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import './Bills.css';
import Print from './printWindow/Print';

function Bills() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      const orderList = [];
      for (let key in data) {
        if (data[key].completed) {
          orderList.push({ id: key, ...data[key] });
        }
      }
      setOrders(orderList);
    });
  }, []);

  const handlePrint = (orderId) => {
    const printContents = document.getElementById(orderId).innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload();
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString();
    return { dateString, timeString };
  };

  return (
    <div className="bills-wrapper">
      <p className="title">Completed Orders</p>
      <hr className="line" />
      <div className="bills-list">
        {orders.map((order) => {
          const { dateString, timeString } = formatDateTime(order.timestamp);
          return (
            <div key={order.id} className="bill-card" id={order.id}>
              <p className="bill-card-title">Order No: {order.id}</p>
              <p className="bill-card-subtitle">Table Number: {order.table}</p>
              <p className="bill-card-subtitle">date: {dateString}</p>
              <p className="bill-card-subtitle">Time: {timeString}</p>
              <div className="bill-items">
                {Object.keys(order.items).map((itemKey) => {
                  return (
                    <div key={itemKey} className="bill-item">
                      <p><strong>Item: {itemKey}</strong></p>
                      <p>Quantity: {order.items[itemKey]}</p>
                    </div>
                  );
                })}
              </div>
              <button className="print-button" onClick={() => handlePrint(order.id)}>Print</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Bills;
