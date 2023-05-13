import defaultUserIcon from "./images/defaultUserIcon.png";
import moment from "moment";
/*------------------ User Column ------------------*/
export const userColumns = [
  {
    field: "uid",
    headerName: "User ID",
    width: 120,
    headerClassName: "headerName",
  },
  {
    field: "fullName",
    headerName: "Full Name",
    width: 230,
    headerClassName: "headerName",
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
    headerClassName: "headerName",
  },

  {
    field: "contactNumber",
    headerName: "Contact Number",
    width: 160,
    headerClassName: "headerName",
  },
  {
    field: "address",
    headerName: "Address",
    width: 250,
    headerClassName: "headerName",
  },
  {
    field: "status",
    headerName: "Status",
    width: 160,
    headerClassName: "headerName",
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
    headerClassName: "headerName",
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
  { field: "id", headerName: "Product ID", width: 120 },
  // {
  //   field: "productName",
  //   headerName: "Product Name",
  //   width: 230,
  //   renderCell: (params) => {
  //     return (
  //       <div className="cellWithImg">
  //         <img className="cellImg" src={params.row.img} alt="avatar" />
  //         {params.row.productName}
  //       </div>
  //     );
  //   },
  // },
  {
    field: "productName",
    headerName: "Product Name",
    width: 230,
    renderCell: (params) => {
      const criticalStock = params.row.criticalStock;
      const stock = params.row.stock;
      const textColor = stock <= criticalStock ? "red" : "inherit";
      const fontWeight = stock <= criticalStock ? 700 : "inherit";
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.img} alt="avatar" />
          <div style={{ color: textColor, fontWeight: fontWeight }}>
            {params.row.productName}
          </div>
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
    width: 120,
    renderCell: (params) => {
      return (
        <div>
          ₱
          {parseFloat(params.row.price)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      );
    },
  },

  {
    field: "categoryName",
    headerName: "Category",
    width: 150,
  },

  // {
  //   field: "stock",
  //   headerName: "Stock",
  //   width: 100,
  // },
  {
    field: "stock",
    headerName: "Stock",
    width: 100,
    renderCell: ({ row: { stock, criticalStock } }) => {
      const textColor = stock <= criticalStock ? "red" : "inherit";
      return (
        <div
          style={{
            color: textColor,
            fontWeight: stock <= criticalStock ? 700 : "normal",
          }}
        >
          {stock}
        </div>
      );
    },
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
    field: "customer",
    headerName: "Customer",
    width: 200,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.img == null ? (
            <img
              className="cellImg"
              src={defaultUserIcon}
              alt="Default User Icon"
            />
          ) : (
            <img className="cellImg" src={params.row.img} alt="avatar" />
          )}
          <div className="customerName">
            <span>
              {params.row.orderFirstName}&nbsp;{params.row.orderLastName}
            </span>
          </div>
        </div>
      );
    },
  },
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
      return (
        <div>
          ₱
          {parseFloat(params.row.orderTotalCost)
            .toFixed(2)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </div>
      );
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
    renderCell: (params) => {
      return (
        <div className={`cellOrderStatus ${params.row.orderStatus}`}>
          {params.row.orderStatus}
        </div>
      );
    },
  },

  {
    field: "deliveryRider",
    headerName: "Delivery Rider",
    width: 180,
  },
];
