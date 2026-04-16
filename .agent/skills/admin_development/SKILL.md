# Admin Development Standard
**name:** admin_development  
**description:** Architectural standards, common pitfalls, and implementation patterns for the Radiant Growth Portfolio Admin Panel. Read this FIRST before creating or editing any admin page or component.

---

> [!CAUTION]
> **MANDATORY PRE-REQUISITE**:
> 1. **Read this Skill**: You MUST read this documentation in its entirety BEFORE performing any tasks related to the Admin Panel.
> 2. **Database Truth**: You MUST read `SUPABASE_SCHEMA_CONSOLIDATED.sql` BEFORE creating any Page, UI, or Database-related code.
> 3. **Fixed Port**: The development port is strictly **8080**. Do not use or configure any other ports.

## 1. Core Principles

- **Component-Driven**: Avoid monolithic page files. Use shared admin components.
- **Generic CRUD**: Use the `useAdminCRUD` hook for all data operations — it auto-fetches on mount.
- **Tabbed Dialogs**: Use `AdminDialogForm` for all create/edit operations.
- **Glassmorphism Aesthetic**: `bg-white/60`, `backdrop-blur-xl`, `rounded-[2.5rem]`.
- **Zero Redundancy**: Before creating a new component, check if an existing one can be reused.
- **Import Stability**: Audit all imports after refactors to prevent `ReferenceError`.
- **Plain English UI**: Use standard, universally understood terminology for labels and buttons (e.g. "Save Changes", "Edit", "Settings" - not "Synchronize", "Refinement", "Protocol").

---

## 2. Reusable Foundation

| Component | Responsibility | Path |
| :--- | :--- | :--- |
| `AdminLayout` | Sidebar + main layout wrapper | `@/components/admin/AdminLayout` |
| `AdminPageHeader` | Title, description, search, primary add action | `@/components/admin/shared/AdminPageHeader` |
| `AdminDialogForm` | Tabbed dialog with sidebar nav and sticky footer | `@/components/admin/shared/AdminDialogForm` |
| `AdminFormSection` | Grouped section inside a form tab | `@/components/admin/shared/AdminFormSection` |
| `AdminField` | Label + Input wrapper | `@/components/admin/shared/AdminFormSection` |
| `AdminStatusToggle` | Card toggle for is_published visibility | `@/components/admin/shared/AdminStatusToggle` |
| `AdminTaxonomyForm` | Reusable form for slug/name_en/name_ja/icon taxonomy entities | `@/components/admin/shared/AdminTaxonomyForm` |
| `ResponsiveDataTable` | Table + mobile card view, search, edit/delete | `@/components/admin/shared/ResponsiveDataTable` |
| `AdminLoading` | Themed loading spinner | `@/components/admin/shared/AdminLoading` |
| `useAdminCRUD` | Generic hook for Supabase fetch/upsert/delete | `@/hooks/useAdminCRUD` |

---

## 3. Critical Bug Patterns — DO NOT REPEAT

### 🔴 Bug 1: Flex Scroll Broken in Dialog
**Symptom:** Form content overflows, footer overlaps content, content is not scrollable.  
**Root Cause:** CSS Flexbox `flex: 1` alone does NOT constrain height for scrolling. `min-height` defaults to `auto`, so the flex item grows with content instead of scrolling.

```tsx
// ❌ WRONG — scroll will NOT work
<div className="flex-1 overflow-y-auto">

// ✅ CORRECT — min-h-0 overrides min-height: auto, enabling scroll
<div className="flex-1 overflow-y-auto min-h-0">
```

**Also required:** Parent flex column must have `min-h-0` too:
```tsx
// ✅ Parent
<div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
```

---

### 🔴 Bug 2: Double Sidebar / Double AdminLayout
**Symptom:** Two sidebars appear side by side.  
**Root Cause:** A parent Page component wraps in `<AdminLayout>`, and the child Management component also wraps in `<AdminLayout>`.

