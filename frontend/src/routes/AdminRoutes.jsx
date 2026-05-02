import { Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import RequireAuth from "./RequireAuth";

import Dashboard from "../pages/admin/Dasboard";
import UsersIndex from "../pages/admin/Users";
import EditUser from "../pages/admin/Users/Edit";
import NewUser from "../pages/admin/Users/Create";
import ViewUser from "../pages/admin/Users/View";
import PropertyType from "../pages/admin/MasterData/PropertyType";
import LocationMaster from "../pages/admin/MasterData/Locations";
import WebSiteUsers from "../pages/admin/WebSiteUsers/list";
import WebUserEdit from "../pages/admin/WebSiteUsers/edit";
import WebUserCreate from "../pages/admin/WebSiteUsers/create";
import PropertiesAdmin from "../pages/admin/Properties/AllProperties";
import CreateEditProperty from "../pages/admin/Properties/CreateEditProperty";
import ProfileMenu from "../pages/admin/Users/ProfileMenu";
import PropertyList from "../pages/admin/Properties/ListedProperties";
import PropertyListedAdd from "../pages/admin/Properties//ListedPropertyAdd";
import PropertiesView from "../pages/admin/Properties/PropertyView";
import Setting from "../pages/admin/Setting/SettingPage";
import ReportsAnalytics from "../pages/admin/Reports/ReportsAnalytics";
import RangeMaster from "../pages/admin/MasterData/Range";

export default function AdminRoutes() {
  return (
    <Routes>
      {/* PROTECTED ROUTES */}
      <Route element={<RequireAuth />}>
        <Route path="/app" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UsersIndex />} />
          <Route path="users/create" element={<NewUser />} />
          <Route path="users/:id/edit" element={<EditUser />} />
          <Route path="users/:id/view" element={<ViewUser />} />
          <Route path="property-type" element={<PropertyType />} />
          <Route path="location-master" element={<LocationMaster />} />
          <Route path="web-users-list" element={<WebSiteUsers />} />
          <Route path="web-users/:id/edit" element={<WebUserEdit />} />
          <Route path="web-users-create" element={<WebUserCreate />} />
          <Route path="all-properties" element={<PropertiesAdmin />} />
          <Route path="properties/create" element={<CreateEditProperty />} />
          <Route path="properties/:id/edit" element={<CreateEditProperty />} />
          <Route path="profile" element={<ProfileMenu />} />
          <Route path="property-list" element={<PropertyList />} />
          <Route path="data/property-listed-add/:id/display" element={<PropertyListedAdd />} />
          <Route path="properties/:id/view" element={<PropertiesView />} />
          <Route path="setting" element={<Setting />} />
          <Route path="report" element={<ReportsAnalytics />} />
          <Route path="range-master" element={<RangeMaster />} />
        </Route>
      </Route>
    </Routes>
  );
}
