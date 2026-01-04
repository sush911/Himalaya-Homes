# HIMALAYA HOMES - USER INTERFACE DIAGRAM
## Simple & Clear Navigation Flow

---

## 🏠 MAIN APPLICATION STRUCTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          HIMALAYA HOMES                                     │
│                     Real Estate Platform - Nepal                            │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    NAVIGATION BAR (All Pages)                               │
│  [Logo] Home | Buy | Rent | Sell | Agents | Contact | Saved                │
│         [My Listings] 🔔 Notifications 🌐 EN/नेपाली [Profile] [Logout]     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 ALL PAGES IN THE APPLICATION

### PUBLIC PAGES (Anyone can access)

```
┌──────────────┐
│  HOME PAGE   │
├──────────────┤
│ • Hero Banner with Search Bar                                              │
│ • New Arrivals (3 latest properties)                                       │
│ • Quick Links to Buy/Rent/Sell                                             │
└──────────────┘
       │
       ├─────────────────────────────────────────────────────────────────┐
       │                                                                 │
       ▼                                                                 ▼
┌──────────────┐                                                 ┌──────────────┐
│   BUY PAGE   │                                                 │  RENT PAGE   │
├──────────────┤                                                 ├──────────────┤
│ • Search Bar                                                   │ • Search Bar │
│ • Filters:                                                     │ • Filters:   │
│   - Property Type (House/Land/Apartment/Building)              │   - Same     │
│   - Price Range                                                │   - Same     │
│ • Property Grid (4 columns)                                    │ • Same Grid  │
│ • Click any property → Goes to Property Detail Page            │ • Same       │
└──────────────┘                                                 └──────────────┘
       │                                                                 │
       └─────────────────────────┬───────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  PROPERTY DETAIL PAGE  │
                    ├────────────────────────┤
                    │ LEFT SIDE:                                                │
                    │ • Large Main Image                                        │
                    │ • Image Gallery Tabs:                                     │
                    │   - Photos                                                │
                    │   - Videos                                                │
                    │   - Location (Map)                                        │
                    │                                                           │
                    │ RIGHT SIDE:                                               │
                    │ • Property Title                                          │
                    │ • Price (रु Rs 50,00,000)                                 │
                    │ • [CONTACT OWNER] Button                                  │
                    │ • [✓ Verified] Badge (if approved)                        │
                    │ • ❤️ Save to Favorites                                     │
                    │ • ⭐ Rating & Reviews                                      │
                    │ • 🚩 Report Property                                       │
                    │                                                           │
                    │ BOTTOM:                                                   │
                    │ • Property Details (Bedrooms, Bathrooms, Area)            │
                    │ • What's Nearby (Schools, Hospitals, etc.)                │
                    │ • Full Description                                        │
                    │ • Interactive Map                                         │
                    └────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ AGENTS PAGE  │     │ CONTACT PAGE │     │   FAQ PAGE   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ • Agent List │     │ • Contact    │     │ • Questions  │
│ • Agent Cards│     │   Form       │     │   & Answers  │
│ • Contact    │     │ • Map        │     │ • Accordion  │
│   Button     │     │ • Email/Phone│     │   Style      │
└──────────────┘     └──────────────┘     └──────────────┘

┌──────────────┐     ┌──────────────┐
│  LOGIN PAGE  │     │ SIGNUP PAGE  │
├──────────────┤     ├──────────────┤
│ • Email      │     │ • First Name │
│ • Password   │     │ • Last Name  │
│ • Show/Hide  │     │ • Email      │
│ • Remember Me│     │ • Password   │
│ • Forgot?    │     │ • Phone      │
│              │     │ • Citizenship│
│              │     │ • Profile Pic│
└──────────────┘     └──────────────┘
       │                     │
       └──────────┬──────────┘
                  │
                  ▼
         [User Logged In]
```

---

### USER PAGES (Must be logged in)

