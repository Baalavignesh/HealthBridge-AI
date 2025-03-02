import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import withAuth from "./HOC/withAuth";
import { PRIMARY } from "./constants/colors";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";
import Error from "./pages/error";
import Doctor from "./pages/doctor";
import Patient from "./pages/paitent";
import Welcome from "./pages/welcome";
import Register from "./pages/register";

PRIMARY;
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" Component={Welcome} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />

        <Route path="/doctor" Component={withAuth(Doctor)} />
        <Route path="/patient" Component={withAuth(Patient)} />
        <Route path="*" Component={Error} />
      </Routes>
    </Router>
  );
}

export default App;
