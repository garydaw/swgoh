import React from 'react';

export default function Stars({rarity}) {
  // Create an array of 7 items (from 1 to 7)
  const stars = Array.from({ length: 7 }, (_, index) => index + 1);

  return (
    <div className="d-flex justify-content-center">
      {stars.map((star) => (
        <i
          style={{color:"#FFD700", fontSize:"12px"}}
          key={star}
          className={star <= rarity ? 'bi bi-star-fill' : 'bi bi-star'}
        ></i>
      ))}
    </div>
  );
};
