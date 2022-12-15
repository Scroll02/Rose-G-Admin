import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";

import defaultUserIcon from "../../images/defaultUserIcon.png";
import { useState, useEffect } from "react";
import {
  doc,
  setDoc,
  addDoc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { db, auth, storage } from "../../firebase";

const Single = () => {
  //------------------ Retrieve User ID  ------------------//
  const { userId } = useParams();
  // console.log(userId);

  //------------------ Rertrieve Users Data  ------------------//
  const [userData, setUserData] = useState();

  const getUserData = async () => {
    const docRef = doc(db, "UserData", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data: ", docSnap.data());
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
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newContactNumber, setNewContactNumber] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const handleChange = (e) => {
    const numberOnly = e.target.value.replace(/[^0-9]/g, "");
    setNewContactNumber(numberOnly);
  };
  // console.log(newAddress);

  //------------------ Update User Data Function  ------------------//
  const handleUpdate = async () => {
    const docRef = doc(db, "UserData", userId);

    if (docRef !== null) {
      if (newFullName !== "") {
        updateDoc(docRef, {
          fullName: newFullName,
        });
      }

      if (newContactNumber !== "") {
        updateDoc(docRef, {
          contactNumber: newContactNumber,
        });
      }

      if (newAddress !== "") {
        updateDoc(docRef, {
          address: newAddress,
        });
      }

      alert("User data is updated");
    } else {
      alert("No user data");
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
            <h1 className="title">Information</h1>
            <div className="item">
              <img src={defaultUserIcon} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{userData?.fullName}</h1>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Full Name"
                  onChange={(e) => setNewFullName(e.target.value)}
                />

                <div className="detailItem">
                  <span className="itemKey">Email:</span>
                  <span className="itemValue">{userData?.email}</span>
                </div>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Email Address"
                  onChange={(e) => setNewEmail(e.target.value)}
                />
                <div className="detailItem">
                  <span className="itemKey">Contact Number:</span>
                  <span className="itemValue">{userData?.contactNumber}</span>
                </div>
                <input
                  type="text"
                  maxLength={11}
                  value={newContactNumber}
                  placeholder="New Contact Number"
                  // onChange={(e) => setNewContactNumber(e.target.value)}
                  onChange={handleChange}
                />
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

export default Single;
