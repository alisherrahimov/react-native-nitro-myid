import { NitroModules } from 'react-native-nitro-modules';
import type {
  NitroMyid,
  MyIdConfig,
  MyIdResult,
  MyIdError,
} from './NitroMyid.nitro';

// Export all types
export type {
  MyIdConfig,
  MyIdResult,
  MyIdError,
  MyIdAppearance,
  MyIdOrganizationDetails,
} from './NitroMyid.nitro';

export {
  MyIdLocale,
  MyIdEnvironment,
  MyIdEntryType,
  MyIdResidency,
  MyIdCameraShape,
} from './NitroMyid.nitro';

// Get HybridObject
const NitroMyidHybridObject =
  NitroModules.createHybridObject<NitroMyid>('NitroMyid');

// Promise-based wrapper
export function startMyId(config: MyIdConfig): Promise<MyIdResult> {
  return new Promise((resolve, reject) => {
    NitroMyidHybridObject.start(
      config,
      (result: MyIdResult) => resolve(result),
      (error: MyIdError) =>
        reject(new Error(`[${error.code}] ${error.message}`)),
      () => reject(new Error('User exited'))
    );
  });
}

// React hook with callbacks
export function useMyId() {
  const start = (
    config: MyIdConfig,
    callbacks: {
      onSuccess: (result: MyIdResult) => void;
      onError: (error: MyIdError) => void;
      onUserExited: () => void;
    }
  ) => {
    NitroMyidHybridObject.start(
      config,
      callbacks.onSuccess,
      callbacks.onError,
      callbacks.onUserExited
    );
  };

  return { start };
}
