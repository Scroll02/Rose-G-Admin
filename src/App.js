import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List"; //*USER LIST
import Single from "./pages/single/Single";
import New from "./pages/new/New"; //*ADDING NEW USER
import NewProduct from "./pages/new/NewProduct"; //*ADDING NEW PRODUCTS
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import ProductList from "./pages/list/ProductList"; //*PRODUCT LIST
import OrderList from "./pages/list/OrderList";
import { AuthContext } from "./context/AuthContext";
import { useContext, useState } from "react";
import SingleProduct from "./pages/single/SingleProduct";
import SingleOrder from "./pages/single/SingleOrder";

function App() {
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  console.log(currentUser);
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/*------------------ Home Route  ------------------*/}
          <Route path="/">
            <Route
              index
              element={
                <RequireAuth>
                  <Home />
                </RequireAuth>
              }
            />

            {/*------------------ Login Route  ------------------*/}
            <Route path="login" element={<Login />} />

            {/*------------------ Users Route  ------------------*/}
            <Route path="users">
              <Route
                index
                element={
                  <RequireAuth>
                    <List />
                  </RequireAuth>
                }
              />
              {/*------------------ Users Route (Single)  ------------------*/}
              <Route
                path=":userId"
                element={
                  <RequireAuth>
                    <Single />
                  </RequireAuth>
                }
              />

              {/*------------------ Add New User Route  ------------------*/}
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <New inputs={userInputs} title="Add New User" />
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

              {/*------------------ Product Route (Single) ------------------*/}
              <Route
                path=":productId"
                element={
                  <RequireAuth>
                    <SingleProduct />
                  </RequireAuth>
                }
              />

              {/*------------------ Add New Product/Food Route  ------------------*/}
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewProduct
                      inputs={productInputs}
                      title="Add New Product"
                    />
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

              {/*------------------ Order Route (Single) ------------------*/}
              <Route
                path=":orderId"
                element={
                  <RequireAuth>
                    <SingleOrder />
                  </RequireAuth>
                }
              />

              {/*------------------ Add New Product/Food Route  ------------------*/}
              <Route
                path="new"
                element={
                  <RequireAuth>
                    <NewProduct
                      inputs={productInputs}
                      title="Add New Product"
                    />
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
