-- =========================================================
-- Patch: Fix Contact Purpose Options Schema Mismatch
-- =========================================================

DO $$ 
BEGIN
    -- 1. Add 'value' column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_purpose_options' AND column_name = 'value') THEN
        ALTER TABLE public.contact_purpose_options ADD COLUMN value TEXT;
        -- Populate value from label_en (slugified)
        UPDATE public.contact_purpose_options SET value = LOWER(REPLACE(label_en, ' ', '_')) WHERE value IS NULL;
        ALTER TABLE public.contact_purpose_options ALTER COLUMN value SET NOT NULL;
        ALTER TABLE public.contact_purpose_options ADD CONSTRAINT contact_purpose_options_value_key UNIQUE (value);
    END IF;

    -- 2. Add 'description' column if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_purpose_options' AND column_name = 'description') THEN
        ALTER TABLE public.contact_purpose_options ADD COLUMN description TEXT;
    END IF;

    -- 3. Handle 'is_active' vs 'is_published'
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_purpose_options' AND column_name = 'is_active') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_purpose_options' AND column_name = 'is_published') THEN
            ALTER TABLE public.contact_purpose_options RENAME COLUMN is_published TO is_active;
        ELSE
            ALTER TABLE public.contact_purpose_options ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
        END IF;
    END IF;

    -- 4. Add 'updated_at' if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_purpose_options' AND column_name = 'updated_at') THEN
        ALTER TABLE public.contact_purpose_options ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 5. Add trigger for updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contact_purpose_options_updated_at') THEN
    CREATE TRIGGER trg_contact_purpose_options_updated_at BEFORE UPDATE ON public.contact_purpose_options FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 6. Fix contact_form_settings missing columns
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_form_settings' AND column_name = 'is_purpose_enabled') THEN
        ALTER TABLE public.contact_form_settings ADD COLUMN is_purpose_enabled BOOLEAN DEFAULT TRUE;
        ALTER TABLE public.contact_form_settings ADD COLUMN is_purpose_required BOOLEAN DEFAULT FALSE;
        ALTER TABLE public.contact_form_settings ADD COLUMN purpose_placeholder_en TEXT DEFAULT 'How can I help you?';
        ALTER TABLE public.contact_form_settings ADD COLUMN purpose_placeholder_ja TEXT DEFAULT 'ご用件を選択してください';
        ALTER TABLE public.contact_form_settings ADD COLUMN purpose_placeholder_vi TEXT DEFAULT 'Tôi có thể giúp gì cho bạn?';
    END IF;
END $$;

-- 7. Ensure initial settings exist
INSERT INTO public.contact_form_settings (id, is_purpose_enabled, is_purpose_required)
VALUES (1, TRUE, FALSE)
ON CONFLICT (id) DO NOTHING;
