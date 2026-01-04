# HIMALAYA HOMES - COMPLETE USER INTERFACE DIAGRAM
## Full System Navigation & Page Flow

---

## COMPLETE SYSTEM DIAGRAM

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                    HIMALAYA HOMES                           │
                                    │                 Real Estate Platform                        │
                                    └──────────────────────────┬──────────────────────────────────┘
                                                               │
                    ┌──────────────────────────────────────────┴──────────────────────────────────────────┐
                    │                                                                                      │
            ┌───────▼────────┐                                                                   ┌────────▼────────┐
            │  GUEST USER    │                                                                   │  LOGGED IN USER │
            │  (Not Logged)  │                                                                   │   (Has Token)   │
            └───────┬────────┘                                                                   └────────┬────────┘
                    │                                                                                     │
        ┌───────────┴───────────┐                                                         ┌───────────────┴───────────────┐
        │                       │                                                         │                               │
   ┌────▼─────┐          ┌─────▼──────┐                                          ┌───────▼────────┐            ┌────────▼────────┐
   │  LOGIN   │          │   SIGNUP   │                                          │  REGULAR USER  │            │   ADMIN USER    │
   │   PAGE   │          │    PAGE    │                                          │    FEATURES    │            │    FEATURES     │
   └────┬─────┘          └─────┬──────┘                                          └───────┬────────┘            └────────┬────────┘
        │                      │                                                         │                              │
        └──────────┬───────────┘                                                         │                              │
                   │                                                                     │                              │
                   └─────────────────────────────────────────────────────────────────────┤                              │
                                                                                         │                              │
                                                                                         │                              │
