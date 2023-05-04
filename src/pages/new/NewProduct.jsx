import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const NewFood = ({ inputs, title }) => {
  const [file, setFile] = useState("");
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

  //------------------ Retrieve Food Categories Data ------------------//
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
      `food_images/${new Date().getTime()}_${file.name}`
    ); // replace 'images' with your storage path

    try {
      // Upload image to storage
      const uploadTask = uploadBytesResumable(storageRef, file);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Add document to Firestore with image download URL
      await addDoc(collection(db, "FoodData"), {
        ...data,
        img: downloadURL,
        foodId: new Date().getTime().toString(),
        categoryTitle: selectedCategory,
      });

      navigate(-1);
      alert("Product is added");
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
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
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
