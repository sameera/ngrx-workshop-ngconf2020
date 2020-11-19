import { UserModel } from "../models";
import { AuthApiEventTypes, AuthEventTypes } from "src/app/auth/actions";
import { createEventReducer, when, Event } from "src/app/event-store";

export interface State {
  gettingStatus: boolean;
  user: null | UserModel;
  error: null | string;
}

const initialState: State = {
  gettingStatus: true,
  user: null,
  error: null,
};

export const authReducer = createEventReducer(
  initialState,
  when(AuthEventTypes.logout, (state) => {
    return {
      gettingStatus: false,
      user: null,
      error: null,
    };
  }),
  when(AuthEventTypes.login, (state) => {
    return {
      gettingStatus: true,
      user: null,
      error: null,
    };
  }),
  when(AuthApiEventTypes.authStatusSuccess, (state, action) => {
    return {
      gettingStatus: false,
      user: action.user,
      error: null,
    };
  }),
  when(AuthApiEventTypes.loginSuccess, (state, action) => {
    return {
      gettingStatus: false,
      user: action.user,
      error: null,
    };
  }),
  when(AuthApiEventTypes.loginFailure, (state, action) => {
    return {
      gettingStatus: false,
      user: null,
      error: action.reason,
    };
  })
);

export function reducer(state: State | undefined, event: Event) {
  return authReducer(state, event);
}

export const selectGettingStatus = (state: State) => state.gettingStatus;
export const selectUser = (state: State) => state.user;
export const selectError = (state: State) => state.error;
