import React from "react";
import { productCategoryColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ConfirmationModal from "../modal/ConfirmationModal";
import moment from "moment";
// Firebase
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";
import { db, auth } from "../../firebase";
// Toast
import {
  showErrorToast,
  showSuccessToast,
  showInfoToast,
} from "../toast/Toast";

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

      const deletedFields = [];

      Object.entries(docSnap.data()).forEach(([field, value]) => {
        deletedFields.push({
          field: field,
          value: value,
        });
      });

      await deleteDoc(docRef);

      const currentUser = auth.currentUser;
      const userId = currentUser.uid;

      const userDocRef = doc(db, "UserData", userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const profileImageUrl = userData.profileImageUrl;
        const role = userData.role;

        const monthDocumentId = moment().format("YYYY-MM");

        const activityLogDocRef = doc(db, "ActivityLog", monthDocumentId);
        const activityLogDocSnapshot = await getDoc(activityLogDocRef);
        const activityLogData = activityLogDocSnapshot.exists()
          ? activityLogDocSnapshot.data().actionLogData || []
          : [];

        activityLogData.push({
          timestamp: new Date().toISOString(),
          deletedFields: deletedFields,
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          profileImageUrl: profileImageUrl,
          role: role,
          actionType: "Delete",
          actionDescription: "Deleted product category data",
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        setData(data.filter((item) => item.id !== selectedProductCategoryId));
        showSuccessToast("Product category data is deleted", 2000);
      } else {
        showInfoToast("No user data");
      }
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
            <AddIcon />
            New Category
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

export default ProductCategoriesTable;
