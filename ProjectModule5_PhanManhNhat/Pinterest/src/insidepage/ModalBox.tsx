import "../css/modalbox.css";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { PinTc } from "../interface/pinTc";
// import { useSelector } from "react-redux";
// import { useEffect, useState } from "react";
import { UserTs } from "../interface/userTc";
import axios from "axios";
import { CollectionTs } from "../interface/collectionTc";

interface ModalBoxProps {
  pin: PinTc | null;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  collection: CollectionTs[];
  setOpenModalCreateTable: React.Dispatch<React.SetStateAction<boolean>>;
  loadPinInCollection: any;
  handleClick: any;
  userLogin: UserTs | null;
}
function Modalbox({
  pin,
  collection,
  setOpenModal,
  setOpenModalCreateTable,
  loadPinInCollection,
  userLogin,
  handleClick,
}: ModalBoxProps) {
  const handleCreateNewCollection = () => {
    setOpenModalCreateTable(true);
    setOpenModal(false);
  };

  const handleClose = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenModal(false);
  };

  const save = async (collectionId: number, pinIn: number) => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    try {
      let res = await axios.post(`http://localhost:3333/pin/intoCollection`, {
        userId: userLocal.id,
        pinId: pinIn,
        collectionId: collectionId,
      });
      console.log(res);
      setOpenModal(false);
      loadPinInCollection(userLogin?.id);
      handleClick("success", `Đã lưu vào ${res.data.collection.name}`);
    } catch (error) {
      console.log(error);
      handleClick("error", `Có lỗi xảy ra!`);
    }
  };

  return (
    <>
      <div className="totalmodal z-50">
        <div className="modalContainer">
          <div className="closeIconWrapper" onClick={handleClose}>
            <CloseIcon className="closeIcon" />
          </div>
          <div className="titleModal">
            <div>Lưu</div>
          </div>
          <div className="searchBoxModal">
            <div className="flex justify-center items-center w-[328px] h-[70%] border-solid border-2 border-gray-400 rounded-[20px]">
              <SearchIcon />
              <input
                className="flex-1 border-0 outline-none"
                type="text"
                placeholder="Tìm kiếm"
              />
            </div>
          </div>
          <div className="collectionModal">
            <p>Các lựa chọn hay nhất</p>
            {collection.map((collection: CollectionTs, index) => (
              <div
                key={index}
                onClick={() =>
                  collection.id && pin && save(collection.id, pin.id)
                }
              >
                <div className="w-[60px] h-[60px] rounded-lg overflow-hidden  ">
                  <img src={collection.thumbnail} alt="Thumbnail" />
                </div>
                <div className="flex-1">{collection.name}</div>
                <button>Lưu</button>
              </div>
            ))}
          </div>
          <div className="newTableModal" onClick={handleCreateNewCollection}>
            <div className="addIcon">
              <AddIcon />
            </div>
            <div>Tạo bảng</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Modalbox;
