import { useEffect, useState } from "react";
import "../css/collectiondetail.css";
import SortIcon from "@mui/icons-material/Sort";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PinInCollection from "../insidepage/PinInCollection";
import { PinInClt } from "../interface/pinInCltTc";
import { CollectionTs } from "../interface/collectionTc";
import { UserTs } from "../interface/userTc";
import privateAxios from "../axiosIntercepter/privateAxios";

function CollectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailCollection, setDetailCollection] = useState<PinInClt[]>([]);
  const [collection, setCollection] = useState<CollectionTs | null>(null);
  const [userLogin, setUserLogin] = useState<UserTs | null>(null);

  const loadcollection = async () => {
    try {
      let res = await axios.put("http://localhost:3333/collection/" + id);
      // console.log(res.data);
      setCollection(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadPinICL = async () => {
    try {
      let res = await axios.get(
        "http://localhost:3333/collection/pinincollection/" + id
      );
      setDetailCollection(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadcollection();
    loadPinICL();
  }, []);

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
      // navigate("/login");
    }
  }, [id]);

  return (
    <div className="mainContainer">
      <div className="cltAvt">
        <div className="clt">{collection?.name}</div>
        <div className="avt">
          <img src={userLogin?.avatar} alt="" />
        </div>
        {userLogin?.name}
      </div>
      <div className="qttPAS">
        <div className="qttPina">{detailCollection.length} Ghim</div>
        <div className="sortIC">
          <SortIcon />
        </div>
      </div>
      <div className="mainBoardcontainer">
        {detailCollection?.map((pin, i) => (
          <PinInCollection
            key={i}
            pin={pin}
            collection={collection}
            userLogin={userLogin}
            loadPinICL={loadPinICL}
          />
        ))}
      </div>
    </div>
  );
}

export default CollectionDetail;
