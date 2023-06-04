import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";

import { useState, useEffect } from "react";
import {
  doc,
  collection,
  setDoc,
  addDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import moment from "moment";

// Toast
import { showSuccessToast, showErrorToast } from "../../components/toast/Toast";

const SingleOrder = () => {
  const { orderId } = useParams();
  // console.log(orderId);

  //------------------ Retrieve User Order Data ------------------//
  const [userOrderData, setUserOrderData] = useState([]);
  const getUserOrderData = async () => {
    const docRef = doc(db, "UserOrders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: ", docSnap.data());
      setUserOrderData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getUserOrderData();
  }, []);

  //------------------- Change Order Status -------------------//
  // const changeOrderStatus = async (id, orderData, status) => {
  //   const docRef = doc(db, "UserOrders", id);
  //   const data = {
  //     ...orderData,
  //     orderStatus: status,
  //   };

  //   // When order status is confirmed, reduce the stock of each product
  //   if (status === "Prepared") {
  //     const orderItems = orderData.orderData;

  //     for (const item of orderItems) {
  //       const productRef = doc(collection(db, "ProductData"), item.productId);
  //       const productDoc = await getDoc(productRef);

  //       if (productDoc.exists()) {
  //         const productData = productDoc.data();
  //         let currentStock =
  //           productData.currentStock || productData.initialStock;

  //         if (item.productQty > currentStock) {
  //           showErrorToast("Product quantity exceeds current stock.");
  //           return;
  //         }

  //         currentStock -= item.productQty;
  //         await updateDoc(productRef, { currentStock });
  //       }
  //     }
  //   }

  //   // When order status is delivered, update totalSold for each product
  //   if (status === "Delivered") {
  //     const orderItems = orderData.orderData;

  //     for (const item of orderItems) {
  //       const productRef = doc(collection(db, "ProductData"), item.productId);
  //       const productDoc = await getDoc(productRef);

  //       if (productDoc.exists()) {
  //         const productData = productDoc.data();
  //         const totalSold = (productData.totalSold || 0) + item.productQty;
  //         await updateDoc(productRef, { totalSold });
  //       }
  //     }
  //   }

  //   try {
  //     await setDoc(docRef, data);
  //     showSuccessToast("Order Status is updated!");
  //   } catch (error) {
  //     showErrorToast("Error writing document: ", error);
  //   }

  //   getUserOrderData();
  // };
  const changeOrderStatus = async (id, orderData, status) => {
    const docRef = doc(db, "UserOrders", id);
    const data = {
      ...orderData,
      orderStatus: status,
    };

    // When order status is confirmed, reduce the stock of each product
    if (status === "Prepared") {
      const orderItems = orderData.orderData;

      for (const item of orderItems) {
        const productRef = doc(collection(db, "ProductData"), item.productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();
          let currentStock =
            productData.currentStock || productData.initialStock;

          if (item.productQty > currentStock) {
            showErrorToast("Product quantity exceeds current stock.");
            return;
          }

          currentStock -= item.productQty;
          await updateDoc(productRef, { currentStock });
        }
      }
    }

    // When order status is delivered, update totalSold for each product and set paymentStatus to "Paid"
    if (status === "Delivered") {
      const orderItems = orderData.orderData;

      for (const item of orderItems) {
        const productRef = doc(collection(db, "ProductData"), item.productId);
        const productDoc = await getDoc(productRef);

        if (productDoc.exists()) {
          const productData = productDoc.data();
          const totalSold = (productData.totalSold || 0) + item.productQty;
          await updateDoc(productRef, { totalSold });
        }
      }

      // Update paymentStatus to "Paid"
      data.paymentStatus = "Paid";
    }

    try {
      await setDoc(docRef, data);
      showSuccessToast("Order Status is updated!");
    } catch (error) {
      showErrorToast("Error writing document: ", error);
    }

    getUserOrderData();
  };

  //------------------- Change Delivery Rider Name -------------------//
  const changeDeliveryRiderInfo = (id, orderdata, riderInfo) => {
    console.log(id, orderdata, riderInfo);
    const docRef = doc(db, "UserOrders", id);
    const data = {
      ...orderdata,
      deliveryRiderInfo: riderInfo,
    };
    setDoc(docRef, data)
      .then(() => {
        showSuccessToast("Delivery Rider is assigned!");
      })
      .catch((error) => {
        showErrorToast("Error writing document: ", error);
      });
    getUserOrderData();
  };

  const data = userOrderData.orderData;
  // console.log(typeof data);

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {/* <div className="editButton">Save</div> */}
            <h1 className="title">Orders Details</h1>
            <div className="item">
              <div className="details">
                {/*------------------ Order ID ------------------*/}
                <h1 className="itemTitle">Order ID: {userOrderData.orderId}</h1>

                {/*------------------ Full Name ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Customer Full Name:</span>
                  <span className="itemValue">
                    {userOrderData.orderFirstName}&nbsp;
                    {userOrderData.orderLastName}
                  </span>
                </div>

                {/*------------------ Payment ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Payment:</span>
                  <span className="itemValue">
                    {userOrderData.orderPayment}
                  </span>
                </div>

                {/*------------------ Total Cost ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Total Cost:</span>
                  <span className="itemValue">
                    ₱{parseFloat(userOrderData.orderTotalCost).toFixed(2)}
                  </span>
                </div>

                {/*------------------ Order Date ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Order Date:</span>
                  <span className="itemValue">
                    {moment(userOrderData.orderDate?.toDate()).format(
                      "MMM D, YYYY h:mm A"
                    )}
                  </span>
                </div>

                {/*------------------ Payment Status ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Payment Status:</span>
                  <span className="itemValue">
                    {userOrderData.paymentStatus}
                  </span>
                </div>

                {/*------------------ Order Status ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Order Status:</span>
                  {/*------------------ Pending ------------------*/}
                  {userOrderData.orderStatus === "Pending" && (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                  {/*------------------ Confirmed ------------------*/}
                  {userOrderData.orderStatus === "Confirmed" && (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                  {/*------------------ Prepared ------------------*/}
                  {userOrderData.orderStatus === "Prepared" && (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="Prepared">Prepared</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                  {/*------------------ Delivery ------------------*/}
                  {userOrderData.orderStatus === "Delivery" && (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="Delivery">Delivery</option>
                      <option value="Pending">Pending</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                  {/*------------------ Delivered ------------------*/}
                  {userOrderData.orderStatus === "Delivered" && (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="Delivered">Delivered</option>
                      <option value="Prepared">Prepared</option>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Delivery">Delivery</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  )}
                  {/*------------------ Cancelled ------------------*/}
                  {userOrderData.orderStatus === "Cancelled" && (
                    <span className="itemValue">
                      {userOrderData.orderStatus}
                    </span>
                  )}
                </div>

                {/*------------------ Delivery Rider & Contact Number ------------------*/}
                {/* <div className="detailItem">
                  <span className="itemKey">
                    Delivery Rider & Contact Number:
                  </span>
                  {userOrderData.deliveryRiderInfo ? (
                    <span className="itemValue">
                      {userOrderData.deliveryRiderInfo}
                    </span>
                  ) : (
                    <select
                      onChange={(e) =>
                        changeDeliveryRiderInfo(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                    >
                      <option value="">-------</option>
                      <option value="Desir Arman - 09123456789">
                        Desir Arman - 09123456789
                      </option>
                      <option value="Pram Schneider - 09245794122">
                        Pram Schneider - 09245794122
                      </option>
                    </select>
                  )}
                </div> */}
              </div>
            </div>
          </div>
          <div className="right">
            {/*------------------ Order Summary ------------------*/}
            <div className="orderSummaryContainer">
              <div className="orderSummary">
                <h2 className="title">Order Summary:</h2>
                <table className="orderTable">
                  <thead>
                    <tr>
                      <th>Quantity</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.values(Object(data)).map((item, index) => (
                      <tr key={index}>
                        <td>{item.productQty}x</td>
                        <td>{item.productName}</td>
                        <td>₱{parseFloat(item.price).toFixed(2)}</td>
                        <td>
                          ₱{parseFloat(item.productQty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div> */}
      </div>
    </div>
  );
};

export default SingleOrder;
