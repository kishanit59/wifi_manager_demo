# WiFi Password Manager

A secure, modern web application for managing Wi-Fi passwords with GitHub authentication and end-to-end encryption.

## Setup Instructions


### 1. Supabase Configuration

After connecting to Supabase, you need to enable GitHub OAuth:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **GitHub** in the list and click **Enable**
5. You'll need to configure GitHub OAuth:
   - Go to [GitHub Settings](https://github.com/settings/developers)
   - Click **New OAuth App**
   - Fill in the application details:
     - **Application name**: WiFi Password Manager
     - **Homepage URL**: `https://your-domain.com` (or `http://localhost:5173` for development)
     - **Authorization callback URL**: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Click **Register application**
   - Copy the **Client ID** and generate a **Client Secret**
6. Back in Supabase, paste the Client ID and Client Secret
7. Save the configuration

### 2. Database Setup

The application requires a `wifi_networks` table. Create it with this SQL:

```sql
-- Create the wifi_networks table
CREATE TABLE wifi_networks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  network_name TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE wifi_networks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own networks" ON wifi_networks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own networks" ON wifi_networks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own networks" ON wifi_networks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own networks" ON wifi_networks
  FOR DELETE USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wifi_networks_updated_at
  BEFORE UPDATE ON wifi_networks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### 3. Environment Variables

Make sure your `.env` file contains:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ENCRYPTION_KEY=your_32_character_encryption_key
```

### 4. Running the Application

```bash
npm run dev
```

## Features

- 🔐 GitHub OAuth authentication
- 🔒 End-to-end password encryption
- 📱 Fully responsive design
- 🌙 Dark/Light mode support
- 📋 Copy passwords to clipboard
- 📱 QR code generation for easy sharing
- 🔍 Search and filter networks
- 📝 Add location and notes

## Security

- All passwords are encrypted using AES encryption before storage
- Row Level Security (RLS) ensures users can only access their own data
- GitHub OAuth provides secure authentication
- No passwords are stored in plain text

## 📸 Project Screenshot

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-14-54.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-24-14.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-25-51.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-26-03.png)
