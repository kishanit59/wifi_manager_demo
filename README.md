# WiFi Password Manager

A secure, modern web application for managing Wi-Fi passwords with GitHub authentication and end-to-end encryption.

## Setup Instructions


### 1. Database Setup

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

### 2. Running the Application

```bash
npm run dev
```

## Features

- 🔒 End-to-end password encryption
- 📱 Fully responsive design
- 📋 Copy passwords to clipboard
- 📱 QR code generation for easy sharing
- 🔍 Search and filter networks
- 📝 Add location and notes

## Security

- All passwords are encrypted using AES encryption before storage
- Row Level Security (RLS) ensures users can only access their own data
- No passwords are stored in plain text

## 📸 Project Screenshot

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-14-54.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-24-14.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-25-51.png)

![WiFi Password Manager Screenshot](https://raw.githubusercontent.com/kishanit59/wifi_manager_demo/refs/heads/main/Screenshot%20from%202025-07-03%2000-26-03.png)
