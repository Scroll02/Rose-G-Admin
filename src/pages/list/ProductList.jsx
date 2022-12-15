import Sidebar from "../../components/sidebar/Sidebar";
import "./productList.scss";
import Navbar from "../../components/navbar/Navbar";
import ProductTable from "../../components/datatable/ProductTable";

const ProductList = () => {
    return (
        <div className="list"> 
            <Sidebar/>
            <div className="listContainer">
                <Navbar/>
                <ProductTable/>
            </div>
        </div>
    )
}

export default ProductList

