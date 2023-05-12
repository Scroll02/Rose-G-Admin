import "./widget.scss";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import { useEffect, useState } from "react";
import moment from "moment";

// Firebase
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  startAt,
  endAt,
} from "firebase/firestore";

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
            <BorderColorRoundedIcon
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
            <BorderColorRoundedIcon
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
            <BorderColorRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderDelivery":
      data = {
        title: "DELIVERY ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <BorderColorRoundedIcon
              className="icon"
              style={{ backgroundColor: "#E8B0AF", color: "#742a40" }}
            />
          </a>
        ),
      };
      break;
    case "orderDelivered":
      data = {
        title: "DELIVERED ORDERS",
        isMoney: false,
        query: "UserOrders",
        link: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            View all orders
          </a>
        ),
        icon: (
          <a href="/orders" style={{ textDecoration: "none" }}>
            <BorderColorRoundedIcon
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
            <BorderColorRoundedIcon
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

  useEffect(() => {
    // Get the start and end of today in UTC
    const startOfDayUtc = moment().utc().startOf("day");
    const endOfDayUtc = moment().utc().endOf("day");

    // Format the start and end of today in a format that Firestore can understand
    const startOfDayUtcFormatted = startOfDayUtc.format("YYYY-MM-DDTHH:mm:ss");
    const endOfDayUtcFormatted = endOfDayUtc.format("YYYY-MM-DDTHH:mm:ss");

    // Queries
    let queryRef;
    if (type === "user") {
      queryRef = query(collection(db, data.query));
    } else if (type === "product") {
      queryRef = query(collection(db, data.query));
    } else if (type === "orderPending") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Pending")
      );
    } else if (type === "orderConfirmed") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Confirmed")
      );
    } else if (type === "orderPrepared") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Prepared")
      );
    } else if (type === "orderDelivery") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Delivery")
      );
    } else if (type === "orderDelivered") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Delivered")
      );
    } else if (type === "orderCancelled") {
      queryRef = query(
        collection(db, data.query),
        where("orderStatus", "==", "Cancelled")
      );
    } else {
      queryRef = null;
    }

    // Fetching data based on query
    const fetchData = async () => {
      if (type === "user") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "product") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderPending") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderConfirmed") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderPrepared") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderDelivery") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderDelivered") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else if (type === "orderCancelled") {
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      } else {
        // Default data fetch
        const queryData = await getDocs(queryRef);
        setAmount(queryData.docs.length);
      }
    };

    fetchData();
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
