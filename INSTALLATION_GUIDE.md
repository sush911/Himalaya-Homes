# Installation & Testing Guide

## Prerequisites
- Node.js 16+
- MongoDB running
- Backend and Frontend development environments set up

## Backend Setup

### 1. No Additional Dependencies Needed
The backend implementation uses only existing dependencies:
- Mongoose (already installed)
- Express (already installed)

### 2. Verify Backend Changes
The following files have been modified:
- `Backend/models/Property.js` - Added review fields
- `Backend/controllers/propertyController.js` - Added 3 new functions
- `Backend/routes/propertyRoutes.js` - Added 3 new routes

### 3. Testing Backend Endpoints

#### Test Adding a Review
```bash
curl -X POST http://localhost:5000/api/properties/:propertyId/reviews \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great property!"
  }'
```

#### Test Getting Reviews
```bash
curl http://localhost:5000/api/properties/:propertyId/reviews
```

#### Test Verifying Property (Admin only)
```bash
curl -X PATCH http://localhost:5000/api/properties/:propertyId/verify \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## Frontend Setup

### 1. New Components Added
- `frontend/src/pages/PrivacyPolicy.jsx`
- `frontend/src/pages/TermsOfService.jsx`
- `frontend/src/pages/FAQ.jsx`

### 2. Modified Components
- `frontend/src/components/PropertyCard.jsx` - Added rating display
- `frontend/src/components/Footer.jsx` - Added footer modals
- `frontend/src/pages/PropertyDetail.jsx` - Added review section
- `frontend/src/api/property.js` - Added 3 new API functions
- `frontend/src/App.jsx` - Added 3 new routes

### 3. No Additional Dependencies Needed
All components use existing packages:
- React Bootstrap (already installed)
- React Icons (already installed)
- React Router (already installed)

### 4. Build Frontend
```bash
cd frontend
npm run build
```

---

## Database Migration (If Upgrading Existing Database)

### Update Existing Properties
If you have existing properties in MongoDB, run this migration to add the new fields:

```javascript
// In MongoDB console or use a migration script
db.properties.updateMany(
  {},
  {
    $set: {
      reviews: [],
      averageRating: 0,
      totalReviews: 0,
      isVerified: false
    }
  }
);
```

Or create a Node.js migration script:

```javascript
// migrate.js
import mongoose from 'mongoose';
import Property from './models/Property.js';

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const result = await Property.updateMany(
      { reviews: { $exists: false } },
      {
        $set: {
          reviews: [],
          averageRating: 0,
          totalReviews: 0,
          isVerified: false
        }
      }
    );
    
    console.log(`Updated ${result.modifiedCount} properties`);
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

Run it:
```bash
node migrate.js
```

---

## Testing the Features

### 1. Test Review Submission
1. Start both backend and frontend
2. Login as a regular user
3. Go to any property detail page
4. Scroll to "Reviews" section
5. Click on stars to rate
6. Add a comment (optional)
7. Click "Submit Review"
8. **Expected**: Review appears immediately, rating is updated

### 2. Test Rating Display
1. Go back to property list
2. **Expected**: You should see the star rating and count
3. Refresh page
4. **Expected**: Rating persists (stored in DB)

### 3. Test Verified Badge (Admin)
1. Login as admin
2. Go to Admin → Admin Properties
3. Find a property
4. Click "Verify" button
5. **Expected**: Property now shows "✓ Verified" badge
6. Go to property detail page
7. **Expected**: Badge visible next to listing type

### 4. Test Verified Badge Display (All Users)
1. Go to property list
2. Verified properties should show green badge in bottom-left
3. Go to property detail
4. Verified badge should be visible in header

### 5. Test Footer Pages
1. Scroll to footer
2. Click "Privacy Policy" button
3. **Expected**: Modal opens with bilingual content
4. Switch language in navbar
5. **Expected**: Footer text updates to Nepali
6. Click modal link again
7. **Expected**: Modal opens in Nepali

### 6. Test Direct Routes
1. Navigate to `/privacy`
2. **Expected**: Full Privacy Policy page loads
3. Navigate to `/terms`
4. **Expected**: Full Terms of Service page loads
5. Navigate to `/faq`
6. **Expected**: Full FAQ page loads with expandable questions

### 7. Test Bilingual FAQ
1. Go to `/faq`
2. View English version (default)
3. Switch language to Nepali
4. **Expected**: All questions and answers display in Nepali
5. Click on FAQ link in English language mode
6. **Expected**: Questions are in English
7. Switch to Nepali
8. **Expected**: Content updates to Nepali

---

## Troubleshooting

### Issue: "Review not submitting"
**Solution**: 
- Check if user is logged in
- Verify token is valid
- Check browser console for errors
- Ensure backend is running

### Issue: "Ratings not showing on property list"
**Solution**:
- Hard refresh browser (Ctrl+Shift+R)
- Check if property has reviews in database
- Verify PropertyCard component is receiving property data

### Issue: "Footer modals not opening"
**Solution**:
- Check if react-bootstrap Modal is imported
- Verify state management is working
- Check console for JavaScript errors

### Issue: "Verified badge not showing"
**Solution**:
- Check if property.isVerified is true in database
- Verify FaCheckCircle icon is imported
- Refresh page after verification

---

## Performance Considerations

1. **Reviews Array Growth**: Consider pagination if properties have many reviews (100+)
2. **Average Rating Calculation**: Currently recalculated on each review submission (fast for <1000 reviews)
3. **Modal Performance**: Modals load components on demand (good for performance)

### Future Optimization Ideas
- Paginate reviews (show 10 at a time)
- Cache average ratings in Redis
- Add review filtering/sorting
- Add helpful/unhelpful votes on reviews

---

## Rollback Instructions

If you need to remove these features:

### Backend Rollback
1. Remove review functions from `propertyController.js`
2. Remove review routes from `propertyRoutes.js`
3. Remove review fields from `Property.js` schema
4. Restart backend

### Frontend Rollback
1. Remove review section from `PropertyDetail.jsx`
2. Remove rating display from `PropertyCard.jsx`
3. Remove footer modals from `Footer.jsx`
4. Remove new pages
5. Remove routes from `App.jsx`
6. Rebuild frontend

### Database Rollback
```javascript
db.properties.updateMany({}, {
  $unset: {
    reviews: "",
    averageRating: "",
    totalReviews: "",
    isVerified: ""
  }
});
```

---

## Monitoring & Maintenance

### Check Review Stats
```javascript
db.properties.aggregate([
  {
    $group: {
      _id: null,
      totalReviews: { $sum: "$totalReviews" },
      avgRating: { $avg: "$averageRating" },
      verifiedCount: {
        $sum: { $cond: ["$isVerified", 1, 0] }
      }
    }
  }
]);
```

### Remove Inappropriate Reviews (Admin)
```javascript
db.properties.updateOne(
  { _id: ObjectId("propertyId") },
  { $pull: { reviews: { _id: ObjectId("reviewId") } } }
);
```

---

## Support

For issues or questions:
- Check the USER_GUIDE.md for feature documentation
- Review the IMPLEMENTATION_SUMMARY.md for technical details
- Check browser console and backend logs for errors