```
┌──────────────┐
│  SELL PAGE   │
├──────────────┤
│ PROPERTY INFORMATION:                                                       │
│ • Title                                                                     │
│ • Type (House/Land/Apartment/Building)                                      │
│ • Price                                                                     │
│ • Bedrooms, Bathrooms                                                       │
│ • Total Area (Ropani, Ana, Paisa, Dam)                                     │
│ • Description                                                               │
│                                                                             │
│ LOCATION:                                                                   │
│ • Address                                                                   │
│ • Interactive Map (Drop Pin)                                                │
│                                                                             │
│ UPLOAD FILES:                                                               │
│ • Lalpurja Documents (Max 4 files)                                          │
│ • Property Photos (Max 20 files)                                            │
│ • Property Videos (Max 2 files)                                             │
│ • Road Photos (Max 6 files)                                                 │
│ • Road Videos (Max 2 files)                                                 │
│                                                                             │
│ [SUBMIT FOR APPROVAL] Button                                                │
└──────────────┘
       │
       ▼
┌──────────────┐
│ MY LISTINGS  │
├──────────────┤
│ Shows all your submitted properties with status:                           │
│                                                                             │
│ ⏳ PENDING   - Waiting for admin approval                                   │
│ ✓ APPROVED   - Live on Buy/Rent pages                                      │
│ ✕ REJECTED   - Not approved by admin                                       │
│                                                                             │
│ Actions:                                                                    │
│ • [View] - See property details                                            │
│ • [Edit] - Update property info                                            │
│ • [Delete] - Remove property                                               │
└──────────────┘

┌──────────────┐
│    SAVED     │
│  PROPERTIES  │
├──────────────┤
│ • All properties you clicked ❤️ on                                          │
│ • Grid view (4 columns)                                                     │
│ • Click to view property details                                           │
│ • Click ❤️ again to remove from saved                                       │
└──────────────┘

┌──────────────┐
│ PROFILE PAGE │
├──────────────┤
│ • Profile Picture                                                           │
│ • First Name, Last Name                                                     │
│ • Email                                                                     │
│ • Phone Number                                                              │
│ • Citizenship Number                                                        │
│ • [Update Profile] Button                                                   │
│ • [Change Password] Option                                                  │
└──────────────┘

┌──────────────┐
│ FORGET PASS  │
├──────────────┤
│ • Enter Email                                                               │
│ • Receive Reset Link                                                        │
│ • Set New Password                                                          │
└──────────────┘
```

---

### ADMIN PAGES (Admin role only)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ADMIN PANEL                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TABS: [⏳ Pending] [✓ Approved] [✕ Rejected]                              │
│                                                                             │
│  ☑️ Select All (15 properties)          [Delete Selected (3)]              │
│                                                                             │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                 │
│  │ ☑️ Property Card 1       │  │ ☑️ Property Card 2       │                 │
│  │ [Thumbnail Image]       │  │ [Thumbnail Image]       │                 │
│  │ ⏳ Pending Review        │  │ ⏳ Pending Review        │                 │
│  │ रु Rs 50,00,000         │  │ रु Rs 75,00,000         │                 │
│  │ Title: Beautiful House  │  │ Title: Modern Apartment │                 │
│  │ Description...          │  │ Description...          │                 │
│  │ 📍 Kathmandu, Nepal     │  │ 📍 Pokhara, Nepal       │                 │
│  │ 🏠 House | 🏷️ Sale      │  │ 🏠 Apartment | Sale     │                 │
│  │ 🛏️3 🚿2 📐1200 sqft     │  │ 🛏️4 🚿3 📐1500 sqft     │                 │
│  │ 📅 Jan 4, 2026          │  │ 📅 Jan 3, 2026          │                 │
│  │                         │  │                         │                 │
│  │ [📋 Full Details]       │  │ [📋 Full Details]       │                 │
│  │ [📸 View Media]         │  │ [📸 View Media]         │                 │
│  │ [🗑️ Delete]             │  │ [🗑️ Delete]             │                 │
│  │                         │  │                         │                 │
│  │ [✓ Approve] [✕ Reject] │  │ [✓ Approve] [✕ Reject] │                 │
│  └─────────────────────────┘  └─────────────────────────┘                 │
│                                                                             │
│  Loads 6 properties at a time (Infinite Scroll)                            │
│  [Loading more... Showing 6 of 15 properties]                              │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │              MEDIA GALLERY MODAL (Tabbed Interface)                   │ │
│  ├───────────────────────────────────────────────────────────────────────┤ │
│  │ Tabs:                                                                 │ │
│  │ [🏠 Property Photos (12)] [📄 Lalpurja (4)] [🛣️ Road Photos (6)]     │ │
│  │ [🎥 Property Videos (2)] [🎬 Road Videos (1)]                         │ │
│  │                                                                       │ │
│  │ Active Tab Content (Only selected tab loads):                        │ │
│  │ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                         │ │
│  │ │[Image] │ │[Image] │ │[Image] │ │[Image] │                         │ │
│  │ └────────┘ └────────┘ └────────┘ └────────┘                         │ │
│  │                                                                       │ │
│  │ [✓ Approve Property] [✕ Reject Property] [Close]                    │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 USER FLOW DIAGRAMS

### Flow 1: Browse & Contact Property Owner

```
Home Page
    │
    ▼
Click "Buy" or "Rent"
    │
    ▼
Property List Page
(Filter by type, price)
    │
    ▼
Click on Property Card
    │
    ▼
Property Detail Page
    │
    ├─────────────────────────────────────┐
    │                                     │
    ▼                                     ▼
[CONTACT OWNER]                      [❤️ SAVE]
    │                                     │
    ▼                                     ▼
Modal with Owner Info              Saved to Favorites
(Phone, Email)                     (Stored in localStorage)
```

