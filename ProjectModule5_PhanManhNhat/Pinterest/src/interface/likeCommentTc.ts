import { CommentTs } from "./commentTc";
import { UserTs } from "./userTc";

export interface LikeCommentTs {
  id: number;
  comment: CommentTs;
  user: UserTs;
}
