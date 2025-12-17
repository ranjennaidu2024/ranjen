# Supabase Setup Guide

This guide will help you set up Supabase for your API Key Management Dashboard.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in the project details:
   - **Name**: `ranjen` (or your preferred name)
   - **Database Password**: Generate a strong password and **save it somewhere safe**
   - **Region**: Choose the closest region to your users
   - **Pricing Plan**: Select Free tier to start
4. Click **"Create new project"**
5. Wait for your project to be set up (takes about 2 minutes)

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Settings** → **API**
2. You'll need two values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

## Step 3: Configure Environment Variables

1. Create a file named `.env.local` in your project root (if it doesn't exist)
2. Add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace `your_project_url_here` with your actual Project URL
4. Replace `your_anon_key_here` with your actual anon key

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click **"Run"** or press `Ctrl+Enter` (Windows/Linux) or `Cmd+Enter` (Mac)
6. You should see a success message

This will:
- Create the `api_keys` table with all necessary columns
- Add indexes for better query performance
- Create a trigger to auto-update the `updated_at` timestamp
- Insert 3 seed API keys (optional - you can remove them if needed)

## Step 5: Verify the Setup

1. In Supabase dashboard, go to **Table Editor**
2. You should see the `api_keys` table
3. Click on it to view the seed data (if you included it)

## Step 6: Run Your Application

1. Make sure all dependencies are installed:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:3000/dashboards in your browser
4. You should see your API key management dashboard connected to Supabase!

## Database Schema

The `api_keys` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | Name/description of the API key |
| `secret` | TEXT | The actual API key (unique) |
| `status` | TEXT | Either 'active' or 'revoked' |
| `scopes` | TEXT[] | Array of permissions (read, write, admin, delete) |
| `created_at` | TIMESTAMPTZ | When the key was created |
| `last_used` | TIMESTAMPTZ | When the key was last used (nullable) |
| `environment` | TEXT | production, staging, or development |
| `updated_at` | TIMESTAMPTZ | Auto-updated on changes |

## API Endpoints

The application uses the following API routes:

### Get All Keys
```
GET /api/keys?status=active&environment=production
```

### Create a Key
```
POST /api/keys
Content-Type: application/json

{
  "name": "My API Key",
  "secret": "groot_dev_abc123",
  "scopes": ["read", "write"],
  "environment": "development"
}
```

### Update a Key
```
PATCH /api/keys/[id]
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "revoked",
  "scopes": ["read"]
}
```

### Delete a Key
```
DELETE /api/keys/[id]
```

## Troubleshooting

### "Missing Supabase environment variables" Error
- Make sure `.env.local` exists in your project root
- Verify the variable names are correct: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your development server after adding environment variables

### "Failed to fetch API keys" Error
- Check that you've run the SQL schema in Supabase
- Verify your API credentials are correct
- Check the browser console for detailed error messages
- Make sure your Supabase project is running (check dashboard)

### Table doesn't exist
- Go back to Step 4 and run the SQL schema again
- Make sure there were no errors in the SQL Editor

### Can't create/update/delete keys
- Check the browser console for error messages
- Verify Row Level Security (RLS) is disabled or properly configured in Supabase
  - Go to **Authentication** → **Policies**
  - For development, you can disable RLS on the `api_keys` table

## Security Notes

1. **Never commit `.env.local`** to version control (it's already in `.gitignore`)
2. The `anon` key is safe to use in the browser for public operations
3. For production, consider implementing Row Level Security (RLS) policies
4. Rotate API keys regularly
5. Use different Supabase projects for development and production

## Next Steps

- Set up Row Level Security policies for production
- Add user authentication
- Implement API key usage tracking
- Add rate limiting
- Set up monitoring and alerts

## Support

- Supabase Documentation: https://supabase.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Project Issues: Create an issue in your repository

