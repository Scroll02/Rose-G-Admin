import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";

const AuditTrail = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
      </div>
    </div>
  );
};

export default AuditTrail;
