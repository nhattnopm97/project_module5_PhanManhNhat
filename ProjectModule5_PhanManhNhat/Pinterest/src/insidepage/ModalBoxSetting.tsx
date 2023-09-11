import React from "react";
import "../css/modalboxsetting.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { UserTs } from "../interface/userTc";
import { loginRedux } from "../redux/userReducer";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";

interface ModalBoxSettingProps {
  openModalSetting: boolean;
  setOpenModalSetting: React.Dispatch<React.SetStateAction<boolean>>;
  userLogin: UserTs | null;
}

function ModalboxSetting({
  openModalSetting,
  setOpenModalSetting,
  userLogin,
}: ModalBoxSettingProps): JSX.Element {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleCloseSettingModal = () => {
    setOpenModalSetting(false);
  };

  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const handleLogout = () => {
    localStorage.removeItem("userLocal");
    handleCloseSettingModal();
    dispatch(loginRedux({}));
    navigate("/login");
  };

  return (
    <>
      {/* The Modal */}
      <div
        className="modal"
        style={openModalSetting ? { display: "block" } : { display: "none" }}
        onClick={handleCloseSettingModal}
      >
        {/* Modal content */}
        <div className="modalContent px-5" onClick={handleModalContentClick}>
          {userLogin === null || Object.keys(userLogin).length === 0 ? (
            <div className="settingWrapper">
              <Link className="flex items-center" to="/login">
                <div className="settingLogin">Đăng Nhập</div>
              </Link>
              <Link className="flex items-center" to="/register">
                <div className="settingRegister mb-5">Đăng Ký</div>
              </Link>
            </div>
          ) : (
            <div>
              <div className="LoginStatus">Đang đăng nhập</div>
              <Link
                className="flex items-center mt-5 py-3 px-5 rounded-md overflow-hidden bg-slate-300"
                to={`/profile/${userLogin.id}`}
              >
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <img
                    width="50px"
                    src={
                      userLogin.avatar && userLogin.avatar.length > 0
                        ? userLogin.avatar
                        : ""
                    }
                    alt=""
                  />
                </div>
                <div className="cursor-pointer w-full ml-2">
                  <div className="font-bold">{userLogin.name}</div>
                  <div>{userLogin.email}</div>
                </div>
              </Link>
              <div
                className="cursor-pointer rounded-md mb-5 overflow-hidden hover:bg-slate-300 mt-5 pl-5"
                onClick={handleLogout}
              >
                <div className="py-3">Đăng xuất</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ModalboxSetting;
