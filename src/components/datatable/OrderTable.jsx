import { useState, useEffect } from "react";
import { orderColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

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

  // Drop Down Sort Date
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

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {datatableTitle}

        <select onChange={(e) => setSortByDate(e.target.value)}>
          <option disabled>---Date---</option>
          <option value="Today">Today</option>
          <option value="All Data">All Data</option>
        </select>
      </div>

      <DataGrid
        className="datagrid"
        rows={sortByDate === "Today" ? todaysData : data}
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
