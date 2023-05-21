import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

// Firebase
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { deleteObject, ref } from "firebase/storage";

// Toast
import { showErrorToast, showSuccessToast } from "../toast/Toast";

// Modal
import ConfirmationModal from "../modal/ConfirmationModal";

const UserTable = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("firstName");

  //------------------ Retrieve Users Data ------------------//
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "UserData"), (snapShot) => {
      setData(snapShot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // console.log(data);

  //------------------ Delete User Data  ------------------//
  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleDelete = async () => {
    try {
      const user = data.find((item) => item.id === selectedUserId);
      if (user.profileImageUrl) {
        const storageRef = ref(storage, user.profileImageUrl);
        await deleteObject(storageRef);
      }

      await deleteDoc(doc(db, "UserData", selectedUserId));
      setData(data.filter((item) => item.id !== selectedUserId));
      showSuccessToast("User data is successfully deleted", 2000);
    } catch (err) {
      console.log(err);
      showErrorToast("Error deleting user", 2000);
    }
  };

  // This delete function, deletes data from firestore database and authentication
  // const handleDelete = async (id, email) => {
  //   try {
  //     const user = auth.currentUser;

  //     if (user && user.email === email) {
  //       // Delete the user's authentication identifier
  //       await auth.deleteUser(user);

  //       // Delete the user's data in Firestore
  //       await deleteDoc(doc(db, "UserData", id));

  //       setData(data.filter((item) => item.id !== id));
  //       showErrorToast("User data is deleted", 1000);
  //     } else {
  //       showErrorToast("You are not authorized to delete this user", 1000);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // Modal

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

  // Filter the data based on the search value
  const filteredData = data.filter((user) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    switch (selectedColumn) {
      case "uid":
        return user.uid?.toLowerCase()?.includes(lowerCaseSearchValue);
      case "firstName":
        return user.firstName.toLowerCase().includes(lowerCaseSearchValue);
      case "lastName":
        return user.lastName.toLowerCase().includes(lowerCaseSearchValue);
      case "email":
        return user.email.toLowerCase().includes(lowerCaseSearchValue);
      case "contactNumber":
        const contactNumberStr = String(user.contactNumber);
        return contactNumberStr.includes(lowerCaseSearchValue);
      case "address":
        return user.address?.toLowerCase()?.includes(lowerCaseSearchValue);
      case "role":
        return user.role.toLowerCase().includes(lowerCaseSearchValue);

      default:
        return true; // No column selected, show all data
    }
  });

  return (
    <div className="datatable">
      <div className="datatableTitle">
        <div className="datatableHeader">
          <label> List of Products</label>
          <div className="searchContainer">
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
            />
            <select value={selectedColumn} onChange={handleColumnSelect}>
              <option value="uid">User ID</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="email">Email</option>
              <option value="contactNumber">Contact Number</option>
              <option value="address">Address</option>
              <option value="role">Role</option>
            </select>
            <SearchRoundedIcon />
          </div>
        </div>
        <div className="datatableButtons">
          <Link to="/users/new" className="link">
            <AddIcon />
            New User
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={filteredData}
        columns={userColumns.concat([
          {
            field: "action",
            headerName: "Action",
            width: 150,
            headerClassName: "headerName",
            renderCell: (params) => {
              return (
                <div className="cellAction">
                  <Link
                    to={`/users/${params.row.id}`}
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
                      setSelectedUserId(params.row.id);
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

export default UserTable;
