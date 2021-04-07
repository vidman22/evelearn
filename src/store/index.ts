import { action, Action, createStore, createTypedHooks } from 'easy-peasy';
import { composeWithDevTools } from 'redux-devtools-extension';
import { User } from '../api/types';

export interface Store {
    user: User | null;
    token: string | null;
    logout: Action<Store>;
    setUser: Action<Store, User | null>;
    setToken: Action<Store, string | null>;
}

export const store = createStore<Store>({
    user: null,
    token: null,

    setUser: action((store, payload) => {
        store.user = payload;
    }),

    setToken: action((store, payload) => {
        store.token = payload;
    }),

    logout: action(state => {
        state.user = null;
        state.token = null;
    }),
}, { compose: composeWithDevTools({ name: 'RootStore' }) });

const typedHooks = createTypedHooks<Store>();

export const useStoreState = typedHooks.useStoreState;
export const useStoreActions = typedHooks.useStoreActions;