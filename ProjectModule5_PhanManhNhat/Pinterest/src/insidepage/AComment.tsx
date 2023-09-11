import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { CommentTs } from "../interface/commentTc";
import moment from "moment";
import axios from "axios";
import { UserTs } from "../interface/userTc";
import { useEffect, useState } from "react";
import { LikeCommentTs } from "../interface/likeCommentTc";

interface ACommentProps {
  cmt: CommentTs;
  userLogin: UserTs | null;
}

function AComment({ cmt, userLogin }: ACommentProps) {
  const [likeComment, setLikeComment] = useState<LikeCommentTs[]>([]);
  const handleLikeCmt = async (cmtId: number) => {
    try {
      await axios.post("http://localhost:3333/comment/likecomment", {
        commentId: cmtId,
        userId: userLogin?.id,
      });
      loadLikeComment(cmt.id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnLikecmt = async () => {
    try {
      let findLike = likeComment?.find(
        (like) => like.user.id === userLogin?.id
      );
      if (findLike) {
        await axios.delete(
          "http://localhost:3333/comment/likecomment/" + findLike.id
        );
      }
      loadLikeComment(cmt.id);
    } catch (error) {
      console.log(error);
    }
  };

  const loadLikeComment = async (cmtId: number) => {
    try {
      let res = await axios.get(
        "http://localhost:3333/comment/likecomment/" + cmtId
      );
      if (Array.isArray(res.data)) {
        setLikeComment(res.data); // Ensure that res.data is an array before setting
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadLikeComment(cmt.id);
  }, [cmt]);
  return (
    <div className="flex mt-2">
      <div className="mr-[15px] flex justify-center items-center w-[50px] h-[50px] rounded-[100%] overflow-hidden">
        <img
          className="w-[50px] h-[50px]"
          src={
            cmt.users.avatar === undefined ||
            cmt.users.avatar === null ||
            cmt.users.avatar === ""
              ? "https://e7.pngegg.com/pngimages/146/551/png-clipart-user-login-mobile-phones-password-user-miscellaneous-blue.png"
              : cmt.users.avatar
          }
          alt=""
        />
      </div>
      <div className="flex items-center w-full">
        <div className="flex flex-1 flex-col mb-1 float-left w-[50px h-[50px] overflow-hidden">
          <div className="font-bold">{cmt.users.name}</div>
          <div className="ml-[10px]">{cmt.content}</div>
        </div>
        <div className="flex mb-1 items-center float-left w-[50px h-[50px] overflow-hidden">
          <div>{moment(cmt.timecomment).fromNow()}</div>
          <div className="ml-5 cursor-pointer flex items-center">
            {likeComment.length > 0 && likeComment.length}
            {likeComment.find((like) => like.user.id === userLogin?.id) ? (
              <ThumbUpIcon
                onClick={handleUnLikecmt}
                className="text-blue-600"
              />
            ) : (
              <ThumbUpOffAltIcon onClick={() => handleLikeCmt(cmt.id)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AComment;
