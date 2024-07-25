import React, { useEffect, useState } from 'react';
import { db } from '../db/firebaseconfig';
import { ref, onValue, update, remove } from 'firebase/database';
import './Menu.css';

function Menu() {
  const [menuData, setMenuData] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editItem, setEditItem] = useState('');
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [newItem, setNewItem] = useState({ category: '', name: '', price: '', isNewCategory: false });

  useEffect(() => {
    const menuRef = ref(db, 'menu');
    onValue(menuRef, (snapshot) => {
      const data = snapshot.val();
      setMenuData(data);
    });
  }, []);

  if (!menuData) {
    return <div>Loading...</div>;
  }

  const categories = Object.keys(menuData);

  const handleToggleAvailability = async (category, item, available) => {
    await update(ref(db, `menu/${category}/${item}`), { available: !available });
  };

  const handleEditItem = (category, item) => {
    setEditCategory(category);
    setEditItem(item);
    const itemData = menuData[category][item];
    setNewPrice(itemData.price);
  };

  const handleDeleteItem = async (category, item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await remove(ref(db, `menu/${category}/${item}`));
    }
  };

  const handleSavePrice = async () => {
    if (newPrice) {
      await update(ref(db, `menu/${editCategory}/${editItem}`), { price: Number(newPrice) });
      setEditCategory('');
      setEditItem('');
      setNewPrice('');
    } else {
      alert('Please enter a new price.');
    }
  };

  const handleAddItem = () => {
    setAddItemOpen(true);
    setNewItem({ category: '', name: '', price: '', isNewCategory: false });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setNewItem((prev) => ({
      ...prev,
      category: selectedCategory,
      isNewCategory: selectedCategory === 'new'
    }));
  };

  const handleAddNewCategory = (e) => {
    setNewItem((prev) => ({ ...prev, category: e.target.value, isNewCategory: true }));
  };

  const handleSaveNewItem = async () => {
    if (newItem.name && newItem.price) {
      const categoryPath = newItem.isNewCategory ? newItem.category : newItem.category;
      await update(ref(db, `menu/${categoryPath}/${newItem.name}`), {
        price: Number(newItem.price),
        available: true
      });
      setAddItemOpen(false);
      setNewItem({ category: '', name: '', price: '', isNewCategory: false });
    } else {
      alert('Please enter all item details.');
    }
  };

  return (
    <div className="menu-container">
      <button className="add-item-button" onClick={handleAddItem}>Add Item</button>
      <br />
      <br />
      {categories.map((category) => (
        <div key={category} className="category-card">
          <div className="category-title">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div className="items-container">
            {Object.keys(menuData[category]).map((item) => {
              const itemData = menuData[category][item];
              return (
                <div key={item} className="item-card">
                  <div className="item-details">
                    <div className="item-name">{item}</div>
                    <div className="item-price">₹{itemData.price}</div>
                    <div className="item-availability">
                      <span>{itemData.available ? 'Available' : 'Not Available'}</span>
                    </div>
                  </div>
                  <button className="toggle-availability-button" onClick={() => handleToggleAvailability(category, item, itemData.available)}>
                    Toggle Availability
                  </button>
                  <button className="edit-button" onClick={() => handleEditItem(category, item)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDeleteItem(category, item)}>
                    Delete
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {editCategory && editItem && (
        <div className="edit-modal">
          <h2>Edit Item: {editItem}</h2>
          <input
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Enter new price (Rs)"
          />
          <button onClick={handleSavePrice}>Save</button>
          <button className="cancel-button" onClick={() => {
            setEditCategory('');
            setEditItem('');
            setNewPrice('');
          }}>Cancel</button>
        </div>
      )}
      {addItemOpen && (
        <div className="add-item-modal">
          <h2>Add Item</h2>
          <select value={newItem.isNewCategory ? 'new' : newItem.category} onChange={handleCategoryChange}>
            <option value="">Select Category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            <option value="new">Add New Category</option>
          </select>
          {newItem.isNewCategory && (
            <input
              type="text"
              value={newItem.category}
              onChange={handleAddNewCategory}
              placeholder="Enter new category name"
            />
          )}
          <input
            type="text"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            placeholder="Enter item name"
          />
          <input
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            placeholder="Enter item price (Rs)"
          />
          <button onClick={handleSaveNewItem}>Save</button>
          <button className="cancel-button" onClick={() => {
            setAddItemOpen(false);
            setNewItem({ category: '', name: '', price: '', isNewCategory: false });
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Menu;
