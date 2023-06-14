import "./widget.scss";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import { useEffect, useState } from "react";
import moment from "moment";

// Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);
  const [pendingOrders, setPendingOrders] = useState(null);

  let data;

  switch (type) {
    case "user":
      data = {
        title: "USERS",
        isMoney: false,
        query: "UserData",
        link: (
          <a href="/users" style={{ textDecoration: "none" }}>
            View all users
          </a>
        ),
        icon: (
          <a href="/users" style={{ textDecoration: "none" }}>
            <Person2RoundedIcon
              className="icon"
              style={{ backgroundColor: "#BCC99B", color: "green" }}
            />
          </a>
        ),
      };
      break;
    case "product":
      data = {
        title: "PRODUCT",
        isMoney: false,
        query: "ProductData",
        link: (
          <a href="/products" style={{ textDecoration: "none" }}>
            View all products
          </a>
        ),
        icon: (
          <a href="/products" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#C26522", color: "#332211" }}
            />
          </a>
        ),
      };
      break;
    case "earnings":
      data = {
        title: "EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <PaidRoundedIcon
            className="icon"
            style={{ backgroundColor: "#E3686B", color: "#451926" }}
          />
        ),
      };
      break;
    case "orderPending":
      data = {
        title: "PENDING ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderConfirmed":
      data = {
        title: "CONFIRMED ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderPrepared":
      data = {
        title: "PREPARED ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderDelivery":
      data = {
        title: "DELIVERY/PICKUP ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderCompleted":
      data = {
        title: "COMPLETED ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderCancelled":
      data = {
        title: "CANCELLED ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <LocalDiningRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
      // Order Widget and Earning Widget
      {
        // case "order":
        //   data = {
        //     title: "ORDERS",
        //     isMoney: false,
        //     query: "UserOrders",
        //     link: (
        //       <a href="/orders" style={{ textDecoration: "none" }}>
        //         View all orders
        //       </a>
        //     ),
        //     icon: (
        //       <a href="/orders" style={{ textDecoration: "none" }}>
        //         <BorderColorRoundedIcon
        //           className="icon"
        //           style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
        //         />
        //       </a>
        //     ),
        //   };
        //   break;
      }

    default:
      break;
  }

  // Display data for today UserOrders
  useEffect(() => {
    // Get the current date
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const startOfDay = new Date(year, month - 1, day, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59);
    // Query
    let queryRef;
    if (type === "orderPending") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Pending"),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else if (type === "orderConfirmed") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Confirmed"),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else if (type === "orderPrepared") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Prepared"),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else if (type === "orderDelivery") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "in", ["Delivery", "Ready for Pickup"]),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else if (type === "orderCompleted") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "in", ["Delivered", "Order Picked up"]),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else if (type === "orderCancelled") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Cancelled"),
        where("orderDate", ">=", startOfDay),
        where("orderDate", "<=", endOfDay)
      );
    } else {
      queryRef = null;
    }

    // Real-time listener
    const unsubscribe =
      queryRef &&
      onSnapshot(queryRef, (snapshot) => {
        setAmount(snapshot.size);
      });

    return () => {
      // Unsubscribe from the real-time listener when the component unmounts
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.title === "PENDING ORDERS" && pendingOrders !== null ? (
            `${pendingOrders}`
          ) : (
            <>
              {data.isMoney && "₱"} {amount}
            </>
          )}
        </span>
        <span className="link">{data.link}</span>
      </div>
      <div className="right">
        {/* <div className="percentage positive">
          <KeyboardArrowUpRoundedIcon />
          {diff} %
        </div> */}
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
