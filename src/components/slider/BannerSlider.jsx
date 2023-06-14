import React from "react";
import "./slider.scss";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import TrashCan from "../../images/trash-can.png";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import moment from "moment";
// Modal
import ConfirmationModal from "../modal/ConfirmationModal";
// Firebase
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage, auth } from "../../firebase";
// Toast
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../toast/Toast";

const BannerSlider = () => {
  const [sliderImgFile, setSliderImgFile] = useState(null);
  const [sliderImgFileName, setSliderImgFileName] = useState("");
  const [bannerSliderContent, setBannerSliderContent] = useState([]);

  // function to add new banner to HomeSliderData collection
  const handleBannerSliderAdd = async (e) => {
    e.preventDefault();

    const handleImageUpload = async () => {
      if (sliderImgFile) {
        const storageRef = ref(
          storage,
          `bannerSlider_images/${new Date().getTime()}_${sliderImgFile.name}`
        );
        await uploadBytes(storageRef, sliderImgFile);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      }
      return null;
    };

    try {
      if (!sliderImgFile) {
        showErrorToast("Please upload an image first");
        return;
      }

      const downloadURL = await handleImageUpload();
      const randomId = Math.floor(Math.random() * 9000) + 1000; // generates a random 4-digit number
      const content = `Banner ${randomId}`;
      const docRef = await addDoc(collection(db, "BannerSliderData"), {
        id: randomId,
        content,
        imageUrl: downloadURL,
      });

      const newBannerDataSnapshot = await getDoc(docRef);
      const newBannerData = newBannerDataSnapshot.data();
      setBannerSliderContent((prevContent) => [...prevContent, newBannerData]);

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

        Object.entries(newBannerData).forEach(([field, value]) => {
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
          actionDescription: "Added banner slider data",
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        setSliderImgFile(null);
        setSliderImgFileName("");
        showSuccessToast("Banner slider added successfully!", 2000);
      } else {
        showInfoToast("No user data");
      }
    } catch (error) {
      console.error(error);
      showErrorToast("Error adding banner slider. Please try again.", 2000);
    }
  };

  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const setSelectedBannerToDelete = (id) => {
    setSelectedBannerId(id);
    setShowConfirmationModal(true);
  };

  // function to delete a banner from HomeSliderData collection
  const handleDelete = async () => {
    try {
      const docRef = doc(db, "BannerSliderData", selectedBannerId);
      const docSnap = await getDoc(docRef);
      const imageUrl = docSnap.data().imageUrl;

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
          actionDescription: "Deleted banner slider data",
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        showSuccessToast("Banner slider data is deleted", 2000);
      } else {
        showInfoToast("No user data");
      }
    } catch (err) {
      console.log(err);
      showErrorToast("Error deleting banner slider data", 2000);
    }
  };

  // function to fetch data from HomeSliderData collection on component mount
  useEffect(() => {
    const fetchBannerSliderData = async () => {
      const querySnapshot = await getDocs(collection(db, "BannerSliderData"));
      const homeSliderData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        imageUrl: doc.data().imageUrl,
      }));
      setBannerSliderContent(homeSliderData);
    };
    fetchBannerSliderData();
  }, []);

  // Modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const closeConfirmationModal = () => {
    setShowConfirmationModal(false);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "0px",
    className: "sliderContainer",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          centerPadding: "0px",
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
        },
      },
    ],
  };
  return (
    <div className="sliderBody">
      {showConfirmationModal && (
        <ConfirmationModal
          handleDelete={handleDelete}
          closeConfirmationModal={closeConfirmationModal}
        />
      )}
      <div className="sliderContainer">
        <div className="sliderHeader">
          <div className="headerLeft">
            <div className="sliderInput">
              <label htmlFor="file">
                Upload Image:
                <DriveFolderUploadOutlinedIcon className="folderIcon" />
                {sliderImgFileName}
              </label>
              <input
                type="file"
                id="file"
                onChange={(e) => {
                  setSliderImgFile(e.target.files[0]);
                  setSliderImgFileName(e.target.files[0].name);
                }}
                style={{ display: "none" }}
              />
            </div>
          </div>
          <div className="headerRight">
            <button className="addBannerButton" onClick={handleBannerSliderAdd}>
              <AddIcon />
              Upload New Banner
            </button>
          </div>
        </div>

        <div className="sliderWrapper">
          <Slider {...settings}>
            {bannerSliderContent.map((item) => (
              <div key={item.id}>
                <div className="slideContainer">
                  <img
                    src={item.imageUrl}
                    alt={item.content}
                    className="slideImage"
                  />
                  <div className="caption">
                    <h3 className="slideTitle">{item.content}</h3>
                    <div className="slideButtons">
                      <button
                        className="slideDeleteButton"
                        // onClick={() => handleDelete(item.id)}
                        onClick={() => setSelectedBannerToDelete(item.id)}
                      >
                        <DeleteForeverIcon className="slideDeleteIcon" />
                      </button>
                    </div>
                  </div>
                  {/* Confirmation Modal */}
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;
