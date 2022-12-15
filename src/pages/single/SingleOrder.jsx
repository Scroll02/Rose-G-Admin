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
import { Link, useParams } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import moment from "moment";

const SingleOrder = () => {
  const { orderId } = useParams();
  // console.log(orderId);

  //------------------ Rertrieve Food Data  ------------------//
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
  // console.log(userOrderData);

  //------------------- Change Order Status -------------------//
  const changeOrderStatus = (id, orderdata, status) => {
    const docRef = doc(db, "UserOrders", id);
    const data = {
      ...orderdata,
      orderStatus: status,
    };
    setDoc(docRef, data)
      .then(() => {
        alert("Document successfully updated!");
      })
      .catch((error) => {
        alert("Error writing document: ", error);
      });
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
        alert("Document successfully written!");
      })
      .catch((error) => {
        alert("Error writing document: ", error);
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
                {/* <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Food Name"
                  onChange={(e) => setNewFoodName(e.target.value)}
                /> */}

                {/*------------------ Full Name ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Customer Full Name:</span>
                  <span className="itemValue">
                    {userOrderData.orderFullName}
                  </span>
                </div>

                {/*------------------ Payment ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Payment:</span>
                  <span className="itemValue">
                    {userOrderData.orderPayment}
                  </span>
                </div>

                {/*------------------ Change For ------------------*/}
                {userOrderData.changeFor == undefined ||
                userOrderData.changeFor == "" ? (
                  <div className="detailItem"></div>
                ) : (
                  <div className="detailItem">
                    <span className="itemKey">Change For:</span>
                    <span className="itemValue">
                      ₱{parseFloat(userOrderData.changeFor).toFixed(2)}
                    </span>
                  </div>
                )}

                {/*------------------ Total Cost ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Total Cost:</span>
                  <span className="itemValue">
                    ₱{parseFloat(userOrderData.orderTotalCost).toFixed(2)}
                  </span>
                </div>

                {/*------------------ Total Cost ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Order Date:</span>
                  <span className="itemValue">
                    {moment(userOrderData.orderDate?.toDate()).format(
                      "MMM D, YYYY h:mm A"
                    )}
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
                <div className="detailItem">
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
                </div>

                {/*------------------ Order Summary ------------------*/}
                <span
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    color: "#555",
                  }}
                >
                  Order Summary:
                </span>
                {Object.values(Object(data)).map((item, index) => {
                  return (
                    <div style={{ flex: 2, fontSize: 17 }} key={index}>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          marginTop: 10,
                        }}
                      >
                        <span>{item.foodQty}x&nbsp;</span>
                        <span>{item.data?.foodName}</span>
                        <span>₱{parseFloat(item.data?.price).toFixed(2)}</span>
                        <span>
                          ₱
                          {parseFloat(item.foodQty * item.data?.price).toFixed(
                            2
                          )}
                        </span>
                      </div>
                      {item.addOnQty != 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-around",
                            marginTop: 10,
                          }}
                        >
                          <span className="itemKey">{item.addOnQty}x </span>
                          <span className="itemValue">{item.data?.addOn}</span>
                          <span className="itemValue">
                            ₱{parseFloat(item.data?.addOnPrice).toFixed(2)}
                          </span>
                          <span className="itemValue">
                            ₱
                            {parseFloat(
                              item.addOnQty * item.data?.addOnPrice
                            ).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* <div className="right">
            //<Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" /> 
          </div> */}
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
