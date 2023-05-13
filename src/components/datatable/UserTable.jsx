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
import { db, auth } from "../../firebase";

// Toast
import { showErrorToast } from "../toast/Toast";

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
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "UserData", id));
      setData(data.filter((item) => item.id !== id));
      showErrorToast("User data is deleted", 1000);
    } catch (err) {
      console.log(err);
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

  const actionColumn = [
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
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteForeverIcon />
            </div>
          </div>
        );
      },
    },
  ];

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
        columns={userColumns.concat(actionColumn)}
        pageSize={10}
        rowsPerPageOptions={[10]}
        // checkboxSelection
      />
    </div>
  );
};

export default UserTable;
