import React from "react";
import { productColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "../../firebase";

const ProductTable = () => {
  const [data, setData] = useState([]);

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
      const docRef = doc(db, "FoodData", id);
      const docSnap = await getDoc(docRef);
      const { img } = docSnap.data();

      const imageRef = ref(storage, img);
      await deleteObject(imageRef);

      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== id));
      alert("Food Data is deleted");
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
        List of Products
        <div className="datatableButtons">
          <Link to="/products/productCategories" className="link">
            Show Product Categories
          </Link>
          <Link to="/products/newProduct" className="link">
            Add New Product
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={actionColumn.concat(productColumns)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        // checkboxSelection
      />
    </div>
  );
};

export default ProductTable;
