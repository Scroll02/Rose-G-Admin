import { useContext, useState, useEffect } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

import { Link, useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

// Firebase
import { onSnapshot, collection } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";

// Toast
import { showSuccessToast } from "../toast/Toast";

const Sidebar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  //------------------ User Orders Data ------------------//
  const [orderCount, setOrderCount] = useState(0);
  const [orderData, setOrderData] = useState([]);
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    // Retrieve User Orders Data
    const unsubscribeUserOrders = onSnapshot(
      collection(db, "UserOrders"),
      (snapshot) => {
        const orders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrderData(orders);
      },
      (error) => console.log(error)
    );

    // Retrieve Product Data
    const unsubscribeProductData = onSnapshot(
      collection(db, "ProductData"),
      (snapshot) => {
        setProductData(
          snapshot.docs.map((doc) => {
            const data = { id: doc.id, ...doc.data() };
            if (data.currentStock <= data.criticalStock) {
              data.isCritical = true;
            } else {
              data.isCritical = false;
            }
            return data;
          })
        );
      },
      (error) => {
        console.error(error);
      }
    );

    return () => {
      unsubscribeUserOrders();
      unsubscribeProductData();
    };
  }, []);

  // Retrieve User Orders Data
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(db, "UserOrders"),
  //     (snapshot) => {
  //       const orders = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setOrderData(orders);
  //     },
  //     (error) => console.log(error)
  //   );
  //   return unsubscribe;
  // }, []);

  // Filtered by orders today's date and order status is pending
  const filterOrdersByDate = (orders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((order) => {
      if (!order.orderDate) return false;
      const orderDate = new Date(order.orderDate.seconds * 1000);
      orderDate.setHours(0, 0, 0, 0);
      return (
        orderDate.getTime() === today.getTime() &&
        order.orderStatus === "Pending"
      );
    });
  };

  // Get the order count for today
  useEffect(() => {
    const filteredData = filterOrdersByDate(orderData);
    const count = filteredData.length;
    setOrderCount(count);
    // If order status is changed to anything other than Pending, minus 1 the order count
    const unsub = onSnapshot(collection(db, "UserOrders"), (snapShot) => {
      snapShot.docs.forEach((doc) => {
        const order = doc.data();
        if (
          order.orderStatus !== "Pending" &&
          order.orderDate &&
          filterOrdersByDate([order]).length > 0
        ) {
          setOrderCount((prevCount) => prevCount - 1);
        }
      });
    });
    return () => {
      unsub();
    };
  }, [orderData]);

  //------------------ Products Data ------------------//
  // const [productData, setProductData] = useState([]);

  // // Retrieve Product Data
  // useEffect(() => {
  //   const unsubscribe = onSnapshot(
  //     collection(db, "ProductData"),
  //     (snapshot) => {
  //       setProductData(
  //         snapshot.docs.map((doc) => {
  //           const data = { id: doc.id, ...doc.data() };
  //           if (data.stock <= data.criticalStock) {
  //             data.isCritical = true;
  //           } else {
  //             data.isCritical = false;
  //           }
  //           return data;
  //         })
  //       );
  //     },
  //     (error) => {
  //       console.error(error);
  //     }
  //   );
  //   return unsubscribe;
  // }, []);

  // Logout function
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
          <li>
            <NavLink
              to="/home"
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
              style={{ textDecoration: "none" }}
            >
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </NavLink>
          </li>

          <p className="title">LISTS</p>
          {/* Users */}
          <li>
            <NavLink
              to="/users"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <Person2RoundedIcon className="icon" />
              <span>Users</span>
            </NavLink>
          </li>

          {/* Products */}
          <li>
            <NavLink
              to="/products"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <FoodBankRoundedIcon className="icon" />
              <span>Products</span>
              {/* <div className="PriorityHighIcon">
                <PriorityHighIcon />
              </div> */}
              {productData.some((product) => product.isCritical) && (
                <>
                  <div className="priorityHigh">
                    <PriorityHighIcon className="PriorityHighIcon" />
                    <span>Low Stock</span>
                  </div>
                </>
              )}
            </NavLink>
          </li>

          {/* Orders */}
          <li>
            <NavLink
              to="/orders"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <BorderColorRoundedIcon className="icon" />
              <span>Orders</span>
              {orderCount !== null && orderCount >= 1 ? (
                <span className="linkCounter">
                  {orderCount}&nbsp;New&nbsp;order
                </span>
              ) : null}
            </NavLink>
          </li>

          {/* Sales Report */}
          <li>
            <NavLink
              to="/salesReport"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <AssessmentRoundedIcon className="icon" />
              <span>Sales Report</span>
            </NavLink>
          </li>

          <p className="title">USEFUL</p>

          {/* Notifications */}
          <li>
            <NavLink
              to="/notification"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <NotificationsRoundedIcon className="icon" />
              <span>Notifications</span>
            </NavLink>
          </li>

          {/* Content Management */}
          <li>
            <NavLink
              to="/contentManagement"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <BorderColorRoundedIcon className="icon" />
              <span>Content Management</span>
            </NavLink>
          </li>

          {/* Audit Trail */}
          <li>
            <NavLink
              to="/auditTrail"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <ManageSearchRoundedIcon className="icon" />
              <span>Audit Trail</span>
            </NavLink>
          </li>

          <p className="title">USER</p>
          {/* Logout */}
          <li onClick={handleLogout}>
            <NavLink style={{ textDecoration: "none" }}>
              <LogoutRoundedIcon className="icon" />
              <span>Logout</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
