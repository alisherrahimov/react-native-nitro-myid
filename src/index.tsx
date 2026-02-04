import { NitroModules } from 'react-native-nitro-modules';
import type { NitroMyid } from './NitroMyid.nitro';

const NitroMyidHybridObject =
  NitroModules.createHybridObject<NitroMyid>('NitroMyid');

export function multiply(a: number, b: number): number {
  return NitroMyidHybridObject.multiply(a, b);
}
