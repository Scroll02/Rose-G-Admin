import React, { useState, useEffect } from "react";
import "./deliveryFee.scss";
import DeliveryImg from "../../images/delivery-fee.svg";
import moment from "moment";
// Firebase
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
// Toast
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../toast/Toast";

const DeliveryFee = () => {
  const [deliveryFee, setDeliveryFee] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [initialDeliveryFee, setInitialDeliveryFee] = useState("");

  useEffect(() => {
    const fetchDeliveryFee = async () => {
      try {
        const docRef = doc(db, "DeliveryFee", "deliveryFee");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDeliveryFee(docSnap.data().value);
          setInitialDeliveryFee(docSnap.data().value);
        }
      } catch (error) {
        console.error("Error fetching delivery fee:", error);
      }
    };

    fetchDeliveryFee();
  }, []);

  const handleInputChange = (event) => {
    if (isEditable) {
      const { value } = event.target;
      // Validate input as a decimal number
      const decimalRegex = /^\d+(\.\d{0,2})?$/;
      if (decimalRegex.test(value) || value === "") {
        setDeliveryFee(value);
      }
    }
  };

  const handleEditClick = () => {
    setIsEditable(!isEditable);
    if (!isEditable) {
      // Enable editable mode
      setInitialDeliveryFee(deliveryFee);
    } else {
      // Revert back to the initial delivery fee value
      setDeliveryFee(initialDeliveryFee);
    }
  };

  // const handleSaveClick = async () => {
  //   try {
  //     // Save the delivery fee to the DeliveryFee collection
  //     const deliveryData = {
  //       value: Number(deliveryFee),
  //     };

  //     // Add the delivery data to the DeliveryFee collection in Firebase Firestore
  //     const docRef = doc(db, "DeliveryFee", "deliveryFee");
  //     await setDoc(docRef, deliveryData);

  //     setIsEditable(false);
  //     showSuccessToast("Delivery fee saved successfully", 2000);
  //   } catch (error) {
  //     showErrorToast("Error saving delivery fee", 2000);
  //   }
  // };

  const handleSaveClick = async () => {
    try {
      const docRef = doc(db, "DeliveryFee", "deliveryFee");
      const docSnapshot = await getDoc(docRef);
      const oldDeliveryFee = docSnapshot.data().value;
      const newDeliveryFeeValue = Number(deliveryFee);

      if (oldDeliveryFee !== newDeliveryFeeValue) {
        const updates = {
          value: newDeliveryFeeValue,
        };
        await updateDoc(docRef, updates);

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

          const updatedFields = [
            {
              field: "value",
              oldValue: oldDeliveryFee,
              newValue: newDeliveryFeeValue,
            },
          ];

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
            actionDescription: "Updated delivery fee data",
          });

          await setDoc(
            activityLogDocRef,
            {
              actionLogData: activityLogData,
            },
            { merge: true }
          );

          setIsEditable(false);
          showSuccessToast("Delivery fee saved successfully", 2000);
        } else {
          showInfoToast("No user data");
        }
      } else {
        showInfoToast("No changes were made.");
      }
    } catch (error) {
      showErrorToast("Error saving delivery fee", 2000);
    }
  };

  return (
    <div className="deliveryWrapper">
      <div class="imageWrapper">
        <img src={DeliveryImg} alt="Delivery Image" />
      </div>
      <h1>Delivery Fee</h1>
      <input
        type="text"
        className={`inputField ${isEditable ? "editable" : ""}`}
        placeholder="Enter delivery fee"
        value={isEditable ? deliveryFee : parseFloat(deliveryFee).toFixed(2)}
        onChange={handleInputChange}
        readOnly={!isEditable}
      />
      <div className="buttonContainer">
        <button
          className={`editButton ${isEditable ? "cancelButton" : ""}`}
          onClick={handleEditClick}
        >
          {isEditable ? "Cancel" : "Edit"}
        </button>
        <button
          className={`saveButton ${!isEditable ? "disabled" : ""}`}
          onClick={handleSaveClick}
          disabled={!isEditable}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default DeliveryFee;
