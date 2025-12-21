# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     HIMALAYA HOMES PLATFORM                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────┐       ┌──────────────────────────────┐
│        FRONTEND              │       │        BACKEND               │
│     (React 18+)              │       │    (Node.js/Express)         │
├──────────────────────────────┤       ├──────────────────────────────┤
│                              │       │                              │
│ Pages:                       │       │ Models:                      │
│ ├─ HomePage                  │──────→├─ Property.js (+reviews)      │
│ ├─ PropertyDetail            │       │ ├─ reviews: []               │
│ ├─ PropertyList              │       │ ├─ averageRating: 0          │
│ ├─ PrivacyPolicy             │       │ ├─ totalReviews: 0           │
│ ├─ TermsOfService            │       │ └─ isVerified: false         │
│ └─ FAQ                       │       │                              │
│                              │       │ Controllers:                 │
│ Components:                  │───────┼─ propertyController.js      │
│ ├─ PropertyCard (rating)     │       │ ├─ addReview()              │
│ ├─ PropertyDetail (reviews)  │       │ ├─ getReviews()             │
│ ├─ Footer (pages)            │       │ └─ verifyProperty()         │
│ └─ Navbar                    │       │                              │
│                              │       │ Routes:                      │
│ Context:                     │       │ ├─ POST /:id/reviews        │
│ └─ LanguageContext           │       │ ├─ GET /:id/reviews         │
│                              │       │ └─ PATCH /:id/verify        │
└──────────────────────────────┘       └──────────────────────────────┘
         │                                     │
         │ HTTP/REST                          │
         └─────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   MongoDB Database   │
         ├──────────────────────┤
         │ properties: {        │
         │   reviews: [],       │
         │   avgRating: 0,      │
         │   totalReviews: 0,   │
         │   isVerified: false  │
         │ }                    │
         └──────────────────────┘
```

---

## Review Submission Flow

```
USER INTERFACE              API LAYER              BACKEND              DATABASE
─────────────────────────────────────────────────────────────────────────────────

User on PropertyDetail
       │
       ├─→ 1. Click Stars ──→ [Select rating 1-5]
       │
       ├─→ 2. Type Comment ──→ [Optional text, max 500 chars]
       │
       └─→ 3. Click Submit ─→ POST /api/properties/:id/reviews
                              {rating, comment, token}
                                          │
                                          ▼
                              propertyController.addReview()
                              ├─ Validate rating 1-5
                              ├─ Find property
                              ├─ Check if user reviewed before
                              │   ├─ YES: Update existing
                              │   └─ NO: Add new review
                              ├─ Recalculate average rating
                              ├─ Update totalReviews count
                              └─ Save to database
                                          │
                                          ▼
                              Property saved to MongoDB:
                              {
                                _id: "...",
                                reviews: [
                                  {
                                    user: "user123",
                                    rating: 5,
                                    comment: "Great!",
                                    createdAt: "2024-12-19"
                                  }
                                ],
                                averageRating: 5,
                                totalReviews: 1
                              }
                                          │
                                          ▼
                              Response sent back to Frontend:
                              {
                                success: true,
                                property: {...},
                                message: "Review added"
                              }
                                          │
                                          ▼
       ◄──────────────────────────────────┘
       │
       ├─→ Update state with new reviews
       │
       └─→ Render updated review list
           Display average rating
           Show user feedback message
```

---

## Property Verification Flow

```
ADMIN                         API                  BACKEND            DATABASE
──────────────────────────────────────────────────────────────────────────────

Admin Panel
PropertyList
   │
   ├─→ Find Property ─→ Click "Verify" Button
   │
   └─→ PATCH /api/properties/:id/verify ──→ verifyProperty()
                        {admin_token}         ├─ Check admin auth
                                              ├─ Find property
                                              ├─ Set isVerified = true
                                              └─ Save to database
                                                         │
                                                         ▼
                                                  MongoDB Update:
                                                  {
                                                    _id: "...",
                                                    isVerified: true
                                                  }
                                                         │
                                                         ▼
       ◄──────────────────────────────────────────────────┘
       │
       └─→ Property now shows "✓ Verified" badge
           On property cards
           On property detail page
```

---

## Rating Display Flow

```
USER VIEWS PROPERTY LIST          API FETCH            DATABASE          UI RENDER
──────────────────────────────────────────────────────────────────────────────────

1. PropertyList Component Loads
   │
   ├─→ Fetch all properties: listProperties()
   │
   ▼
   Backend returns properties with:
   ├─ averageRating: 4.5
   ├─ totalReviews: 10
   └─ isVerified: true
        │
        ▼
   PropertyCard Component receives data
        │
        ├─→ renderStars(4.5) ──→ Shows ★★★★☆
        │
        ├─→ Display "4.5 (10)" ──→ Shows rating count
        │
        ├─→ isVerified? ──→ Show green "✓ Verified" badge
        │
        └─→ User sees full card with all info
```

---

## Footer Pages Navigation Flow

```
ANY PAGE
   │
   ├─→ User scrolls to footer
   │
   ├─→ Sees links in "Company" section:
   │   ├─ Privacy Policy
   │   ├─ Terms of Service
   │   └─ FAQ
   │
   ├─→ User clicks "Privacy Policy"
   │
   ├─→ Option 1: Opens Modal
   │   ├─ Import PrivacyPolicy component
   │   ├─ Render inside Modal
   │   ├─ Show content (English/Nepali)
   │   ├─ User reads content
   │   └─ Close button returns to page
   │
   └─→ Option 2: Direct Navigation
       ├─ Click link goes to /privacy
       ├─ Full page with content
       ├─ Back button returns
       └─ Content in selected language
```

---

## Data Model

```
Property Document Structure:

