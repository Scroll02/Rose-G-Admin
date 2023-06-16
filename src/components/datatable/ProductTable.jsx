import "./datatable.scss";
import React from "react";
import { productColumns } from "../../datatablesource";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
// Firebase
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  getDoc,
  writeBatch,
  setDoc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
// Toast
import {
  showErrorToast,
  showSuccessToast,
  showInfoToast,
} from "../toast/Toast";
// Modal
import ConfirmationModal from "../modal/ConfirmationModal";

const ProductTable = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("productName");
  const [resetTime, setResetTime] = useState(null);

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
            return -1;
          } else if (
            a.currentStock > a.criticalStock &&
            b.currentStock <= b.criticalStock
          ) {
            return 1;
          } else {
            return 0;
          }
        });
        setData(newData);

        // Reset data at 9 PM
        const resetDataAtSpecificTime = () => {
          const currentTime = new Date();
          const resetTime = new Date(
            currentTime.getFullYear(),
            currentTime.getMonth(),
            currentTime.getDate(),
            21, // 9 PM hour
            0, // 0 minutes
            0 // 0 seconds
          );
          let millisecondsUntilReset = resetTime - currentTime;

          if (millisecondsUntilReset < 0) {
            // If the reset time has already passed today, schedule it for the next day
            const nextDay = new Date(
              currentTime.getFullYear(),
              currentTime.getMonth(),
              currentTime.getDate() + 1,
              21, // 9 PM hour
              0, // 0 minutes
              0 // 0 seconds
            );
            millisecondsUntilReset = nextDay - currentTime;
          }

          setTimeout(() => {
            const batch = writeBatch(db);
            const productsRef = collection(db, "ProductData");

            newData.forEach((product) => {
              batch.update(doc(productsRef, product.id), {
                totalSold: 0,
                initialStock: product.currentStock,
                currentStock: product.currentStock,
                criticalStock: Math.round(product.currentStock * 0.4),
              });
            });

            batch
              .commit()
              .then(() => {
                console.log("Data reset successful.");
                setData(newData); // Set the updated data after the reset
              })
              .catch((error) => {
                console.error("Data reset failed:", error);
              });
          }, millisecondsUntilReset);
        };
        resetDataAtSpecificTime(); // Call the function to start the reset process
      },
      (error) => {
        console.error(error);
      }
    );

    return unsubscribe;
  }, []);

  // Delete Product Data
  const [selectedProductId, setSelectedProductId] = useState(null);
  // const handleDelete = async () => {
  //   const storage = getStorage();
  //   try {
  //     const docRef = doc(db, "ProductData", selectedProductId);
  //     const docSnap = await getDoc(docRef);
  //     const imageUrl = docSnap.data().img;

  //     const imageRef = ref(storage, imageUrl);
  //     await deleteObject(imageRef);

  //     await deleteDoc(docRef);
  //     setData(data.filter((item) => item.id !== selectedProductId));
  //     showSuccessToast("Product data is deleted", 2000);
  //   } catch (err) {
  //     console.log(err);
  //     showErrorToast("Error deleting product", 2000);
  //   }
  // };

  // Modal
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "ProductData", selectedProductId);
      const docSnap = await getDoc(docRef);
      const imageUrl = docSnap.data().img;

      const imageRef = ref(storage, imageUrl);
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
          actionDescription: "Deleted product data",
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        setData(data.filter((item) => item.id !== selectedProductId));
        showSuccessToast("Product data is deleted", 2000);
      } else {
        showInfoToast("No product data");
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Error deleting product", 2000);
    }
  };

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
  const filteredData = data.filter((product) => {
    const lowerCaseSearchValue = searchValue.toLowerCase();
    switch (selectedColumn) {
      case "productName":
        return product.productName.toLowerCase().includes(lowerCaseSearchValue);
      case "description":
        return product.description.toLowerCase().includes(lowerCaseSearchValue);
      case "price":
        return product.price.toString().includes(searchValue);
      case "categoryName":
        return product.categoryName
          .toLowerCase()
          .includes(lowerCaseSearchValue);
      case "stock":
        return (
          product.initialStock.toString().includes(searchValue) ||
          product.currentStock.toString().includes(searchValue)
        );
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
              <option value="productName">Product Name</option>
              <option value="description">Description</option>
              <option value="price">Price</option>
              <option value="categoryName">Category Name</option>
              <option value="stock">Stock</option>
            </select>
            <SearchRoundedIcon />
          </div>
        </div>

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
        rows={filteredData}
        slots={{ toolbar: GridToolbar }}
        columns={productColumns.concat([
          {
            field: "action",
            headerName: "Action",
            width: 180,
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