┌────────────────────────────────────────────────────────────────────────────────────────┴──────────────────────────────┴────────────┐
│                                                                                                                                     │
│                                          MAIN APPLICATION NAVIGATION                                                                │
│                                                                                                                                     │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │                                              NAVBAR (Always Visible)                                                          │ │
│  │  ┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │ │
│  │  │  [Logo] Home | Buy | Rent | Sell | Agents | Contact | Saved ❤️  |  [My Listings] 🔔 🌐 [Profile] [Logout]           │  │ │
│  │  └────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │ │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                                                     │
│                                                                                                                                     │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │             │      │             │      │             │      │             │      │             │      │             │      │
│  │    HOME     │─────▶│     BUY     │      │    RENT     │      │    SELL     │      │   AGENTS    │      │   CONTACT   │      │
│  │    PAGE     │      │    PAGE     │      │    PAGE     │      │    PAGE     │      │    PAGE     │      │    PAGE     │      │
│  │             │      │             │      │             │      │             │      │             │      │             │      │
│  └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      │
│         │                    │                    │                    │                    │                    │             │
│         │                    └────────┬───────────┘                    │                    │                    │             │
│         │                             │                                │                    │                    │             │
│         │                    ┌────────▼────────┐                       │                    │                    │             │
│         │                    │   PROPERTY      │                       │                    │                    │             │
│         │                    │   DETAIL PAGE   │◀──────────────────────┘                    │                    │             │
│         │                    └────────┬────────┘                                            │                    │             │
│         │                             │                                                     │                    │             │
│         │                    ┌────────┴────────┐                                            │                    │             │
│         │                    │                 │                                            │                    │             │
│         │           ┌────────▼────────┐  ┌─────▼──────┐                                    │                    │             │
│         │           │  CONTACT OWNER  │  │   REPORT   │                                    │                    │             │
│         │           │     MODAL       │  │   MODAL    │                                    │                    │             │
│         │           └─────────────────┘  └────────────┘                                    │                    │             │
│         │                                                                                   │                    │             │
│         │                                                                                   │                    │             │
│         └───────────────────────────────────────────────────────────────────────────────────┴────────────────────┘             │
│                                                                                                                                     │
│                                                                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                          USER DASHBOARD SECTION                                                              │  │
│  │                                                                                                                              │  │
│  │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐                      │  │
│  │  │             │      │             │      │             │      │             │      │             │                      │  │
│  │  │   PROFILE   │      │  MY LISTING │      │    SAVED    │      │ FORGET PASS │      │ NOTIFICATION│                      │  │
│  │  │    PAGE     │      │    PAGE     │      │ PROPERTIES  │      │    PAGE     │      │   DROPDOWN  │                      │  │
│  │  │             │      │             │      │             │      │             │      │             │                      │  │
│  │  └─────────────┘      └──────┬──────┘      └─────────────┘      └─────────────┘      └─────────────┘                      │  │
│  │                              │                                                                                              │  │
│  │                     ┌────────┴────────┐                                                                                     │  │
│  │                     │                 │                                                                                     │  │
│  │            ┌────────▼────────┐  ┌─────▼──────┐                                                                             │  │
│  │            │   EDIT/DELETE   │  │   VIEW     │                                                                             │  │
│  │            │    PROPERTY     │  │  PROPERTY  │                                                                             │  │
│  │            └─────────────────┘  └────────────┘                                                                             │  │
│  │                                                                                                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                                     │
│                                                                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                          ADMIN SECTION (Admin Only)                                                          │  │
│  │                                                                                                                              │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐   │  │
│  │  │                                        ADMIN PANEL                                                                    │   │  │
│  │  │                                                                                                                       │   │  │
│  │  │  ┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐                                          │   │  │
│  │  │  │  PENDING         │      │   APPROVED       │      │   REJECTED       │                                          │   │  │
│  │  │  │  REQUESTS        │      │   PROPERTIES     │      │   PROPERTIES     │                                          │   │  │
│  │  │  │  (Tab 1)         │      │   (Tab 2)        │      │   (Tab 3)        │                                          │   │  │
│  │  │  └────────┬─────────┘      └──────────────────┘      └──────────────────┘                                          │   │  │
│  │  │           │                                                                                                          │   │  │
│  │  │  ┌────────┴────────────────────────────────────────┐                                                                │   │  │
│  │  │  │                                                  │                                                                │   │  │
│  │  │  │  ┌──────────────┐      ┌──────────────┐        │                                                                │   │  │
│  │  │  │  │ VIEW MEDIA   │      │ FULL DETAILS │        │                                                                │   │  │
│  │  │  │  │   MODAL      │      │    MODAL     │        │                                                                │   │  │
│  │  │  │  └──────┬───────┘      └──────────────┘        │                                                                │   │  │
│  │  │  │         │                                        │                                                                │   │  │
│  │  │  │  ┌──────▼──────────────────────────────────┐   │                                                                │   │  │
│  │  │  │  │  TABBED MEDIA VIEWER:                   │   │                                                                │   │  │
│  │  │  │  │  • Property Photos                      │   │                                                                │   │  │
│  │  │  │  │  • Lalpurja Documents                   │   │                                                                │   │  │
│  │  │  │  │  • Road Photos                          │   │                                                                │   │  │
│  │  │  │  │  • Property Videos                      │   │                                                                │   │  │
│  │  │  │  │  • Road Videos                          │   │                                                                │   │  │
│  │  │  │  └─────────────────────────────────────────┘   │                                                                │   │  │
│  │  │  │                                                  │                                                                │   │  │
│  │  │  │  ┌──────────────┐      ┌──────────────┐        │                                                                │   │  │
│  │  │  │  │   APPROVE    │      │    REJECT    │        │                                                                │   │  │
│  │  │  │  │   PROPERTY   │      │   PROPERTY   │        │                                                                │   │  │
│  │  │  │  └──────┬───────┘      └──────┬───────┘        │                                                                │   │  │
│  │  │  │         │                     │                 │                                                                │   │  │
│  │  │  │         │                     │                 │                                                                │   │  │
│  │  │  │         ▼                     ▼                 │                                                                │   │  │
│  │  │  │  Property goes to      Property status         │                                                                │   │  │
│  │  │  │  Buy/Rent page         set to rejected         │                                                                │   │  │
│  │  │  │  with isVerified=true                           │                                                                │   │  │
│  │  │  │                                                  │                                                                │   │  │
│  │  │  └──────────────────────────────────────────────────┘                                                                │   │  │
│  │  │                                                                                                                       │   │  │
│  │  └───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                                                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                                     │
│                                                                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                          FOOTER (All Pages)                                                                  │  │
│  │                                                                                                                              │  │
│  │  Quick Links: Home | Buy | Rent | Sell | Agents | Contact                                                                   │  │
│  │  Company: About Us | Privacy Policy | Terms of Service | FAQ                                                                │  │
│  │  Contact: Email | Phone | Address                                                                                           │  │
│  │                                                                                                                              │  │
│  └──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              DATA FLOW & INTERACTIONS

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════


