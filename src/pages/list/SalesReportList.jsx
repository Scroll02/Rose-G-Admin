import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import TodaySalesReportTable from "../../components/datatable/TodaySalesReportTable";
import AllSalesReportTable from "../../components/datatable/AllSalesReportTable";

import BannerSlider from "../../components/slider/BannerSlider";
import FeedbackList from "./FeedbackList";
const SalesReportList = () => {
  const [activeContent, setActiveContent] = useState("Today's sales report");

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
                activeContent === "Today's sales report" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Today's sales report")}
            >
              Today's sales report
            </button>
            <button
              className={`toggleButton ${
                activeContent === "All sales report" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("All sales report")}
            >
              All sales report
            </button>
          </div>
          <div className="activeContentContainer">
            {activeContent === "Today's sales report" && (
              <TodaySalesReportTable />
            )}
            {activeContent === "All sales report" && <AllSalesReportTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReportList;
