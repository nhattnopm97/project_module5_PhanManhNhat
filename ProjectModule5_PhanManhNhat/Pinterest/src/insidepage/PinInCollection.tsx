import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "../css/pinincollection.css";
import UploadIcon from "@mui/icons-material/Upload";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import axios from "axios";
import { PinInClt } from "../interface/pinInCltTc";
import { CollectionTs } from "../interface/collectionTc";
import { UserTs } from "../interface/userTc";

interface PinInCollectionProps {
  pin: PinInClt;
  collection: CollectionTs | null;
  userLogin: UserTs | null;
  loadPinICL: any;
}

function PinInCollection({
  pin,
  collection,
  userLogin,
  loadPinICL,
}: PinInCollectionProps) {
  const unsave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let res = await axios.delete(
        `http://localhost:3333/pin/removePinFromCollection`,
        {
          data: {
            userId: userLogin?.id,
            pinId: pin.pin.id,
            collectionId: collection?.id,
          },
        }
      );
      console.log(res);
      loadPinICL();
      alert("xoa thanh cong");
    } catch (error) {
      console.log(error);
      alert("Có lỗi đã xảy ra");
    }
  };
  return (
    <Wrapper>
      <Container>
        <Link to={`/detailImg/${pin.pin.id}`}>
          <img src={pin.pin.link} alt="" />
          <div className="button-container">
            <div className="collectiona">{pin?.pin.title}</div>
            <div onClick={unsave} className="saved">
              Bỏ lưu
            </div>
            <div className="upload">
              <UploadIcon />
            </div>
            <div className="more">
              <MoreHorizIcon />
            </div>
          </div>
        </Link>
      </Container>
    </Wrapper>
  );
}

export default PinInCollection;

const Wrapper = styled.div`
  display: inline-flex;
  padding: 8px;
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  width: 236px;
  :hover .button-container {
    opacity: 1;
  }

  img {
    display: flex;
    width: 100%;
    cursor: zoom-in;
    object-fit: cover;
    border-radius: 16px;
  }
  .button-container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.3s ease;
    cursor: zoom-in;
  }
  .button-container .collectiona {
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    left: 5%;
  }
  .button-container .save {
    background-color: red;
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    position: absolute;
    top: 5%;
    right: 5%;
  }
  .button-container .saved {
    background-color: rgb(165, 165, 165);
    padding: 8px 12px;
    border-radius: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    color: white;
    position: absolute;
    top: 5%;
    right: 5%;
    cursor: pointer;
  }
  .button-container .upload {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 19%;
  }
  .button-container .more {
    color: white;
    cursor: pointer;
    position: absolute;
    bottom: 5%;
    right: 5%;
  }
`;
