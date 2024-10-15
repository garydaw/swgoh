import React, { useState } from 'react';

const SearchableList = ({items, item_id, item_name, placeholder, clickHandler}) => {


  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Handle search input and filter items
  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);

    if (value) {
      const filtered = items.filter(item =>
        item[item_name].toString().toLowerCase().includes(value) || item[item_id].toString().toLowerCase().includes(value)
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems([]); // Clear filtered items when search is empty
    }
  };

  const handleItemClick = (item) => {
    setSearchTerm(''); // Clear search when item is clicked
    setFilteredItems([]); // Clear filtered items

    clickHandler(item)
  };

  return (
    <div className="container">

      {/* Search Box */}
      <div className="mb-2 mt-2 position-relative">
        <input
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* Filtered Items */}
        {searchTerm && filteredItems.length > 0 && (
          <ul className="list-group position-absolute w-150" style={{ zIndex: 1000 }}>
            {filteredItems.map(item => (
              <li
                key={item[item_id]}
                className="list-group-item list-group-item-action"
                onClick={() => handleItemClick(item)}
                style={{ cursor: 'pointer' }}
              >
                {item[item_name]}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchableList;
