# Component Specifications (Editorial Theme)

## Button (componentId: WXNZtnABK)
- **Variants**:
  - `gxJXsd32R` (Primary): Background: `/Primary`, Text: `/White Shades/White`, Border: None.
  - `onFwOfrge` (Secondary/Outline): Background: Transparent, Text: `/Primary`, Border: 1px solid `/Primary`.
- **Props**: `cRoeZpcrs` (label), `GrpQ8zFBL` (link), `RCPR2dydG` (icon), `lrMcAD3oy` (show icon).
- **Proportions**: Height determined by padding (typically 12px 24px based on visuals).

## ServicesCard (componentId: USoFoZXIb)
- **Layout**: Stack (vertical), gap: 24px.
- **Styling**: Background: `/Card color`, Padding: 44px, Border: 2px solid `/White Shades/White`.
- **Content**: Icon, Title (Heading 3), Description (Body).

## StepCard (componentId: cRIJOJRbF)
- **Layout**: Stack (vertical), gap: 16px.
- **Styling**: Tonal Background, Number (Large, low opacity), Title (Heading 3), Text (Body).

## Comparison Row
- **Layout**: Stack (horizontal).
- **Styling**: Border bottom: 1px solid `/Black Shades/black | 30`.
- **Cells**:
  - 1st Cell: Width 1fr, Padding 32px, text align left.
  - 2nd/3rd Cell: Width 1fr, Center aligned, specific background for Expert column (`/bg color`).

## Stat Card (componentId: qNFHjZUon)
- **Styling**: Large number (Heading 1 or custom size), Label (Body small).

## Team Card (componentId: XXEatS0Om)
- **Styling**: Image container (fixed height or aspect ratio), Content padding 24px, Title (Heading 4), Subtitle (Body small).

## Navigation (componentId: YT9Heqk3b)
- **Sticky Behavior**: Fixed top, backdrop-filter: blur(10px), translucent background.
