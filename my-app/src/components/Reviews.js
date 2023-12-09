import React from 'react';
import '../css/Reviews.css';

const Reviews = ({ reviews }) => {
  return (
    <div className="reviews-content">
      {reviews.map((review, index) => (
        <div key={index} className="review-card">
          <h4><strong>{review.reviewer}</strong> </h4>
          <p>{review.review}</p>
        </div>
      ))}
    </div>
  );
};


export default Reviews;