import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs, productCategoryInputs } from "./formSource";
import { AuthContext } from "./context/AuthContext";
import { useContext, useState, useEffect } from "react";
import "./App.css";

// React-Slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// React-Date Picker
import "react-datepicker/dist/react-datepicker.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

// LIST
import UserList from "./pages/list/UserList"; //USER LIST
import ProductList from "./pages/list/ProductList"; //PRODUCT LIST
import OrderList from "./pages/list/OrderList"; //ORDER LIST
import ProductCategoriesList from "./pages/list/ProductCategoriesList"; //PRODUCT CATEGORIES LIST
import NotificationList from "./pages/list/NotificationList"; //NOTIFICATION LIST
import ContentManagement from "./pages/list/ContentManagement"; //CONTENT MANAGEMENT LIST
import ActivityLog from "./pages/list/ActivityLog"; //AUDIT TRAIL LIST
import SalesReport from "./pages/list/SalesReportList"; //SALES REPORT LIST
import AuditTrail from "./pages/list/AuditTrail"; // AUDIT TRAIL LIST

// ADDING NEW
import NewUser from "./pages/new/NewUser"; //ADDING NEW USER
import NewProduct from "./pages/new/NewProduct"; //ADDING NEW PRODUCTS
import NewProductCategory from "./pages/new/NewProductCategory"; //ADDING NEW FOOD CATEGORY

// SINGLE
import SingleUser from "./pages/single/SingleUser"; //SINGLE USER
import SingleProduct from "./pages/single/SingleProduct"; //SINGLE PRODUCT
import SingleOrder from "./pages/single/SingleOrder"; //SINGLE ORDER
import SingleProductCategory from "./pages/single/SingleProductCategory"; //SINGLE PRODUCT CATEGORY

import NewOrderAlert from "./components/alert/NewOrderAlert";
import { ToastContainer, toast } from "react-toastify";
import { showErrorToast } from "./components/toast/Toast";
import "react-toastify/dist/ReactToastify.css";

// Firebase
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const { currentUser } = useContext(AuthContext);

  const autoCloseTime = 2000;

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  const RequireSuperAdmin = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [errorShown, setErrorShown] = useState(false);

    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, "UserData", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.exists() ? userDocSnap.data() : null;
          setUserData(userData);
          setHasPermission(userData?.role === "Super Admin");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }, [db, currentUser]);

    useEffect(() => {
      if (
        !hasPermission &&
        userData &&
        userData.role !== "Super Admin" &&
        !errorShown
      ) {
        showErrorToast("You do not have permission to access this page.", 2000);
        setErrorShown(true);
      }
    }, [hasPermission, userData, errorShown]);

    // console.log("Current User:", currentUser);

    if (hasPermission || !userData || userData.role === "Super Admin") {
      return children;
    } else {
      return <Navigate to="/home" />;
    }
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-center"
        autoClose={autoCloseTime}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
      />

      <BrowserRouter>
        <Routes>
          {/*------------------ Login Route  ------------------*/}
          {/* <Route path="login" element={<Login />} /> */}

          {/*------------------ Root Route (Login)  ------------------*/}
          <Route path="/">
            {/* Login Route */}
            <Route index element={<Login />} />

            {/*------------------ Home Route  ------------------*/}
            <Route path="home">
              <Route
                index
                element={
                  <RequireAuth>
                    <Home />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Users Route  ------------------*/}
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <UserList />
                  </RequireAuth>
                }
              />
              {/* Users Route (Single) */}
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <SingleUser />
                  </RequireAuth>
                }
              />

              {/* Add New User Route */}
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewUser inputs={userInputs} title="Add New User" />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Product Route (Food) ------------------*/}
            <Route path="products">
              <Route
                index
                element={
                  <RequireAuth>
                    <ProductList />
                  </RequireAuth>
                }
              />

              {/* Product Route (Single) */}
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <SingleProduct />
                  </RequireAuth>
                }
              />

              {/* Product Categories Route */}
              <Route
                path="productCategories"
                index
                element={
                  <RequireAuth>
                    <ProductCategoriesList />
                  </RequireAuth>
                }
              />

              {/* Add New Product Route */}
              <Route
                path="newProduct"
                element={
                  <RequireAuth>
                    <NewProduct
                      inputs={productInputs}
                      title="Add New Product"
                    />
                  </RequireAuth>
                }
              />

              {/* New Food Category Route */}
              <Route
                path="newCategory"
                element={
                  <RequireAuth>
                    <NewProductCategory
                      inputs={productCategoryInputs}
                      title="Add New Category"
                    />
                  </RequireAuth>
                }
              />

              {/* Product Category Route (Single - "Edit") */}
              <Route
                path="productCategories/:categoryId"
                element={
                  <RequireAuth>
                    <SingleProductCategory />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Orders Route ------------------*/}
            <Route path="orders">
              <Route
                index
                element={
                  <RequireAuth>
                    <OrderList />
                  </RequireAuth>
                }
              />

              {/* Order Route (Single) */}
              <Route
                path=":orderId"
                element={
                  <RequireAuth>
                    <SingleOrder />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Sales Report Route  ------------------*/}
            {/* <Route path="salesReport">
              <Route
                index
                element={
                  <RequireAuth>
                    <SalesReport />
                  </RequireAuth>
                }
              />
            </Route> */}
            <Route path="salesReport">
              <Route
                index
                element={
                  <RequireAuth>
                    <RequireSuperAdmin>
                      <SalesReport />
                    </RequireSuperAdmin>
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Notifcation Route  ------------------*/}
            <Route path="notification">
              <Route
                index
                element={
                  <RequireAuth>
                    <NotificationList />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Content Management Route  ------------------*/}
            <Route path="contentManagement">
              <Route
                index
                element={
                  <RequireAuth>
                    <ContentManagement />
                  </RequireAuth>
                }
              />
            </Route>

            {/*------------------ Audit Trail Route  ------------------*/}
            <Route path="auditTrail">
              <Route
                index
                element={
                  <RequireAuth>
                    <RequireSuperAdmin>
                      <AuditTrail />
                    </RequireSuperAdmin>
                  </RequireAuth>
                }
              />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
