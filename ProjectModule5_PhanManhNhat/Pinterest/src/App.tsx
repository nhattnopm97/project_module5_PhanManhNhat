import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Login from "./page/Login";
import Register from "./page/Register";
import Header from "./layout/Header";
import NotFound from "./page/NotFound";
import MainBoard from "./page/Mainboard";
import CreateANewPin from "./page/CreateANewPin";
import Profile from "./page/Profile";
import DetailImg from "./page/DetailImg";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CollectionDetail from "./page/CollectionDetail";
import SettingProfile from "./page/SettingProfile";

function App() {
  let user = useSelector((state: any) => state.auth.user);
  const [currentUser, setCurrentUser] = useState(true);

  useEffect(() => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    setCurrentUser(userLocal);
  }, [user]);

  const PrivateRoute = () => {
    return currentUser ? <Outlet /> : <Navigate to="/login" />;
  };
  return (
    <>
      <div>
        <Header></Header>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<MainBoard />}></Route>
            <Route path="/createanewpin" element={<CreateANewPin />}></Route>
            <Route path="/profile/:id" element={<Profile />}></Route>
            <Route path="/detailImg/:id" element={<DetailImg />}></Route>
            <Route path="/settingprofile" element={<SettingProfile />}></Route>
            <Route
              path="/collectiondetail/:id"
              element={<CollectionDetail />}
            ></Route>
          </Route>

          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/notfound" element={<NotFound />}></Route>
          <Route path="/*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
