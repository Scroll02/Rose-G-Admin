import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import moment from "moment";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
  setDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showInfoToast } from "../../components/toast/Toast"; //SUCCESS & INFO TOAST

const SingleProduct = () => {
  const { productId } = useParams();
  // console.log(productId);

  const navigate = useNavigate();

  //------------------ Retrieve Product Data  ------------------//
  const [productData, setProductData] = useState();
  const getProductData = async () => {
    const docRef = doc(db, "ProductData", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data: ", docSnap.data());
      setProductData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getProductData();
  }, []);

  //------------------ Handle Change for Input  ------------------//
  const [newImageFile, setNewImageFile] = useState("");
  const [newImageFileName, setNewImageFileName] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const handleChangeNewPrice = (e) => {
    const numberOnly = e.target.value.replace(/^[A-Za-z ]+$/g, "");
    setNewPrice(numberOnly);
  };
  const handleChangeNewStock = (e) => {
    const numberOnly = e.target.value.replace(/^[A-Za-z ]+$/g, "");
    setNewStock(numberOnly);
  };

  //------------------ Retrieve Product Categories Data ------------------//
  const [categoriesData, setCategoriesData] = useState([]);
  useEffect(() => {
    //LISTEN (REALTIME)
    const unsub = onSnapshot(
      collection(db, "ProductCategories"),
      (snapShot) => {
        let list = [];
        snapShot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCategoriesData(list);
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unsub();
    };
  }, []);

  //------------------ Update Product Data Function  ------------------//
  const [newSelectedCategory, setNewSelectedCategory] = useState("");
  const handleUpdate = async () => {
    const monthDocumentId = moment().format("YYYY-MM");
    const user = auth.currentUser;
    const docRef = doc(db, "ProductData", productId);

    if (docRef !== null) {
      const updates = {};
      const updatedFields = [];
      let isUpdated = false;
      let newCriticalStock = 0; // add a variable for new criticalStock

      if (newProductName !== "") {
        const oldProductName = productData?.productName;
        const newProductNameValue = newProductName;

        if (oldProductName !== newProductNameValue) {
          updatedFields.push({
            field: "productName",
            oldValue: oldProductName,
            newValue: newProductNameValue,
          });
        }

        updates.productName = newProductNameValue;
        isUpdated = true;
      }

      if (newDescription !== "") {
        const oldDescription = productData?.description;
        const newDescriptionValue = newDescription;

        if (oldDescription !== newDescriptionValue) {
          updatedFields.push({
            field: "description",
            oldValue: oldDescription,
            newValue: newDescriptionValue,
          });
        }

        updates.description = newDescriptionValue;
        isUpdated = true;
      }

      if (newSelectedCategory !== "") {
        const oldCategoryName = productData?.categoryName;
        const newCategoryNameValue = newSelectedCategory;

        if (oldCategoryName !== newCategoryNameValue) {
          updatedFields.push({
            field: "categoryName",
            oldValue: oldCategoryName,
            newValue: newCategoryNameValue,
          });
        }

        updates.categoryName = newCategoryNameValue;
        isUpdated = true;
      }

      if (newPrice !== "") {
        const oldPrice = productData?.price;
        const newPriceValue = newPrice;

        if (oldPrice !== newPriceValue) {
          updatedFields.push({
            field: "price",
            oldValue: oldPrice,
            newValue: newPriceValue,
          });
        }

        updates.price = newPriceValue;
        isUpdated = true;
      }

      if (newStock !== "") {
        const docSnapshot = await getDoc(docRef);
        const currentStock =
          docSnapshot.data().currentStock || docSnapshot.data().initialStock;
        const updatedStock =
          parseInt(newStock, 10) -
          (currentStock - parseInt(docSnapshot.data().initialStock, 10));

        const oldInitialStock = docSnapshot.data().initialStock;
        const newInitialStockValue = updatedStock;

        if (oldInitialStock !== newInitialStockValue) {
          updatedFields.push({
            field: "initialStock",
            oldValue: oldInitialStock,
            newValue: newInitialStockValue,
          });
        }

        const oldCurrentStock = currentStock;
        const newCurrentStockValue = updatedStock;

        if (oldCurrentStock !== newCurrentStockValue) {
          updatedFields.push({
            field: "currentStock",
            oldValue: oldCurrentStock,
            newValue: newCurrentStockValue,
          });
        }

        newCriticalStock = Math.round(updatedStock * 0.4); // Calculate the new criticalStock value based on the updated stock

        const oldCriticalStock = docSnapshot.data().criticalStock;
        const newCriticalStockValue = newCriticalStock;

        if (oldCriticalStock !== newCriticalStockValue) {
          updatedFields.push({
            field: "criticalStock",
            oldValue: oldCriticalStock,
            newValue: newCriticalStockValue,
          });
        }

        updates.initialStock = newInitialStockValue;
        updates.currentStock = newCurrentStockValue;
        updates.criticalStock = newCriticalStockValue;

        isUpdated = true;
      }

      if (newImageFile !== "") {
        const docSnapshot = await getDoc(docRef);
        const oldImageUrl = docSnapshot.data().img;

        const storageRef = ref(
          storage,
          `product_images/${new Date().getTime()}_${newImageFile.name}`
        );
        await uploadBytes(storageRef, newImageFile);
        const downloadURL = await getDownloadURL(storageRef);

        const oldImg = docSnapshot.data().img;
        const newImgValue = downloadURL;

        if (oldImg !== newImgValue) {
          updatedFields.push({
            field: "img",
            oldValue: oldImg,
            newValue: newImgValue,
          });
        }

        updates.img = newImgValue;

        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }
        isUpdated = true;
      }

      const currentUser = auth.currentUser;
      const userId = currentUser.uid;

      // Retrieve the user document from the UserData collection
      const userDocRef = doc(db, "UserData", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const firstName = userData.firstName;
        const lastName = userData.lastName;
        const profileImageUrl = userData.profileImageUrl;

        if (isUpdated) {
          await updateDoc(docRef, updates);

          // Check if the document exists in the ActivityLog collection
          const activityLogDocRef = doc(db, "ActivityLog", monthDocumentId);
          const activityLogDocSnapshot = await getDoc(activityLogDocRef);
          const activityLogData = activityLogDocSnapshot.exists()
            ? activityLogDocSnapshot.data().actionLogData || []
            : [];

          // Push the current update to the action log data array
          activityLogData.push({
            timestamp: new Date().toISOString(),
            updatedFields: updatedFields,
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            profileImageUrl: profileImageUrl,
            actionType: "Update",
            actionDescription: "Updated product data",
          });

          // Update the actionLogData field in the ActivityLog collection
          await setDoc(
            activityLogDocRef,
            {
              actionLogData: activityLogData,
            },
            { merge: true }
          );

          showSuccessToast("Product data is updated", 2000);
          navigate(-1);
        } else {
          showInfoToast("No changes were made.");
          navigate(-1);
        }
      } else {
        showInfoToast("No product data");
      }
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            <div className="editButton" onClick={handleUpdate}>
              Save
            </div>

            <h1 className="title">Product Information</h1>
            <div className="item">
              {/*------------------ Product Image ------------------*/}
              <img src={productData?.img} alt="" className="itemImg" />
              <div className="details">
                {/*------------------ Product Name ------------------*/}
                <h1 className="itemTitle">{productData?.productName}</h1>
                <input
                  type="text"
                  placeholder="New Food Name"
                  className="itemInput"
                  onChange={(e) => setNewProductName(e.target.value)}
                />

                {/*------------------ New Product Image ------------------*/}
                <div className="detailItem">
                  <label
                    htmlFor="file"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    New Product Image:
                    <DriveFolderUploadOutlinedIcon className="icon" />
                    {newImageFileName}
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => {
                      setNewImageFile(e.target.files[0]);
                      setNewImageFileName(e.target.files[0].name);
                    }}
                    style={{ display: "none" }}
                  />
                </div>

                {/*------------------ Product Description ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Description:</span>
                  <span className="itemValue">{productData?.description}</span>
                </div>
                <input
                  type="text"
                  placeholder="New Description"
                  onChange={(e) => setNewDescription(e.target.value)}
                />

                {/*------------------ Product Category ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Category:</span>
                  <span className="itemValue">{productData?.categoryName}</span>
                </div>

                <select
                  value={newSelectedCategory}
                  onChange={(e) => setNewSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    ---Select a category---
                  </option>
                  {categoriesData.map((item) => {
                    return (
                      <option
                        key={item.productCategoryId}
                        value={item.categoryName}
                      >
                        {item.categoryName}
                      </option>
                    );
                  })}
                </select>

                {/*------------------ Product Price ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Price:</span>
                  <span className="itemValue">
                    ₱{parseFloat(productData?.price).toFixed(2)}
                  </span>
                </div>
                <input
                  type="text"
                  value={newPrice}
                  placeholder="New Price"
                  onChange={handleChangeNewPrice}
                />

                {/*------------------ Product Stock ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Stock:</span>
                  <span className="itemValue">
                    {productData?.currentStock || productData?.initialStock}
                  </span>
                </div>
                <input
                  type="text"
                  value={newStock}
                  placeholder="New Stock"
                  onChange={handleChangeNewStock}
                />
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
