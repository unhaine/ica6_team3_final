# 📱 Mobile App Page Plan

This document outlines the page structure and logic for the mobile application in `/app/mobile` based on `ASCII_WIREFRAMES.md`.

## 1. Page Structure (Next.js App Router)

| Path                  | Page Name        | Description                                          |
| :-------------------- | :--------------- | :--------------------------------------------------- |
| `/mobile`             | Landing Page     | Splash/Hero intro with "Start" button.               |
| `/mobile/onboarding`  | Onboarding Flow  | Multi-step setup (Household, Dietary).               |
| `/mobile/home`        | Dashboard (Home) | Home overview (Fridge status, Categories, Recipes).  |
| `/mobile/fridge`      | My Fridge        | Inventory management list and FAB for scanning.      |
| `/mobile/camera`      | Camera & Scan    | Scanner UI and Correction list for detected items.   |
| `/mobile/recipe/[id]` | Recipe Detail    | Detailed recipe info, ingredients, and steps.        |
| `/mobile/profile`     | Profile          | User settings and preferences (Placeholder for now). |

---

## 2. Page Transitions & Units

### 🟢 Landing Page (`/app/mobile/page.tsx`)

- **Main Unit**: `LandingTemplate`
- **Logic**: Simple splash screen. Redirects to `/mobile/onboarding` or `/mobile/home` based on auth/onboarding status.

### 🟡 Onboarding (`/app/mobile/onboarding/page.tsx`)

- **Main Unit**: `OnboardingTemplate`
- **Steps**:
  - **Step 1**: Household Size (`/mobile/onboarding?step=1`)
  - **Step 2**: Dietary Restrictions (`/mobile/onboarding?step=2`)
- **Logic**: Progress tracking, state management for user preferences.

### 🏠 Dashboard (`/app/mobile/home/page.tsx`)

- **Main Unit**: `DashboardTemplate`
- **Layout**: Includes `AppHeader` and `BottomNav`.
- **Logic**: Fetching fridge summary and recommended recipes.

### 🧊 My Fridge (`/app/mobile/fridge/page.tsx`)

- **Main Unit**: `FridgeTemplate`
- **Layout**: Includes `AppHeader` and `BottomNav`.
- **Logic**: Inventory listing, filtering (D-Day, Registration date).

### 📸 Camera (`/app/mobile/camera/page.tsx`)

- **Main Unit**: `CameraTemplate`
- **Logic**: Integration with `BoundingBox` module, image capture, and AI result correction.

### 🥘 Recipe Detail (`/app/mobile/recipe/[id]/page.tsx`)

- **Main Unit**: `RecipeDetailTemplate`
- **Logic**: Fetching specific recipe data, calculating missing ingredients.

---

## 3. Navigation Strategy

- **Bottom Navigation**: Persistent across `Home`, `Fridge`, `Recipe`, and `Profile`.
- **Header**: Persistent but context-aware (Title changes or Back button appears).
- **Scan Button**: The central `(+)` button in `BottomNav` or FAB in `Fridge` opens the camera.
