import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs, productCategoryInputs } from "./formSource";
import { AuthContext } from "./context/AuthContext";
import { useContext, useState } from "react";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import UserList from "./pages/list/UserList"; //USER LIST
import ProductList from "./pages/list/ProductList"; //PRODUCT LIST
import OrderList from "./pages/list/OrderList"; //ORDER LIST
import ProductCategoriesList from "./pages/list/ProductCategoriesList"; //PRODUCT CATEGORIES LIST
import NewUser from "./pages/new/NewUser"; //ADDING NEW USER
import NewProduct from "./pages/new/NewProduct"; //ADDING NEW PRODUCTS
import NewProductCategory from "./pages/new/NewProductCategory"; //ADDING NEW FOOD CATEGORY
import SingleUser from "./pages/single/SingleUser"; //SINGLE USER
import SingleProduct from "./pages/single/SingleProduct"; //SINGLE PRODUCT
import SingleOrder from "./pages/single/SingleOrder"; //SINGLE ORDER
import SingleProductCategory from "./pages/single/SingleProductCategory"; //SINGLE PRODUCT CATEGORY

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
          {/*------------------ Login Route  ------------------*/}
          <Route path="login" element={<Login />} />

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
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
