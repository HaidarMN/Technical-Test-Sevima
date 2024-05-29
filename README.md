# Technical Test Sekawan

## Getting Started

**Admin**
admin@admin.com
admin123

**Guest**
guest@guest.com
guest123

**Important Note**: this project use pnpm v8.15.2 for package manager. Make sure to install it first:

```bash
npm install -g pnpm@8.15.2
```

Don't forget to install the package:

```bash
pnpm install
# or
pnpm i
```

Next step is to run the development server on [http://localhost:3000](http://localhost:3000):

```bash
pnpm run dev
# or
pnpm dev
```

**Important Note**: this project is using Firebase for the data. If you want to search for something, make sure to type it correctly

Example:
Title: "Testing Search"

Search query:
- "Testing Search" :white_check_mark:
- "testing search" :white_check_mark:
- "Testing search" :white_check_mark:
- "Test" :x:
- "Testing" :x:
- "testing se" :x:

## Packages List

- react v18
- next v14.1.0
- node v21.2.0
- pnpm v8.15.2
