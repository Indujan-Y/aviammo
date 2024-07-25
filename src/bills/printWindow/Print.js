import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { db } from '../../db/firebaseconfig';
import { ref, onValue } from 'firebase/database';
import './Print.css';

function Print() {
  const [order, setOrder] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  useEffect(() => {
    if (orderId) {
      const orderRef = ref(db, `orders/${orderId}`);
      onValue(orderRef, (snapshot) => {
        setOrder(snapshot.val());
      });
    }
  }, [orderId]);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const dateString = date.toLocaleDateString();
    return dateString;
  };

  if (!order) return <p>Loading...</p>;

  const orderDate = formatDateTime(order.timestamp);

  return (
    <div className="print-window">
      <div className="print-header">
        <h1>The BrewBerry Cafe</h1>
        <h4>SIVANADHACOLONY BUS STOP, COIMBATORE.</h4>
      </div>
      <div className="print-neck">
        <div className="print-neck-row">
          <p className="print-neck-row-item">Order No: {orderId}</p>
          <p className="print-neck-row-item">Order Date: {orderDate}</p>
        </div>
      </div>
      <div className="print-body">
        <div className="print-body-row">
          <p className="print-body-row-item">Item</p>
          <p className="print-body-row-item">Price</p>
          <p className="print-body-row-item">Quantity</p>
          <p className="print-body-row-item">Total</p>
        </div>
        {Object.keys(order.items).map((itemKey) => {
          const item = order.items[itemKey];
          const itemTotal = item.price * item.quantity;
          return (
            <div key={itemKey} className="print-body-row">
              <p className="print-body-row-item">{itemKey}</p>
              <p className="print-body-row-item">{item.price}</p>
              <p className="print-body-row-item">{item.quantity}</p>
              <p className="print-body-row-item">{itemTotal}</p>
            </div>
          );
        })}
      </div>
      <div className="print-footer">
        <p className="print-footer-row">Total: {order.total}</p>
        <p className="print-footer-row">Tax: {order.tax}</p>
        <p className="print-footer-row">Grand Total: {order.grandTotal}</p>
      </div>
    </div>
  );
}

export default Print;
