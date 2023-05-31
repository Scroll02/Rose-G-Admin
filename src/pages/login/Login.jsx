import "./login.scss";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

// Icon and Images
import adminlogo from "../../images/adminlogo.png";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

// Firebase
import { db, auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  where,
  getDocs,
  query,
  doc,
  updateDoc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Toast
import { showSuccessToast, showErrorToast } from "../../components/toast/Toast";

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  // Update Activity Log Data once login
  const updateActivityLog = async (uid, userData) => {
    const monthDocumentId = moment().format("YYYY-MM");

    const docRef = doc(db, "ActivityLog", monthDocumentId);
    const docSnap = await getDoc(docRef);

    const uniqueId = `${uid}-${Date.now()}`; // Generate a unique ID
    const logData = {
      id: uniqueId,
      uid,
      profileImageUrl: userData.profileImageUrl,
      firstName: userData.firstName,
      lastName: userData.lastName,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedLogData = { ...logData }; // Create a copy of logData

    if (docSnap.exists()) {
      const activityLogData = docSnap.data().activityLogData || [];
      activityLogData.push(updatedLogData);
      await updateDoc(docRef, { activityLogData });
    } else {
      await setDoc(docRef, { activityLogData: [updatedLogData] });
    }
  };

  // Login function
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if the user has the correct role
    const usersRef = collection(db, "UserData");
    const queryRef = query(usersRef, where("email", "==", email));
    getDocs(queryRef)
      .then((querySnapshot) => {
        const userDoc = querySnapshot.docs[0];
        if (userDoc && ["Super Admin", "Admin"].includes(userDoc.data().role)) {
          // User has the correct role, proceed with login
          signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
              // Signed in
              const user = userCredential.user;
              dispatch({ type: "LOGIN", payload: user });
              showSuccessToast("You've successfully logged in", 2000);

              // Query the UserData collection again to get the updated document
              const updatedQuerySnapshot = await getDocs(queryRef);
              const updatedUserDoc = updatedQuerySnapshot.docs[0];
              const userData = updatedUserDoc.data();

              // Update lastLoginAt field in UserData
              const userRef = doc(db, "UserData", user.uid);
              await updateDoc(userRef, {
                lastLoginAt: new Date().toISOString(),
              });

              // Call the function to update activity log with user data
              updateActivityLog(user.uid, userData);

              navigate("/home");
            })
            .catch((error) => {
              showErrorToast(
                "Failed to sign in. Please check your email and password.",
                2000
              );
            });
        } else {
          // User does not have the correct role, show error
          showErrorToast(
            "You do not have permission to access this website.",
            2000
          );
        }
      })
      .catch((error) => {
        showErrorToast(
          "Failed to retrieve user information. Please try again later.",
          2000
        );
      });
  };

  return (
    <div className="loginBody">
      <div className="loginContainer">
        <img src={adminlogo} alt="" />
        <h2>
          Welcome back, admin! Please enter your login credentials to access the
          dashboard.
        </h2>

        <form onSubmit={handleLogin} className="loginForm">
          {/* Email Field */}
          <div className="loginFormGroup">
            <div className="loginInputContainer">
              <input
                type="email"
                placeholder="Email"
                className="loginFormInput"
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => {
                  setEmailFocus(true);
                  setShowPassword(false);
                  setPasswordFocus(false);
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="loginFormGroup">
            <div className="loginInputContainer">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="loginFormInput"
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => {
                  setEmailFocus(false);
                  setPasswordFocus(true);
                }}
              />
              {/* Toggle On and Off Eye Icon */}
              <div
                className="loginInputIcon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <VisibilityOffIcon className="visibilityIcon" />
                ) : (
                  <VisibilityIcon className="visibilityIcon" />
                )}
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button type="submit">Login</button>
          {error && <span>Wrong email or password</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;
