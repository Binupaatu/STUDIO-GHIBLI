import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon, 
  RectangleStackIcon,
  CheckBadgeIcon,
  PencilSquareIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Courses, Notifications } from "@/pages/dashboard";
import { Customers } from "./pages/dashboard/courses/customers/customers";
import Enrollments from "./pages/dashboard/enrollments/enrollments";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "customers",
        path: "/customers",
        element: <Customers />,
      },
      {
        icon: <CheckBadgeIcon {...icon} />,
        name: "courses",
        path: "/courses",
        element: <Courses />,
      },
      {
        icon: <PencilSquareIcon {...icon} />,
        name: "enrollments",
        path: "/enrollments",
        element: <Enrollments />,
      },
    ],
  }
];

export default routes;