**Rule:** Only ONE component in the chain provides `<AdminLayout>`.
- If the **page wrapper** (e.g., `StrategicSkillsPage`) renders `<AdminLayout>`, the **Management component** must NOT.
- Best pattern: Route directly to the Management component which owns its own `<AdminLayout>`, remove the intermediate Page wrapper entirely.

```tsx
// App.tsx — route directly to Management, no Page wrapper needed
const StrategicSkillsManagement = lazy(() => import("./pages/admin/StrategicSkillsManagement"));
<Route path="/admin/strategic-skills" element={<ProtectedRoute><StrategicSkillsManagement /></ProtectedRoute>} />
```

---

### 🔴 Bug 3: Double Data Fetch
**Symptom:** Network shows two identical Supabase requests on page load.  
**Root Cause:** `useAdminCRUD` hook already auto-fetches on mount via `useEffect`. Manually calling `fetchData()` in the page component's own `useEffect` causes a double fetch.

```tsx
// ❌ WRONG — causes double fetch
const { fetchData } = useAdminCRUD({ tableName: "clients" });
useEffect(() => {
  fetchData(); // hook already does this internally
}, [fetchData]);

// ✅ CORRECT — just destructure and use, hook auto-fetches
const { data: clients, loading, upsertData, deleteData } = useAdminCRUD({ tableName: "clients" });
```

---

### 🔴 Bug 4: Wrong AdminStatusToggle Props
**Symptom:** TypeScript errors or toggle not responding.  
**Root Cause:** `AdminStatusToggle` uses `isPublished`/`onToggle`, NOT `isActive`/`onChange`.

```tsx
// ❌ WRONG
<AdminStatusToggle isActive={value} onChange={(v) => ...} description="..." />

// ✅ CORRECT
<AdminStatusToggle
  isPublished={formData.is_published ?? false}
  onToggle={(val) => setFormData({ ...formData, is_published: val })}
  description={{ active: "Live text.", inactive: "Draft text." }}
/>
```

---

