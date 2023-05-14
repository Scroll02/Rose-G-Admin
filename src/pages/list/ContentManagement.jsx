import Sidebar from "../../components/sidebar/Sidebar";
import "./list.scss";
import Navbar from "../../components/navbar/Navbar";
import HomeSlider from "../../components/slider/HomeSlider";
const ContentManagement = () => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        <Navbar />
        <HomeSlider />
      </div>
    </div>
  );
};

export default ContentManagement;
