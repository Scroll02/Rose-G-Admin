import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";

// Firebase
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Toast
import { showErrorToast, showSuccessToast } from "../toast/Toast";

// Modal
import ConfirmationModal from "../modal/ConfirmationModal";

const UserTable = () => {
  const [data, setData] = useState([]);

  //------------------ Retrieve Users Data ------------------//
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "UserData"),
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
  console.log(data);

  //------------------ Delete User Data  ------------------//
  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleDelete = async () => {
    try {
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

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="datatable">
      <div className="datatableTitle">
        List of Users
        <div className="datatableButtons">
          <Link to="/users/new" className="link">
            <AddIcon />
            New User
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
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