### Flow 2: Sell Property (User Journey)

```
User Logs In
    │
    ▼
Click "Sell" in Navbar
    │
    ▼
Fill Property Form
(Title, Price, Location, etc.)
    │
    ▼
Upload Files
(Photos, Videos, Documents)
    │
    ▼
Click [SUBMIT FOR APPROVAL]
    │
    ▼
Property Status: ⏳ PENDING
(Visible in "My Listings")
    │
    ▼
Admin Reviews in Admin Panel
    │
    ├─────────────────────────┐
    │                         │
    ▼                         ▼
Admin Clicks [✓ APPROVE]   Admin Clicks [✕ REJECT]
    │                         │
    ▼                         ▼
Property goes to           Status: ✕ REJECTED
Buy/Rent page              (User gets notification)
with ✓ Verified badge
    │
    ▼
User gets notification
"Your property has been approved!"
```

### Flow 3: Admin Approval Process

```
Admin Logs In
    │
    ▼
Goes to Admin Panel
    │
    ▼
Clicks [⏳ Pending] Tab
(Shows all pending properties)
    │
    ▼
Clicks [📸 View Media]
    │
    ▼
Tabbed Media Gallery Opens
• Property Photos
• Lalpurja Documents
• Road Photos
• Property Videos
• Road Videos
    │
    ▼
Reviews all media & details
    │
    ├─────────────────────────┐
    │                         │
    ▼                         ▼
Clicks [✓ Approve]        Clicks [✕ Reject]
    │                         │
    ▼                         ▼
Property created with      Property status
isVerified: true           set to rejected
    │                         │
    ▼                         ▼
Goes to Buy/Rent page      User notified
User notified              of rejection
```

---

## 🔔 NOTIFICATION SYSTEM

```
User submits property
    │
    ▼
Admin approves/rejects
    │
    ▼
Notification created
(Stored in localStorage)
    │
    ▼
🔔 Bell icon shows red badge
(Unread count: 3)
    │
    ▼
User clicks bell icon
    │
    ▼
Notification dropdown opens
┌─────────────────────────────────┐
│ 🔔 Notifications (3)            │
├─────────────────────────────────┤
│ ✓ Property Approved             │
│   "Beautiful House in..."       │
│   5 minutes ago                 │
│   [View] [Delete]               │
├─────────────────────────────────┤
│ ✕ Property Rejected             │
│   "Land in Pokhara..."          │
│   1 hour ago                    │
│   [View] [Delete]               │
└─────────────────────────────────┘
    │
    ▼
Click [View]
    │
    ▼
Goes to "My Listings" page
Shows the specific property
```

---

## 🌐 LANGUAGE TOGGLE

```
User clicks 🌐 button in navbar
    │
    ├─────────────────────────┐
    │                         │
    ▼                         ▼
Currently: EN              Currently: नेपाली
    │                         │
    ▼                         ▼
Switches to: नेपाली        Switches to: EN
    │                         │
    └─────────────┬───────────┘
                  │
                  ▼
ALL pages update instantly
(Home, Buy, Rent, Sell, Profile, etc.)
Language preference saved in localStorage
```

---

## 📊 KEY FEATURES SUMMARY

### Performance Optimizations
- ✅ Thumbnail generation (400px, 60% quality) - 95% size reduction
- ✅ Infinite scroll (loads 6 properties at a time)
- ✅ Lazy image loading with blur effect
- ✅ Video preload="none" (only loads when clicked)
- ✅ Tabbed media viewer (70-80% faster loading)

### User Experience Features
- ✅ Verified badge (✓) on approved properties
- ✅ Real-time notifications with unread count
- ✅ Bilingual support (EN/नेपाली) - one-click toggle
- ✅ Save favorites (❤️) with localStorage
- ✅ Property rating & review system (⭐)
- ✅ Report property (🚩)
- ✅ Interactive maps (Leaflet)
- ✅ Responsive design (Mobile/Tablet/Desktop)

### Admin Features
- ✅ Tabbed interface (Pending/Approved/Rejected)
- ✅ Tabbed media gallery (5 categories)
- ✅ Bulk delete operations
- ✅ Auto-verify on approval (isVerified: true)
- ✅ Thumbnail optimization for fast loading

### Security Features
- ✅ JWT authentication
- ✅ Role-based access (User/Admin)
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ File size validation

---

## 📁 FILE UPLOAD LIMITS

| Category          | Max Files | Max Size per File |
|-------------------|-----------|-------------------|
| Property Photos   | 20        | 50 MB             |
| Property Videos   | 2         | 500 MB            |
| Lalpurja Docs     | 4         | 50 MB             |
| Road Photos       | 6         | 50 MB             |
| Road Videos       | 2         | 500 MB            |
| Profile Picture   | 1         | 10 MB             |

---

**END OF USER INTERFACE DIAGRAM**
