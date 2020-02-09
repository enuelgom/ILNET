import { queries } from "./types/queries";
import { mutations } from "./types/mutations";
import { custom } from "./types/custom";

let typeDefs = queries 
typeDefs += mutations 
typeDefs += custom
export default typeDefs;