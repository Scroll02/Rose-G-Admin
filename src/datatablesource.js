import defaultUserIcon from "./images/defaultUserIcon.png";
import moment from "moment";
/*------------------ User Column ------------------*/
export const userColumns = [
  { field: "foodId", headerName: "ID", width: 70 },
  {
    field: "user",
    headerName: "User",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.img == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt={defaultUserIcon}
            />
          ) : (
            <img className="cellImg" src={params.row.img} alt="avatar" />
          )}
          {params.row.firstName}&nbsp;{params.row.lastName}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },

  // {
  //   field: "fullName",
  //   headerName: "Full Name",
  //   width: 180,
  // },
  {
    field: "contactNumber",
    headerName: "Contact Number",
    width: 150,
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    renderCell: (params) => {
      return (
        <div className={`cellWithStatus ${params.row.status}`}>
          {params.row.status}
        </div>
      );
    },
  },
];

/*------------------ User Rows (Temporary Data) ------------------*/
export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    age: 65,
  },
];

/*------------------ Food Column ------------------*/
export const foodColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "foodName",
    headerName: "Food Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          {params.row.foodName}
        </div>
      );
    },
  },
  {
    field: "description",
    headerName: "Food Description",
    width: 230,
  },

  {
    field: "price",
    headerName: "Price",
    width: 100,
    renderCell: (params) => {
      return <div>₱{parseFloat(params.row.price).toFixed(2)}</div>;
    },
  },

  {
    field: "categoryTitle",
    headerName: "Category",
    width: 150,
  },

  {
    field: "addOn",
    headerName: "Add-on Name",
    width: 180,
  },

  {
    field: "addOnPrice",
    headerName: "Add-on Price",
    width: 100,
    renderCell: (params) => {
      return (
        <div>
          {params.row.addOnPrice != " " && (
            <div>₱{parseFloat(params.row.addOnPrice).toFixed(2)}</div>
          )}
        </div>
      );
    },
  },

  {
    field: "stock",
    headerName: "Stock",
    width: 100,
  },
];

export const foodRows = [
  {
    id: 1,
    foodname: "Palabok",
    foodImg:
      "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    fooddescription: "Masarap",
    foodprice: 300,
    foodcategory: "Pasta",
    addonname: "Egg",
    addonprice: 30,
    stock: 10,
  },

  {
    id: 2,
    foodname: "Palabok",
    foodImg:
      "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    fooddescription: "Masarap",
    foodprice: 300,
    foodcategory: "Pasta",
    addonname: "Egg",
    addonprice: 30,
    stock: 10,
  },

  {
    id: 3,
    foodname: "Palabok",
    foodImg:
      "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    fooddescription: "Masarap",
    foodprice: 300,
    foodcategory: "Pasta",
    addonname: "Egg",
    addonprice: 30,
    stock: 10,
  },
];

/*------------------ Order Columns ------------------*/
export const orderColumns = [
  { field: "orderId", headerName: "Order ID", width: 160 },
  {
    field: "orderPayment",
    headerName: "Order Payment",
    width: 180,
  },
  {
    field: "orderTotalCost",
    headerName: "Order Total Cost",
    width: 150,
    renderCell: (params) => {
      return <div>₱{parseFloat(params.row.orderTotalCost).toFixed(2)}</div>;
    },
  },

  {
    field: "orderDate",
    headerName: "Order Date",
    width: 210,
    renderCell: (params) => {
      return (
        <div>
          {moment(params.row.orderDate.toDate()).format("MMM D, YYYY h:mm A")}
        </div>
      );
    },
  },

  {
    field: "orderStatus",
    headerName: "Order Status",
    width: 150,
  },

  {
    field: "deliveryRiderInfo",
    headerName: "Delivery Rider Information",
    width: 250,
  },
];
