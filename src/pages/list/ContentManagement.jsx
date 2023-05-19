import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import "./contentManagement.scss";
import Navbar from "../../components/navbar/Navbar";
import BannerSlider from "../../components/slider/BannerSlider";
import FeedbackList from "./FeedbackList";
import DeliveryFee from "../../components/box/DeliveryFee";

const ContentManagement = () => {
  const [activeContent, setActiveContent] = useState("Banner Slider");

  const handleButtonClick = (contentName) => {
    setActiveContent(contentName);
  };

  return (
    <div className="contentManagementBody">
      <Sidebar />
      <div className="contentManagementWrapper">
        <Navbar />

        <div className="contentManagementContainer">
          <div className="toggleButtonsContainer">
            {/* Banner Slider */}
            <button
              className={`toggleButton ${
                activeContent === "Banner Slider" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Banner Slider")}
            >
              Banner Slider
            </button>

            {/* List of Feedbacks */}
            <button
              className={`toggleButton ${
                activeContent === "List of Feedbacks" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("List of Feedbacks")}
            >
              List of Feedbacks
            </button>

            {/* Delivery Fee */}
            <button
              className={`toggleButton ${
                activeContent === "Delivery Fee" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Delivery Fee")}
            >
              Delivery Fee
            </button>
          </div>
          <div className="activeContentContainer">
            {activeContent === "Banner Slider" && <BannerSlider />}
            {activeContent === "List of Feedbacks" && <FeedbackList />}
            {activeContent === "Delivery Fee" && <DeliveryFee />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
