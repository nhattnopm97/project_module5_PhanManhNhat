import { PinTc } from "./pinTc";
import { UserTs } from "./userTc";

export interface LikePin {
  id: number;
  pin: PinTc;
  user: UserTs;
}