### 🔴 Bug 5: Invalid/Nonexistent Props
**Symptom:** TypeScript error; prop is silently ignored.  
**Examples found:** `footerMetadata` passed to `AdminDialogForm` (doesn't exist in interface).

**Rule:** Always check `AdminDialogFormProps` interface before passing props:
```ts
// Valid AdminDialogForm props only:
open, onOpenChange, title, description, tabs, activeTab, onTabChange,
onSave, saving, children, sidebarTitle, sidebarSubtitle, sidebarIcon, saveLabel
```

---

### 🔴 Bug 6: Wrong Table Name
**Symptom:** Supabase query returns empty data or 404.  
**Root Cause:** Table name in `useAdminCRUD` doesn't match the actual Supabase schema.

**Always verify against `SUPABASE_SCHEMA_CONSOLIDATED.sql` before writing `tableName`.**  
Known mapping:
```
StrategicSkills  → tableName: "expertise_strategic_skills"  (NOT "strategic_skills")
ToolItems        → tableName: "expertise_tool_items"
FAQ              → tableName: "faq"
```

---

### 🔴 Bug 7: Wrong Type Field Names
**Symptom:** TypeScript error like `Property 'name' does not exist on type 'ProjectCategory'`.  
**Root Cause:** Some types use `name_en`/`name_ja` instead of `name`.

**Always check `src/types/admin.ts` before accessing type fields.**  
Common pattern for i18n entities:
```tsx
// ❌ WRONG
{categories.map(c => <option value={c.id}>{c.name}</option>)}

// ✅ CORRECT — lang-aware
{categories.map(c => <option value={c.id}>{lang === 'ja' ? (c.name_ja || c.name_en) : c.name_en}</option>)}
```

---

### 🟡 Bug 8: Double Padding in Form Components
**Symptom:** Form content has too much whitespace.  
**Root Cause:** `AdminDialogForm` now adds `p-6 md:p-10` to the scroll area. Form components (e.g., `ClientForm`, `ToolItemForm`) must NOT add their own outer padding.

```tsx
// ❌ WRONG — double padding
export const ClientForm = () => (
  <div className="p-4 md:p-8 space-y-10"> {/* ← remove this outer padding */}

// ✅ CORRECT — no outer padding, AdminDialogForm handles it
export const ClientForm = () => (
  <div className="space-y-10 text-left">
```

---

## 4. Architecture Pattern — New Admin Page

### Step 1: Decide the pattern
- **Simple taxonomy** (slug + name EN/JA + icon + order): Use `AdminTaxonomyForm` directly, no custom form needed.
- **Simple entity** (< 5 fields, 1-2 tabs): Use form inline via `tabs[].content` in the page.
- **Complex entity** (multi-field, 3+ tabs): Extract to a `FeatureForm.tsx` component in `components/admin/<feature>/`.

### Step 2: Data hook
```tsx
const { data, loading, saving, deleting, upsertData, deleteData } = useAdminCRUD<MyType>({
  tableName: "my_table",  // verify in SUPABASE_SCHEMA_CONSOLIDATED.sql
  defaultOrderBy: { column: "order_index", ascending: true }
});
// ⚠️ Do NOT manually call fetchData() — hook auto-fetches on mount
```

### Step 3: Page structure
```tsx
return (
  <AdminLayout>
    <DeleteConfirmDialog ... />
    <div className="space-y-12 animate-in fade-in duration-700 pb-12">
      <AdminPageHeader title="..." searchTerm={...} onSearchChange={...} primaryAction={{ label: "Add", onClick: handleAdd }} />
      <ResponsiveDataTable data={...} columns={...} loading={loading} ... />
      <AdminDialogForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="..."
        tabs={tabs}         // array of { id, label, fullLabel, icon }
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSave={handleSave}
        saving={saving}
        sidebarTitle="..."
        sidebarSubtitle="..."
        sidebarIcon={SomeIcon}
      >
        <MyFeatureForm formData={formData} setFormData={setFormData} activeSection={activeTab} />
      </AdminDialogForm>
    </div>
  </AdminLayout>
);
```

### Step 4: Form component structure
```tsx
// components/admin/myfeature/MyFeatureForm.tsx
export const MyFeatureForm = ({ formData, setFormData, activeSection }) => (
  <div className="space-y-10 text-left"> {/* NO outer padding — AdminDialogForm handles it */}
    {activeSection === "tab1" && (
      <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <AdminFormSection title="...">
          <AdminField label="...">
            <input className="w-full h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm" />
          </AdminField>
        </AdminFormSection>
      </div>
    )}
    {activeSection === "status" && (
      <AdminStatusToggle
        label="Public Visibility"
        isPublished={formData.is_published ?? true}
        onToggle={(val) => setFormData({ ...formData, is_published: val })}
        description={{ active: "Live.", inactive: "Draft." }}
      />
    )}
  </div>
);
```

---

## 5. Layout Hierarchy Rules

```
AdminLayout (provides sidebar + layout shell)
  └── Page Content div (space-y-12, pb-12)
        ├── AdminPageHeader
        ├── ResponsiveDataTable (or custom list)
        └── AdminDialogForm (provides its own scroll + padding)
              └── FeatureForm (section-based, no outer padding)
```

**One `AdminLayout` per route. Never nest.** If a Management page has its own `AdminLayout`, it must be the direct route target in `App.tsx`.

---

## 6. Design Constants

- **Primary Color**: `bg-sage` → `#849989`
- **Large Border Radius**: `rounded-[2.5rem]` / `rounded-[3rem]`
- **Typography**: Heading → `font-serif font-bold text-heading`. Label → `text-[10px] uppercase tracking-widest text-muted-foreground`
- **Inputs**: `h-14 px-6 bg-muted/20 border-none rounded-xl font-bold shadow-sm`
- **Animations**: `animate-in fade-in duration-700` for page, `animate-in fade-in slide-in-from-bottom-4 duration-500` for form sections
- **Status badge**: `px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest`

---

## 7. AdminDialogForm Sidebar — Mobile vs Desktop

- **Desktop** (`md+`): Left sidebar with full tab labels, logos, scrollable nav.
- **Mobile** (`< md`): Horizontal scrollable tab bar at the top, floating above the content.
- **DO NOT** render the full vertical sidebar on mobile — it consumes 40-60% of viewport height.
