import "./datatable.scss";
import React from "react";
import { productColumns } from "../../datatablesource";
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

const ProductTable = () => {
  const [data, setData] = useState([]);

  //------------------ Display Food Data ------------------//
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "ProductData"),
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

  //------------------ Delete Food Data  ------------------//
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

  // const actionColumn = [
  //   {
  //     field: "action",
  //     headerName: "Action",
  //     width: 200,
  //     renderCell: (params) => {
  //       return (
  //         <div className="cellAction">
  //           <Link
  //             to={`/products/${params.row.id}`}
  //             style={{ textDecoration: "none" }}
  //           >
  //             <div className="viewButton">
  //               <EditIcon />
  //               <span>Edit</span>
  //             </div>
  //           </Link>
  //           <div
  //             className="deleteButton"
  //             onClick={() => handleDelete(params.row.id)}
  //           >
  //             <DeleteForeverIcon />
  //           </div>
  //         </div>
  //       );
  //     },
  //   },
  // ];

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
