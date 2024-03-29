import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import ActivityLogTable from "../../components/datatable/ActivityLogTable";

const ActivityLog = () => {
  const [activeContent, setActiveContent] = useState("Today's sales report");

  const handleButtonClick = (contentName) => {
    setActiveContent(contentName);
  };

  return (
    // <div className="list">
    //   <Sidebar />
    //   <div className="listContainer">
    //     <Navbar />
    //     <ActivityLogTable />
    //   </div>
    // </div>
    <div className="contentManagementBody">
      <Sidebar />
      <div className="contentManagementWrapper">
        <Navbar />

        <div className="contentManagementContainer">
          <div className="toggleButtonsContainer">
            <button
              className={`toggleButton ${
                activeContent === "Activity Log" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Activity Log")}
            >
              Activity Log
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
            {activeContent === "Activity Log" && <ActivityLogTable />}
            {activeContent === "All sales report" && <ActivityLogTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