{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  title: "Beautiful House in Kathmandu",
  price: 5000000,
  listingType: "sale",
  propertyType: "house",
  
  ├─ REVIEW FIELDS (NEW):
  │
  ├─ reviews: [
  │   {
  │     _id: ObjectId(...),
  │     user: ObjectId("507f1f77bcf86cd799439012"),  // refs User
  │     rating: 5,                                   // 1-5 stars
  │     comment: "Great property!",                  // Optional
  │     createdAt: ISODate("2024-12-19")
  │   },
  │   {
  │     _id: ObjectId(...),
  │     user: ObjectId("507f1f77bcf86cd799439013"),
  │     rating: 4,
  │     comment: "Good but needs renovation",
  │     createdAt: ISODate("2024-12-18")
  │   }
  │ ],
  │
  ├─ averageRating: 4.5,              // (5+4)/2
  ├─ totalReviews: 2,                 // Array length
  ├─ isVerified: true,                // Admin verified
  │
  ├─ OTHER EXISTING FIELDS:
  │
  ├─ location: {...},
  ├─ bedrooms: 3,
  ├─ bathrooms: 2,
  ├─ postedBy: ObjectId(...),
  ├─ createdAt: ISODate(...),
  └─ updatedAt: ISODate(...)
}
```

---

## Component Hierarchy

```
App
├── Navbar
│   └── Language Selector
├── Routes
│   ├── Home
│   │   └── PropertyList
│   │       └── PropertyCard (shows rating + verified badge)
│   ├── PropertyDetail
│   │   ├── Property Info
│   │   ├── Reviews Section ◄── NEW
│   │   │   ├── Rating Display
│   │   │   ├── Review Form (if logged in)
│   │   │   └── Review List
│   │   └── Comments
│   ├── PrivacyPolicy ◄── NEW
│   ├── TermsOfService ◄── NEW
│   └── FAQ ◄── NEW
└── Footer ◄── UPDATED
    ├── Modal: PrivacyPolicy
    ├── Modal: TermsOfService
    └── Modal: FAQ
```

---

## API Endpoints

```
REVIEW ENDPOINTS:
═════════════════════════════════════════════════════════════════

1. Submit/Update Review
   POST /api/properties/:id/reviews
   Required: Authorization Bearer <token>
   Body: { rating: 1-5, comment: "optional text" }
   Response: { property: {...}, message: "..." }

2. Get All Reviews
   GET /api/properties/:id/reviews
   Response: { 
     averageRating: 4.5, 
     totalReviews: 10,
     reviews: [{...}, {...}]
   }

3. Verify Property (Admin)
   PATCH /api/properties/:id/verify
   Required: Authorization Bearer <admin_token>
   Response: { property: {...}, message: "Verified" }
```

---

## User Journey

```
BUYER/RENTER JOURNEY:
═════════════════════════════════════════════════════════════════

1. Browse Properties
   Home → PropertyList → See ratings & verified badges

2. View Details
   Click Property → PropertyDetail → See all reviews

3. Make Decision
   Read reviews → Check verified badge → Contact owner

4. Leave Review (if purchased/rented)
   Login → PropertyDetail → Rating Form → Submit → Review visible

5. Check Policies
   Footer → Click Privacy/Terms/FAQ → Read content


ADMIN JOURNEY:
═════════════════════════════════════════════════════════════════

1. Access Admin Panel
   Admin → Admin Properties

2. Review Properties
   See properties with review counts

3. Verify Properties
   Find property → Click Verify → Badge appears

4. Monitor Reviews
   See all reviews for properties
```

---

## State Management

```
FRONTEND STATE (React Hooks):
═════════════════════════════════════════════════════════════════

PropertyDetail Component:
├─ [property, setProperty]          // Full property data
├─ [reviews, setReviews]            // Array of reviews
├─ [rating, setRating]              // User's selected rating 1-5
├─ [comment, setComment]            // User's comment text
└─ [submittingReview, setSubmitting] // Loading state

Footer Component:
├─ [showPrivacy, setShowPrivacy]    // Modal state
├─ [showTerms, setShowTerms]        // Modal state
└─ [showFAQ, setShowFAQ]            // Modal state

App Component:
└─ [language, setLanguage]          // From LanguageContext
```

---

## Security Layers

```
┌─────────────────────────────────────────────┐
│        REQUEST VALIDATION                   │
├─────────────────────────────────────────────┤
│ 1. Check Authorization Token                │
│    └─ Required: Bearer token in header      │
├─────────────────────────────────────────────┤
│ 2. Validate Input Data                      │
│    ├─ Rating must be 1-5                    │
│    └─ Comment max 500 chars                 │
├─────────────────────────────────────────────┤
│ 3. Check Admin Status (for verify)          │
│    └─ Must be admin user                    │
├─────────────────────────────────────────────┤
│ 4. Authenticate User                        │
│    └─ User can only update own review       │
├─────────────────────────────────────────────┤
│ 5. Database Operations                      │
│    └─ Mongoose schema validation            │
└─────────────────────────────────────────────┘
```

---

## Performance Optimization

```
OPTIMIZATION STRATEGIES:
═════════════════════════════════════════════════════════════════

Frontend:
├─ Component Memoization: React.memo for PropertyCard
├─ Lazy Loading: Modal pages load on demand
├─ State Optimization: Minimal component re-renders
└─ Caching: Browser caches property data

Backend:
├─ Indexing: On property._id for quick lookups
├─ Calculation: Average rating cached in DB
├─ Queries: Only fetch needed fields
└─ Response: Minimal JSON payloads

Database:
├─ Schema: Subdocuments for reviews
├─ Indexing: Index on propertyId
└─ Aggregation: Pre-calculated averages
```

---

This comprehensive architecture ensures scalability, security, and excellent user experience!
