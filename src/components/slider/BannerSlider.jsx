import React from "react";
import "./slider.scss";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import TrashCan from "../../images/trash-can.png";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

// Firebase
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";

// Toast
import { showSuccessToast, showErrorToast } from "../toast/Toast";

const BannerSlider = () => {
  const [sliderImgFile, setSliderImgFile] = useState(null);
  const [sliderImgFileName, setSliderImgFileName] = useState("");
  const [bannerSliderContent, setBannerSliderContent] = useState([]);

  // function to upload image to Firebase Storage
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

  // function to add new banner to HomeSliderData collection
  const handleBannerSliderAdd = async () => {
    if (!sliderImgFile) {
      showErrorToast("Please upload an image first");
      return;
    }

    try {
      const downloadURL = await handleImageUpload();
      const randomId = Math.floor(Math.random() * 9000) + 1000; // generates a random 4-digit number
      const content = `Banner ${randomId}`;
      const docRef = await addDoc(collection(db, "BannerSliderData"), {
        id: randomId,
        content,
        imageUrl: downloadURL,
      });
      setBannerSliderContent([
        ...bannerSliderContent,
        { id: docRef.id, content, imageUrl: downloadURL },
      ]);
      setSliderImgFile(null);
      setSliderImgFileName("");
      showSuccessToast("Banner slider added successfully!", 2000);
    } catch (error) {
      console.error(error);
      showErrorToast("Error adding banner slider. Please try again.", 2000);
    }
  };

  // function to delete a banner from HomeSliderData collection
  const handleBannerSliderDelete = async (id) => {
    try {
      const docRef = doc(db, "BannerSliderData", id);
      const docSnap = await getDoc(docRef);
      const imageUrl = docSnap.data().imageUrl;

      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);

      await deleteDoc(docRef);
      setBannerSliderContent(
        bannerSliderContent.filter((item) => item.id !== id)
      );
      showSuccessToast("Banner slider data is deleted", 2000);
    } catch (err) {
      console.log(err);
      showErrorToast("Error deleting product", 2000);
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
                        onClick={() => handleBannerSliderDelete(item.id)}
                      >
                        <DeleteForeverIcon className="slideDeleteIcon" />
                      </button>
                    </div>
                  </div>
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
