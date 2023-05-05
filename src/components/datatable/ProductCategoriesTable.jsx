import React from "react";
import { productCategoryColumns } from "../../datatablesource";
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
import { showErrorToast } from "../toast/Toast";

const ProductCategoriesTable = () => {
  const [data, setData] = useState([]);
  //------------------ Display Food Categories Data ------------------//
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "ProductCategories"),
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

  //------------------ Delete Product Category Data  ------------------//
  const handleDelete = async (id) => {
    const storage = getStorage();
    // try {
    //   await deleteDoc(doc(db, "ProductCategories", id));
    //   setData(data.filter((item) => item.id !== id));
    //   showErrorToast("Selected food category is deleted", 1000);
    // } catch (err) {
    //   console.log(err);
    // }
    try {
      const docRef = doc(db, "ProductCategories", id);
      const docSnap = await getDoc(docRef);
      const { categoryImg } = docSnap.data();

      const imageRef = ref(storage, categoryImg);
      await deleteObject(imageRef);

      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== id));
      showErrorToast("Product category data is deleted", 1000);
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
              to={`/products/productCategories/${params.row.id}`}
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
        List of Product Categories
        <div className="datatableButtons">
          <Link to="/products/newCategory" className="link">
            Add New Category
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        columns={actionColumn.concat(productCategoryColumns)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        // checkboxSelection
      />
    </div>
  );
};

export default ProductCategoriesTable;
