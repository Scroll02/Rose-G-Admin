import React from "react";
import { foodColumns, foodRows } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  getDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../firebase";

const ProductTable = () => {
  const [data, setData] = useState(foodRows);

  //------------------ Display Food Data ------------------//
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "FoodData"),
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

  //------------------ Delete Food Data  ------------------//

  const handleDelete = async (id) => {
    const storage = getStorage();
    try {
      await deleteDoc(doc(db, "FoodData", id));
      setData(data.filter((item) => item.id !== id));
      alert("Food Data is deleted");
      // Deleting the image from storage
      // const foodRef = ref(storage, "tapa_topview.png");
      // deleteObject(foodRef)
      //   .then(() => {
      //     alert("deleted");
      //   })
      //   .catch((error) => {
      //     alert("something went wrong");
      //   });
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/products/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        List of Foods
        <Link to="/products/new" className="link">
          Add New Food
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={foodColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default ProductTable;
