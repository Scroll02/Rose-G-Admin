import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import moment from "moment";
import UserDarkIcon from "../../images/user-dark.png";

// Firebase
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Toast
import { showErrorToast } from "../toast/Toast";

const LatestTransaction = () => {
  const rows = [
    {
      id: 1143155,
      product: "Acer Nitro 5",
      img: "https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 785,
      method: "Cash on Delivery",
      status: "Approved",
    },
    {
      id: 2235235,
      product: "Playstation 5",
      img: "https://m.media-amazon.com/images/I/31JaiPXYI8L._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Michael Doe",
      date: "1 March",
      amount: 900,
      method: "Online Payment",
      status: "Pending",
    },
    {
      id: 2342353,
      product: "Redragon S101",
      img: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "John Smith",
      date: "1 March",
      amount: 35,
      method: "Cash on Delivery",
      status: "Pending",
    },
    {
      id: 2357741,
      product: "Razer Blade 15",
      img: "https://m.media-amazon.com/images/I/71wF7YDIQkL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Jane Smith",
      date: "1 March",
      amount: 920,
      method: "Online",
      status: "Approved",
    },
    {
      id: 2342355,
      product: "ASUS ROG Strix",
      img: "https://m.media-amazon.com/images/I/81hH5vK-MCL._AC_UY327_FMwebp_QL65_.jpg",
      customer: "Harold Carol",
      date: "1 March",
      amount: 2000,
      method: "Online",
      status: "Pending",
    },
  ];

  const [data, setData] = useState([]);
  const [todaysData, setTodaysData] = useState([]);

  //------------------ Retrieve User Orders Data ------------------//
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "UserOrders"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);
  // console.log(data);

  // Filter orders by today's date
  const filterOrdersByDate = (orders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter((order) => {
      if (!order.orderDate) return false;
      const orderDate = new Date(order.orderDate.seconds * 1000);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  };

  // Filter orders by today's date and store it in todaysData state
  useEffect(() => {
    const filteredData = filterOrdersByDate(data);
    setTodaysData(filteredData);
  }, [data]);

  return (
    <TableContainer component={Paper} className="table">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="tableCell">Order ID</TableCell>
            <TableCell className="tableCell">Customer</TableCell>
            <TableCell className="tableCell">Date</TableCell>
            <TableCell className="tableCell">Amount</TableCell>
            <TableCell className="tableCell">Payment Method</TableCell>
            <TableCell className="tableCell">Status</TableCell>
            <TableCell className="tableCell">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todaysData.map((row) => (
            <TableRow key={row.orderId}>
              {/* Order ID */}
              <TableCell className="tableCell"> {row.orderId} </TableCell>

              {/* Customer */}
              <TableCell className="tableCell">
                <div className="cellWrapper">
                  <img
                    src={row.profileImgUrl || UserDarkIcon}
                    alt=""
                    className="image"
                  />
                  <label>{`${row.orderFirstName} ${row.orderLastName}`}</label>
                </div>
                {/* <div className="cellWrapper">
                  <img
                    src={row.profileImgUrl || UserDarkIcon}
                    alt=""
                    className="image"
                  />
                  <label>{`${row.orderFirstName} ${row.orderLastName}`}</label>
                </div> */}
              </TableCell>

              {/* Order Date */}
              <TableCell className="tableCell">
                {moment(row.orderDate.toDate()).format("MMM D, YYYY h:mm A")}
              </TableCell>

              {/* Order Total Amount */}
              <TableCell className="tableCell">
                ₱
                {parseFloat(row.orderTotalCost)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </TableCell>

              {/* Order Payment Method */}
              <TableCell className="tableCell">{row.orderPayment}</TableCell>

              {/* Order Status */}
              <TableCell className="tableCell">
                <span className={`status ${row.status}`}>
                  {row.orderStatus}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LatestTransaction;
