import defaultUserIcon from "./images/defaultUserIcon.png";
import moment from "moment";
/*------------------ User Column ------------------*/
export const userColumns = [
  { field: "uid", headerName: "ID", width: 150 },
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

  // {
  //   field: "isVerified",
  //   headerName: "Email Verified",
  //   width: 150,
  //   renderCell: (params) => {
  //     return params.row.isVerified ? (
  //       <div className={`cellWithIsVerified ${params.row.status}`}>
  //         Verified
  //       </div>
  //     ) : (
  //       <div className={`cellWithIsVerified ${params.row.status}`}>
  //         Not Verified
  //       </div>
  //     );
  //   },
  // },

  {
    field: "emailVerified",
    headerName: "Email Verified",
    width: 150,
    renderCell: (params) => {
      return (
        <div
          className={`cellWithEmailVerified ${
            params.row.emailVerified == "Verified" ? "verified" : "notVerified"
          }`}
        >
          {params.row.emailVerified == "Verified" ? "Verified" : "Not Verified"}
        </div>
      );
    },
  },
];

/*------------------ Product Column ------------------*/
export const productColumns = [
  { field: "id", headerName: "ID", width: 100 },
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

  // {
  //   field: "addOn",
  //   headerName: "Add-on Name",
  //   width: 180,
  // },

  // {
  //   field: "addOnPrice",
  //   headerName: "Add-on Price",
  //   width: 100,
  //   renderCell: (params) => {
  //     return (
  //       <div>
  //         {params.row.addOnPrice != " " && (
  //           <div>₱{parseFloat(params.row.addOnPrice).toFixed(2)}</div>
  //         )}
  //       </div>
  //     );
  //   },
  // },

  {
    field: "stock",
    headerName: "Stock",
    width: 100,
  },
];

/*------------------ Product Categories Column ------------------*/
export const productCategoryColumns = [
  { field: "productCategoryId", headerName: "Category ID", width: 160 },
  {
    field: "categoryName",
    headerName: "Category Name",
    width: 230,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img
            className="cellImg"
            src={params.row.categoryImg}
            alt="product-category-image"
          />
          {params.row.categoryName}
        </div>
      );
    },
  },
  {
    field: "slug",
    headerName: "Slug",
    width: 230,
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
