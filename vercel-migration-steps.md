# Migration to Vercel

## 1. Vercel Configuration
We've added a `vercel.json` file to the root of your project. This specifically tells Vercel how to handle routing for Vite Single Page Applications (SPAs) to prevent 404 errors on deep links.

## 2. Dynamic Auth Update
We updated `src/components/AuthModal.tsx` to dynamically detect the origin for Firebase Magic Links instead of hardcoding the old Firebase Hosting URL.

```typescript
const actionCodeSettings = {
  url: `${window.location.origin}/finish-sign-in`,
  handleCodeInApp: true,
};
```

*Note: You MUST add your new `<your-project>.vercel.app` domain to the Authorized Domains list in the Firebase Authentication Console for this to work.*

## 3. Google AdSense
For Google AdSense to work, you must log into your AdSense dashboard, click on **Sites**, and click **Add Site**. Enter your new Vercel domain (e.g., `the-daily-byte.vercel.app`). Verify the ownership by copying the meta tag into your `index.html` or letting AdSense verify the script tag. The component logic (`NewsAd.tsx`) remains exactly the same as it simply executes the AdSense push.

## 4. GitHub Push-to-Deploy

To link your GitHub repository to Vercel and enable automatic deployments (Push-to-Deploy), run the following command in your terminal using the Vercel CLI (or do it natively through the Vercel dashboard):

```bash
npx vercel link
npx vercel git connect
```
Or simply push your code to GitHub, go to your Vercel Dashboard, click **Add New Project**, select your GitHub repository, set the Framework Preset to `Vite`, and click **Deploy**.
