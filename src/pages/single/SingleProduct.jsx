import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useParams } from "react-router-dom";
import { db, auth, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";

const SingleProduct = () => {
  const { productId } = useParams();
  // console.log(productId);

  const navigate = useNavigate();

  //------------------ Retrieve Product Data  ------------------//
  const [foodData, setFoodData] = useState();

  const getFoodData = async () => {
    const docRef = doc(db, "FoodData", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: ", docSnap.data());
      setFoodData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getFoodData();
  }, []);
  console.log(foodData);

  //------------------ Handle Change for Input  ------------------//
  const [newImageFile, setNewImageFile] = useState("");
  const [newFoodName, setNewFoodName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newAddOnName, setNewAddOnName] = useState("");
  const [newAddOnPrice, setNewAddOnPrice] = useState("");
  // console.log(newFoodName);
  const handleChangeNewPrice = (e) => {
    const numberOnly = e.target.value.replace(/^[A-Za-z ]+$/g, "");
    setNewPrice(numberOnly);
  };
  const handleChangeNewStock = (e) => {
    const numberOnly = e.target.value.replace(/^[A-Za-z ]+$/g, "");
    setNewStock(numberOnly);
  };
  const handleChangeNewAddOnPrice = (e) => {
    const numberOnly = e.target.value.replace(/^[A-Za-z ]+$/g, "");
    setNewAddOnPrice(numberOnly);
  };

  //------------------ Update Product Data Function  ------------------//
  // const handleUpdate = async () => {
  //   const docRef = doc(db, "FoodData", productId);

  //   if (docRef !== null) {
  //     if (newFoodName !== "") {
  //       updateDoc(docRef, {
  //         foodName: newFoodName,
  //       });
  //     }

  //     if (newDescription !== "") {
  //       updateDoc(docRef, {
  //         description: newDescription,
  //       });
  //     }

  //     if (newCategory !== "") {
  //       updateDoc(docRef, {
  //         categoryTitle: newCategory,
  //       });
  //     }

  //     if (newPrice !== "") {
  //       updateDoc(docRef, {
  //         price: newPrice,
  //       });
  //     }

  //     if (newStock !== "") {
  //       updateDoc(docRef, {
  //         stock: newStock,
  //       });
  //     }

  //     if (newAddOnName !== "") {
  //       updateDoc(docRef, {
  //         addOn: newAddOnName,
  //       });
  //     }

  //     if (newAddOnPrice !== "") {
  //       updateDoc(docRef, {
  //         addOnPrice: newAddOnPrice,
  //       });
  //     }

  //     alert("Food data is updated");
  //     navigate(-1);
  //   } else {
  //     alert("No food data");
  //   }
  // };
  const handleUpdate = async () => {
    const docRef = doc(db, "FoodData", productId);

    if (docRef !== null) {
      const updates = {};

      if (newFoodName !== "") {
        updates.foodName = newFoodName;
      }

      if (newDescription !== "") {
        updates.description = newDescription;
      }

      if (newCategory !== "") {
        updates.categoryTitle = newCategory;
      }

      if (newPrice !== "") {
        updates.price = newPrice;
      }

      if (newStock !== "") {
        updates.stock = newStock;
      }

      if (newAddOnName !== "") {
        updates.addOn = newAddOnName;
      }

      if (newAddOnPrice !== "") {
        updates.addOnPrice = newAddOnPrice;
      }

      if (newImageFile !== "") {
        const storageRef = ref(
          storage,
          `food_images/${new Date().getTime()}_${newImageFile.name}`
        );
        await uploadBytes(storageRef, newImageFile);
        const downloadURL = await getDownloadURL(storageRef);
        updates.imageUrl = downloadURL;
      }

      await updateDoc(docRef, updates);

      alert("Food data is updated");
      navigate(-1);
    } else {
      alert("No food data");
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
              <img src={foodData?.img} alt="" className="itemImg" />
              <div className="details">
                {/*------------------ Food Name ------------------*/}
                <h1 className="itemTitle">{foodData?.foodName}</h1>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Food Name"
                  onChange={(e) => setNewFoodName(e.target.value)}
                />

                {/*------------------ New Product Image ------------------*/}
                <div className="detailItem">
                  <label
                    htmlFor="file"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    New Image:
                    <DriveFolderUploadOutlinedIcon className="icon" />
                  </label>
                  <input
                    type="file"
                    id="file"
                    onChange={(e) => setNewImageFile(e.target.files[0])}
                    style={{ display: "none" }}
                  />
                </div>

                {/*------------------ Food Description ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Description:</span>
                  <span className="itemValue">{foodData?.description}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Description"
                  onChange={(e) => setNewDescription(e.target.value)}
                />

                {/*------------------ Food Category ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Category:</span>
                  <span className="itemValue">{foodData?.categoryTitle}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Category"
                  onChange={(e) => setNewCategory(e.target.value)}
                />

                {/*------------------ Food Price ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Price:</span>
                  <span className="itemValue">
                    ₱{parseFloat(foodData?.price).toFixed(2)}
                  </span>
                </div>
                <input
                  type="text"
                  value={newPrice}
                  placeholder="New Price"
                  // onChange={(e) => setNewPrice(e.target.value)}
                  onChange={handleChangeNewPrice}
                />

                {/*------------------ Food Stock ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Stock:</span>
                  <span className="itemValue">{foodData?.stock}</span>
                </div>
                <input
                  type="text"
                  value={newStock}
                  placeholder="New Stock"
                  // onChange={(e) => setNewStock(e.target.value)}
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
