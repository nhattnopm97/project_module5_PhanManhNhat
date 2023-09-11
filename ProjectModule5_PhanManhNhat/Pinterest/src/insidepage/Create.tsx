import "../css/create.css";
import PinCreated from "./PinCreated";
import { Link } from "react-router-dom";
import { PinTc } from "../interface/pinTc";
import { UserTs } from "../interface/userTc";
import { CollectionTs } from "../interface/collectionTc";
import { PinInClt } from "../interface/pinInCltTc";

interface CreateProps {
  pinOfUser: PinTc[];
  userLogin: UserTs | null;
  collection: CollectionTs[];
  loadPinInCollection: any;
  loadcollection: any;
  pinInClt: PinInClt[];
  loadMyPin: any;
}

function Create({
  pinOfUser,
  userLogin,
  collection,
  loadPinInCollection,
  loadcollection,
  pinInClt,
  loadMyPin,
}: CreateProps) {
  return (
    <div className="bg-white flex w-full h-full mt-[15px] justify-center">
      {pinOfUser?.length === 0 ? (
        <div className="flex flex-col justify-center items-center">
          <div>Chưa có gì để hiển thị! Ghim bạn tạo sẽ xuất hiện ở đây.</div>
          <Link to="/createanewpin">
            <div className="px-5 py-2.5 mt-2 w-[200px] flex justify-center border-none outline-none bg-red-600 rounded-[20px] text-white hover:bg-red-900">
              Tạo ghim ý tưởng
            </div>
          </Link>
        </div>
      ) : (
        <div className="mainBoardcontainerxxx" id="mainBoardcontainerxxx">
          {pinOfUser?.map((pin, i) => (
            <>
              {pin.status === 3 ? (
                <></>
              ) : (
                <PinCreated
                  key={i}
                  loadMyPin={loadMyPin}
                  userLogin={userLogin}
                  pin={pin}
                  collection={collection}
                  pinInClt={pinInClt}
                  loadPinInCollection={loadPinInCollection}
                  loadcollection={loadcollection}
                />
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default Create;
