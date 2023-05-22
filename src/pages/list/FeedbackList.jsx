import React, { useState, useEffect } from "react";
import "./feedbackList.scss";
import Pagination from "@mui/material/Pagination";
import Rating from "@mui/material/Rating";

// Firebase
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";

const FeedbackList = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(8); //Set number of items shown per page
  const [filteredData, setFilteredData] = useState([]);
  const [posted, setPosted] = useState(false);
  const [activeFilterRating, setActiveFilterRating] = useState("All");
  const [activeFilterStatus, setActiveFilterStatus] = useState("All");

  // Retrieve Feedback Data
  useEffect(() => {
    const fetchFeedbackData = async () => {
      const querySnapshot = await getDocs(collection(db, "FeedbackData"));
      const feedbackData = querySnapshot.docs.map((doc) => doc.data());
      setFeedbackData(feedbackData);
      setFilteredData(feedbackData);
    };
    fetchFeedbackData();
  }, [db]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const numPages = Math.ceil(feedbackData.length / perPage);
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Handle Filter
  const handleFilterClick = (rating, status) => {
    setActiveFilterRating(rating);
    setActiveFilterStatus(status);
    let filtered = feedbackData;

    if (rating !== "All") {
      filtered = filtered.filter((feedback) => feedback.rating === rating);
    }

    if (status === "Posted") {
      filtered = filtered.filter((feedback) => feedback.posted === true);
    } else if (status === "Unpost") {
      filtered = filtered.filter(
        (feedback) => feedback.posted === false || feedback.posted === null
      );
    }

    if (rating === "All") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredData(filtered);
    setPage(1);
  };

  // Post & Unpost Button
  const handlePostClick = async (feedback) => {
    const feedbackQuery = query(
      collection(db, "FeedbackData"),
      where("orderId", "==", feedback.orderId)
    );
    const feedbackSnapshot = await getDocs(feedbackQuery);
    const feedbackDoc = feedbackSnapshot.docs[0];
    const feedbackId = feedbackDoc.id;

    const feedbackRef = doc(db, "FeedbackData", feedbackId);
    await updateDoc(feedbackRef, { posted: !feedback.posted });

    const updatedFeedbackData = [...feedbackData];
    const feedbackIndex = updatedFeedbackData.findIndex(
      (fb) => fb.uid === feedback.uid
    );
    updatedFeedbackData[feedbackIndex] = {
      ...updatedFeedbackData[feedbackIndex],
      posted: !feedback.posted,
    };
    setFeedbackData(updatedFeedbackData);
    setPosted(!posted);

    const fetchFeedbackData = async () => {
      const querySnapshot = await getDocs(collection(db, "FeedbackData"));
      const feedbackData = querySnapshot.docs.map((doc) => doc.data());
      setFeedbackData(feedbackData);
      setFilteredData(feedbackData);
    };
    fetchFeedbackData();
  };

  return (
    <div className="feedbackListWrapper">
      {/* Filter Buttons */}
      <div className="filterButtons">
        <button
          // className="filterButton"
          className={`filterButton ${
            activeFilterRating === "All" && activeFilterStatus === "All"
              ? "active"
              : ""
          }`}
          onClick={() => handleFilterClick("All", "All")}
        >
          All
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${activeFilterRating === "5" && "active"}`}
          onClick={() => handleFilterClick("5", "All")}
        >
          5 Stars
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${activeFilterRating === "4" && "active"}`}
          onClick={() => handleFilterClick("4", "All")}
        >
          4 Stars
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${activeFilterRating === "3" && "active"}`}
          onClick={() => handleFilterClick("3", "All")}
        >
          3 Stars
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${activeFilterRating === "2" && "active"}`}
          onClick={() => handleFilterClick("2", "All")}
        >
          2 Stars
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${activeFilterRating === "1" && "active"}`}
          onClick={() => handleFilterClick("1", "All")}
        >
          1 Star
        </button>
        <button
          // className="filterButton"
          className={`filterButton ${
            activeFilterStatus === "Posted" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("All", "Posted")}
        >
          Posted
        </button>
        <button
          className={`filterButton ${
            activeFilterStatus === "Unpost" ? "active" : ""
          }`}
          onClick={() => handleFilterClick("All", "Unpost")}
        >
          Unpost
        </button>
      </div>

      <div className="feedbackList">
        <div className="feedbackListRow">
          {filteredData.slice(startIndex, endIndex).map((feedback) => (
            <>
              <div className="feedbackItem" key={feedback.uid}>
                <h2>
                  {feedback.firstName} {feedback.lastName}
                </h2>
                <div className="feedbackRating">
                  <p>Rating: </p>
                  <Rating
                    name="read-only"
                    value={parseInt(feedback.rating)}
                    readOnly
                  />
                </div>
                <div className="feedbackMsg">
                  <p>{feedback.message}</p>
                </div>

                <button
                  className={`postButton ${
                    feedback.posted ? "unposted" : "posted"
                  }`}
                  onClick={() => handlePostClick(feedback)}
                >
                  {feedback.posted ? "Unpost" : "Post"}
                </button>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="paginationWrapper">
        <Pagination
          count={numPages}
          page={page}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </div>
    </div>
  );
};

export default FeedbackList;
