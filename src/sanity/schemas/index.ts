import { projectSchema } from "./project";
import { teamMemberSchema } from "./teamMember";
import { partnerSchema } from "./partner";
import { studioSchema } from "./studio";
import { homeSchema } from "./home";
import { eventSchema } from "./event";

export const schemaTypes = [
  projectSchema,
  teamMemberSchema,
  partnerSchema,
  studioSchema,
  homeSchema,
  eventSchema,
];
