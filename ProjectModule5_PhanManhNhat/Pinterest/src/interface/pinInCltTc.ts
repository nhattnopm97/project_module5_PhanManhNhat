import { CollectionTs } from "./collectionTc";
import { PinTc } from "./pinTc";

export interface PinInClt {
  id?: number;
  pin: PinTc;
  collection: CollectionTs;
}
