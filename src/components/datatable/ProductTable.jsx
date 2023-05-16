import "./datatable.scss";
import React from "react";
import { productColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

// Modal
import ConfirmationModal from "../modal/ConfirmationModal";

const ProductTable = () => {
  const [data, setData] = useState([]);

  //------------------ Retrieve Product Data ------------------//
  // Once stock is below or less than criticalStock that product will displayed first on the table
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "ProductData"),
      (snapshot) => {
        const newData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        newData.sort((a, b) => {
          if (
            a.currentStock <= a.criticalStock &&
            b.currentStock > b.criticalStock
          ) {
            return -1; // a should be sorted before b
          } else if (
            a.currentStock > a.criticalStock &&
            b.currentStock <= b.criticalStock
          ) {
            return 1; // a should be sorted after b
          } else {
            return 0; // the order doesn't matter
          }
        });
        setData(newData);
      },
      (error) => {
        console.error(error);
      }
    );
    return unsubscribe;
  }, []);

  // Delete Product Data
  const [selectedProductId, setSelectedProductId] = useState(null);
  const handleDelete = async () => {
    const storage = getStorage();
    try {
      const docRef = doc(db, "ProductData", selectedProductId);
      const docSnap = await getDoc(docRef);
      const imageUrl = docSnap.data().img;

      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      await deleteDoc(docRef);
      setData(data.filter((item) => item.id !== selectedProductId));
      showSuccessToast("Product data is deleted", 2000);
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
        List of Products
        <div className="datatableButtons">
          <Link to="/products/productCategories" className="link">
            <VisibilityIcon />
            Product Categories
          </Link>
          <Link to="/products/newProduct" className="link">
            <AddIcon />
            New Product
          </Link>
        </div>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
        slots={{ toolbar: GridToolbar }}
        columns={productColumns.concat([
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
                    <div className="viewButton">
                      <EditIcon />
                      <span>Edit</span>
                    </div>
                  </Link>
                  <div
                    className="deleteButton"
                    onClick={() => {
                      setSelectedProductId(params.row.id);
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

export default ProductTable;
