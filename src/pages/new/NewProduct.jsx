import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../components/toast/Toast";

const NewFood = ({ inputs, title }) => {
  const [productImgFile, setProductImgFile] = useState("");
  const [productImgFileName, setProductImgFileName] = useState("");
  const [data, setData] = useState({});
  const [per, setPerc] = useState(null);

  const navigate = useNavigate();
  console.log(data);

  //------------------ Handle Input For Fields ------------------//
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
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

  //------------------ Add New Food Function ------------------//
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAdd = async (e) => {
    e.preventDefault();

    const storageRef = ref(
      storage,
      `product_images/${new Date().getTime()}_${productImgFile.name}`
    ); // replace 'images' with your storage path

    try {
      // Upload image to storage
      const uploadTask = uploadBytesResumable(storageRef, productImgFile);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Calculate critical stock level
      const criticalStock = Math.floor(data.initialStock * 0.4);

      // Add document to Firestore with image download URL and critical stock level
      await addDoc(collection(db, "ProductData"), {
        ...data,
        img: downloadURL,
        productId: new Date().getTime().toString(),
        categoryName: selectedCategory,
        criticalStock: criticalStock,
      });

      navigate(-1);
      showSuccessToast("Product is added", 1000);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                productImgFile
                  ? URL.createObjectURL(productImgFile)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image:
                  <DriveFolderUploadOutlinedIcon className="icon" />
                  {productImgFileName}
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    setProductImgFile(e.target.files[0]);
                    setProductImgFileName(e.target.files[0].name);
                  }}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}

              {/* Drop down list for product categories */}
              <div className="formInput">
                <label>Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
              </div>
            </form>
            <button disabled={per !== null && per < 100} onClick={handleAdd}>
              Add Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFood;
