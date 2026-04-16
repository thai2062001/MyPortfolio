# Hero Layout System - Flow Diagrams

## Admin Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    Hero Management Page                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Part 1: Content │
                    │  (Existing UI)   │
                    └──────────────────┘
                    • Badge
                    • Titles
                    • Description
                    • Buttons
                    • Image Upload
                              │
                              ▼
                    ┌──────────────────┐
                    │ Part 2: Selector │
                    │  (NEW - Layout)  │
                    └──────────────────┘
                    • Grid of cards
                    • Click to select
                    • Updates selected_layout_key
                              │
                              ▼
                    ┌──────────────────┐
                    │ Part 3: Settings │
                    │  (NEW - Config)  │
                    └──────────────────┘
                    • Dynamic form
                    • Based on default_config
                    • Updates layout_config
                              │
                              ▼
                    ┌──────────────────┐
                    │   Click Save     │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  upsertHeroSection│
                    │  (All data saved) │
                    └──────────────────┘
```

## Frontend Rendering Flow

```
┌──────────────────────────────────────────────────────────────┐
│              HeroSection Component Mounts                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ getHeroSection() │
                    │  (Fetch from DB) │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Extract Layout Information       │
                    │ • selected_layout_key            │
                    │ • layout_config                  │
                    │ • langSuffix (_en or _ja)        │
                    └──────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ getHeroLayout(layoutKey)         │
                    │ Resolve Component from Map       │
                    └──────────────────────────────────┘
                              │
                    ┌─────────┼─────────┐
                    │         │         │
                    ▼         ▼         ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │  Split   │ │ Centered │ │Background│
            │  Layout  │ │  Layout  │ │  Layout  │
            └──────────┘ └──────────┘ └──────────┘
                    │         │         │
                    └─────────┼─────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Render Selected Component        │
                    │ Pass: content, config, langSuffix│
                    └──────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Component Applies Config         │
                    │ • Styling                        │
                    │ • Layout                         │
                    │ • Visibility                     │
                    └──────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────────┐
                    │ Render HTML with Animations      │
                    │ Display to User                  │
                    └──────────────────────────────────┘
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Database (Supabase)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  hero_layouts (Static)                                       │
│  ├─ layout_key: "split-left-image-right"                    │
│  ├─ layout_name: "Split Layout"                             │
│  ├─ default_config: { textAlign, imagePosition, height }    │
│  └─ is_active: true                                         │
│                                                              │
│  hero_sections (Dynamic)                                     │
│  ├─ badge_en, badge_ja                                      │
│  ├─ title_line_1_en, title_line_1_ja                        │
│  ├─ description_en, description_ja                          │
│  ├─ hero_image_url                                          │
│  ├─ selected_layout_key: "split-left-image-right"           │
│  └─ layout_config: { textAlign: "left", ... }               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Supabase Client │
                    │  (RLS Policies)  │
                    └──────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
            ┌──────────────┐    ┌──────────────┐
            │ Admin Page   │    │ Frontend     │
            │ (Queries)    │    │ (Queries)    │
            └──────────────┘    └──────────────┘
```

## Layout Selection Process

```
Admin clicks layout card
        │
        ▼
handleLayoutSelect(layout)
        │
        ├─ setSelectedLayout(layout)
        ├─ setFormData({ selected_layout_key: layout.layout_key })
        └─ setLayoutConfig(layout.default_config)
        │
        ▼
Admin sees Part 3 form updated
        │
        ├─ Form fields from default_config
        ├─ Current values from layoutConfig
        └─ Ready to customize
        │
        ▼
Admin adjusts settings
        │
        ├─ handleLayoutConfigChange(key, value)
        ├─ Updates layoutConfig state
        └─ Updates formData.layout_config
        │
        ▼
Admin clicks Save
        │
        ├─ upsertHeroSection(formData)
        ├─ Saves to hero_sections table:
        │  ├─ selected_layout_key
        │  └─ layout_config
        └─ toast.success()
        │
        ▼
Frontend fetches updated data
        │
        ├─ getHeroSection()
        ├─ Gets new selected_layout_key
        ├─ Gets new layout_config
        └─ Re-renders with new layout
