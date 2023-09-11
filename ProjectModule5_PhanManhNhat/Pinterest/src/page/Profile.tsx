import { useEffect, useState } from "react";
import "../css/profile.css";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Create from "../insidepage/Create";
import Collection from "../insidepage/Collection";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import privateAxios from "../axiosIntercepter/privateAxios";
import { UserTs } from "../interface/userTc";
import { CollectionTs } from "../interface/collectionTc";
import { PinTc } from "../interface/pinTc";
import { PinInClt } from "../interface/pinInCltTc";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isCreate, setIsCreate] = useState<boolean>(true);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
  const [collection, setCollection] = useState<CollectionTs[]>([]);
  const [pinOfUser, setPinOfUser] = useState<PinTc[]>([]);
  const [pinInClt, setPinInClt] = useState<PinInClt[]>([]);

  const loadPinInCollection = async (userId: number) => {
    try {
      let res = await axios.get(`http://localhost:3333/pin/user/${userId}`);
      // console.log("loadPinInCollection", res.data);
      setPinInClt(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadcollection = async () => {
    try {
      let res = await axios.get("http://localhost:3333/collection/" + id);
      setCollection(res.data);
      console.log("collection", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMyPin = async () => {
    try {
      let res = await axios.get("http://localhost:3333/pin/pinofuser/" + id);
      console.log("pinOfUser", res.data);
      setPinOfUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUserLogin = () => {
    privateAxios
      .get("http://localhost:3333/users/detail/" + id)
      .then((response) => {
        console.log(response);
        loadPinInCollection(response.data.id);
        setUserLogin(response.data);
      })
      .catch((error) => {
        console.log(error);
        setUserLogin(null);
        alert("Hết thời gian đăng nhập, xin mời đăng nhập lại!");
        navigate("/login");
      });
  };

  // lấy người subcriber

  useEffect(() => {
    loadUserLogin();
    loadcollection();
    loadMyPin();
  }, []);

  return (
    <>
      {userLogin === null ? (
        <h2>Đăng nhập để chỉnh sửa, xem hồ sơ của mình</h2>
      ) : (
        <div className="WrapperProfile">
          <div className="wrapperAvartar">
            <img
              src={
                userLogin.avatar !== null
                  ? userLogin.avatar
                  : "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
              }
              alt=""
            />
          </div>
          <div>
            <h1>{userLogin.name}</h1>
          </div>
          {/* <div className="userNameWrapper">{userLogin.shortName}</div> */}
          <div className="descriptionYourSelft">
            {userLogin.url && (
              <Link to={`http://${userLogin.url}`} target="_blank">
                {userLogin.url}
              </Link>
            )}
            .{userLogin.description && <span>{userLogin.description}</span>}
          </div>

          <div className="subcriberWrapper">
            {/* {subcriber.length === 0
              ? ""
              : `${subcriber.length} người đang theo dõi bạn. `}
            <br />
            {subing.length === 0
              ? ""
              : `${subing.length} người bạn đang theo dõi bạn.`} */}
            {/* Người theo dõi. Người đang theo dõi */}
          </div>
          {/* <div className="contactWrapper">
          <div className="message">Liên hệ</div>
          <div className="subcribeblack">Người đang theo dõi</div>
          <div className="subcribered">Theo dõi</div>
          <div className="more">
            <MoreHorizIcon />
          </div>
        </div> */}
          <div className="contactWrapper">
            {/* <div className="message">Chia sẻ</div> */}
            <Link
              to="/settingprofile"
              style={{ textDecoration: "none", color: "black" }}
            >
              <div className="message" style={{ marginLeft: "10px" }}>
                Chỉnh sửa hồ sơ
              </div>
            </Link>
          </div>
          {isCreate ? (
            <div className="menuWrapper">
              <div
                className="create bg-slate-600"
                onClick={() => setIsCreate(true)}
              >
                Đã tạo
              </div>
              <div className="save" onClick={() => setIsCreate(false)}>
                Đã lưu
              </div>
            </div>
          ) : (
            <div className="menuWrapper">
              <div className="create" onClick={() => setIsCreate(true)}>
                Đã tạo
              </div>
              <div
                className="save  bg-slate-600"
                onClick={() => setIsCreate(false)}
              >
                Đã lưu
              </div>
            </div>
          )}
          <div className="">
            {isCreate ? (
              <div>
                <Create
                  loadMyPin={loadMyPin}
                  pinOfUser={pinOfUser}
                  userLogin={userLogin}
                  collection={collection}
                  pinInClt={pinInClt}
                  loadPinInCollection={loadPinInCollection}
                  loadcollection={loadcollection}
                />
              </div>
            ) : (
              <div className="savedCollection">
                {collection?.map((co, i) => (
                  <Collection key={i} collection={co} pinInClt={pinInClt} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
