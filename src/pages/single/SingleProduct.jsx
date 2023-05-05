import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage } from "../../firebase";
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
      console.log("Document data: ", docSnap.data());
      setProductData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getProductData();
  }, []);
  // console.log(productData);

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
  // console.log(categoriesData);

  //------------------ Update Product Data Function  ------------------//
  const [newSelectedCategory, setNewSelectedCategory] = useState("");
  const handleUpdate = async () => {
    const docRef = doc(db, "ProductData", productId);

    if (docRef !== null) {
      const updates = {};
      let isUpdated = false; // add a flag variable

      if (newProductName !== "") {
        updates.productName = newProductName;
        isUpdated = true;
      }

      if (newDescription !== "") {
        updates.description = newDescription;
        isUpdated = true;
      }

      if (newSelectedCategory !== "") {
        updates.categoryName = newSelectedCategory;
        isUpdated = true;
      }

      if (newPrice !== "") {
        updates.price = newPrice;
        isUpdated = true;
      }

      if (newStock !== "") {
        updates.stock = newStock;
        isUpdated = true;
      }

      if (newImageFile !== "") {
        // Get the URL of the old image from Firestore
        const docSnapshot = await getDoc(docRef);
        const oldImageUrl = docSnapshot.data().img;

        const storageRef = ref(
          storage,
          `product_images/${new Date().getTime()}_${newImageFile.name}`
        );
        await uploadBytes(storageRef, newImageFile);
        const downloadURL = await getDownloadURL(storageRef);
        updates.img = downloadURL;

        // Delete the old image from storage
        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }
        isUpdated = true;
      }

      if (isUpdated) {
        // check the flag variable to display the success message
        await updateDoc(docRef, updates);
        showSuccessToast("Product data is updated", 1000);
        navigate(-1);
      } else {
        showInfoToast("No changes were made.");
        navigate(-1);
      }
    } else {
      showInfoToast("No product data");
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
              {/*------------------ Food Image ------------------*/}
              <img src={productData?.img} alt="" className="itemImg" />
              <div className="details">
                {/*------------------ Food Name ------------------*/}
                <h1 className="itemTitle">{productData?.productName}</h1>
                <input
                  type="text"
                  placeholder="New Food Name"
                  onChange={(e) => setNewProductName(e.target.value)}
                />

                {/*------------------ New Product Image ------------------*/}
                <div className="detailItem">
                  <label
                    htmlFor="file"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    New Image:
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

                {/*------------------ Food Description ------------------*/}
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
                  <span className="itemValue">
                    {productData?.categoryProduct}
                  </span>
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

                {/*------------------ Food Price ------------------*/}
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

                {/*------------------ Food Stock ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Stock:</span>
                  <span className="itemValue">{productData?.stock}</span>
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
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
