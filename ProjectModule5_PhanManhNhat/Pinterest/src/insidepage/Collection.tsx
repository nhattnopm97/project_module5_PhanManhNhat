import { useEffect, useState } from "react";
import "../css/collection.css";
import { Link } from "react-router-dom";
import { CollectionTs } from "../interface/collectionTc";
import { PinInClt } from "../interface/pinInCltTc";

interface CollectionProps {
  collection: CollectionTs;
  pinInClt: PinInClt[];
}

function Collection({ collection, pinInClt }: CollectionProps) {
  const [PinICLT, setPinICLT] = useState<PinInClt[]>([]);

  const filterPinInThisClt = () => {
    let result = pinInClt.filter(
      (pinicl) => pinicl.collection.name === collection.name
    );
    setPinICLT(result);
  };

  useEffect(() => {
    filterPinInThisClt();
  }, [collection]);

  return (
    <div className="collection">
      {PinICLT.length > 2 ? (
        <Link to={`/collectiondetail/${collection.id}`}>
          <div className="imgWrapper">
            <div className="img1">
              <img src={PinICLT[0].pin.link} alt="ảnh 1" />
            </div>
            <div className="img2VsImg3">
              <div className="img2">
                <img src={PinICLT[1].pin.link} alt="ảnh 2" />
              </div>
              <div className="img3">
                <img src={PinICLT[2].pin.link} alt="ảnh 3" />
              </div>
            </div>
          </div>
        </Link>
      ) : (
        <Link to={`/collectiondetail/${collection.id}`}>
          <div className="imgWrapper">
            <div>
              <img
                className="justOnePin"
                src={collection.thumbnail}
                alt="ảnh 1"
              />
            </div>
          </div>
        </Link>
      )}

      <div className="textDetailCollection">
        <h4>{collection.name}</h4>
        <span>{PinICLT.length} Pin</span>
      </div>
    </div>
  );
}

export default Collection;
