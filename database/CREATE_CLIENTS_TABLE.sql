-- Create Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_clients_order_index ON clients(order_index);
CREATE INDEX IF NOT EXISTS idx_clients_is_published ON clients(is_published);

-- Enable RLS (Row Level Security)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON clients
  FOR SELECT
  USING (is_published = true);

-- Create policy for authenticated users to manage clients
CREATE POLICY "Allow authenticated users to manage clients" ON clients
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
