import { queries } from "./types/queries";
import { mutations } from "./types/mutations";
import { custom } from "./types/custom";
import { subscriptions } from "./types/subscription";

let typeDefs = queries 
typeDefs += mutations 
typeDefs += custom;
typeDefs += subscriptions;
export default typeDefs;
