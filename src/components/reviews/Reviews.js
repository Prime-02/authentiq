"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useGlobalState } from "@/app/GlobalStateProvider";
import { Plus } from "lucide-react";
import Modal from "../Modal/Modal";
import { TextArea } from "../inputs/Textinput";

const Reviews = ({ id }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useGlobalState();
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 0 });
  const userToken = getToken(`user`);
  const [modal, setModal] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `https://isans.pythonanywhere.com/shop/see-reviews/${id}/`
        );
        if (response.status === 200) {
          setReviews(response.data.reviews || []);
        } else if (response.status === 404) {
          setReviews([]); // No reviews found
        } else {
          setError("Failed to fetch reviews.");
          toast.error("Failed to fetch reviews. Please try again.");
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setReviews([]); // Handle 404 as no reviews
        } else {
          setError("Failed to fetch reviews.");
          toast.error("Unable to load reviews. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleStarClick = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userToken) {
      toast.error("You must be logged in to submit a review.");
      return;
    }
    try {
      const response = await axios.post(
        `https://isans.pythonanywhere.com/shop/add-reviews/${id}/`,
        { rating: newReview.rating, comment },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Review added successfully!");
        setReviews((prev) => [...prev, response.data]);
        setNewReview({ rating: 0 });
        setComment(""); // Reset comment state
      } else {
        toast.error("Failed to add review. Please try again.");
      }
    } catch (err) {
      toast.error("Unable to submit review. Please try again.");
    }
  };

  const renderStars = (rating, setRating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => setRating(star)}
            style={{
              cursor: "pointer",
              color: star <= rating ? "#FFD700" : "#ddd",
              fontSize: "1.5rem",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="card p-6 rounded-lg shadow-md ">
      {/* Reviews Header */}
      <div className="pb-4 mb-4 flex w-full justify-between">
        <span>
          <h3 className="text-2xl font-bold ">Review on this Product</h3>
          <p>
            Total Reviews: <span className="font-medium">{reviews.length}</span>
          </p>
        </span>
        {userToken && (
          <span
            className="flex gap-x-4 cursor-pointer"
            onClick={() => setModal(!modal)}
          >
            <p className="hidden md:flex">Add a review</p>
            <p>
              <Plus />
            </p>
          </span>
        )}
      </div>

      {/* No Reviews Message */}
      {reviews.length === 0 ? (
        <div className="text-center text-gray-500">
          No reviews for this product yet.
        </div>
      ) : (
        <ul className="space-y-6 w-full">
          {reviews.map((review) => (
            <li key={review.id} className="pb-4 last:border-none">
              <div className="flex flex-col items-start gap-x-8 w-full">
                <span className="flex gap-x-3">
                  <span className="border text-center flex items-center justify-center w-12 h-12 rounded-full text-3xl font-extrabold">
                    {review.user_first_name.charAt(0).toUpperCase()}
                  </span>
                  <span>
                    <h1 className="text-lg font-bold">
                      {review.user_first_name}
                    </h1>
                    <small className="text-sm">
                      {new Date(review.created_at).toLocaleString()}
                    </small>
                    <span>{renderStars(review.rating)}</span>
                    <p className="mt-2">{review.comment}</p>
                  </span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        isOpen={modal}
        onClose={() => setModal(!modal)}
        onSubmit={handleSubmit}
        buttonValue={`Submit Review`}
        title={`Review & Rating`}
      >
        <div>
          <label className="block font-medium">Rating:</label>
          <div className="flex">
            {renderStars(newReview.rating, handleStarClick)}
          </div>
        </div>
        <div>
          <TextArea
            id={`comments`}
            label="Comment"
            value={comment}
            changed={(e) => setComment(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Reviews;
