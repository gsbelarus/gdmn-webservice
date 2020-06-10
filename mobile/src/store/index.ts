import { TApiActions } from './Api/actions';
import { TAppActions } from './App/actions';
import { TAuthActions } from './Auth/actions';

export { AuthActions } from './Auth/actions';
export { useStore as useAuthStore, StoreProvider as AuthStoreProvider } from './Auth/store';
export { AppActions } from './App/actions';
export { useStore as useAppStore, StoreProvider as AppStoreProvider } from './App/store';
export { ApiActions } from './Api/actions';
export { useStore as useApiStore, StoreProvider as ApiStoreProvider } from './Api/store';

export type TActions = TApiActions | TAppActions | TAuthActions;
