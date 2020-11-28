import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { map, concatMap, catchError, tap } from "rxjs/operators";
import { args, onEvent, Event, createEvent } from "../event-store";
import { AuthService } from "../shared/services/auth.service";
import { AuthApiEventTypes, AuthEvents } from "./actions";
import { UserModel } from "src/app/shared/models";

const AUTH_API = "Auth API";

export const getAuthStatusSuccess = createEvent(
  AUTH_API,
  AuthApiEventTypes.authStatusSuccess,
  args<{ user: UserModel | null }>()
);

export const loginSuccess = createEvent(
  AUTH_API,
  AuthApiEventTypes.loginSuccess,
  args<{ user: UserModel }>()
);

export const loginFailure = createEvent(
  AUTH_API,
  AuthApiEventTypes.loginFailure,
  args<{ reason: string }>()
);

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private auth: AuthService) {}

  getAuthStatus$ = createEffect(() =>
    this.auth
      .getStatus()
      .pipe(map(userOrNull => getAuthStatusSuccess({ user: userOrNull })))
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      onEvent(AuthEvents.login),
      concatMap((action: Event) => {
        return this.auth.login(action.username, action.password).pipe(
          map(user => loginSuccess({ user })),
          catchError(reason => of(loginFailure({ reason })))
        );
      })
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        onEvent(AuthEvents.logout),
        tap(() => this.auth.logout())
      ),
    { dispatch: false }
  );
}
