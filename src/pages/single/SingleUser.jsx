import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import defaultUserIcon from "../../images/defaultUserIcon.png";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Firebase
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";

// Toast
import { showSuccessToast, showInfoToast } from "../../components/toast/Toast";

const SingleUser = () => {
  //------------------ Retrieve User ID  ------------------//
  const { userId } = useParams();
  // console.log(userId);

  const navigate = useNavigate();

  //------------------ Retrieve Users Data  ------------------//
  const [userData, setUserData] = useState();

  const getUserData = async () => {
    const docRef = doc(db, "UserData", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserData(docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  //------------------ Handle Change for Input  ------------------//
  const [newImageFile, setNewImageFile] = useState("");
  const [newImageFileName, setNewImageFileName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const handleChange = (e) => {
    const numberOnly = e.target.value.replace(/[^0-9]/g, "");
    setNewContactNumber(numberOnly);
  };
  // console.log(newAddress);

  //------------------ Update User Data Function  ------------------//
  // const handleUpdate = async () => {
  //   const docRef = doc(db, "UserData", userId);

  //   if (docRef !== null) {
  //     const updates = {};

  //     if (newFirstName !== "") {
  //       updates.firstName = newFirstName;
  //     }

  //     if (newLastName !== "") {
  //       updates.lastName = newLastName;
  //     }

  //     if (newEmail !== "") {
  //       updates.email = newEmail;
  //     }

  //     if (newContactNumber !== "") {
  //       updates.contactNumber = newContactNumber;
  //     }

  //     if (newAddress !== "") {
  //       updates.address = newAddress;
  //     }

  //     if (Object.keys(updates).length > 0) {
  //       await updateDoc(docRef, updates);
  //       showSuccessToast("User data is updated", 1000);
  //       navigate(-1);
  //     } else {
  //       showInfoToast("No changes made");
  //     }
  //   } else {
  //     showInfoToast("No user data");
  //   }
  // };
  const handleUpdate = async () => {
    const docRef = doc(db, "UserData", userId);

    if (docRef !== null) {
      const updates = {};

      if (newFirstName !== "") {
        updates.firstName = newFirstName;
      }

      if (newLastName !== "") {
        updates.lastName = newLastName;
      }

      if (newContactNumber !== "") {
        updates.contactNumber = newContactNumber;
      }

      if (newAddress !== "") {
        updates.address = newAddress;
      }

      if (newImageFile !== "") {
        const docSnapshot = await getDoc(docRef);
        const oldImageUrl = docSnapshot.data().profileImageUrl;

        if (oldImageUrl) {
          const oldImageRef = ref(storage, oldImageUrl);
          await deleteObject(oldImageRef);
        }

        const storageRef = ref(
          storage,
          `userProfile_images/${userData?.uid}/${new Date().getTime()}_${
            newImageFile.name
          }`
        );
        await uploadBytes(storageRef, newImageFile);
        const downloadURL = await getDownloadURL(storageRef);
        updates.profileImageUrl = downloadURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateDoc(docRef, updates);
        showSuccessToast("User data is updated", 1000);
        navigate(-1);
      } else {
        showInfoToast("No changes made");
      }
    } else {
      showInfoToast("No user data");
    }
  };

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="top">
          <div className="left">
            {userData?.role !== "Customer" ? (
              <>
                <div className="editButton" onClick={handleUpdate}>
                  Save
                </div>
              </>
            ) : null}
            <h1 className="title">Information</h1>
            <div className="item">
              {userData?.profileImageUrl === "" ||
              userData?.profileImageUrl === null ? (
                <img src={defaultUserIcon} alt="" className="itemImg" />
              ) : (
                <img
                  src={userData?.profileImageUrl}
                  alt=""
                  className="itemImg"
                />
              )}

              <div className="details">
                {/*-------------------- Full Name -------------------- */}

                <h1 className="itemTitle">
                  Full Name:&nbsp;{userData?.firstName}&nbsp;
                  {userData?.lastName}
                </h1>

                {/*-------------------- Role -------------------- */}
                {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Role:</span>
                      <span className="itemValue">{userData?.role}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">Role:</span>
                      <span className="itemValueCustomer">
                        {userData?.role}
                      </span>
                    </div>
                  </>
                )}

                {/*------------------ New Profile Image ------------------*/}
                {userData?.role !== "Customer" ? (
                  <>
                    {" "}
                    <div className="detailItem">
                      <label
                        htmlFor="file"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        New Profile Image:
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
                  </>
                ) : null}

                {/*-------------------- First Name -------------------- */}
                {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">First Name:</span>
                      <span className="itemValue">{userData?.firstName}</span>
                    </div>
                    <input
                      type="text"
                      // defaultValue={userData?.contactNumber}
                      placeholder="New First Name"
                      onChange={(e) => setNewFirstName(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">First Name:</span>
                      <span className="itemValueCustomer">
                        {userData?.firstName}
                      </span>
                    </div>
                  </>
                )}

                {/*-------------------- Last Name -------------------- */}
                {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Last Name:</span>
                      <span className="itemValue">{userData?.lastName}</span>
                    </div>
                    <input
                      type="text"
                      // defaultValue={userData?.contactNumber}
                      placeholder="New Last Name"
                      onChange={(e) => setNewLastName(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">Last Name:</span>
                      <span className="itemValueCustomer">
                        {userData?.lastName}
                      </span>
                    </div>
                  </>
                )}

                {/*-------------------- Email -------------------- */}
                {/* <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData?.email}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Email Address"
                  onChange={(e) => setNewEmail(e.target.value)}
                /> */}

                {/*-------------------- Contact Number -------------------- */}
                {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Contact Number:</span>
                      <span className="itemValue">
                        {userData?.contactNumber}
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={11}
                      value={newContactNumber}
                      placeholder="New Contact Number"
                      // onChange={(e) => setNewContactNumber(e.target.value)}
                      onChange={handleChange}
                    />
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">Contact Number:</span>
                      <span className="itemValueCustomer">
                        {userData?.contactNumber}
                      </span>
                    </div>
                  </>
                )}

                {/*-------------------- Address -------------------- */}
                {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Address:</span>
                      <span className="itemValue">{userData?.address}</span>
                    </div>
                    <input
                      type="text"
                      // defaultValue={userData?.contactNumber}
                      placeholder="New Address"
                      onChange={(e) => setNewAddress(e.target.value)}
                    />
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">Address:</span>
                      <span className="itemValueCustomer">
                        {userData?.address}
                      </span>
                    </div>
                  </>
                )}

                {/*-------------------- Email Verified -------------------- */}
                {/* {userData?.role !== "Customer" ? (
                  <>
                    <div className="detailItem">
                      <span className="itemKey">Email Verified:</span>
                      <span className="itemValue">
                        {userData?.emailVerified}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="detailItemCustomer">
                      <span className="itemKeyCustomer">Email Verified:</span>
                      <span className="itemValueCustomer">
                        {userData?.emailVerified}
                      </span>
                    </div>
                  </>
                )} */}
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

export default SingleUser;
