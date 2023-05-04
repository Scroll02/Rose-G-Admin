import "./single.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Chart from "../../components/chart/Chart";
import List from "../../components/table/Table";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";

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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newSlug, setNewSlug] = useState("");

  //------------------ Update Food Data Function  ------------------//
  const handleUpdate = async () => {
    const docRef = doc(db, "ProductCategories", categoryId);

    if (docRef !== null) {
      if (newCategoryName !== "") {
        updateDoc(docRef, {
          categoryName: newCategoryName,
        });
      }

      if (newSlug !== "") {
        updateDoc(docRef, {
          bagSlug: newSlug,
        });
      }

      alert("Category data is updated");
      navigate(-1);
    } else {
      alert("No category data");
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
              <div className="details">
                {/*------------------ Food Name ------------------*/}
                <h1 className="itemTitle">
                  Category Name:&nbsp;{categoryData?.categoryName}
                </h1>
                <input
                  type="text"
                  // defaultValue={userData?.contactNumber}
                  placeholder="New Category Name"
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />

                {/*------------------ Food Description ------------------*/}
                <div className="detailItem">
                  <span className="itemKey">Bag Slug:</span>
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
        <div className="bottom">
          <h1 className="title">Last Transactions</h1>
          <List />
        </div>
      </div>
    </div>
  );
};

export default SingleProductCategory;
