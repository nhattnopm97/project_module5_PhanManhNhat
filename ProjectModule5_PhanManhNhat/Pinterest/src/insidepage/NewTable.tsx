import React, { useState } from "react";
import "../css/newtable.css";
import axios from "axios";
import { PinTc } from "../interface/pinTc";
import { CollectionTs } from "../interface/collectionTc";
import { UserTs } from "../interface/userTc";
interface NewTableProps {
  setOpenModalCreateTable: React.Dispatch<React.SetStateAction<boolean>>;
  pin: PinTc | null;
  loadcollection: any;
  collection: CollectionTs[];
  loadPinInCollection: any;
  userLogin: UserTs | null;
  handleClick: any;
}

function NewTable({
  setOpenModalCreateTable,
  pin,
  loadcollection,
  collection,
  loadPinInCollection,
  userLogin,
  handleClick,
}: NewTableProps) {
  const [collectionName, setCollectionName] = useState("");
  const [publicClt, setPublicClt] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const handleClose = () => {
    setOpenModalCreateTable(false);
  };
  const handleModalContentClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  const save = async (id: number, collectionId: number) => {
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    try {
      let res = await axios.post(`http://localhost:3333/pin/intoCollection`, {
        userId: userLocal.id,
        pinId: id,
        collectionId: collectionId,
      });
      console.log(res);
      loadPinInCollection(userLogin?.id);
      handleClick("success", `Đã lưu vào: ${res.data.collection.name}`);
    } catch (error) {
      console.log(error);
      handleClick("error", `Có lỗi xảy ra!`);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    if (event.target.value !== "") {
      setIsWriting(true);
    } else {
      setIsWriting(false);
    }
    setCollectionName(event.target.value);
  };

  const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
    setPublicClt(event.target.checked);
  };
  const handleCreatNewTable = async () => {
    console.log("collectionName", collectionName);
    console.log("publicClt", publicClt);
    let userLocalJson = localStorage.getItem("userLocal");
    let userLocal = userLocalJson ? JSON.parse(userLocalJson) : null;
    let newCollection = {
      name: collectionName,
      thumbnail: pin?.link,
      status: publicClt === false ? 1 : 0,
      userId: userLocal.id,
    };
    try {
      let res = await axios.post(
        "http://localhost:3333/collection",
        newCollection
      );
      console.log(res);
      pin && save(pin.id, res.data.id);
      loadcollection();
      handleClose();
      handleClick("success", `Tạo bảng thành công!`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* The Modal */}
      <div
        onClick={handleClose}
        className="modala"
        style={{ display: "block" }}
      >
        {/* Modal content */}
        <div className="modal-contentx" onClick={handleModalContentClick}>
          <div className="settingEditCollection">
            <div className="Taobang">Tạo bảng</div>
            <div className="nameCollection">
              <div className="imageWrapper">
                <img src={pin?.link} alt="pin" />
              </div>
              <div className="newCollection">
                <label htmlFor="nameCollection">Tên bảng</label>
                <div className="inputWrapper">
                  <input
                    value={collectionName}
                    type="text"
                    id="nameCollection"
                    placeholder="Tên bảng"
                    maxLength={30}
                    onChange={handleInputChange}
                  />
                </div>
                <label className="mt-[20px]" htmlFor="secret">
                  Bí mật
                </label>
                <div>
                  <input
                    id="secret"
                    type="checkbox"
                    checked={publicClt}
                    onChange={handleCheckBoxChange}
                  />
                </div>
              </div>
            </div>
            <div className="huyVaTao">
              <button onClick={handleClose}>Hủy</button>
              <button
                className={isWriting === true ? "isWriting" : ""}
                disabled={isWriting === false}
                onClick={handleCreatNewTable}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NewTable;
