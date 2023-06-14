import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import moment from "moment";
import { useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showInfoToast } from "../../components/toast/Toast";

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
  // const handleAdd = async (e) => {
  //   e.preventDefault();

  //   const storageRef = ref(
  //     storage,
  //     `productCategory_images/${new Date().getTime()}_${categoryImg.name}`
  //   );

  //   try {
  //     const uploadTask = uploadBytesResumable(storageRef, categoryImg);
  //     const snapshot = await uploadTask;
  //     const downloadURL = await getDownloadURL(snapshot.ref);

  //     const newCategoryRef = await addDoc(collection(db, "ProductCategories"), {
  //       ...data,
  //       categoryImg: downloadURL,
  //       productCategoryId: new Date().getTime().toString(),
  //     });

  //     const newCategoryDataSnapshot = await getDoc(newCategoryRef);
  //     const newCategoryData = newCategoryDataSnapshot.data();

  //     const currentUser = auth.currentUser;
  //     const userId = currentUser.uid;

  //     const userDocRef = doc(db, "UserData", userId);
  //     const userDocSnapshot = await getDoc(userDocRef);
  //     if (userDocSnapshot.exists()) {
  //       const userData = userDocSnapshot.data();
  //       const firstName = userData.firstName;
  //       const lastName = userData.lastName;
  //       const profileImageUrl = userData.profileImageUrl;

  //       const monthDocumentId = moment().format("YYYY-MM");

  //       const activityLogDocRef = doc(db, "ActivityLog", monthDocumentId);
  //       const activityLogDocSnapshot = await getDoc(activityLogDocRef);
  //       const activityLogData = activityLogDocSnapshot.exists()
  //         ? activityLogDocSnapshot.data().actionLogData || []
  //         : [];

  //       const createdFields = [];

  //       Object.entries(newCategoryData).forEach(([field, value]) => {
  //         createdFields.push({
  //           field: field,
  //           value: value,
  //         });
  //       });

  //       activityLogData.push({
  //         timestamp: new Date().toISOString(),
  //         createdFields: createdFields,
  //         userId: userId,
  //         firstName: firstName,
  //         lastName: lastName,
  //         profileImageUrl: profileImageUrl,
  //         actionType: "Create",
  //         actionDescription: "Created product category data",
  //       });

  //       await setDoc(
  //         activityLogDocRef,
  //         {
  //           actionLogData: activityLogData,
  //         },
  //         { merge: true }
  //       );

  //       navigate(-1);
  //       showSuccessToast("New category is added", 1000);
  //     } else {
  //       showInfoToast("No user data");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const handleAdd = async (e) => {
    e.preventDefault();

    const storageRef = ref(
      storage,
      `productCategory_images/${new Date().getTime()}_${categoryImg.name}`
    );

    try {
      const uploadTask = uploadBytesResumable(storageRef, categoryImg);
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);

      const newCategoryRef = await addDoc(collection(db, "ProductCategories"), {
        ...data,
        categoryImg: downloadURL,
      });

      const newCategoryId = newCategoryRef.id;

      await updateDoc(doc(db, "ProductCategories", newCategoryId), {
        productCategoryId: newCategoryId,
      });

      const newCategoryDataSnapshot = await getDoc(newCategoryRef);
      const newCategoryData = newCategoryDataSnapshot.data();

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

        const createdFields = [];

        Object.entries(newCategoryData).forEach(([field, value]) => {
          createdFields.push({
            field: field,
            value: value,
          });
        });

        activityLogData.push({
          timestamp: new Date().toISOString(),
          createdFields: createdFields,
          userId: userId,
          firstName: firstName,
          lastName: lastName,
          profileImageUrl: profileImageUrl,
          role: role,
          actionType: "Create",
          actionDescription: "Created product category data",
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        setCategoryImg(null);
        showSuccessToast("New category is added", 1000);
        navigate(-1);
      } else {
        showInfoToast("No user data");
      }
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
