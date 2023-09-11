import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "../css/pin.css";
import { PinTc } from "../interface/pinTc";
import { Link, useNavigate } from "react-router-dom";
import Modalbox from "./ModalBox";

import { useState } from "react";
import axios from "axios";
import { UserTs } from "../interface/userTc";
import { CollectionTs } from "../interface/collectionTc";
import { PinInClt } from "../interface/pinInCltTc";
import NewTable from "./NewTable";

function Pin({
  pin,
  collection,
  loadcollection,
  pinInClt,
  loadPinInCollection,
  userLogin,
  handleClick,
}: {
  pin: PinTc | null;
  collection: CollectionTs[];
  loadcollection: any;
  loadPinInCollection: any;
  pinInClt: PinInClt[];
  userLogin: UserTs | null;
  handleClick: any;
}) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalCreateTable, setOpenModalCreateTable] =
    useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<boolean>(false);
  const navigate = useNavigate();

  const openModalBox = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenModal(true);
  };

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
        loadPinInCollection(userLogin?.id);
        handleClick("success", `đã lưu vào ${collection[0].name}`);
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
        loadPinInCollection(userLogin?.id);
        handleClick("success", `đã lưu vào ${res.data.name}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const unsave = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let collectionId = pinInClt.find((piclt) => piclt.pin.id === pin?.id);
      if (collectionId) {
        let res = await axios.delete(
          `http://localhost:3333/pin/removePinFromCollection`,
          {
            data: {
              userId: userLogin?.id,
              pinId: id,
              collectionId: collectionId?.collection.id,
            },
          }
        );
        console.log(res);
        loadPinInCollection(userLogin?.id);
        handleClick("warning", `Đã xóa khỏi bộ sưu tập!`);
      } else {
        handleClick("error", `Có lỗi xảy ra!`);
      }
    } catch (error) {
      console.log(error);
      handleClick("error", `Có lỗi xảy ra!`);
    }
  };

  const openMoreDownLoad = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpenMore(!isOpenMore);
  };

  const coppyLink = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const linkInput: HTMLInputElement | null = document.getElementById(
      "linkInput"
    ) as HTMLInputElement;

    if (linkInput) {
      linkInput.select();
      linkInput.setSelectionRange(0, 99999); // Dành cho các trình duyệt khác

      // Sao chép nội dung vào clipboard
      document.execCommand("copy");
      handleClick("info", `Đã sao chép liên kết: ${linkInput.value}`);
    }
  };

  const linkToDetailCollection = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    let collectionOfPin = pinInClt.find((item) => item.pin.id === pin?.id);
    navigate(`/collectiondetail/${collectionOfPin?.collection.id}`);
  };

  return (
    <div className="relative inline-flex mt-4">
      <input
        id="linkInput"
        readOnly
        type="text"
        value={pin?.link}
        className="hidden"
      />
      {openModalCreateTable === true ? (
        <NewTable
          setOpenModalCreateTable={setOpenModalCreateTable}
          loadcollection={loadcollection}
          pin={pin}
          userLogin={userLogin}
          collection={collection}
          handleClick={handleClick}
          loadPinInCollection={loadPinInCollection}
        />
      ) : (
        <></>
      )}
      <div className="flex absolute w-10 h-10 z-50">
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
      </div>

      <Link to={`/detailImg/${pin?.id}`}>
        <div className="containerPin relative inline-block items-center box-border cursor-pointer w-[236px]">
          <img
            className="flex w-full cursor-zoom-in object-cover rounded-[16px]"
            src={pin?.link}
            alt=""
          />
          <div className="">
            <div className=" button-container w-full h-full rounded-[16px] overflow-hidden absolute top-[50%] left-[50%] cursor-zoom-in opacity-0 z-20">
              {pinInClt.find((piclt) => piclt.pin.id === pin?.id) ? (
                <div
                  className="text-white cursor-pointer absolute top-[5%] left-[5%]"
                  onClick={(event: React.MouseEvent) =>
                    linkToDetailCollection(event)
                  }
                >
                  {
                    pinInClt.find((piclt) => piclt.pin.id === pin?.id)
                      ?.collection.name
                  }
                </div>
              ) : (
                <div className="text-white cursor-pointer absolute top-[5%] left-[5%]">
                  {pinInClt.find((piclt) => piclt.pin.id === pin?.id) ? (
                    <Link to={`/detailImg/${collection[0].id}`}>
                      {
                        pinInClt.find((piclt) => piclt.pin.id === pin?.id)
                          ?.collection.name
                      }
                    </Link>
                  ) : (
                    <div
                      onClick={(event: React.MouseEvent) => openModalBox(event)}
                    >
                      {collection.length > 0
                        ? collection[0].name?.slice(0, 13)
                        : "Bảng mới"}
                      <KeyboardArrowDownIcon />
                    </div>
                  )}
                </div>
              )}
              {pinInClt.find((piclt) => piclt.pin.id === pin?.id) ? (
                <div
                  className="bg-[#2c2222] w-18 py-2 px-3 rounded-[20px] text-center text-[16px] font-bold text-white cursor-pointer absolute top-[5%] right-[5%]"
                  onClick={(event) => pin && unsave(event, pin.id)}
                >
                  Đã lưu
                </div>
              ) : (
                <div
                  className="bg-[red] w-16 py-2 px-3 rounded-[20px] text-center text-[16px] font-bold text-white cursor-pointer absolute top-[5%] right-[5%]"
                  onClick={(event) => pin && save(event, pin.id)}
                >
                  Lưu
                </div>
              )}

              <div
                onClick={coppyLink}
                className="text-white cursor-pointer absolute bottom-[5%] right-[19%]"
              >
                <ContentCopyIcon />
              </div>
              <div
                onClick={openMoreDownLoad}
                className="text-white cursor-pointer absolute bottom-[5%] right-[5%]"
              >
                <MoreHorizIcon />
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="absolute top-[87%] left-[-40%] -translate-x-1/2 -translate-y-1/2 z-40">
        {isOpenMore === true && (
          <div className=" more-options-container absolute bg-white flex items-center justify-center rounded-2xl border-none outline-none w-[200px] h-[40px] z-40  no-underline">
            <div className="absolute w-40 mr-[10px] hover:bg-slate-400 left-2 text-center text-black rounded-md border-none outline-none z-40 no-underline">
              <a href={pin?.link} download>
                Tải xuống hình ảnh
              </a>
            </div>
            <div
              className="absolute right-0  hover:bg-slate-400 text-black flex items-center justify-center cursor-pointer w-[40px] h-[40px] rounded-[10px] overflow-hidden z-50"
              onClick={() => setIsOpenMore(false)}
            >
              <CloseIcon />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pin;
