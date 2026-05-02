import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import Footer from "../src/pages/landing/Footer";
import AdminRoutes from "./routes/AdminRoutes";


function App() {
  const location = useLocation();

  // hide navbar on admin routes
  const isAdminRoute = location.pathname.startsWith("/app");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <AppRoutes />
      
      <AdminRoutes />
      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
