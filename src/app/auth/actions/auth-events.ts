import { args, prepareEvent } from "src/app/event-store";
import { AuthEventTypes } from "./event-types";

export const login = prepareEvent(
  AuthEventTypes.login,
  args<{ username: string; password: string }>()
);

export const logout = prepareEvent(AuthEventTypes.logout);
