import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";

function App() {
 
  
  const isLoggedIn = () => {
    const value = localStorage.getItem('authToken');
    console.log(Math.random() + ' >> ' + value);
    //return true;
    return value !== null && value !== ''; // Return true if there's a token and it's not an empty string
  };
  

  return (
    <Routes>
      <Route path="/dashboard/*" element={isLoggedIn() ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />} />
      <Route path="/auth/*" element={!isLoggedIn() ? <Auth /> : <Navigate to="/dashboard/home" replace />} />
      <Route path="*" element={<Navigate to={isLoggedIn() ? "/dashboard/home" : "/auth/sign-in"} replace />} />
    </Routes>
  );
}

export default App;
