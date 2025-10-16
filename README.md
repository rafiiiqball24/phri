<br />
<div align="center">
  <img width="200" src="assets/img/nuxt_logo.png" alt="Nuxt 3">
</div>
<br />

# Nuxt 3 Boilerplate with TypeScript

This boilerplate will help get you started developing with Nuxt 3. Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Stack](#stack)
- [Setup](#setup)
- [Development Server](#development-server)
- [Production](#production)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)

## Prerequisites

- [Node.js - `v18.0.0`](https://nodejs.org/) or newer
- Text editor, - We recommend [Visual Studio Code](https://code.visualstudio.com/) with the [official Vue extension](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously known as Volar)
- Terminal - In order to run Nuxt commands

## Stack

| Technology   | Version | Documentation                                                            |
| ------------ | ------- | ------------------------------------------------------------------------ |
| Nuxt         | 3.10    | [Documentation](https://nuxt.com/)                                       |
| Pinia        | 2.1.7   | [Documentation](https://pinia.vuejs.org/)                                |
| Tailwind CSS | 3.4.1   | [Documentation](https://tailwindcss.com/)                                |
| Moment.js    | 2.30.1  | [Documentation](https://momentjs.com/)                                   |
| Nuxt i18n    | 8.1     | [Documentation](https://i18n.nuxtjs.org/)                                |
| Vue Router   | 4.2.5   | [Documentation](https://router.vuejs.org/)                               |
| TypeScript   | 5.4.2   | [Documentation](https://nuxt.com/docs/guide/concepts/typescript)         |
| daisyUI      | 1.12.1  | [Documentation](https://daisyui.com/)                                    |
| Vee Validate | 4.12    | [Documentation](https://vee-validate.logaretm.com/v4/integrations/nuxt/) |

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Folder Structure

- `assets` - app's assets - contains assets folder holds your asset files like Stylesheets (CSS, SASS, etc.), fonts and images that won't be served from the `public/` directory
- `components` - where you put all your Vue components
- `helpers` - contains helper functions that you would like to use in your application
- `layouts` - app's layouts - layouts framework to extract common UI patterns into reusable layouts
- `locales` - all language configurations go here
- `plugins` - store Vue plugins that extend core functionality
- `pages` - contains Vue components representing the views or screens of your application. Each file corresponds to a route in your application
- `public` - serve your website's static assets
- `server` - contains server-side code such as API routes, server middleware, or any server-related logic

## Contributing

Contributions are welcome! Please feel free to open issues or pull requests for any improvements, bug fixes, or feature additions.
