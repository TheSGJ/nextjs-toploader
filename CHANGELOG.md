# Changelogs

## v1.0.0

### Added

- Added next.js version 13.2.3 in package.json `peerDependancies`
- Initialized and added propTypes in NextTopLoader, Support for Next.js v13.2.3

## v1.0.1

### Updated

- Fixed misspelled Component name in README, added more instructions for the Component for the usage with `layout.js` in `app` folder structure

## v1.1.1

### Added

- Used `React.memo` for better performance

### Fixed

- Fix spelling for `NextTopLoadersProps` to `NextTopLoaderProps`

### Updated

- Removed unwanted `devDependancies` to reduce the package size

## v1.2.1

### Added

- Added `nprogress` and `@types/nprogress` packages for the `dependencies`

### Fixed

- Fix the `newUrl` returning as `undefined` value for few anchor tags , added support to prevent loader from being stuck for anchor navigation for hash urls

### Updated

- Refactor the code in `useEffect` hook, removed the `next/script`

## v1.2.2

### Fixed

- Fix the Loader gets triggered on navigation to link in another tab

## v1.3.2

### Added

- Added support for client side navigations

## v1.4.2

### Added

- Added shadow config prop

### Fixed

- Fixed spelling for increment. And updated the README.
