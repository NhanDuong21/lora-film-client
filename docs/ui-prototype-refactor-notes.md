# LoraFilm UI Prototype Refactor Notes

## 1. Project Refactoring Objectives

This document records the structural reorganization of the LoraFilm Movie Booking System UI prototype codebase from a flat `views/` + `components/` layout into a clean **Page-Component Decoupled Architecture**.

**Primary Goal:** Enforce a strict separation of concerns between:
- **Pages** (`src/pages/`): Primary standalone routing entry points that represent full-screen views mounted by the application router (`App.jsx`).
- **Components** (`src/components/`): Reusable display containers, layout shells, sidebars, headers, footers, and modals that are composed within pages.

**Motivation:** This page-component segregation prepares the UI prototype for systematic integration into the production monorepo by establishing clear architectural boundaries. Each page can be independently migrated, tested, and connected to live API services without disturbing the component framework layer.

---

## 2. Standardized Directory Blueprint

```text
src/
┣ assets/
┃ ┣ react.svg
┃ ┗ vite.svg
┣ components/
┃ ┣ common/
┃ ┃ ┗ TrailerModal.jsx
┃ ┣ customer/
┃ ┃ ┣ BookingSteps.jsx
┃ ┃ ┣ BrandOverview.jsx
┃ ┃ ┣ Footer.jsx
┃ ┃ ┣ Header.jsx
┃ ┃ ┣ Hero.jsx
┃ ┃ ┣ MovieGrid.jsx
┃ ┃ ┗ PromoShowcase.jsx
┃ ┣ admin/
┃ ┃ ┣ AdminLayout.jsx
┃ ┃ ┗ AdminSidebar.jsx
┃ ┗ employee/
┃   ┗ EmployeeLayout.jsx
┣ pages/
┃ ┣ auth/
┃ ┃ ┣ LoginPage.jsx
┃ ┃ ┗ RegisterPage.jsx
┃ ┣ customer/
┃ ┃ ┣ MovieDiscoveryPage.jsx
┃ ┃ ┣ MovieDetailPage.jsx
┃ ┃ ┣ SeatSelectionPage.jsx
┃ ┃ ┣ MasterBookingFunnelPage.jsx
┃ ┃ ┣ CustomerProfilePage.jsx
┃ ┃ ┗ CinemaDetailPage.jsx
┃ ┣ admin/
┃ ┃ ┣ AdminDashboardPage.jsx
┃ ┃ ┣ AdminMoviePage.jsx
┃ ┃ ┣ AdminCinemaPage.jsx
┃ ┃ ┣ AdminShowtimePage.jsx
┃ ┃ ┣ AdminStaffPage.jsx
┃ ┃ ┣ AdminActorPage.jsx
┃ ┃ ┣ AdminEventPage.jsx
┃ ┃ ┣ AdminFinancePage.jsx
┃ ┃ ┣ AdminMembersPage.jsx
┃ ┃ ┣ AdminSettingsPage.jsx
┃ ┃ ┣ AdminConcessionInventoryPage.jsx
┃ ┃ ┣ ActorRegistryPage.jsx
┃ ┃ ┣ DirectorRegistryPage.jsx
┃ ┃ ┗ EventRegistryPage.jsx
┃ ┗ employee/
┃   ┣ EmployeeDashboardPage.jsx
┃   ┣ EmployeeCheckInPage.jsx
┃   ┣ EmployeePOSPage.jsx
┃   ┗ EmployeeSchedulePage.jsx
┣ mocks/
┃ ┣ mockData.js
┃ ┗ mockDashboardData.js
┣ contexts/
┃ ┣ AuthContext.jsx
┃ ┗ DataContext.jsx
┣ App.css
┣ App.jsx
┣ index.css
┗ main.jsx
```

---

## 3. Primary Route Entries Mapping (Pages Directory)

### Authentication (`src/pages/auth/`)
| Page File | Route Hash | Description |
|---|---|---|
| `LoginPage.jsx` | `#/login` | User authentication login form |
| `RegisterPage.jsx` | `#/register` | New customer registration form |

### Customer (`src/pages/customer/`)
| Page File | Route Hash | Description |
|---|---|---|
| `MovieDiscoveryPage.jsx` | `#/discovery` | Full movie catalog with search & filter |
| `MovieDetailPage.jsx` | `#/movie/:id` | Individual movie detail with showtimes |
| `SeatSelectionPage.jsx` | `#/seats` | Interactive seat map & booking confirmation |
| `MasterBookingFunnelPage.jsx` | `#/booking-funnel` | Step-by-step booking wizard |
| `CustomerProfilePage.jsx` | `#/profile` | Authenticated user profile dashboard |
| `CinemaDetailPage.jsx` | `#/cinema/:id` | Individual cinema cluster detail view |

