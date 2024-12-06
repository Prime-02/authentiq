"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure toast is imported
import { useGlobalState } from "@/app/GlobalStateProvider";

const Reviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const {userToken} = useGlobalState()
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  useEffect(() => {
    const fetchReviews = async () => {
      console.log("Fetching reviews started...");
      console.log(`Product ID: ${id}`);

      try {
        console.log("Sending GET request to fetch reviews...");
        const response = await axios.get(
          `https://isans.pythonanywhere.com/shop/see-reviews/${id}`
        );

        console.log("Response received:", response);
        if (response.status === 200) {
          console.log("Successfully fetched reviews.");
          setReviews(response.data.reviews || []);
        } else {
          console.error("Unexpected response status:", response.status);
          setError("Failed to fetch reviews.");
          toast.error("Failed to fetch reviews. Please try again.");
        }
      } catch (err) {
        console.error("Error occurred while fetching reviews:", err);
        setError("Failed to fetch reviews.");
        toast.error("Unable to load reviews. Please try again.");
      } finally {
        console.log("Fetching reviews process completed.");
        setLoading(false);
      }
    };

    console.log("useEffect triggered. Calling fetchReviews...");
    fetchReviews();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value, 10) : value, // Convert rating to integer
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting new review...", newReview);

    const userAuthToken = userToken

    if (!userAuthToken) {
      console.error("User authorization token not found.");
      toast.error("You must be logged in to submit a review.");
      return;
    }

    try {
      const response = await axios.post(
        `https://isans.pythonanywhere.com/shop/add-reviews/${id}/`,
        newReview,
        {
          headers: {
            Authorization: `Bearer ${userAuthToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response from adding review:", response);
      if (response.status === 201) {
        toast.success("Review added successfully!");
        setReviews((prev) => [...prev, response.data]);
        setNewReview({ rating: "", comment: "" }); // Reset form
      } else {
        toast.error("Failed to add review. Please try again.");
      }
    } catch (err) {
      console.error("Error while submitting review:", err);
      toast.error("Unable to submit review. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
  }

  return (
    <div className="w-full h-screen">
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

      <h4>Add a Review</h4>
      <form onSubmit={handleSubmit} className="border">
        <div>
          <label>
            Rating:
            <select
              name="rating"
              value={newReview.rating}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>
                Select Rating
              </option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Comment:
            <textarea
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              required
            />
          </label>
        </div>
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default Reviews;
