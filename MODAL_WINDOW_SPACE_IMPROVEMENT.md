# Modal Window Space Improvement

## Summary of Changes

Updated all modal components to better utilize window space on laptops and other devices by:

1. Increasing the maximum width from `max-w-lg` to `max-w-2xl`
2. Increasing the maximum height from `max-h-[90vh]` to `max-h-[95vh]`
3. Adjusting the scrollable area calculation from `max-h-[calc(90vh-140px)]` to `max-h-[calc(95vh-140px)]`

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

- Changed modal container width from `max-w-lg` (32rem/512px) to `max-w-2xl` (42rem/672px)
- Increased available vertical space from 90% to 95% of viewport height
- Maintained the same calculation for scrollable area to preserve proper header spacing
- All modals now better utilize available screen space, particularly on laptop screens