### Administrator (`src/pages/admin/`)
| Page File | Mount Context | Description |
|---|---|---|
| `AdminDashboardPage.jsx` | AdminLayout tab: `dashboard` | KPI overview with charts |
| `AdminMoviePage.jsx` | AdminLayout tab: `movies` | Movie CRUD management |
| `AdminCinemaPage.jsx` | AdminLayout tab: `clusters` | Cinema cluster & hall management |
| `AdminShowtimePage.jsx` | AdminLayout tab: `showtimes` | Showtime scheduling management |
| `AdminStaffPage.jsx` | AdminLayout tab: `staff` | Employee records management |
| `AdminActorPage.jsx` | AdminLayout tab: `actors` | Actor catalog management |
| `AdminEventPage.jsx` | AdminLayout tab: `events-promo` | Events & promotions management |
| `AdminFinancePage.jsx` | AdminLayout tab: `tickets/payroll` | Financial transaction views |
| `AdminMembersPage.jsx` | AdminLayout tab: `customers` | Customer membership management |
| `AdminSettingsPage.jsx` | AdminLayout tab: `settings` | System configuration panel |
| `AdminConcessionInventoryPage.jsx` | AdminLayout tab: `concessions` | Concession inventory management |
| `ActorRegistryPage.jsx` | `#/actors`, `#/actor/:name` | Public actor registry & detail |
| `DirectorRegistryPage.jsx` | `#/directors`, `#/director/:name` | Public director registry & detail |
| `EventRegistryPage.jsx` | `#/events`, `#/event/:id` | Public event registry & detail |

### Employee (`src/pages/employee/`)
| Page File | Mount Context | Description |
|---|---|---|
| `EmployeeDashboardPage.jsx` | Legacy standalone dashboard | Full employee workspace (legacy) |
| `EmployeeCheckInPage.jsx` | EmployeeLayout tab: `checkin` | Gate check-in ticket audit |
| `EmployeePOSPage.jsx` | EmployeeLayout tab: `pos` | Counter ticket sales POS |
| `EmployeeSchedulePage.jsx` | EmployeeLayout tab: `schedules` | Showtime schedule viewer |

---

## 4. Reusable Layout Elements (Components Directory)

### Layout Frameworks
| Component | Location | Purpose |
|---|---|---|
| `AdminLayout.jsx` | `src/components/admin/` | Admin panel shell with sidebar, header, and tab-based content routing |
| `AdminSidebar.jsx` | `src/components/admin/` | Collapsible admin navigation sidebar with RBAC-aware sections |
| `EmployeeLayout.jsx` | `src/components/employee/` | Employee workspace shell with sidebar navigation |

### Customer UI Blocks
| Component | Location | Purpose |
|---|---|---|
| `Header.jsx` | `src/components/customer/` | Sticky navigation header with auth-aware controls |
| `Footer.jsx` | `src/components/customer/` | Dark-themed site footer |
| `Hero.jsx` | `src/components/customer/` | Cinematic hero banner carousel |
| `MovieGrid.jsx` | `src/components/customer/` | Featured films grid with tab filtering |
| `BookingSteps.jsx` | `src/components/customer/` | Horizontal booking workflow visualization |
| `BrandOverview.jsx` | `src/components/customer/` | SEO-optimized brand description text panel |
| `PromoShowcase.jsx` | `src/components/customer/` | Homepage events & promotions showcase section |

### Common UI Blocks
| Component | Location | Purpose |
|---|---|---|
| `TrailerModal.jsx` | `src/components/common/` | YouTube trailer embed modal overlay |

---

## 5. Mock Storage Allocations

All mock data files are housed in the `src/mocks/` directory:

| File | Purpose |
|---|---|
| `mockData.js` | Primary mock database containing movies, actors, cinemas, showtimes, events, concessions, tickets, customers, employees, and system settings |
| `mockDashboardData.js` | Supplementary dashboard KPI metrics dataset |

**Consumer references:**
- `DataContext.jsx` imports from `../mocks/mockData.js`
- `AdminSettingsPage.jsx` imports from `../../mocks/mockData.js`

---

## 6. Critical Monorepo Integration & Production Security Guidelines
- This source tree represents a standalone functional UI archetype simulation loop, not production client code.
- When migrating views into the production monorepo, do not overwrite central authentication providers or security context wrappers.
- All live system operations must channel exclusively through the centralized API Gateway configured in the environment configuration (`VITE_API_BASE_URL`). Direct network calls to microservice nodes are strictly prohibited:
  - Do not call the Authentication Service directly (`localhost:8081`).
  - Do not call the User Identity Management Service directly (`localhost:8086`).
- Direct invocation of backend validation routes (`/internal/users`) from the client runtime layer is strictly forbidden.
- To protect Personal Identifiable Information (PII), raw citizen identifiers (`CCCD`) must never be dropped into unencrypted local cache layers (`localStorage`).
- Ensure the user profile interface securely processes identity metrics by running masks, outputting `cccdMasked` tokens only.

