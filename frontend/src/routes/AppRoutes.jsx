import { Routes, Route } from "react-router-dom";
import Home from "../pages/landing/Home";
import About from "../pages/landing/About";
import Properties from "../pages/landing/Properties";
import PropertyDetails from "../pages/landing/PropertyDetails";
import Contact from "../pages/landing/Contact";
import SignupPage from "../pages/auth/SignupPage";
import LoginPage from "../pages/auth/Login";
import AdminLoginPage from "../pages/auth/admin_login";
import PropertyOwnerDetail from "../pages/landing/PropertyOwnedetail";
import PublicRoutes from "./PublicRoutes";
import SearchdataShow from "../pages/landing/SearchdataShow";

export default function AppRoutes() {
  return (
    // <Routes>
    //   <Route path="/" element={<Home />} />
    //   <Route path="/about" element={<About />} />

    //   <Route path="/contact" element={<Contact />} />
    //   <Route path="/propertydetails" element={<PropertyDetails />} />
    //   {/* <Route path="/signup" element={<SignUp />} /> */}
    //   <Route path="/login" element={<LoginPage />} />
    //   <Route path="/signup" element={<SignupPage />} />

    //   <Route element={<PublicRoutes />}>

    //     <Route path="/property-owner-detail/:propertyId" element={<PropertyOwnerDetail />} />
    //   </Route>
    //   <Route path="/admin/login" element={<AdminLoginPage />} />
    //   <Route path="/properties" element={<Properties />} />
    // </Routes>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/properties" element={<Properties />} />
      <Route path="/propertydetails" element={<PropertyDetails />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/contact" element={<Contact />} />

      {/*  Protected Routes */}
      <Route element={<PublicRoutes />}>
        <Route path="/property-owner-detail/:propertyId" element={<PropertyOwnerDetail />}

        />
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/property-search-data-show-detail" element={<SearchdataShow />}

        />
      </Route>
    </Routes>

  );
}
