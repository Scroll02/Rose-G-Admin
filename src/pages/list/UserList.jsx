import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import UserTable from "../../components/datatable/UserTable";

const UserList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <UserTable />
      </div>
    </div>
  );
};

export default UserList;
