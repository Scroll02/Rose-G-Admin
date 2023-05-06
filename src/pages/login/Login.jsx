import "./login.scss";
import { useState, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { showSuccessToast } from "../../components/toast/Toast";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        dispatch({ type: "LOGIN", payload: user });
        showSuccessToast("You've successfully login", 1000);
        navigate("/home");
      })
      .catch((error) => {
        setError(true);
      });
  };

  // const handleLogin = (e) => {
  //   e.preventDefault();

  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(async (userCredential) => {
  //       const user = userCredential.user;

  //       // Retrieve the user's role from Firebase Firestore
  //       const userDocRef = doc(db, "UserData", user.uid);
  //       const userDocSnapshot = await getDoc(userDocRef);
  //       const userData = userDocSnapshot.data();
  //       const userRole = userData.role;

  //       console.log(userRole);
  //       // Check if the user's role is one of the allowed roles
  //       if (userRole === "Super Admin" || userRole === "Admin") {
  //         dispatch({ type: "LOGIN", payload: user });
  //         showSuccessToast("You've successfully login", 1000);
  //         navigate("/home");
  //       } else {
  //         // Show an error message if the user's role is not allowed
  //         setError(true);
  //       }
  //     })
  //     .catch((error) => {
  //       setError(true);
  //     });
  // };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {error && <span>Wrong email or password</span>}
      </form>
    </div>
  );
};

export default Login;
