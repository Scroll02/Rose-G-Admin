import { useContext } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { showSuccessToast } from "../toast/Toast";

const Sidebar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
        showSuccessToast("You've successfully logged out", 1000);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span className="logo">Admin Panel</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          {/* Dashboard */}
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          <p className="title">LISTS</p>
          {/* Users */}
          <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <Person2RoundedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          {/* Products */}
          <Link to="/products" style={{ textDecoration: "none" }}>
            <li>
              <FoodBankRoundedIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>

          {/* Orders */}
          <Link to="/orders" style={{ textDecoration: "none" }}>
            <li>
              <BorderColorRoundedIcon className="icon" />
              <span>Orders</span>
            </li>
          </Link>

          <p className="title">USEFUL</p>
          {/* Notifications */}
          <Link to="/notification" style={{ textDecoration: "none" }}>
            <li>
              <NotificationsNoneIcon className="icon" />
              <span>Notifications</span>
            </li>
          </Link>

          <p className="title">USER</p>
          {/* Logout */}
          <li onClick={handleLogout}>
            <LogoutRoundedIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
