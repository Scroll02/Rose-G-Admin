import { useState, useEffect } from "react";
import { orderColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Modal
import ConfirmationModal from "../modal/ConfirmationModal";

// Firebase
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Toast
import { showErrorToast } from "../toast/Toast";

const OrderTable = ({ datatableTitle }) => {
  const [data, setData] = useState([]);
  const [todaysData, setTodaysData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("orderFirstName");

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

  // Filtering by date
  const filterOrdersByDate = (orders) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sortedOrders = orders.sort((a, b) => {
      const dateA = new Date(a.orderDate?.seconds * 1000);
      const dateB = new Date(b.orderDate?.seconds * 1000);
      return dateB - dateA;
    });
    const filteredOrders = sortedOrders.filter((order) => {
      if (!order.orderDate) return false;
      const orderDate = new Date(order.orderDate.seconds * 1000);
      orderDate.setHours(0, 0, 0, 0);
      const matchesSearchValue =
        order.orderId?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
        order.orderFirstName
          .toLowerCase()
          .includes(searchValue.toLowerCase()) ||
        order.orderPayment.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.orderLastName.toLowerCase().includes(searchValue.toLowerCase()) ||
        order.orderTotalCost.toString().includes(searchValue) ||
        (selectedColumn === "orderDate" &&
          orderDate
            .toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              second: "numeric",
            })
            .toLowerCase()
            .includes(searchValue.toLowerCase())) ||
        order.orderStatus.toLowerCase().includes(searchValue.toLowerCase());

      return orderDate.getTime() === today.getTime() && matchesSearchValue;
    });
    return filteredOrders;
  };

  // Filter orders by today's date and store it in todaysData state
  useEffect(() => {
    const filteredData = filterOrdersByDate(data);
    setTodaysData(filteredData);
  }, [data, searchValue]);

  // Delete Function
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "UserOrders", selectedOrderId));
      setData(data.filter((item) => item.id !== selectedOrderId));
      showErrorToast("Order is deleted", 1000);
    } catch (err) {
      console.log(err);
    }
  };

  //  Sort Date Drop Down
  const [sortByDate, setSortByDate] = useState("Today");
  const [selectedDate, setSelectedDate] = useState("");
  // Update todaysData and data based on the selected date
  useEffect(() => {
    if (sortByDate === "Today") {
      setSelectedDate(todaysData);
    } else if (sortByDate === "All Data") {
      setSelectedDate(data);
    }
  }, [selectedDate, data, todaysData]);

  // Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  // Search handler
  const handleSearch = (event) => {
    setSearchValue(event.target.value);
  };
  const handleColumnSelect = (event) => {
    setSelectedColumn(event.target.value);
  };

  // Search Filtering
  const searchFiltered = data.filter((order) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    switch (selectedColumn) {
      case "orderId":
        return order.orderId?.toLowerCase()?.includes(lowerCaseSearchValue);
      case "orderFirstName":
        return order.orderFirstName
          .toLowerCase()
          .includes(lowerCaseSearchValue);
      case "orderLastName":
        return order.orderLastName.toLowerCase().includes(lowerCaseSearchValue);
      case "orderPayment":
        return order.orderPayment.toLowerCase().includes(lowerCaseSearchValue);
      case "orderTotalCost":
        return order.orderTotalCost.toString().includes(searchValue);
      case "orderDate":
        const orderDate = new Date(order.orderDate.seconds * 1000);
        const formattedDate = orderDate.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });
        return formattedDate.toLowerCase().includes(lowerCaseSearchValue);
      case "orderStatus":
        return order.orderStatus.toLowerCase().includes(lowerCaseSearchValue);
      default:
        return true; // No column selected, show all data
    }
  });

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div className="datatableHeader">
          <label>{datatableTitle}</label>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
            />
            <select value={selectedColumn} onChange={handleColumnSelect}>
              <option value="orderId">Order ID</option>
              <option value="orderFirstName">First Name</option>
              <option value="orderLastName">Last Name</option>
              <option value="orderPayment">Order Payment</option>
              <option value="orderTotalCost">Total Cost</option>
              <option value="orderDate">Order Date</option>
              <option value="orderStatus">Order Status</option>
            </select>
            <SearchRoundedIcon />
          </div>
        </div>

        <select onChange={(e) => setSortByDate(e.target.value)}>
          <option disabled>---Date---</option>
          <option value="Today">Today</option>
          <option value="All Data">All Data</option>
        </select>
      </div>

      <DataGrid
        className="datagrid"
        rows={sortByDate === "Today" ? todaysData : searchFiltered}
        // columns={orderColumns.concat(actionColumn)}
        columns={orderColumns.concat([
          {
            field: "action",
            headerName: "Action",
            width: 220,
            renderCell: (params) => {
              return (
                <div className="cellAction">
                  <Link
                    to={`/orders/${params.row.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="viewButton">
                      <VisibilityIcon />
                      <span>View</span>
                    </div>
                  </Link>
                  <div
                    className="deleteButton"
                    onClick={() => {
                      setSelectedOrderId(params.row.id);
                      setShowConfirmationModal(true);
                    }}
                  >
                    <DeleteForeverIcon />
                  </div>
                </div>
              );
            },
          },
        ])}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
      />

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <ConfirmationModal
          handleDelete={handleDelete}
          closeConfirmationModal={closeConfirmationModal}
        />
      )}
    </div>
  );
};

export default OrderTable;
