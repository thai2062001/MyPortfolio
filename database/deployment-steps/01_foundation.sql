-- =========================================================
-- Step 01: Foundation (Extensions, Functions, Enums)
-- =========================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Common updated_at function
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Core Helper Function: is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Logic: Admins are service_role or users with admin role in their metadata
  -- This provides a safe baseline for RLS.
  RETURN (
    auth.role() = 'service_role' OR 
    (auth.jwt() ->> 'role' = 'authenticated' AND (auth.jwt() -> 'user_metadata' ->> 'is_admin')::boolean = true)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Vault Secret Helper (Idempotent)
CREATE OR REPLACE FUNCTION public.upsert_secret(new_name text, new_secret text, new_description text DEFAULT NULL)
RETURNS void AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM vault.secrets WHERE name = new_name) THEN
    UPDATE vault.secrets 
    SET secret = new_secret, 
        description = COALESCE(new_description, description) 
    WHERE name = new_name;
  ELSE
    INSERT INTO vault.secrets (name, secret, description) 
    VALUES (new_name, new_secret, new_description);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Enum Types (Safe Creation)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'section_type_enum') THEN
    CREATE TYPE section_type_enum AS ENUM (
      'hero', 'about', 'services', 'projects', 'testimonials', 
      'blog', 'contact', 'custom', 'expertise', 'timeline'
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'page_type_enum') THEN
    CREATE TYPE page_type_enum AS ENUM ('home', 'projects', 'blog', 'contact', 'about');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'section_data_source_enum') THEN
    CREATE TYPE section_data_source_enum AS ENUM ('table', 'fixed', 'mixed', 'none');
  END IF;
END $$;
