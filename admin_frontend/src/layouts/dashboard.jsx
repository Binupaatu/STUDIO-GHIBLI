import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator, 
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddCourse from "@/pages/dashboard/courses/add-course";
import EditCourse from "@/pages/dashboard/courses/edit-course";
import { EditCustomer } from "@/pages/dashboard/courses/customers/edit-customer";

//import AddCourse from "@/pages/dashboard/courses/add-course";
//import EditCourse from "@/pages/dashboard/courses/edit-course";


export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
          <Route exact path={"courses/add"} element={<AddCourse />} />
          <Route exact path={"courses/edit/:id"} element={<EditCourse />} />
          <Route exact path={"customers/edit/:id"} element={<EditCustomer />} />          
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
