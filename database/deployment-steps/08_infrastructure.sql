-- =========================================================
-- Step 08: Infrastructure (Pages, Contact, Logs, FAQs)
-- =========================================================

-- 1. Page Sections (The most critical table for dynamic layout)
CREATE TABLE IF NOT EXISTS public.page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type page_type_enum NOT NULL DEFAULT 'home',
  section_key TEXT NOT NULL, -- Identifer for frontend logic
  section_type section_type_enum NOT NULL,
  section_name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  is_visible BOOLEAN DEFAULT TRUE,
  is_fixed BOOLEAN DEFAULT FALSE,
  data_source section_data_source_enum DEFAULT 'table',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page_type, section_key),
  UNIQUE(page_type, section_name)
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_page_sections_updated_at') THEN
    CREATE TRIGGER trg_page_sections_updated_at BEFORE UPDATE ON public.page_sections FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 2. Contact Infrastructure
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  purpose TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_purpose_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en TEXT NOT NULL UNIQUE,
  label_ja TEXT,
  label_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.contact_form_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  eyebrow_en TEXT DEFAULT 'CONTACT',
  title_en TEXT DEFAULT 'Get in Touch',
  eyebrow_ja TEXT,
  title_ja TEXT,
  eyebrow_vi TEXT,
  title_vi TEXT,
  submit_button_label_en TEXT DEFAULT 'SEND MESSAGE',
  success_message_en TEXT DEFAULT 'Message sent successfully!',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_contact_form_settings_updated_at') THEN
    CREATE TRIGGER trg_contact_form_settings_updated_at BEFORE UPDATE ON public.contact_form_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 3. FAQs
CREATE TABLE IF NOT EXISTS public.faq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_en TEXT NOT NULL,
  question_ja TEXT,
  question_vi TEXT,
  answer_en TEXT NOT NULL,
  answer_ja TEXT,
  answer_vi TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_faq_items_updated_at') THEN
    CREATE TRIGGER trg_faq_items_updated_at BEFORE UPDATE ON public.faq_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 4. Animation Settings
CREATE TABLE IF NOT EXISTS public.page_animation_settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  transition_type TEXT DEFAULT 'fade',
  duration FLOAT DEFAULT 0.5,
  stagger_children FLOAT DEFAULT 0.1,
  ease TEXT DEFAULT 'easeInOutQuick',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_page_animation_settings_updated_at') THEN
    CREATE TRIGGER trg_page_animation_settings_updated_at BEFORE UPDATE ON public.page_animation_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

-- 5. Logging & Analytics
CREATE TABLE IF NOT EXISTS public.portfolio_visit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT,
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.daily_report_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_date DATE NOT NULL UNIQUE,
  total_visits INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  messages_received INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
