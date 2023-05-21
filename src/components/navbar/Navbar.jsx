import "./navbar.scss";
import { useEffect, useState, useContext } from "react";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import UserIcon from "../../images/user.png";

// Context
import { AuthContext } from "../../context/AuthContext";

// Firebase
import { db } from "../../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Navbar = () => {
  // const { currentUser } = useContext(AuthContext);
  // const [currentUser, setCurrentUser] = useState(null);

  //------------------ Retrieve Users Data ------------------//
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);

  const getUserData = () => {
    const userDataRef = collection(db, "UserData");
    const queryData = query(userDataRef, where("uid", "==", currentUser.uid));

    getDocs(queryData)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            setUserData(doc.data());
          });
        } else {
          console.log("Empty user document");
          setUserData(null); // Clear the userData state
        }
      })
      .catch((error) => {
        console.log("Error getting user data:", error);
        setUserData(null); // Clear the userData state
      });
  };

  useEffect(() => {
    if (currentUser) {
      getUserData();
    } else {
      setUserData(null); // Clear the userData state
    }
  }, [currentUser]);

  // console.log(userData);

  return (
    <div className="navbar">
      <div className="wrapper">
        {/* <div className="search">
          <input type="text" placeholder="Search..." />
          <SearchRoundedIcon />
        </div> */}
        <div className="items">
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />{" "}
            <div className="counter">1</div>
          </div>
          <div className="item">
            <img
              src={userData?.profileImageUrl || UserIcon}
              alt="Profile Avatar"
              className="avatar"
            />
            <span>
              {`${userData?.firstName} (${userData?.role})` || "User"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
