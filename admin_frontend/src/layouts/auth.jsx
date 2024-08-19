import { Routes, Route } from "react-router-dom";
import { SignIn } from "@/pages/auth";
import {
  ChartPieIcon,
  UserIcon,
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/solid";
export function Auth() {
  const navbarRoutes = [
    {
      layout: "auth",
      pages: [
        {
          name: "sign in",
          path: "/auth/sign-in",
          icon: ArrowRightOnRectangleIcon,
          element: <SignIn />
        }
      ]
    }
  ];

  return (
    <div className="relative min-h-screen w-full">
      <SignIn />
    </div>
  );
}

Auth.displayName = "/src/layout/Auth.jsx";

export default Auth;