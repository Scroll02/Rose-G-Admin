import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../../components/toast/Toast";

const NewProductCategory = ({ inputs, title }) => {
  const [categoryImg, setCategoryImg] = useState("");
  const [categoryImgFileName, setCategoryImgFileName] = useState("");
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  //------------------ Handle Input For Fields ------------------//
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  //------------------ Add New Product Category Function ------------------//
  const handleAdd = async (e) => {
    e.preventDefault();

    const storageRef = ref(
      storage,
      `productCategory_images/${new Date().getTime()}_${categoryImg.name}`
    ); // replace 'images' with your storage path

    try {
      // Upload image to storage
      const uploadTask = uploadBytesResumable(storageRef, categoryImg);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(db, "ProductCategories"), {
        ...data,
        categoryImg: downloadURL,
        productCategoryId: new Date().getTime().toString(),
      });
      navigate(-1);
      showSuccessToast("New category is added", 1000);
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
                categoryImg
                  ? URL.createObjectURL(categoryImg)
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
                  {categoryImgFileName}
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => {
                    setCategoryImg(e.target.files[0]);
                    setCategoryImgFileName(e.target.files[0].name);
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
            </form>
            <button onClick={handleAdd}>Add New Category</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductCategory;
