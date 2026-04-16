# 🛠 Supabase Database Schema Reference (Trilingual)

This document contains the standard schema patterns for the Radiant Growth Portfolio. For the full initialization script, use the [SUPABASE_SCHEMA_CONSOLIDATED.sql](../SUPABASE_SCHEMA_CONSOLIDATED.sql) file.

## Core Multi-Language Pattern
Every content-heavy table follows this standard for English (default), Japanese (`_ja`), and Vietnamese (`_vi`).

```sql
-- Pattern Example
CREATE TABLE example (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,         -- Default (EN)
  title_ja TEXT,               -- Japanese
  title_vi TEXT,               -- Vietnamese
  content TEXT NOT NULL,       -- Default (EN)
  content_ja TEXT,             -- Japanese
  content_vi TEXT              -- Vietnamese
);
```

---

## 🏗 Key Tables

### 1. Projects (`projects`)
| Column | Type | Description |
| --- | --- | --- |
| `title` | TEXT | English Title |
| `title_ja` | TEXT | Japanese Title |
| `title_vi` | TEXT | Vietnamese Title |
| `description` | TEXT | EN Description |
| `description_ja` | TEXT | JA Description |
| `description_vi` | TEXT | VI Description |
| `is_published` | BOOLEAN | Visibility toggle |
| `is_featured` | BOOLEAN | Highlight toggle |

### 2. Expertise Tool Items (`expertise_tool_items`)
| Column | Type | Description |
| --- | --- | --- |
| `tool_name` | TEXT | Tool Name (EN) |
| `tool_name_ja` | TEXT | Tool Name (JA) |
| `tool_name_vi` | TEXT | Tool Name (VI) |
| `description` | TEXT | EN Narrative |
| `description_ja` | TEXT | JA Narrative |
| `description_vi` | TEXT | VI Narrative |

### 3. Timeline Phases (`timeline_phases`)
| Column | Type | Description |
| --- | --- | --- |
| `title_en` | TEXT | Phase Title (EN) |
| `title_ja` | TEXT | Phase Title (JA) |
| `title_vi` | TEXT | Phase Title (VI) |
| `company_en` | TEXT | Company (EN) |
| `company_ja` | TEXT | Company (JA) |
| `company_vi` | TEXT | Company (VI) |

---

## 🔐 Security (RLS Policies)
- **Public**: Select access only where `is_published = true`.
- **Authenticated**: Full CRUD access for the Admin account.

## ⚡ Automation
All tables have a trigger `trg_..._updated_at` that automatically sets the `updated_at` timestamp on every update.

---
*Refer to SUPABASE_SCHEMA_CONSOLIDATED.sql for the complete DDL script.*
