import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import "./contentManagement.scss";
import Navbar from "../../components/navbar/Navbar";
import BannerSlider from "../../components/slider/BannerSlider";
import FeedbackList from "./FeedbackList";
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
            <button
              className={`toggleButton ${
                activeContent === "Banner Slider" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Banner Slider")}
            >
              Banner Slider
            </button>
            <button
              className={`toggleButton ${
                activeContent === "List of Feedbacks" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("List of Feedbacks")}
            >
              List of Feedbacks
            </button>
          </div>
          <div className="activeContentContainer">
            {activeContent === "Banner Slider" && <BannerSlider />}
            {activeContent === "List of Feedbacks" && <FeedbackList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
