# Production Deployment Instructions for Firebase

This guide outlines the steps to take the Streamflix application from its current development state (using CDN dependencies) to a production-ready build deployed on Firebase Hosting.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js and npm](https://nodejs.org/) (LTS version recommended)
- [Firebase CLI](https://firebase.google.com/docs/cli): `npm install -g firebase-tools`
- A Firebase account and a new project created on the [Firebase Console](https://console.firebase.google.com/).

---

## Step 1: Convert to a Standard Vite Project

The current setup relies on CDN links for React and Tailwind CSS, which is not optimal for production. We will convert it into a standard Vite project to bundle and optimize our code.

**1. Initialize a `package.json` file:**
```bash
npm init -y
```

**2. Install Dependencies:**
```bash
# Install React
npm install react react-dom

# Install development dependencies (Vite, TypeScript, Tailwind)
npm install -D typescript vite @vitejs/plugin-react tailwindcss postcss autoprefixer
```

**3. Create a `src` Directory:**
Create a new directory named `src` and move all the existing component, services, utils, and type folders (`components`, `services`, `utils`, `types.ts`) into it. Also move `App.tsx` and `index.tsx` into `src`.

**4. Create Configuration Files:**
Create the following configuration files in the root of your project:

- **`vite.config.ts`**
  ```typescript
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
  })
  ```

- **`tailwind.config.js`**
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }
  ```

- **`postcss.config.js`**
  ```javascript
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

**5. Create a Global CSS file:**
Create `src/index.css` and add the Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**6. Update `index.tsx` to import the new CSS file:**
Add this line at the top of `src/index.tsx`:
```javascript
import './index.css';
```

**7. Update `index.html`:**
Replace the entire content of `index.html` with the following. This removes the CDN links and points to our new Vite entry point.
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Streamflix</title>
  </head>
  <body class="bg-black">
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
```

**8. Update `package.json` with Scripts:**
Open your `package.json` and add the following `scripts` section:
```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
},
```

You can now run `npm run dev` to start the development server.

---

## Step 2: Firebase Project Setup

**1. Login to Firebase:**
```bash
firebase login
```

**2. Initialize Firebase Hosting:**
Run the following command in your project's root directory:
```bash
firebase init hosting
```
Follow the prompts:
- **Please select an option:** `Use an existing project`
- **Select a default Firebase project for this directory:** Choose the project you created in the Firebase Console.
- **What do you want to use as your public directory?** `dist` (This is where Vite places the production build).
- **Configure as a single-page app (rewrite all urls to /index.html)?** `Yes`

This will create `firebase.json` and `.firebaserc` files in your project.

---

## Step 3: Build for Production

Run the build script. This will compile, optimize, and minify your application into the `dist` folder.

```bash
npm run build
```

---

## Step 4: Deploy to Firebase

After the build is complete, deploy the contents of the `dist` folder to Firebase Hosting.

```bash
firebase deploy
```

Once the deployment is finished, the CLI will provide you with your live **Hosting URL**. Your Streamflix application is now live!
