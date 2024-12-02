"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure toast is imported

const Reviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Update the URL to fetch reviews for the specific product using the `id` prop
        const response = await axios.get(
          `https://isans.pythonanywhere.com/shop/see-reviews/${id}`
        );

        if (response.status === 200 || response.status === 200) {
          setReviews(response.data.reviews || []);
        } else {
          setError("Failed to fetch reviews.");
          toast.error("Failed to fetch reviews. Please try again.");
        }
      } catch (err) {
        setError("Failed to fetch reviews.");
        toast.error("Unable to load reviews. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id]); // Dependency array ensures fetching happens when `id` changes

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h3>Product Reviews</h3>
      <div>Total Reviews: {reviews.length}</div>
      <ul>
        {reviews.map((review) => (
          <li key={review.id}>
            <strong>{review.user_first_name}</strong> (Rating: {review.rating})
            <p>{review.comment}</p>
            <small>{new Date(review.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reviews;