USER ACTIONS FLOW:
──────────────────

1. BROWSE PROPERTIES:
   Home → Buy/Rent → Property Detail → Contact Owner / Save / Report

2. POST PROPERTY:
   Sell Page → Upload Form → Submit → My Listings (Pending) → Admin Approval → Buy/Rent Page (Approved)

3. MANAGE LISTINGS:
   My Listings → View/Edit/Delete → Property Detail

4. SAVE FAVORITES:
   Any Property Card → Click ❤️ → Saved Properties Page

5. NOTIFICATIONS:
   Property Status Change → Notification Bell (🔔) → Notification Dropdown → My Listings


ADMIN ACTIONS FLOW:
───────────────────

1. REVIEW PROPERTIES:
   Admin Panel → Pending Tab → View Media/Details → Approve/Reject

2. APPROVE PROPERTY:
   Pending Request → Click Approve → Property created with isVerified=true → Goes to Buy/Rent page

3. REJECT PROPERTY:
   Pending Request → Click Reject → Status set to rejected → User notified

4. BULK OPERATIONS:
   Select Multiple → Delete Selected → Properties removed


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              KEY FEATURES BY PAGE

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════


┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ PAGE                  │ KEY FEATURES                                                                                                │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ HOME                  │ • Hero section with search                                                                                  │
│                       │ • New Arrivals (3 properties)                                                                               │
│                       │ • Quick navigation                                                                                          │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ BUY/RENT              │ • Advanced search & filters                                                                                 │
│                       │ • Property type filters (All, House, Land, Apartment, Building)                                             │
│                       │ • Price range slider                                                                                        │
│                       │ • Property grid (4 columns)                                                                                 │
│                       │ • Infinite scroll                                                                                           │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PROPERTY DETAIL       │ • Large image gallery with tabs (Photos/Videos/Location)                                                    │
│                       │ • Property details grid                                                                                     │
│                       │ • Verified badge (✓ Verified)                                                                               │
│                       │ • Contact owner button                                                                                      │
│                       │ • Save to favorites (❤️)                                                                                     │
│                       │ • Star rating & reviews                                                                                     │
│                       │ • Report property                                                                                           │
│                       │ • What's nearby section                                                                                     │
│                       │ • Interactive map                                                                                           │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SELL                  │ • Multi-step form                                                                                           │
│                       │ • Property details input                                                                                    │
│                       │ • Interactive map (drop pin)                                                                                │
│                       │ • Media upload (5 categories)                                                                               │
│                       │ • File size validation                                                                                      │
│                       │ • Thumbnail preview                                                                                         │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ MY LISTINGS           │ • Status badges (Approved/Pending/Rejected)                                                                 │
│                       │ • Edit/Delete actions                                                                                       │
│                       │ • View property details                                                                                     │
│                       │ • Filter by status                                                                                          │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SAVED PROPERTIES      │ • All favorited properties                                                                                  │
│                       │ • Remove from favorites                                                                                     │
│                       │ • Quick access to property details                                                                          │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ PROFILE               │ • Update personal information                                                                               │
│                       │ • Upload profile picture                                                                                    │
│                       │ • Change password                                                                                           │
├───────────────────────┼─────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ADMIN PANEL           │ • Tabbed interface (Pending/Approved/Rejected)                                                              │
│                       │ • Infinite scroll (6 items at a time)                                                                       │
│                       │ • Thumbnail optimization                                                                                    │
│                       │ • Tabbed media viewer (5 categories)                                                                        │
│                       │ • Approve/Reject actions                                                                                    │
│                       │ • Bulk delete                                                                                               │
│                       │ • Full property details modal                                                                               │
└───────────────────────┴─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              AUTHENTICATION FLOW

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════


                                    ┌─────────────────────────────────────┐
                                    │      GUEST USER VISITS SITE         │
                                    └──────────────────┬──────────────────┘
                                                       │
                                    ┌──────────────────┴──────────────────┐
                                    │                                     │
                            ┌───────▼────────┐                  ┌────────▼────────┐
                            │  CLICK LOGIN   │                  │  CLICK SIGNUP   │
                            └───────┬────────┘                  └────────┬────────┘
                                    │                                     │
                            ┌───────▼────────┐                  ┌────────▼────────┐
                            │  LOGIN PAGE    │                  │  SIGNUP PAGE    │
                            │                │                  │                 │
                            │ • Email        │                  │ • First Name    │
                            │ • Password     │                  │ • Last Name     │
                            │ • Show/Hide    │                  │ • Email         │
                            │                │                  │ • Password      │
                            └───────┬────────┘                  │ • Phone         │
                                    │                           │ • Citizenship   │
                                    │                           │ • Profile Pic   │
                                    │                           └────────┬────────┘
                                    │                                     │
                                    └──────────────┬──────────────────────┘
                                                   │
                                    ┌──────────────▼──────────────────┐
                                    │   TOKEN STORED IN LOCALSTORAGE  │
                                    └──────────────┬──────────────────┘
                                                   │
                                    ┌──────────────▼──────────────────┐
                                    │   REDIRECT TO HOME PAGE         │
                                    │   (Logged In State)             │
                                    └─────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              NOTIFICATION SYSTEM

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════


    USER SUBMITS PROPERTY
            │
            ▼
    PROPERTY STATUS: PENDING
            │
            ▼
    ADMIN REVIEWS IN ADMIN PANEL
            │
            ├─────────────────────────────┐
            │                             │
            ▼                             ▼
    ADMIN APPROVES              ADMIN REJECTS
            │                             │
            ▼                             ▼
    Property goes to            Status set to rejected
    Buy/Rent page                       │
    isVerified = true                   │
            │                             │
            └──────────┬──────────────────┘
                       │
                       ▼
    NOTIFICATION CREATED
    (Stored in localStorage)
                       │
                       ▼
    🔔 BELL ICON SHOWS RED BADGE
    (Unread count)
                       │
                       ▼
    USER CLICKS BELL
                       │
                       ▼
    NOTIFICATION DROPDOWN OPENS
    • Property Approved/Rejected
    • Timestamp (5m ago, 1h ago)
    • Click to view in My Listings
    • Mark as read / Delete
                       │
                       ▼
    AUTO-CHECK EVERY 30 SECONDS
    (Background polling)


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              PERFORMANCE OPTIMIZATIONS

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════


1. THUMBNAIL GENERATION:
   • Original images stored at full resolution
   • Thumbnails: 400px width, 60% quality, progressive JPEG
   • Admin panel uses thumbnails for fast loading
   • Approved properties use original high-res images

2. INFINITE SCROLL:
   • Initial load: 6 property cards
   • Load 6 more on scroll to bottom
   • Prevents loading 30+ properties at once

3. LAZY LOADING:
   • Images load progressively with blur effect
   • Skeleton loaders while content loads
   • CSS: content-visibility: auto

4. VIDEO OPTIMIZATION:
   • preload="none" prevents auto-loading
   • Videos only load when user clicks play

5. TABBED MEDIA VIEWER:
   • Only active tab's media is rendered
   • Reduces initial render by 70-80%
   • Smooth tab switching


═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════

                                              END OF COMPLETE UI DIAGRAM

═══════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════════
```
