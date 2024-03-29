import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
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

  // Retrieve User Order Data
  const [userOrderData, setUserOrderData] = useState([]);
  const getUserOrderData = async () => {
    const docRef = doc(db, "UserOrders", orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserOrderData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getUserOrderData();
  }, []);
  const data = userOrderData.orderData;

  // Change Order Status function
  const changeOrderStatus = async (id, orderData, status) => {
    const docRef = doc(db, "UserOrders", id);
    const data = {
      ...orderData,
      orderStatus: status,
    };

    // When order status is prepared, reduce the stock of each product
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
    if (status === "Delivered" || status === "Order Picked up") {
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

      // Update paymentStatus to "Paid" and add thankYouModalDisplayed field with value false
      data.paymentStatus = "Paid";
      data.thankYouModalDisplayed = false;
    }

    try {
      await setDoc(docRef, data);
      showSuccessToast("Order Status is updated!");
    } catch (error) {
      showErrorToast("Error writing document: ", error);
    }

    getUserOrderData();
  };

  // Proof of Payment Issue drop down function
  const handleProofOfPaymentIssue = async (selectedValue) => {
    const docRef = doc(db, "UserOrders", orderId);
    try {
      await updateDoc(docRef, { proofOfPaymentIssue: selectedValue });
      setUserOrderData((prevState) => ({
        ...prevState,
        proofOfPaymentIssue: selectedValue,
      }));
      showSuccessToast("Proof of Payment Issue is updated!");
    } catch (error) {
      showErrorToast("Error updating document: ", error);
    }
  };

  // Order status class name
  const orderStatusClassName = `itemValue ${
    userOrderData.orderStatus
      ? userOrderData.orderStatus.replace(/\s/g, "-")
      : ""
  }`;

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

                {/*------------------ Pick Up Time ------------------*/}
                {userOrderData.orderPayment === "Cash On Pickup" && (
                  <div className="detailItem">
                    <span className="itemKey">Pick Up Time:</span>
                    <span className="itemValue">
                      {userOrderData.orderPickUpTime}
                    </span>
                  </div>
                )}

                {/*------------------ Total Cost ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Total Cost:</span>
                  <span className="itemValue">
                    ₱
                    {parseFloat(userOrderData.orderTotalCost)
                      .toFixed(2)
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
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

                {/*------------------ Delivery Rider ------------------*/}
                {userOrderData.deliveryRiderName != null && (
                  <div className="detailItem">
                    <span className="itemKey">Delivery Rider:</span>
                    <span className="itemValue">
                      {userOrderData.deliveryRiderName}
                    </span>
                  </div>
                )}

                {/*------------------ Order Status ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Order Status:</span>
                  {userOrderData.orderStatus !== "Cancelled" &&
                  userOrderData.orderStatus !== "Delivered" &&
                  userOrderData.orderStatus !== "Order Picked up" ? (
                    <select
                      onChange={(e) =>
                        changeOrderStatus(
                          userOrderData.orderId,
                          userOrderData,
                          e.target.value
                        )
                      }
                      value={userOrderData.orderStatus}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Prepared">Prepared</option>
                      {userOrderData.orderPayment === "Cash On Pickup" && (
                        <>
                          <option value="Ready for Pickup">
                            Ready for Pickup
                          </option>
                          <option value="Order Picked up">
                            Order Picked up
                          </option>
                        </>
                      )}
                      {userOrderData.orderPayment !== "Cash On Pickup" && (
                        <>
                          <option value="Delivery">Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </>
                      )}
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span className={orderStatusClassName}>
                      {userOrderData.orderStatus}
                    </span>
                  )}
                </div>

                {/*------------------ Reason for Cancellation (Rider) ------------------*/}
                {userOrderData.cancellationReason && (
                  <div className="detailItem">
                    <span className="itemKey">
                      Reason for Cancellation (Rider):
                    </span>
                    <span className="itemValue">
                      {userOrderData.cancellationReason}
                    </span>
                  </div>
                )}

                {/*------------------ settlement Options ------------------*/}
                {userOrderData.settlementOptions && (
                  <div className="detailItem">
                    <span className="itemKey">Settlement Options:</span>
                    <span className="itemValue">
                      {userOrderData.settlementOptions}
                    </span>
                  </div>
                )}

                {/*------------------ Proof of Payment Issue ------------------*/}
                {userOrderData.proofOfPaymentURL != null &&
                userOrderData.orderPayment === "GCash" &&
                userOrderData.orderStatus !== "Cancelled" &&
                userOrderData.orderStatus !== "Delivered" &&
                userOrderData.orderStatus !== "Confirmed" &&
                userOrderData.orderStatus !== "Prepared" ? (
                  <div className="detailItem">
                    <span className="itemKey">
                      Proof of Payment Issue:&nbsp;
                    </span>
                    <select
                      onChange={(e) =>
                        handleProofOfPaymentIssue(e.target.value)
                      }
                      value={userOrderData.proofOfPaymentIssue || ""}
                    >
                      <option value="" disabled>
                        ---Select---
                      </option>
                      <option value="Insufficient Payment Amount">
                        Insufficient Payment Amount
                      </option>
                      <option value="Invalid Proof of Payment">
                        Invalid Proof of Payment
                      </option>
                    </select>
                  </div>
                ) : (
                  userOrderData.proofOfPaymentIssue && (
                    <div className="detailItem">
                      <span className="itemKey">
                        Proof of Payment Issue:&nbsp;
                      </span>
                      <span className="itemValue">
                        {userOrderData.proofOfPaymentIssue}
                      </span>
                    </div>
                  )
                )}

                {/*------------------ Proof of Payment ------------------*/}
                {userOrderData.proofOfPaymentURL != null &&
                  userOrderData.orderPayment === "GCash" && (
                    <div className="detailItem">
                      <span className="itemKey">Proof of Payment:</span>
                      {userOrderData.proofOfPaymentURL.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Proof of Payment ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
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
      </div>
    </div>
  );
};

export default SingleOrder;