## 7. Refactoring Migration Manifest

### Files Relocated (Before → After)

#### Authentication Pages
| Before | After |
|---|---|
| `src/views/LoginView.jsx` | `src/pages/auth/LoginPage.jsx` |
| `src/views/RegisterView.jsx` | `src/pages/auth/RegisterPage.jsx` |

#### Customer Pages
| Before | After |
|---|---|
| `src/views/MovieDiscoveryView.jsx` | `src/pages/customer/MovieDiscoveryPage.jsx` |
| `src/views/MovieDetailView.jsx` | `src/pages/customer/MovieDetailPage.jsx` |
| `src/views/SeatSelectionView.jsx` | `src/pages/customer/SeatSelectionPage.jsx` |
| `src/views/MasterBookingFunnel.jsx` | `src/pages/customer/MasterBookingFunnelPage.jsx` |
| `src/views/CustomerProfileView.jsx` | `src/pages/customer/CustomerProfilePage.jsx` |
| `src/views/CinemaDetailView.jsx` | `src/pages/customer/CinemaDetailPage.jsx` |

#### Admin Pages
| Before | After |
|---|---|
| `src/components/admin/AdminDashboardView.jsx` | `src/pages/admin/AdminDashboardPage.jsx` |
| `src/components/admin/AdminMovieView.jsx` | `src/pages/admin/AdminMoviePage.jsx` |
| `src/components/admin/AdminCinemaView.jsx` | `src/pages/admin/AdminCinemaPage.jsx` |
| `src/components/admin/AdminShowtimeView.jsx` | `src/pages/admin/AdminShowtimePage.jsx` |
| `src/components/admin/AdminStaffView.jsx` | `src/pages/admin/AdminStaffPage.jsx` |
| `src/components/admin/AdminActorView.jsx` | `src/pages/admin/AdminActorPage.jsx` |
| `src/components/admin/AdminEventView.jsx` | `src/pages/admin/AdminEventPage.jsx` |
| `src/components/admin/AdminFinanceView.jsx` | `src/pages/admin/AdminFinancePage.jsx` |
| `src/components/admin/AdminMembersView.jsx` | `src/pages/admin/AdminMembersPage.jsx` |
| `src/components/admin/AdminSettingsView.jsx` | `src/pages/admin/AdminSettingsPage.jsx` |
| `src/components/admin/AdminConcessionInventory.jsx` | `src/pages/admin/AdminConcessionInventoryPage.jsx` |
| `src/views/ActorRegistryView.jsx` | `src/pages/admin/ActorRegistryPage.jsx` |
| `src/views/DirectorRegistryView.jsx` | `src/pages/admin/DirectorRegistryPage.jsx` |
| `src/views/EventRegistryView.jsx` | `src/pages/admin/EventRegistryPage.jsx` |

#### Employee Pages
| Before | After |
|---|---|
| `src/components/employee/EmployeeDashboardView.jsx` | `src/pages/employee/EmployeeDashboardPage.jsx` |
| `src/components/employee/EmployeeCheckInView.jsx` | `src/pages/employee/EmployeeCheckInPage.jsx` |
| `src/components/employee/EmployeePOSView.jsx` | `src/pages/employee/EmployeePOSPage.jsx` |
| `src/components/employee/EmployeeScheduleView.jsx` | `src/pages/employee/EmployeeSchedulePage.jsx` |

#### Mock Data
| Before | After |
|---|---|
| `src/data/mockData.js` | `src/mocks/mockData.js` |
| `src/data/mockDashboardData.js` | `src/mocks/mockDashboardData.js` |

#### Retained Components (No Relocation)
- `src/components/admin/AdminLayout.jsx` — imports updated to reference `../../pages/admin/`
- `src/components/admin/AdminSidebar.jsx` — unchanged
- `src/components/employee/EmployeeLayout.jsx` — imports updated to reference `../../pages/employee/`
- `src/components/customer/*` — all 7 files unchanged
- `src/components/common/TrailerModal.jsx` — unchanged

#### Deleted Directories
- `src/views/` — fully removed (all files relocated to `src/pages/`)
- `src/data/` — fully removed (all files relocated to `src/mocks/`)

---

## 8. Security Clearance Statement

A comprehensive codebase-wide scan has been conducted with the following results:

| Security Check | Status |
|---|---|
| `localhost:8081` references | ✅ **CLEAR** — No instances found |
| `localhost:8086` references | ✅ **CLEAR** — No instances found |
| `/internal/users` endpoint references | ✅ **CLEAR** — No instances found |
| `console.log(cccd)` PII dumps | ✅ **CLEAR** — No instances found |
| `localStorage.setItem("cccd"...)` PII storage | ✅ **CLEAR** — No instances found |

**All forbidden traces have been verified absent from the refactored codebase.**
