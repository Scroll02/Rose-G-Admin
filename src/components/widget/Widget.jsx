import "./widget.scss";
import KeyboardArrowUpRoundedIcon from "@mui/icons-material/KeyboardArrowUpRounded";
import Person2RoundedIcon from "@mui/icons-material/Person2Rounded";
import BorderColorRoundedIcon from "@mui/icons-material/BorderColorRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const Widget = ({ type }) => {
  const [amount, setAmount] = useState(null);
  const [diff, setDiff] = useState(null);

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
    case "order":
      data = {
        title: "ORDERS",
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

    default:
      break;
  }

  useEffect(() => {
    const fetchData = async () => {
      // Date
      const today = new Date();
      const lastMonth = new Date(new Date().setMonth(today.getMonth() - 1));
      const prevMonth = new Date(new Date().setMonth(today.getMonth() - 2));

      // Queries
      const lastMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", today),
        where("timeStamp", ">", lastMonth)
      );
      const prevMonthQuery = query(
        collection(db, data.query),
        where("timeStamp", "<=", lastMonth),
        where("timeStamp", ">", prevMonth)
      );
      const allItemsQuery = query(collection(db, data.query));

      // Data
      const lastMonthData = await getDocs(lastMonthQuery);
      const prevMonthData = await getDocs(prevMonthQuery);
      const allItemsData = await getDocs(allItemsQuery);

      // setAmount(lastMonthData.docs.length);
      setAmount(allItemsData.docs.length);
      if (prevMonthData.docs.length === 0) {
        // Handle the case when prevMonthData has no documents
        setDiff(0); // or set to NaN, Infinity, or a custom error message
      } else {
        const percentageChange =
          ((lastMonthData.docs.length - prevMonthData.docs.length) /
            prevMonthData.docs.length) *
          100;
        setDiff(percentageChange);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
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
