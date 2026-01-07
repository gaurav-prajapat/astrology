# Divine Rituals - Hindu Puja Booking Platform

A modern, fully-responsive single-page website for astrologers offering Hindu ritual bookings.

## Features

### Design & Theme
- Devotional theme with warm saffron-gold colors
- Subtle mandala patterns
- Animated diyas/flames
- Sanskrit fonts (Playfair Display) and Devanagari support (Noto Sans Devanagari)
- Gentle parallax scrolling effects
- Mobile-first responsive design with Tailwind CSS

### Key Sections
1. **Hero Section**: Eye-catching banner with astrologer photo, tagline, and CTA buttons
2. **Services**: Cards displaying rituals (Graha Shanti, Marriage Muhurat, Vastu Puja, etc.) with icons, descriptions, durations, and prices
3. **Booking Form**: Multi-step form with:
   - Service selection
   - Customer information (name, email, phone)
   - Date/time preferences
   - Location/address
   - Special notes
   - Real-time form validation
4. **About**: Astrologer bio, years of experience, and testimonials carousel
5. **Gallery**: Photo grid of past rituals
6. **Contact**: Map embed, WhatsApp/Call buttons, inquiry form
7. **Footer**: Links, socials, privacy policy

### Essential Features
- Real-time form validation
- Loading spinners
- WhatsApp integration for instant inquiries
- Calendar/availability checker
- Pricing calculator based on ritual selection
- SEO-optimized with dynamic meta tags
- Dark mode toggle
- PWA-ready for app-like experience
- Smooth animations using Framer Motion
- Hindi/English language switcher
- Fully responsive across all devices

## Tech Stack
- **Framework**: Next.js 13.5 with App Router
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Google Fonts (Inter, Playfair Display, Noto Sans Devanagari)
- **Images**: Pexels stock photos

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase

Update the `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-actual-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-supabase-anon-key
```

### 3. Database Setup

The database schema has been created with the following tables:
- `services`: Hindu ritual services
- `bookings`: Customer bookings
- `testimonials`: Customer reviews
- `availability_slots`: Available time slots

Sample data has been pre-populated for services and testimonials.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 5. Build for Production
```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder
3. Configure environment variables in Netlify dashboard

## PWA Configuration

The application includes a PWA manifest (`/public/manifest.json`) for an app-like experience on mobile devices. To complete the PWA setup:

1. Add icon files to `/public/`:
   - `icon-192.png` (192x192px)
   - `icon-512.png` (512x512px)

2. The manifest is already linked in the layout

## Customization

### Colors
Edit the color palette in `tailwind.config.ts`:
- `saffron`: Main accent color
- `gold`: Secondary accent
- `divine`: Complementary warm tones

### Services
Add or modify services through the Supabase dashboard in the `services` table.

### Testimonials
Manage testimonials through the `testimonials` table. Set `is_featured` to `true` to display on the homepage.

### Contact Information
Update contact details in `/components/Contact.tsx`:
- Phone number
- Email address
- Physical address
- WhatsApp number
- Map embed coordinates

## Language Support

The website supports both English and Hindi. Use the language switcher in the navigation bar to toggle between languages.

To add more translations, update the translation functions in each component.

## Key Files Structure

```
project/
├── app/
│   ├── layout.tsx          # Root layout with fonts and metadata
│   ├── page.tsx            # Main page with all sections
│   └── globals.css         # Global styles
├── components/
│   ├── Navigation.tsx      # Top navigation bar
│   ├── Hero.tsx           # Hero section with diya animation
│   ├── Services.tsx       # Services grid
│   ├── BookingForm.tsx    # Multi-step booking form
│   ├── About.tsx          # About section with testimonials
│   ├── Gallery.tsx        # Photo gallery
│   ├── Contact.tsx        # Contact form and information
│   └── Footer.tsx         # Footer component
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── contexts/
│       ├── LanguageContext.tsx  # Language switching
│       └── ThemeContext.tsx     # Dark mode toggle
└── public/
    └── manifest.json      # PWA manifest

## Features in Detail

### Dark Mode
Click the sun/moon icon in the navigation to toggle between light and dark modes. Preference is saved in localStorage.

### Booking Flow
1. Select a ritual service
2. Enter personal information
3. Choose date, time, and location
4. Review and submit
5. Receive confirmation

### WhatsApp Integration
Click the WhatsApp button to open a chat with pre-filled message for instant inquiries.

### Responsive Design
The website is fully responsive with breakpoints for:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance
- Optimized images from Pexels CDN
- Lazy loading for images
- Code splitting
- Fast page loads

## Support

For issues or questions, contact: info@divinerituals.com

---

Built with devotion for spiritual seekers 🙏
