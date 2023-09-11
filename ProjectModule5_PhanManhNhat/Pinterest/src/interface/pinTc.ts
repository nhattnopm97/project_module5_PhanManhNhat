import { UserTs } from "./userTc";

export interface PinTc {
  id: number;
  link: string;
  title?: string;
  description?: string;
  tag?: string;
  timeupload?: string;
  users: UserTs;
  status: number;
}
