import Navbar from "../../components/navbar/Navbar";
import "./new.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

import { useNavigate } from "react-router-dom";

const NewFoodCategory = ({ inputs, title }) => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  //------------------ Handle Input For Fields ------------------//
  const handleInput = (e) => {
    const id = e.target.id;
    const value = e.target.value;
    setData({ ...data, [id]: value });
  };

  //------------------ Add New Food Function ------------------//
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await addDoc(collection(db, "FoodCategories"), {
        ...data,
        foodCategoryId: new Date().getTime().toString(),
      });
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
    alert("New category is added");
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
          <div className="right">
            <form>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    type={input.type}
                    placeholder={input.placeholder}
                    onChange={handleInput}
                  />
                </div>
              ))}
            </form>
            <button onClick={handleAdd}>Add New Category</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFoodCategory;
