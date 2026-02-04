import type { HybridObject } from 'react-native-nitro-modules';

// ========== Enums ==========
export enum MyIdLocale {
  EN = 'en',
  RU = 'ru',
  UZ = 'uz',
}

export enum MyIdEnvironment {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production',
}

export enum MyIdEntryType {
  IDENTIFICATION = 'identification',
  FACE_DETECTION = 'faceDetection',
}

export enum MyIdResidency {
  RESIDENT = 'resident',
  NON_RESIDENT = 'nonResident',
  USER_DEFINED = 'userDefined',
}

export enum MyIdCameraShape {
  CIRCLE = 'circle',
  ELLIPSE = 'ellipse',
}

// ========== Appearance / Customization ==========
export interface MyIdAppearance {
  colorPrimary?: string;
  colorOnPrimary?: string;
  colorError?: string;
  colorOnError?: string;
  colorOutline?: string;
  colorDivider?: string;
  colorSuccess?: string;
  colorButtonContainer?: string;
  colorButtonContainerDisabled?: string;
  colorButtonContent?: string;
  colorButtonContentDisabled?: string;
  colorScanButtonContainer?: string;
  buttonCornerRadius?: number;
}

// ========== Organization Details ==========
export interface MyIdOrganizationDetails {
  phoneNumber?: string;
  logo?: string;
}

// ========== Configuration ==========
export interface MyIdConfig {
  sessionId: string;
  clientHash: string;
  clientHashId: string;
  locale?: MyIdLocale;
  environment?: MyIdEnvironment;
  entryType?: MyIdEntryType;
  residency?: MyIdResidency;
  cameraShape?: MyIdCameraShape;
  minAge?: number;
  showErrorScreen?: boolean;
  appearance?: MyIdAppearance;
  organizationDetails?: MyIdOrganizationDetails;
}

// ========== Result Types ==========
export interface MyIdResult {
  code: string;
  base64Image: string;
}

export interface MyIdError {
  code: number;
  message: string;
}

// ========== Hybrid Object Interface ==========
export interface NitroMyid
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  start(
    config: MyIdConfig,
    onSuccess: (result: MyIdResult) => void,
    onError: (error: MyIdError) => void,
    onUserExited: () => void
  ): void;
}
