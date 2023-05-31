import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import ActivityLogTable from "../../components/datatable/ActivityLogTable";

const ActivityLog = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ActivityLogTable />
      </div>
    </div>
  );
};

export default ActivityLog;
