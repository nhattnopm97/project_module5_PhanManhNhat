import React, { useEffect, useState } from "react";
import PinterestIcon from "@mui/icons-material/Pinterest";
import styled from "styled-components";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import TextsmsIcon from "@mui/icons-material/Textsms";
import FaceIcon from "@mui/icons-material/Face";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import privateAxios from "../axiosIntercepter/privateAxios";
import { UserTs } from "../interface/userTc";
import ModalboxSetting from "../insidepage/ModalBoxSetting";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";

const Header = () => {
  let user = useSelector((state: any) => state.auth.user);
  const navigate = useNavigate();
  const [input, setInput] = useState<string>("");
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
  const [openModalSetting, setOpenModalSetting] = useState<boolean>(false);

  const onSearchSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(input);
  };
  useEffect(() => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    if (userLocal !== null) {
      privateAxios
        .get("http://localhost:3333/users/detail/" + userLocal.id)
        .then((response) => {
          // console.log(response);
          setUserLogin(response.data);
        })
        .catch((error) => {
          console.log(error);
          setUserLogin(null);
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    setUserLogin(user);
  }, [user]);

  return (
    <Wrapper>
      <LogoWrapper>
        <Link to="/">
          <PinterestIcon
            style={{
              color: "red",
              fontSize: "32px",
              cursor: "pointer",
              marginTop: "7px",
            }}
          />
        </Link>
      </LogoWrapper>
      <Link to="/">
        <HomePageButton>Trang chủ</HomePageButton>
      </Link>
      <NavLink className="mx-2" to="/createanewpin">
        <FollowingButton>Tạo</FollowingButton>
      </NavLink>
      {/* <Tippy
        interactive
        visible={input && searchResult.length > 0 ? true : false}
        render={(attrs) => (
          <div tabIndex={-1} {...attrs}>
            <div className="w-[726px] text-white bg-[#2f2739] py-2 rounded-3xl overflow-hidden">
              {searchResult.slice(0, 10).map((searchResult) => (
                <div
                  onClick={() => handleClickSearch(searchResult.id)}
                  className="w-full flex pl-4 items-center h-[40px] hover:bg-[#5d4d71] cursor-pointer"
                  key={searchResult.id}
                >
                  {searchResult.name}
                </div>
              ))}
            </div>
          </div>
        )}
      >
      </Tippy> */}
      <SearchWrapper>
        <SearchBarWrapper>
          <IconButton>
            <SearchIcon />
          </IconButton>
          <form>
            <input type="text" onChange={(e) => setInput(e.target.value)} />
            <button type="submit" onClick={onSearchSubmit}></button>
          </form>
        </SearchBarWrapper>
      </SearchWrapper>
      <div className="flex justify-center items-center gap-1">
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <IconButton>
          <TextsmsIcon />
        </IconButton>
        {userLogin === null ? (
          <Link to={`/profile/null`}>
            <IconButton>
              <FaceIcon />
            </IconButton>
          </Link>
        ) : (
          <>
            {Object.keys(userLogin).length === 0 ||
            userLogin.avatar === null ||
            userLogin.avatar === "" ? (
              <Link to={`/profile/${userLogin.id}`}>
                <IconButton>
                  <FaceIcon />
                </IconButton>
              </Link>
            ) : (
              <Link to={`/profile/${userLogin.id}`}>
                <div className="w-[30px] h-[30px] rounded-full overflow-hidden">
                  <img src={userLogin?.avatar} style={{ width: "30px" }} />
                </div>
              </Link>
            )}
          </>
        )}

        <IconButton onClick={() => setOpenModalSetting(true)}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </div>
      {openModalSetting && (
        <ModalboxSetting
          openModalSetting={openModalSetting}
          setOpenModalSetting={setOpenModalSetting}
          userLogin={userLogin}
        />
      )}
    </Wrapper>
  );
};
export default Header;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-item: center;
  height: 65px;
  padding: 12px 4px 4px 16px;
  background-color: white;
  color: black;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const LogoWrapper = styled.div`
  .MuiSvgIcon-root {
    color: #e60023;
    font-size: 32px;
    cursor: pointer;
  }
`;

const HomeButton = styled.div`
  display: flex;
  height: 43px;
  min-width: 123px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
`;

const HomePageButton = styled(HomeButton)`
  background-color: rgb(17, 17, 17);
  text-decoration: none;
  color: white;
  font-weight: 700;
`;

const FollowingButton = styled.div`
  display: flex;
  height: 43px;
  min-width: 60px;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  cursor: pointer;
  background-color: white;
  color: black;
  font-weight: 700;
  &:hover {
    background-color: #c1c1c1;
  }
`;

const SearchWrapper = styled.div`
  flex: 1;
`;

const SearchBarWrapper = styled.div`
  background-color: #efefef;
  display: flex;
  height: 43px;
  width: 100;
  border-radius: 50px;
  border: none;
  padding-left: 10px;

  form {
    display: flex;
    flex: 1;
  }

  form > input {
    background-color: transparent;
    border: none;
    width: 100%;
    margin-left: 5px;
    font-size: 16px;
  }

  form > button {
    display: none;
  }

  input:focus {
    outline: none;
  }
`;
