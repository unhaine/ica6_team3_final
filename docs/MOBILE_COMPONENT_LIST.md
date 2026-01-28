# 🧩 Mobile Component Architecture Plan

This document outlines the **revised** component architecture, critically optimized for **Scalability** (Extendable patterns), **Reusability** (Generic composites), and **Simplicity** (Atomic design).

## 1. UI Layer (`components/ui/`)

_The "Primitive" Layer. Direct dependencies on Shadcn UI / Radix primitives._

| Group        | Component         | Base          | Critical Role & Scalability Note                     |
| :----------- | :---------------- | :------------ | :--------------------------------------------------- |
| **Layout**   | `Card`            | `Card`        | Base surface for all dashboard 커widgets.            |
|              | `Separator`       | `Separator`   | Visual divider for lists.                            |
|              | **`AspectRatio`** | `AspectRatio` | **Essential** for responsive image/video formatting. |
|              | **`Drawer`**      | `Vaul`        | Mobile-first replacement for Modals/Dialogs.         |
|              | **`Carousel`**    | `Embla`       | Touch-friendly slider for recipes/hero sections.     |
| **Forms**    | `Button`          | `Button`      | Standard actions.                                    |
|              | `Input`           | `Input`       | Text/Number entry.                                   |
|              | `Checkbox`        | `Checkbox`    | Binary selection (Ingredients).                      |
|              | `RadioGroup`      | `RadioGroup`  | Single selection (Household size).                   |
|              | `Label`           | `Label`       | Accessibility linkage.                               |
| **Feedback** | `Skeleton`        | `Skeleton`    | Loading states structure.                            |
|              | `Progress`        | `Progress`    | Visualizing completion/fill-rate.                    |
|              | `Badge`           | `Badge`       | Static status indicators (D-Day).                    |

---

## 2. Elements Layer (`components/elements/`)

_The "Visual Pattern" Layer. Pure UI composites, **0% business logic**, 100% reusable._

### 🧱 Core Visual Blocks

| Component             | Status     | Description & Pattern Definition                                                                                                                                |
| :-------------------- | :--------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`DataRow`**         | ✨ **NEW** | **The Master List Component.**<br>Flexible "Left(Image) - Content(Title/Sub) - Right(Action)" layout.<br>Used for: Fridge Item, Ingredient Row, Correction Row. |
| **`SelectableChip`**  | ✨ **NEW** | Interactive toggle button (Pill shape).<br>Used for: Dietary filters, Category tabs, Onboarding choices.<br>_Extends Badge/Button logic._                       |
| **`IconBox`**         | ✨ **NEW** | Icon wrapper with shape/color background.<br>Used for: Category buttons (Cold, Frozen), Feature icons.                                                          |
| **`AvatarThumbnail`** | ✨ **NEW** | Image wrapper with standard sizing/rounding/fallback.<br>Used in: `DataRow` slots, Profile.                                                                     |
| **`RatingStars`**     | ✨ **NEW** | Read-only star display.<br>Used in: Recipe cards.                                                                                                               |
| `Typography`          | ✅ Reuse   | Standard text tokens.                                                                                                                                           |
| `IconButton`          | ✅ Reuse   | Circular action triggers.                                                                                                                                       |

---

## 3. Modules Layer (`components/modules/`)

_The "Domain" Layer. Connects `Elements` to Data/State._

### 📱 Feature Implementations

| Category       | Component             | Composition Strategy                                                   |
| :------------- | :-------------------- | :--------------------------------------------------------------------- |
| **Navigation** | `BottomNavBar`        | `Fixed Container` + `IconBox` + Active State Logic.                    |
|                | `TopAppBar`           | `AppHeader` wrapper + Page Title Logic + Back Action.                  |
| **Dashboard**  | `FridgeStatusCard`    | `Card` + `Progress` + Gradient styles.                                 |
|                | `RecipeCarousel`      | `Carousel` + `RecipeCard`.                                             |
| **Lists**      | `FridgeList`          | Maps data to **`DataRow`**. Injects Swipe actions & D-Day badges.      |
|                | `CorrectionForm`      | Maps AI results to **`DataRow`**. Injects `Input` into Right Slot.     |
|                | `IngredientChecklist` | Maps recipe items to **`DataRow`**. Injects `Checkbox` into Left Slot. |
| **Cards**      | `RecipeCard`          | `Card` + `AspectRatio`(Image) + `RatingStars` + `Typography`.          |
| **Canvas**     | `DetectionCanvas`     | (Existing `BoundingBox`) Canvas manipulation logic.                    |

---

## ⚖️ Architectural Decision Log

1.  **Why `DataRow`?**
    - Instead of creating `InventoryItem`, `CorrectionItem`, `IngredientItem`, we create **ONE** robust `DataRow` element.
    - **Scalability**: If we add a "Shopping List" later, checkouts, or history, we reuse `DataRow` without new code.

2.  **Drawer vs Modal**:
    - On mobile, bottom-sheet Drawers are superior to centered Modals for reachability. We will exclusively use `Drawer` for details/edits.

3.  **Grouping**:
    - `SelectableChip` handles all "Selection" needs (Filters, Onboarding, Tags). Avoids creating specific "FilterButton" components.