```

## Component Hierarchy

```
HeroSection (Container)
    │
    ├─ Fetch hero data
    ├─ Resolve layout component
    │
    └─ Render Selected Layout Component
        │
        ├─ HeroSplitLayout
        │   ├─ Motion.div (text)
        │   └─ Motion.div (image)
        │
        ├─ HeroCenteredLayout
        │   ├─ Motion.div (centered content)
        │   └─ Motion.div (optional image)
        │
        ├─ HeroBackgroundLayout
        │   ├─ Background image
        │   ├─ Overlay div
        │   └─ Motion.div (text)
        │
        └─ HeroCardOverlayLayout
            ├─ Background image
            ├─ Overlay div
            └─ Motion.div (card with content)
```

## Admin Page Component Structure

```
HeroManagementPage
    │
    ├─ State Management
    │   ├─ formData (hero content)
    │   ├─ layouts (available layouts)
    │   ├─ selectedLayout (current selection)
    │   └─ layoutConfig (current config)
    │
    ├─ Main Grid (3 columns)
    │   │
    │   ├─ Column 1-3: Form
    │   │   ├─ Language Tabs
    │   │   ├─ Part 1: Hero Content
    │   │   │   ├─ Badge input
    │   │   │   ├─ Title inputs
    │   │   │   ├─ Description textarea
    │   │   │   ├─ Button configs
    │   │   │   └─ Image upload
    │   │   │
    │   │   ├─ Part 2: Layout Selector
    │   │   │   └─ Grid of layout cards
    │   │   │
    │   │   ├─ Part 3: Layout Settings
    │   │   │   └─ Dynamic form fields
    │   │   │
    │   │   └─ Save Button
    │   │
    │   └─ Column 4: Preview
    │       ├─ Badge preview
    │       ├─ Title preview
    │       ├─ Description preview
    │       ├─ Layout name
    │       └─ Image preview
    │
    └─ Effects
        └─ useEffect: fetchData on mount
```

## Configuration Update Flow

```
User changes config value
        │
        ▼
handleLayoutConfigChange(key, value)
        │
        ├─ Create newConfig = { ...layoutConfig, [key]: value }
        ├─ setLayoutConfig(newConfig)
        └─ setFormData({ ...formData, layout_config: newConfig })
        │
        ▼
State updates
        │
        ├─ layoutConfig state updated
        ├─ formData.layout_config updated
        └─ Component re-renders
        │
        ▼
Form field reflects new value
        │
        ├─ Input/checkbox/range shows new value
        └─ User sees immediate feedback
        │
        ▼
User clicks Save
        │
        ├─ upsertHeroSection(formData)
        ├─ Sends to Supabase
        └─ Persists layout_config
        │
        ▼
Frontend fetches updated data
        │
        ├─ New layout_config applied
        └─ Layout renders with new settings
```

## Error Handling Flow

```
Admin Action
        │
        ▼
Try Block
        │
        ├─ Fetch/Update operation
        │
        ├─ Success
        │   └─ toast.success()
        │
        └─ Error
            ├─ Catch error
            ├─ toast.error()
            ├─ console.error()
            └─ User sees message
```

## Database Query Flow

```
getHeroLayouts()
    │
    ├─ SELECT * FROM hero_layouts
    ├─ WHERE is_active = true
    ├─ ORDER BY order_index
    │
    └─ Returns: HeroLayout[]

getHeroSection()
    │
    ├─ SELECT * FROM hero_sections
    ├─ WHERE id = 1
    │
    └─ Returns: HeroSectionWithLayout

upsertHeroSection(data)
    │
    ├─ UPSERT hero_sections
    ├─ SET selected_layout_key, layout_config, ...
    ├─ WHERE id = 1
    │
    └─ Returns: Updated HeroSectionWithLayout
```

## Bilingual Content Flow

```
User selects language (EN/JA)
        │
        ▼
setLanguage("en" | "ja")
        │
        ▼
getFieldValue(fieldName)
        │
        ├─ Constructs key: `${fieldName}_${language}`
        ├─ Example: "badge_en" or "badge_ja"
        │
        └─ Returns: formData[key]
        │
        ▼
updateField(fieldName, value)
        │
        ├─ Constructs key: `${fieldName}_${language}`
        ├─ Updates: formData[key] = value
        │
        └─ Component re-renders
        │
        ▼
Frontend rendering
        │
        ├─ langSuffix = lang === "en" ? "_en" : "_ja"
        ├─ Extracts: content[`badge${langSuffix}`]
        │
        └─ Displays correct language
```
