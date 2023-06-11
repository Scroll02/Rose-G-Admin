import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./auditTrail.scss";
import Navbar from "../../components/navbar/Navbar";
import ActivityLogTable from "../../components/datatable/ActivityLogTable";
import ActionLogTable from "../../components/datatable/ActionLogTable";

const AuditTrail = () => {
  const [activeContent, setActiveContent] = useState("Activity Log");

  const handleButtonClick = (contentName) => {
    setActiveContent(contentName);
  };

  return (
    <div className="auditTrailBody">
      <Sidebar />
      <div className="auditTrailWrapper">
        <Navbar />
        <div className="auditTrailContainer">
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
                activeContent === "Action Log" ? "active" : ""
              }`}
              onClick={() => handleButtonClick("Action Log")}
            >
              Action Log
            </button>
          </div>
          <div className="activeContentContainer">
            {activeContent === "Activity Log" && <ActivityLogTable />}
            {activeContent === "Action Log" && <ActionLogTable />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
