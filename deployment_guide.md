# Deployment Guide - Vercel

Follow these steps to host your library software for free on Vercel.

## 1. Push to GitHub
If you haven't already, push your code to a GitHub repository.
1. Go to [github.com](https://github.com) and create a new repository.
2. Link your local project to it and push the code:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

## 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with your GitHub account.
2. Click **"Add New"** > **"Project"**.
3. Import your library software repository.

## 3. Configure Environment Variables
Before clicking "Deploy", you must add your Supabase credentials:
1. Open the **"Environment Variables"** section.
2. Add the following keys (copy values from your `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 4. Deploy!
1. Click **"Deploy"**.
2. Once finished, Vercel will provide you with a public URL for your library!

## 5. (Optional) Custom Domain
You can add a custom domain (like `library.example.com`) in the Project Settings > Domains section on the Vercel dashboard.
