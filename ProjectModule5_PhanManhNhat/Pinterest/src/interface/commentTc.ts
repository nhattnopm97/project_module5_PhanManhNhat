import { PinTc } from "./pinTc";
import { UserTs } from "./userTc";

export interface CommentTs {
  id: number;
  users: UserTs;
  pin?: PinTc;
  content?: string;
  timecomment?: string;
  avartar?: string;
}
