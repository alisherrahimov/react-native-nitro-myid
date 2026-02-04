# Contributing

We welcome contributions to `react-native-nitro-myid`! This document provides guidelines for contributing.

## Development Setup

1. **Clone the repository**

```sh
git clone https://github.com/alisherrahimov/react-native-nitro-myid.git
cd react-native-nitro-myid
```

2. **Install dependencies**

```sh
yarn install
```

3. **Generate Nitro bindings**

```sh
yarn nitrogen
```

4. **Build the library**

```sh
yarn prepare
```

## Development Workflow

### Running the Example App

**iOS:**

```sh
cd example
yarn ios
```

**Android:**

```sh
cd example
yarn android
```

### Making Changes

1. Make your changes to the TypeScript source in `src/`
2. If modifying the native interface, update `src/NitroMyid.nitro.ts`
3. Run `yarn nitrogen` to regenerate bindings
4. Test on both platforms

### Code Style

- We use ESLint and Prettier for code formatting
- Run `yarn lint` to check for issues
- Run `yarn typecheck` to verify TypeScript types

## Project Structure

```
react-native-nitro-myid/
├── src/                    # TypeScript source
│   ├── NitroMyid.nitro.ts  # Nitro interface definition
│   └── index.tsx           # Public API
├── ios/                    # iOS native code (Swift)
├── android/                # Android native code (Kotlin)
├── nitrogen/               # Generated Nitro bindings
├── example/                # Example React Native app
└── README.md
```

## Sending a Pull Request

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

### Commit Message Convention

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
