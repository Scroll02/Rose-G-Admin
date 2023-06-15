import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useNavigate } from "react-router-dom";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../../components/toast/Toast";
import { useState, useEffect } from "react";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// Firebase
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth, storage } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const userRoles = [
  {
    userRoleId: 1,
    userRoleName: "Super Admin",
  },
  {
    userRoleId: 2,
    userRoleName: "Admin",
  },
  {
    userRoleId: 3,
    userRoleName: "Rider",
  },
];

const NewUser = ({ inputs, title }) => {
  const [file, setFile] = useState("");
  const [data, setData] = useState({});
  const navigate = useNavigate();

  //------------------ Handle Input Fields ------------------//
  // Validation
  const [inputError, setInputError] = useState("");
  const [checkFirstName, setCheckFirstName] = useState(false);
  const [checkLastName, setCheckLastName] = useState(false);
  const [checkValidEmail, setCheckValidEmail] = useState(false);
  const [checkContactNumber, setCheckContactNumber] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });

    // Perform validation based on input id
    switch (id) {
      case "firstName":
        let regFirstName = /^[\w\d!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/~`_\s]{2,}$/;
        setCheckFirstName(!regFirstName.test(value));
        setInputError((prevError) => ({
          ...prevError,
          firstName: !regFirstName.test(value)
            ? "At least 2 characters and can include letters, special characters, numbers, and spaces."
            : "",
        }));
        break;
      case "lastName":
        let regLastName = /^[\w\d!@#$%^&*()\-+={[}\]|\\:;"'<,>.?/~`_\s]{2,}$/;
        setCheckLastName(!regLastName.test(value));
        setInputError((prevError) => ({
          ...prevError,
          lastName: !regLastName.test(value)
            ? "At least 2 characters and can include letters, special characters, numbers, and spaces."
            : "",
        }));
        break;
      case "email":
        let re = /\S+@\S+\.\S+/;
        let regex =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
        setCheckValidEmail(!(re.test(value) || regex.test(value)));
        setInputError((prevError) => ({
          ...prevError,
          email: !(re.test(value) || regex.test(value))
            ? `Please enter a valid email address. Example: sample@domain.com`
            : "",
        }));
        break;
      case "contactNumber":
        let regexContactNumber = /^0\d{10}$/;
        setCheckContactNumber(!regexContactNumber.test(value));
        setInputError((prevError) => ({
          ...prevError,
          contactNumber: !regexContactNumber.test(value)
            ? "Please enter a valid mobile number. Example: 0917123456"
            : "",
        }));
        break;
      case "password":
        let regexPassword =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;
        setCheckValidPassword(!regexPassword.test(value));
        setInputError((prevError) => ({
          ...prevError,
          password: !regexPassword.test(value)
            ? `Password must be at least 8 characters, 1 numeric character, 1
          lowercase letter, 1 uppercase letter, 1 special character`
            : "",
        }));
        break;
      default:
        break;
    }
  };

  // Password and Confirm Password Visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const handlePasswordVisibility = (inputId) => {
    if (inputId === "password") {
      setShowPassword(!showPassword);
    } else if (inputId === "cPassword") {
      setShowCPassword(!showCPassword);
    }
  };
  const handleInputFocus = () => {
    setShowPassword(false);
    setShowCPassword(false);
  };

  //------------------ Add New User Function ------------------//
  const [selectedUserRole, setSelectedUserRole] = useState("");
  var bcrypt = require("bcryptjs");
  // const handleAdd = async (e) => {
  //   e.preventDefault();
  //   // Check if any input field is empty
  //   if (
  //     !data.firstName ||
  //     !data.lastName ||
  //     !data.email ||
  //     !data.contactNumber ||
  //     !selectedUserRole
  //   ) {
  //     showErrorToast("Please fill out all input fields.", 2000);
  //     return;
  //   }

  //   // Check if all input fields meet the regex
  //   if (
  //     checkFirstName ||
  //     checkLastName ||
  //     checkValidEmail ||
  //     checkContactNumber
  //   ) {
  //     setInputError((prevError) => ({
  //       ...prevError,
  //       cPassword: "Confirm Password must match Password.",
  //     }));
  //     return;
  //   }

  //   try {
  //     const currentUser = auth.currentUser;
  //     const userId = currentUser.uid;

  //     const userDocRef = doc(db, "UserData", userId);
  //     const userDocSnapshot = await getDoc(userDocRef);

  //     if (userDocSnapshot.exists()) {
  //       const userData = userDocSnapshot.data();
  //       const firstName = userData.firstName;
  //       const lastName = userData.lastName;
  //       const profileImageUrl = userData.profileImageUrl;
  //       const role = userData.role;

  //       const monthDocumentId = moment().format("YYYY-MM");

  //       const activityLogDocRef = doc(db, "ActivityLog", monthDocumentId);
  //       const activityLogDocSnapshot = await getDoc(activityLogDocRef);
  //       const activityLogData = activityLogDocSnapshot.exists()
  //         ? activityLogDocSnapshot.data().actionLogData || []
  //         : [];

  //       const createdFields = [];

  //       Object.entries(data).forEach(([field, value]) => {
  //         if (field !== "password" && field !== "cPassword") {
  //           createdFields.push({
  //             field: field,
  //             value: value,
  //           });
  //         }
  //       });

  //       activityLogData.push({
  //         timestamp: new Date().toISOString(),
  //         createdFields: createdFields,
  //         userId: userId,
  //         firstName: firstName,
  //         lastName: lastName,
  //         profileImageUrl: profileImageUrl,
  //         role: role,
  //         actionType: "Create",
  //         actionDescription: "Created user data",
  //       });

  //       const res = await createUserWithEmailAndPassword(
  //         auth,
  //         data.email,
  //         data.password
  //       );

  //       let downloadURL = null;

  //       if (file) {
  //         const storageRef = ref(
  //           storage,
  //           `userProfile_images/${res.user.uid}/${new Date().getTime()}_${
  //             file.name
  //           }`
  //         );
  //         const uploadTask = uploadBytesResumable(storageRef, file);
  //         const snapshot = await uploadTask;
  //         downloadURL = await getDownloadURL(snapshot.ref);
  //       }

  //       const newDocRef = doc(collection(db, "UserData"), res.user.uid);
  //       await setDoc(newDocRef, {
  //         ...data,
  //         profileImageUrl: downloadURL || "",
  //         createdAt: serverTimestamp(),
  //         emailVerified: "Not Verified",
  //         role: selectedUserRole,
  //         uid: res.user.uid,
  //       });

  //       await setDoc(
  //         activityLogDocRef,
  //         {
  //           actionLogData: activityLogData,
  //         },
  //         { merge: true }
  //       );

  //       navigate("/users");
  //       showSuccessToast("New user is created", 2000);
  //     } else {
  //       showInfoToast("No user data");
  //     }
  //   } catch (err) {
  //     let errorMessage = "Failed to create user";

  //     if (err.code === "auth/email-already-in-use") {
  //       errorMessage = "Email address is already in use";
  //     } else if (err.code === "auth/weak-password") {
  //       errorMessage = "Password is too weak";
  //     }
  //     showErrorToast(errorMessage, 2000);
  //   }
  // };

  const handleAdd = async (e) => {
    e.preventDefault();
    // Check if any input field is empty
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.contactNumber ||
      !selectedUserRole
    ) {
      showErrorToast("Please fill out all input fields.", 2000);
      return;
    }

    // Check if all input fields meet the regex
    if (
      checkFirstName ||
      checkLastName ||
      checkValidEmail ||
      checkContactNumber
    ) {
      setInputError((prevError) => ({
        ...prevError,
        cPassword: "Confirm Password must match Password.",
      }));
      return;
    }

    try {
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

        Object.entries(data).forEach(([field, value]) => {
          if (field !== "password" && field !== "cPassword") {
            createdFields.push({
              field: field,
              value: value,
            });
          }
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
          actionDescription: "Created user data",
        });

        const res = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );

        let downloadURL = null;

        if (file) {
          const storageRef = ref(
            storage,
            `userProfile_images/${res.user.uid}/${new Date().getTime()}_${
              file.name
            }`
          );
          const uploadTask = uploadBytesResumable(storageRef, file);
          const snapshot = await uploadTask;
          downloadURL = await getDownloadURL(snapshot.ref);
        }

        const newDocRef = doc(collection(db, "UserData"), res.user.uid);
        await setDoc(newDocRef, {
          ...data,
          profileImageUrl: downloadURL || "",
          createdAt: serverTimestamp(),
          emailVerified: "Not Verified",
          role: selectedUserRole,
          uid: res.user.uid,
        });

        await setDoc(
          activityLogDocRef,
          {
            actionLogData: activityLogData,
          },
          { merge: true }
        );

        navigate("/users");
        showSuccessToast("New user is created", 2000);
      } else {
        showInfoToast("No user data");
      }
    } catch (err) {
      let errorMessage = "Failed to create user";

      if (err.code === "auth/email-already-in-use") {
        errorMessage = "Email address is already in use";
      } else if (err.code === "auth/weak-password") {
        errorMessage = "Password is too weak";
      }
      showErrorToast(errorMessage, 2000);
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
                  Profile Image:
                  <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />

                {/* User Role */}
                <label>Role:</label>
                <select
                  value={selectedUserRole}
                  onChange={(e) => setSelectedUserRole(e.target.value)}
                  className="selectCategory"
                >
                  <option value="" disabled>
                    --- Select role ---
                  </option>
                  {userRoles.map((item) => {
                    return (
                      <option key={item.userRoleId} value={item.userRoleName}>
                        {item.userRoleName}
                      </option>
                    );
                  })}
                </select>
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}:</label>
                  {input.id === "password" || input.id === "cPassword" ? (
                    <>
                      <div className="passwordContainer">
                        <input
                          id={input.id}
                          type={
                            input.id === "password"
                              ? showPassword
                                ? "text"
                                : "password"
                              : showCPassword
                              ? "text"
                              : "password"
                          }
                          placeholder={input.placeholder}
                          onChange={handleInput}
                          onFocus={handleInputFocus}
                        />
                        <div
                          className="passwordIcon"
                          onClick={() => handlePasswordVisibility(input.id)}
                        >
                          {input.id === "password" ? (
                            showPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )
                          ) : showCPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </div>
                      </div>
                      {inputError[input.id] && (
                        <p className="errorMessage">{inputError[input.id]}</p>
                      )}
                    </>
                  ) : (
                    <>
                      {/* <label>{input.label}</label> */}
                      <input
                        id={input.id}
                        type={input.type}
                        placeholder={input.placeholder}
                        onChange={handleInput}
                        onFocus={handleInputFocus}
                      />
                      {inputError[input.id] && (
                        <p className="errorMessage">{inputError[input.id]}</p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </form>
            <button onClick={handleAdd}>Create New User</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
