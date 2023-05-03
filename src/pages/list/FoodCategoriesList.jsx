import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import FoodCategoriesTable from "../../components/datatable/FoodCategoriesTable";

const FoodCategoriesList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <FoodCategoriesTable />
      </div>
    </div>
  );
};

export default FoodCategoriesList;
