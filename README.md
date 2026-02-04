# react-native-nitro-myid

High-performance React Native wrapper for [MyID SDK](https://myid.uz) - Uzbekistan's biometric identification system. Built with [Nitro Modules](https://nitro.margelo.com/) for native-speed JSI integration.

## Features

- ✅ **iOS & Android** support
- ⚡ **High performance** via JSI (no bridge overhead)
- 🎨 **Full customization** - colors, branding, localization
- 📝 **TypeScript** first-class support
- 🔐 **Biometric identification** via MyID services

## Installation

```sh
npm install react-native-nitro-myid react-native-nitro-modules
# or
yarn add react-native-nitro-myid react-native-nitro-modules
```

### iOS Setup

1. Add MyID SDK to your Podfile:

```ruby
# ios/Podfile
pod 'MyIdSDK', :git => 'https://gitlab.myid.uz/myid-public-code/myid-ios-sdk.git', :tag => '3.1.3'
```

2. Run pod install:

```sh
cd ios && pod install
```

3. Add required permissions to `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Camera access is required for identity verification</string>
```

### Android Setup

1. Add MyID Maven repository in your `android/build.gradle`:

```gradle
allprojects {
    repositories {
        // ... other repos
        maven { url "https://artifactory.aigroup.uz:443/artifactory/myid" }
    }
}
```

2. Minimum SDK version 24 is required.

## Quick Start

```typescript
import {
  startMyId,
  MyIdLocale,
  MyIdEnvironment,
} from 'react-native-nitro-myid';

try {
  const result = await startMyId({
    sessionId: 'your-session-id',
    clientHash: 'your-client-hash',
    clientHashId: 'your-client-hash-id',
    locale: MyIdLocale.EN,
    environment: MyIdEnvironment.SANDBOX,
  });

  console.log('Verification code:', result.code);
  console.log('Face image (base64):', result.base64Image);
} catch (error) {
  console.error('Verification failed:', error.message);
}
```

## API Reference

### `startMyId(config: MyIdConfig): Promise<MyIdResult>`

Promise-based API for simple usage.

```typescript
const result = await startMyId(config);
```

### `useMyId()`

Hook-based API with callbacks for more control.

```typescript
const { start } = useMyId();

start(config, {
  onSuccess: (result) => console.log('Success:', result.code),
  onError: (error) => console.error('Error:', error.message),
  onUserExited: () => console.log('User cancelled'),
});
```

---

## Configuration

### `MyIdConfig`

| Property              | Type                      | Required | Description                    |
| --------------------- | ------------------------- | -------- | ------------------------------ |
| `sessionId`           | `string`                  | ✅       | Session ID from MyID backend   |
| `clientHash`          | `string`                  | ✅       | Client hash for authentication |
| `clientHashId`        | `string`                  | ✅       | Client hash ID                 |
| `locale`              | `MyIdLocale`              |          | UI language                    |
| `environment`         | `MyIdEnvironment`         |          | SANDBOX or PRODUCTION          |
| `entryType`           | `MyIdEntryType`           |          | Verification type              |
| `residency`           | `MyIdResidency`           |          | User residency type            |
| `cameraShape`         | `MyIdCameraShape`         |          | Camera preview shape           |
| `minAge`              | `number`                  |          | Minimum age requirement        |
| `showErrorScreen`     | `boolean`                 |          | Show SDK error screens         |
| `appearance`          | `MyIdAppearance`          |          | UI customization (iOS only)    |
| `organizationDetails` | `MyIdOrganizationDetails` |          | Branding                       |

---

## Enums

### `MyIdLocale`

```typescript
MyIdLocale.EN; // English
MyIdLocale.RU; // Russian
MyIdLocale.UZ; // Uzbek
```

### `MyIdEnvironment`

```typescript
MyIdEnvironment.SANDBOX; // Testing environment
MyIdEnvironment.PRODUCTION; // Production environment
```

### `MyIdEntryType`

```typescript
MyIdEntryType.IDENTIFICATION; // Full identification
MyIdEntryType.FACE_DETECTION; // Face detection only
```

### `MyIdResidency`

```typescript
MyIdResidency.RESIDENT; // Uzbekistan resident
MyIdResidency.NON_RESIDENT; // Non-resident
MyIdResidency.USER_DEFINED; // User selects
```

### `MyIdCameraShape`

```typescript
MyIdCameraShape.CIRCLE; // Circular camera view
MyIdCameraShape.ELLIPSE; // Elliptical camera view
```

---

## Customization

### iOS Appearance (Programmatic)

```typescript
const config: MyIdConfig = {
  // ... required fields
  appearance: {
    colorPrimary: '#6200EE',
    colorOnPrimary: '#FFFFFF',
    colorButtonContainer: '#3700B3',
    buttonCornerRadius: 12,
  },
};
```

### Android Appearance (Resource-based)

Android uses XML resources for theming. Add to your `android/app/src/main/res/values/colors.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="myid_color_primary">#6200EE</color>
    <color name="myid_color_onPrimary">#FFFFFF</color>
    <color name="myid_button_container_color">#3700B3</color>
    <color name="myid_button_content_color">#FFFFFF</color>
</resources>
```

For button corner radius, add to `res/values/dimens.xml`:

```xml
<dimen name="myid_button_corner_radius">12dp</dimen>
```

### Organization Branding

```typescript
const config: MyIdConfig = {
  // ... required fields
  organizationDetails: {
    phoneNumber: '+998901234567',
    logo: 'my_company_logo', // iOS: image name | Android: drawable resource name
  },
};
```

---

## Result Types

### `MyIdResult`

```typescript
interface MyIdResult {
  code: string; // Verification code from MyID
  base64Image: string; // Face portrait as base64 PNG
}
```

### `MyIdError`

```typescript
interface MyIdError {
  code: number; // Error code
  message: string; // Error description
}
```

---

## Error Handling

The SDK may throw errors in these cases:

| Code | Description                                  |
| ---- | -------------------------------------------- |
| -1   | User exited                                  |
| 100+ | SDK-specific errors (see MyID documentation) |

```typescript
try {
  const result = await startMyId(config);
} catch (error) {
  // Error format: "[code] message"
  console.error(error.message);
}
```

---

## Requirements

| Platform     | Minimum Version       |
| ------------ | --------------------- |
| iOS          | 13.0+                 |
| Android      | API 24+ (Android 7.0) |
| React Native | 0.76+                 |

## License

MIT

---

Made with [Nitro Modules](https://nitro.margelo.com/)
