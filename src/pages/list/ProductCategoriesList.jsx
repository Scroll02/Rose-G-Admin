import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import ProductCategoriesTable from "../../components/datatable/ProductCategoriesTable";

const ProductCategoriesList = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <ProductCategoriesTable />
      </div>
    </div>
  );
};

export default ProductCategoriesList;
