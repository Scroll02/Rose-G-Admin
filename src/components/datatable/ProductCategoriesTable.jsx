import React from "react";
import { productCategoryColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ConfirmationModal from "../modal/ConfirmationModal";

// Firebase
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db } from "../../firebase";

// Toast
import { showErrorToast, showSuccessToast } from "../toast/Toast";

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
  const [selectedProductCategoryId, setSelectedProductCategoryId] =
    useState(null);
  const handleDelete = async () => {
    const storage = getStorage();
    try {
      const docRef = doc(db, "ProductCategories", selectedProductCategoryId);
      const docSnap = await getDoc(docRef);
      const categoryImageUrl = docSnap.data().categoryImg;

      const imageRef = ref(storage, categoryImageUrl);
      await deleteObject(imageRef);

      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== selectedProductCategoryId));
      showSuccessToast("Product category data is deleted", 2000);
    } catch (err) {
      console.log(err);
      showErrorToast("Error deleting product", 2000);
    }
  };

  // Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

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
        columns={productCategoryColumns.concat([
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
                    <div className="viewButton">
                      <EditIcon />
                      <span>Edit</span>
                    </div>
                  </Link>
                  <div
                    className="deleteButton"
                    onClick={() => {
                      setSelectedProductCategoryId(params.row.id);
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
      {showConfirmationModal && (
        <ConfirmationModal
          handleDelete={handleDelete}
          closeConfirmationModal={closeConfirmationModal}
        />
      )}
    </div>
  );
};

export default ProductCategoriesTable;
