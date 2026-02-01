# Modal Scrolling Improvement

## Summary of Changes

Updated all modal components to improve scrolling behavior on smaller screens by:

1. Adding `flex-grow` class to the scrollable content area
2. Ensuring content is properly scrollable even when it exceeds the visible area
3. Maintaining the increased window space utilization from previous updates

## Files Updated

- [admin-components/modals/AddGalleryModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/AddGalleryModal.tsx)
- [admin-components/modals/EditGalleryModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/EditGalleryModal.tsx)
- [admin-components/modals/AddCarouselModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/AddCarouselModal.tsx)
- [admin-components/modals/EditCarouselModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/EditCarouselModal.tsx)
- [admin-components/modals/AddAstrologerModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/AddAstrologerModal.tsx)
- [admin-components/modals/EditAstrologerModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/EditAstrologerModal.tsx)
- [admin-components/modals/AddStaffModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/AddStaffModal.tsx)
- [admin-components/modals/EditStaffModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/EditStaffModal.tsx)
- [admin-components/modals/AddServiceModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/AddServiceModal.tsx)
- [admin-components/modals/EditServiceModal.tsx](file:///c%3A/Users/RSP.tech%20Solution/Desktop/astrology/admin-components/modals/EditServiceModal.tsx)

## Technical Details

- Added `flex-grow` class to the scrollable content area to ensure it expands properly
- This ensures that all content within modals is accessible via scrolling on smaller screens
- Combined with previous improvements (increased width from max-w-lg to max-w-2xl and height from 90vh to 95vh)
- Modals now properly show all content and allow scrolling to reach all form elements and buttons