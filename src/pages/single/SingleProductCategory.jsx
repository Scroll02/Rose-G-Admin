import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import moment from "moment";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { useParams } from "react-router-dom";
import { db, storage, auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showInfoToast } from "../../components/toast/Toast";

const SingleProductCategory = () => {
  const { categoryId } = useParams();
  console.log(categoryId);

  const navigate = useNavigate();

  //------------------ Retrieve Product Categories Data  ------------------//
  const [categoryData, setCategoryData] = useState();

  const getCategoryData = async () => {
    const docRef = doc(db, "ProductCategories", categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: ", docSnap.data());
      setCategoryData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getCategoryData();
  }, []);
  console.log(categoryData);

  //------------------ Handle Change for Input  ------------------//
  const [newCategoryImg, setNewCategoryImg] = useState("");
  const [newCategoryImgName, setNewCategoryImgName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  //------------------ Update Food Data Function  ------------------//
  // const handleUpdate = async () => {
  //   const docRef = doc(db, "ProductCategories", categoryId);
  //   if (docRef !== null) {
  //     const updates = {};
  //     let isUpdated = false; // add a flag variable

  //     if (newCategoryName !== "") {
  //       updates.categoryName = newCategoryName;
  //       isUpdated = true;
  //     }

  //     if (newSlug !== "") {
  //       updates.slug = newSlug;
  //       isUpdated = true;
  //     }

  //     if (newCategoryImg !== "") {
  //       // Get the URL of the old image from Firestore
  //       const docSnapshot = await getDoc(docRef);
  //       const oldImageUrl = docSnapshot.data().categoryImg;

  //       const storageRef = ref(
  //         storage,
  //         `productCategory_images/${new Date().getTime()}_${
  //           newCategoryImg.name
  //         }`
  //       );
  //       await uploadBytes(storageRef, newCategoryImg);
  //       const downloadURL = await getDownloadURL(storageRef);
  //       updates.categoryImg = downloadURL;

  //       // Delete the old image from storage
  //       if (oldImageUrl) {
  //         const oldImageRef = ref(storage, oldImageUrl);
  //         await deleteObject(oldImageRef);
  //       }
  //       isUpdated = true;
  //     }

  //     if (isUpdated) {
  //       // check the flag variable to display the success message
  //       await updateDoc(docRef, updates);
  //       showSuccessToast("Category data is updated", 1000);
  //       navigate(-1);
  //     } else {
  //       showInfoToast("No changes were made.");
  //       navigate(-1);
  //     }
  //   } else {
  //     alert("No product category data");
  //   }
  // };
  const handleUpdate = async () => {
    const docRef = doc(db, "ProductCategories", categoryId);

    if (docRef !== null) {
      const updates = {};
      const updatedFields = [];
      let isUpdated = false;

      if (newCategoryName !== "") {
        const docSnapshot = await getDoc(docRef);
        const oldCategoryName = docSnapshot.data().categoryName;
        const newCategoryNameValue = newCategoryName;

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

      if (newSlug !== "") {
        const docSnapshot = await getDoc(docRef);
        const oldSlug = docSnapshot.data().slug;
        const newSlugValue = newSlug;

        if (oldSlug !== newSlugValue) {
          updatedFields.push({
            field: "slug",
            oldValue: oldSlug,
            newValue: newSlugValue,
          });
        }

        updates.slug = newSlugValue;
        isUpdated = true;
      }

      if (newCategoryImg !== "") {
        const docSnapshot = await getDoc(docRef);
        const oldImageUrl = docSnapshot.data().categoryImg;

        const storageRef = ref(
          storage,
          `productCategory_images/${new Date().getTime()}_${
            newCategoryImg.name
          }`
        );
        await uploadBytes(storageRef, newCategoryImg);
        const downloadURL = await getDownloadURL(storageRef);

        const oldCategoryImg = docSnapshot.data().categoryImg;
        const newCategoryImgValue = downloadURL;

        if (oldCategoryImg !== newCategoryImgValue) {
          updatedFields.push({
            field: "categoryImg",
            oldValue: oldCategoryImg,
            newValue: newCategoryImgValue,
          });
        }

        updates.categoryImg = newCategoryImgValue;

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
        const role = userData.role;

        if (isUpdated) {
          await updateDoc(docRef, updates);

          const monthDocumentId = moment().format("YYYY-MM");
          const activityLogDocRef = doc(db, "ActivityLog", monthDocumentId);
          const activityLogDocSnapshot = await getDoc(activityLogDocRef);
          const activityLogData = activityLogDocSnapshot.exists()
            ? activityLogDocSnapshot.data().actionLogData || []
            : [];

          activityLogData.push({
            timestamp: new Date().toISOString(),
            updatedFields: updatedFields,
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            profileImageUrl: profileImageUrl,
            role: role,
            actionType: "Update",
            actionDescription: "Updated product category data",
          });

          await setDoc(
            activityLogDocRef,
            {
              actionLogData: activityLogData,
            },
            { merge: true }
          );

          showSuccessToast("Category data is updated", 1000);
          navigate(-1);
        } else {
          showInfoToast("No changes were made.");
          navigate(-1);
        }
      } else {
        showInfoToast("No user data");
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
            <h1 className="title">Food Category Information</h1>
            <div className="item">
              <img src={categoryData?.categoryImg} alt="" className="itemImg" />
              <div className="details">
                {/*------------------ Category Name ------------------*/}
                <h1 className="itemTitle">
                  Category Name:&nbsp;{categoryData?.categoryName}
                </h1>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Category Name"
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />

                {/*------------------ New Product Image ------------------*/}
                <div className="detailItem">
                  <label
                    htmlFor="file"
                    style={{ display: "flex", alignItems: "center" }}
                  >
                    New Image:
                    <DriveFolderUploadOutlinedIcon className="icon" />
                    {newCategoryImgName}
                  </label>

                  <input
                    type="file"
                    id="file"
                    onChange={(e) => {
                      setNewCategoryImg(e.target.files[0]);
                      setNewCategoryImgName(e.target.files[0].name);
                    }}
                    style={{ display: "none" }}
                  />
                </div>

                {/*------------------ Category Slug ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Slug:</span>
                  <span className="itemValue">{categoryData?.slug}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Bag Slug"
                  onChange={(e) => setNewSlug(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="right">
            <Chart aspect={3 / 1} title="User Spending ( Last 6 Months)" />
          </div>
        </div>
        {/* <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div> */}
      </div>
    </div>
  );
};

export default SingleProductCategory;
