import { useEffect, useState } from "react";
import "../css/detailimages.css";
// import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SendIcon from "@mui/icons-material/Send";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { PinTc } from "../interface/pinTc";
import { CollectionTs } from "../interface/collectionTc";
import { PinInClt } from "../interface/pinInCltTc";
import DownloadIcon from "@mui/icons-material/Download";
import { UserTs } from "../interface/userTc";
import privateAxios from "../axiosIntercepter/privateAxios";
import { CommentTs } from "../interface/commentTc";
import Modalbox from "../insidepage/ModalBox";
import Pin from "../insidepage/Pin";
import { SubcriberTs } from "../interface/subcriber";
import { LikePin } from "../interface/likePinTc";
import NewTable from "../insidepage/NewTable";
import AComment from "../insidepage/AComment";
// import EditCollection from "./EditCollection";
// import Modalbox from "./Modalbox";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function DetailImg() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [comment, setComment] = useState<CommentTs[]>([]);
  const [pin, setPin] = useState<PinTc | null>(null);
  const [collection, setCollection] = useState<CollectionTs[]>([]);
  const [pinInClt, setPinInClt] = useState<PinInClt[]>([]);
  const [relatePins, setRelatePins] = useState<PinTc[]>([]);
  const [subcriber, setSubscriber] = useState<SubcriberTs[]>([]);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);
  const [likePin, setLikePin] = useState<LikePin[]>([]);
  const [newCmnt, setNewCmnt] = useState("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<any>("success");
  const [message, setMessage] = useState("Thành công");
  const handleClick = (a: string, b: string) => {
    setType(a);
    setMessage(b);
    setOpen(true);
  };
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const [openModalCreateTable, setOpenModalCreateTable] =
    useState<boolean>(false);

  const loadPindetails = async () => {
    try {
      let res = await axios.get("http://localhost:3333/pin/detail/" + id);
      console.log("loadPindetails", res.data);
      setPin(res.data);
      if (res.data.status === 3) {
        navigate("/notfound");
      }
      loadSubcriber(res.data.users.id);
      loadLikePin(res.data.id);
      loadCmt(res.data.id);
    } catch (error) {
      console.log(error);
      navigate("/notfound");
    }
  };

  const loadLikePin = async (pinId: number) => {
    try {
      let res = await axios.get("http://localhost:3333/like-pin/pin/" + pinId);
      setLikePin(res.data);
      // console.log("likePin", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadUserLogin = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    if (userLocal !== null) {
      setUserLogin(userLocal);
      privateAxios
        .get("http://localhost:3333/users/detail/" + userLocal.id)
        .then((response) => {
          console.log("user", response.data);
          setUserLogin(response.data);
          loadPinInCollection(response.data.id);
        })
        .catch((error) => {
          console.log(error);
          setUserLogin(null);
          handleClick("warning", `Có lỗi xảy ra`);
        });
    } else {
      navigate("/login");
    }
  };

  const loadPinInCollection = async (id: number) => {
    try {
      let res = await axios.get(`http://localhost:3333/pin/user/${id}`);
      console.log("loadPinInCollection", res.data);
      setPinInClt(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadcollection = async () => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    try {
      let res = await axios.get(
        "http://localhost:3333/collection/" + userLocal?.id
      );
      setCollection(res.data);
      // console.log("collection", res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadCmt = async (id: number) => {
    try {
      let res = await axios.get("http://localhost:3333/comment/" + id);
      // console.log("comment", res.data);
      setComment(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPinRelate = async () => {
    try {
      let res = await axios.get("http://localhost:3333/pin/relate/" + id);
      // console.log("Relate", res.data);
      setRelatePins(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSubcriber = async (id: number) => {
    try {
      let res = await axios.get("http://localhost:3333/users/subcriber/" + id);
      setSubscriber(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadUserLogin();
    loadPindetails();
    loadcollection();

    loadPinRelate();
    pin && pin.users.id && loadSubcriber(pin?.users.id);
  }, [id]);

  const save = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (collection.length > 0) {
        let res = await axios.post(`http://localhost:3333/pin/intoCollection`, {
          userId: userLogin?.id,
          pinId: id,
          collectionId: collection[0].id,
        });
        console.log(res);
        userLogin && userLogin.id && loadPinInCollection(userLogin?.id);
        handleClick("success", `Đã lưu vào bộ sưu tập`);
      } else {
        let now = new Date();
        let dateNow =
          now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();
        console.log(dateNow);
        let res = await axios.post(`http://localhost:3333/collection`, {
          name: "Bảng mới",
          thumbnail: pin?.link,
          status: 1,
          userId: userLogin?.id,
        });
        console.log(res);
        loadcollection();
        userLogin && userLogin.id && loadPinInCollection(userLogin?.id);
        handleClick("success", `Đã lưu vào ${res.data.name} `);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unsave = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    try {
      let collectionId = pinInClt.find((piclt) => piclt.pin.id === +id);
      if (collectionId) {
        let res = await axios.delete(
          `http://localhost:3333/pin/removePinFromCollection`,
          {
            data: {
              userId: userLocal.id,
              pinId: id,
              collectionId: collectionId?.collection.id,
            },
          }
        );
        console.log(res);
        userLogin && userLogin.id && loadPinInCollection(userLogin?.id);
        handleClick("warning", `Đã xóa khỏi bộ sưu tập!`);
      } else {
        handleClick("error", `Có lỗi xảy ra!`);
      }
    } catch (error) {
      console.log(error);
      handleClick("error", `Có lỗi xảy ra!`);
    }
  };

  const handleSubcribe = async (subscriberId: number, subscribedId: number) => {
    console.log(subscriberId, subscribedId);
    try {
      let res = await axios.post(
        "http://localhost:3333/users/subcriber/create",
        {
          subscriberId,
          subscribedId,
        }
      );
      pin && pin.users.id && loadSubcriber(pin?.users.id);
      console.log("res", res);
    } catch (error: any) {
      console.log("error", error);
      if (error.response.status === 502) {
        handleClick("error", `Có lỗi xảy ra!`);
      }
    }
  };

  const unSubcribe = async () => {
    try {
      let subcriberfind = subcriber.find(
        (userSubcribed) => userSubcribed.userSubcribed.id === userLogin?.id
      );
      console.log(subcriberfind);
      if (subcriberfind) {
        let res = await axios.delete(
          "http://localhost:3333/users/subcriber/" + subcriberfind.id
        );
        console.log(res);
        pin && pin.users.id && loadSubcriber(pin?.users.id);
      } else {
        handleClick("error", `Có lỗi xảy ra!`);
      }
    } catch (error) {
      console.log(error);
      handleClick("error", `Có lỗi xảy ra!`);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(newCmnt, pin, userLogin);
    try {
      let res = await axios.post("http://localhost:3333/comment", {
        content: newCmnt,
        userId: userLogin?.id,
        pinId: pin?.id,
      });
      setNewCmnt("");
      pin && loadCmt(pin?.id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePin = async () => {
    try {
      let res = await axios.post("http://localhost:3333/like-pin", {
        userId: userLogin?.id,
        pinId: pin?.id,
      });
      console.log(res);
      pin && loadLikePin(pin?.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnLikePin = async () => {
    try {
      let res = await axios.delete("http://localhost:3333/like-pin", {
        data: {
          userId: userLogin?.id,
          pinId: pin?.id,
        },
      });
      console.log(res);
      pin && loadLikePin(pin?.id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="">
        <Stack className="" spacing={2} sx={{ width: "100%" }}>
          {/* <Button
          variant="outlined"
          onClick={() => handleClick("success", "oke ae")}
        >
          Open success snackbar
        </Button> */}
          <Snackbar open={open} autoHideDuration={1000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
              {message}
            </Alert>
          </Snackbar>
          {/* <Alert severity="error">This is an error message!</Alert>
      <Alert severity="warning">This is a warning message!</Alert>
      <Alert severity="info">This is an information message!</Alert>
      <Alert severity="success">This is a success message!</Alert> */}
        </Stack>
        {openModalCreateTable === true ? (
          <NewTable
            handleClick={handleClick}
            setOpenModalCreateTable={setOpenModalCreateTable}
            loadcollection={loadcollection}
            pin={pin}
            userLogin={userLogin}
            collection={collection}
            loadPinInCollection={loadPinInCollection}
          />
        ) : (
          <></>
        )}
        <div className="detailIMG w-[80%] m-auto flex overflow-hidden rounded-3xl">
          <img src={pin?.link} width="508px" alt="" />
          <div className="w-2 border-b-black border-b-2 mt-[10px]" />
          <div className="w-[50%] m-auto mt-5">
            {openModal && (
              <Modalbox
                handleClick={handleClick}
                pin={pin}
                userLogin={userLogin}
                collection={collection}
                setOpenModal={setOpenModal}
                setOpenModalCreateTable={setOpenModalCreateTable}
                loadPinInCollection={loadPinInCollection}
              />
            )}
            <div className="flex items-center pt-[10px] justify-content space-between">
              <div className="flex items-center justify-around w-[30%]">
                <IconButton>
                  <DownloadIcon />
                </IconButton>
                {/* <IconButton>
                  <UploadIcon />
                </IconButton> */}
                <IconButton>
                  <InsertLinkIcon />
                </IconButton>
              </div>
              <div className="flex-1"></div>

              <div className="flex mr-[15px]">
                <div className="flex absolute w-10 h-10 z-50"></div>
                {pinInClt?.find((clt) => clt.pin.id === pin?.id) ? (
                  <>
                    <div className="cursor-pointer flex items-center mr-2 font-bold">
                      {
                        pinInClt?.find((clt) => clt.pin.id === pin?.id)
                          ?.collection.name
                      }
                    </div>
                    <div
                      onClick={(event) => id && unsave(event, id)}
                      className="bg-[#2c2222] w-18 py-2 px-3 rounded-[20px] text-center text-[16px] font-bold text-white cursor-pointer"
                    >
                      Đã lưu
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="cursor-pointer"
                      onClick={() => setOpenModal(!openModal)}
                    >
                      {collection.length > 0 ? collection[0].name : "Bảng mới"}
                      <KeyboardArrowDownIcon />
                    </div>
                    <button
                      onClick={(event) => pin && save(event, pin.id)}
                      className="border-0 px-[10px] py-[5px] text-white bg-red-600 font-bold rounded-3xl cursor-pointer"
                    >
                      Lưu
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="w-[80%] m-auto">
              <div className="aboutComments">
                <div className="mt-[15px]">
                  <h1 className="text-[16px] font-bold mb-[10px]">
                    {pin?.title}
                  </h1>
                </div>
                <div className="mt-[15px]">
                  <p className="text-3 ">{pin?.title}</p>
                </div>
                <div className="mt-[15px] flex text-[13px] flex-wrap">
                  <div className="w-[50px] h-[50px] rounded-[100%] overflow-hidden">
                    <img
                      src={
                        pin?.users?.avatar === undefined ||
                        pin?.users?.avatar === "" ||
                        pin?.users?.avatar === null
                          ? "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
                          : pin?.users?.avatar
                      }
                      alt=""
                      width="50px"
                    />
                  </div>
                  <div className="flex-1 items-center ml-2 clear-both">
                    <span className="font-bold text-lg">{pin?.users.name}</span>
                    {subcriber.length > 0 ? (
                      <div>{subcriber.length} người theo dõi</div>
                    ) : (
                      <></>
                    )}
                  </div>

                  {subcriber?.find(
                    (sub) => sub.userSubcribed.id === userLogin?.id
                  ) ? (
                    <button
                      onClick={() => unSubcribe()}
                      className="mx-[15px] hover:bg-blue-950 bg-black text-white text-center font-bold rounded-[30px] border-none outline-none cursor-pointer float-right py-[3px] px-[15px] "
                    >
                      Đã theo dõi
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        pin &&
                        pin.users &&
                        pin.users.id &&
                        userLogin &&
                        userLogin.id &&
                        handleSubcribe(pin?.users.id, userLogin?.id)
                      }
                      className="mx-[15px] hover:bg-red-900 bg-red-600 text-white text-center font-bold rounded-[30px] border-none outline-none cursor-pointer float-right py-[3px] px-[15px] "
                    >
                      Theo dõi
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  {comment?.length > 0 ? (
                    <div className="max-h-[570px] mt-[15px] overflow-y-scroll">
                      <div className="font-bold text-[16px]">Nhận xét</div>
                      {comment?.map((cmt, i) => (
                        <AComment key={i} cmt={cmt} userLogin={userLogin} />
                      ))}
                    </div>
                  ) : (
                    <div className="mt-[15px] w-full flex items-center justify-center">
                      {/* <div className="w-[80%]">Chưa có nhận xét nào!</div> */}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-1 justify-around w-full text-[14px] text-#6b6b6b my-[15px]">
                <div className="flex flex-1 justify-center w-[40%] h-[50%]">
                  {comment.length > 0 ? (
                    <>{comment.length} Nhận xét</>
                  ) : (
                    "Chưa có nhận xét nào!"
                  )}
                </div>
                {likePin.length > 0 ? (
                  <>
                    {likePin?.find((like) => like.user.id === userLogin?.id) ? (
                      <div
                        onClick={handleUnLikePin}
                        className="flex justify-center w-[40%]"
                      >
                        {likePin.length}
                        <FavoriteIcon className="cursor-pointer text-red-600" />
                      </div>
                    ) : (
                      <div
                        onClick={handleLikePin}
                        className="flex justify-center w-[40%]"
                      >
                        {likePin.length}
                        <FavoriteBorderIcon className="cursor-pointer" />
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    onClick={handleLikePin}
                    className="flex justify-center w-[40%]"
                  >
                    <FavoriteBorderIcon className="cursor-pointer" />
                  </div>
                )}
              </div>
              <div className="flex h-[80px] items-center mb-[80px] w-[90%] m-auto mt-[15px]">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                  <img
                    className="w-[50px] rounded-full"
                    src={
                      userLogin?.avatar === undefined ||
                      userLogin?.avatar === "" ||
                      userLogin?.avatar === null
                        ? "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
                        : userLogin?.avatar
                    }
                    alt=""
                  />
                </div>
                <div className="flex bg-[#dbdbdb] items-center h-[60px] w-full px-2 rounded-[20px] border-0 outline-none">
                  <form
                    className="flex bg-[#dbdbdb] items-center h-[60px] w-full px-2 rounded-[20px] border-0 outline-none"
                    action=""
                    onSubmit={handleSubmit}
                  >
                    <input
                      value={newCmnt}
                      onChange={(event) => setNewCmnt(event.target.value)}
                      id="IpcmtUs"
                      className="w-full rounded-md border-0 outline-none p-[5px] h-[35px]"
                      type="text"
                      placeholder="Thêm nhận xét"
                    />
                    <IconButton type="submit">
                      <SendIcon />
                    </IconButton>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="text-center mt-5 font-bold">Các Ghim tương tự</h3>
      <div className="mainBoardcontainer">
        <div className="litleWrapper pl-2">
          {relatePins.map((pin, i) => (
            <>
              {pin.status === 3 ? (
                <></>
              ) : (
                <Pin
                  handleClick={handleClick}
                  key={i}
                  pin={pin}
                  collection={collection}
                  loadcollection={loadcollection}
                  loadPinInCollection={loadPinInCollection}
                  pinInClt={pinInClt}
                  userLogin={userLogin}
                ></Pin>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  );
}

export default DetailImg;
