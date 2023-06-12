import { useContext, useState, useEffect } from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import FoodBankRoundedIcon from "@mui/icons-material/FoodBankRounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import ManageSearchRoundedIcon from "@mui/icons-material/ManageSearchRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";
import moment from "moment";
// Alert
import NewOrderAlert from "../alert/NewOrderAlert";
// Navigation
import { Link, useNavigate, NavLink, useLocation } from "react-router-dom";
// Context
import { AuthContext } from "../../context/AuthContext";
// Firebase
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
// Toast
import { showSuccessToast, showErrorToast } from "../toast/Toast";

const Sidebar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  //------------------ User Data (For Restricting Access on Sidebar Menu) ------------------//
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (auth.currentUser) {
          const userDocRef = doc(db, "UserData", auth.currentUser.uid);

          // Listen for real-time changes using onSnapshot
          const unsubscribe = onSnapshot(userDocRef, (userDocSnap) => {
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserData(userData);
            } else {
              // Document does not exist, handle the case if needed
            }
          });
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

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

  const [showNewOrderAlert, setShowNewOrderAlert] = useState(false);
  // Get the order count for today
  useEffect(() => {
    const filteredData = filterOrdersByDate(orderData);
    const count = filteredData.length;
    setOrderCount(count);

    // If order status is changed to anything other than Pending, subtract 1 from the order count
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

  // Show New Order Alert
  useEffect(() => {
    // Check if the current location is "/orders"
    const isOrdersPage = location.pathname.startsWith("/orders");

    // Update the showNewOrderAlert state based on the current location and order count
    setShowNewOrderAlert(!isOrdersPage && orderCount > 0);
  }, [location, orderCount]);

  // Close New Order Alert
  const closeNewOrderAlert = () => {
    setShowNewOrderAlert(false);
  };

  // Logout function
  const handleLogout = async () => {
    // Get the current user
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Retrieve the UserData document
      const userRef = doc(db, "UserData", currentUser.uid);
      const userDoc = await getDoc(userRef);

      const userData = userDoc.data();
      const now = new Date().toISOString();
      const logoutData = { lastLogoutAt: now };

      // Update lastLogoutAt field in UserData
      await updateDoc(userRef, logoutData);

      // Update lastLogoutAt field in ActivityLog
      const startOfMonth = moment().startOf("month").toISOString();
      const endOfMonth = moment().endOf("month").toISOString();
      const monthDocumentId = moment().format("YYYY-MM");

      const activityLogRef = doc(db, "ActivityLog", monthDocumentId);
      const activityLogDoc = await getDoc(activityLogRef);

      if (activityLogDoc.exists()) {
        const activityLogData = activityLogDoc.data().activityLogData || [];

        // Find the login entry to update
        const entryToUpdate = activityLogData.find(
          (entry) => entry.uid === currentUser.uid && !entry.lastLogoutAt
        );

        if (entryToUpdate) {
          // Update the entry with the lastLogoutAt value
          entryToUpdate.lastLogoutAt = now;

          // Update the activityLogData field in ActivityLog
          await updateDoc(activityLogRef, { activityLogData });
        }
      }

      // Proceed with regular logout
      signOut(auth)
        .then(() => {
          dispatch({ type: "LOGOUT" });
          showSuccessToast("You've successfully logged out", 2000);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // User is not logged in, proceed with regular logout
      signOut(auth)
        .then(() => {
          dispatch({ type: "LOGOUT" });
          showSuccessToast("You've successfully logged out", 2000);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
          {showNewOrderAlert && orderCount >= 1 && (
            <NewOrderAlert
              orderCount={orderCount}
              closeNewOrderAlert={closeNewOrderAlert}
            />
          )}

          {/* Sales Report */}
          {userData?.role === "Super Admin" && (
            <li>
              <NavLink
                to="/salesReport"
                style={{ textDecoration: "none" }}
                className={(navClass) =>
                  navClass.isActive ? "activeLink" : ""
                }
              >
                <AssessmentRoundedIcon className="icon" />
                <span>Sales Report</span>
              </NavLink>
            </li>
          )}

          <p className="title">USEFUL</p>

          {/* Notifications */}
          {/* <li>
            <NavLink
              to="/notification"
              style={{ textDecoration: "none" }}
              className={(navClass) => (navClass.isActive ? "activeLink" : "")}
            >
              <NotificationsRoundedIcon className="icon" />
              <span>Notifications</span>
            </NavLink>
          </li> */}

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
          {userData?.role === "Super Admin" && (
            <li>
              <NavLink
                to="/auditTrail"
                style={{ textDecoration: "none" }}
                className={(navClass) =>
                  navClass.isActive ? "activeLink" : ""
                }
              >
                <ManageSearchRoundedIcon className="icon" />
                <span>Audit Trail</span>
              </NavLink>
            </li>
          )}

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
