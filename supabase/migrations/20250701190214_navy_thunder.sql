/*
  # Create WiFi Networks Table

  1. New Tables
    - `wifi_networks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `network_name` (text, required)
      - `encrypted_password` (text, required)
      - `location` (text, optional)
      - `notes` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `wifi_networks` table
    - Add policies for authenticated users to manage their own networks
    - Add trigger to automatically update `updated_at` timestamp
*/

-- Create the wifi_networks table
CREATE TABLE IF NOT EXISTS wifi_networks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  network_name text NOT NULL,
  encrypted_password text NOT NULL,
  location text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE wifi_networks ENABLE ROW LEVEL SECURITY;

-- Create policies for CRUD operations
CREATE POLICY "Users can view their own networks"
  ON wifi_networks
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own networks"
  ON wifi_networks
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own networks"
  ON wifi_networks
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own networks"
  ON wifi_networks
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_wifi_networks_updated_at ON wifi_networks;
CREATE TRIGGER update_wifi_networks_updated_at
  BEFORE UPDATE ON wifi_networks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX IF NOT EXISTS wifi_networks_user_id_idx ON wifi_networks(user_id);
CREATE INDEX IF NOT EXISTS wifi_networks_created_at_idx ON wifi_networks(created_at DESC);