import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { User } from 'src/app/models/user.model';

export interface UserState {
  user: User | null;
}

export const initialState: UserState = {
  user: null
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loginCreateAction, (state, { user }) => ({
    ...state,
    user
  }))
);