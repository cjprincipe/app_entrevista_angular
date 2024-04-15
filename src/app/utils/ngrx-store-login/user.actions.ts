import { createAction, props } from '@ngrx/store';
import { User } from 'src/app/models/user.model';

export const loginCreateAction = createAction('[User] Login', props<{ user: User }>());