
-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_hi text NOT NULL,
  description_en text NOT NULL,
  description_hi text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  base_price decimal(10,2) NOT NULL,
  icon text NOT NULL,
  category text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id) ON DELETE CASCADE,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  preferred_date date NOT NULL,
  preferred_time time NOT NULL,
  location text NOT NULL,
  special_notes text DEFAULT '',
  status text DEFAULT 'pending',
  total_amount decimal(10,2) NOT NULL,
  payment_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_photo text DEFAULT '',
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_en text NOT NULL,
  review_hi text NOT NULL,
  ritual_name text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create availability_slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  is_available boolean DEFAULT true,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create astrologers table
CREATE TABLE IF NOT EXISTS astrologers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_hi text NOT NULL,
  bio_en text NOT NULL,
  bio_hi text NOT NULL,
  photo_url text DEFAULT '',
  experience_years integer NOT NULL DEFAULT 0,
  specializations text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE astrologers ENABLE ROW LEVEL SECURITY;

-- Create policies for services (public read access)
CREATE POLICY "Anyone can view active services"
  ON services FOR SELECT
  TO public
  USING (is_active = true);

-- Create policies for bookings (anyone can create, only authenticated can view their own)
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view bookings"
  ON bookings FOR SELECT
  TO public
  USING (true);

-- Create policies for testimonials (public read access to featured ones)
CREATE POLICY "Anyone can view featured testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_featured = true);

-- Create policies for availability_slots (public read access)
CREATE POLICY "Anyone can view available slots"
  ON availability_slots FOR SELECT
  TO public
  USING (true);

-- Create policies for astrologers (public read access to active ones)
CREATE POLICY "Anyone can view active astrologers"
  ON astrologers FOR SELECT
  TO public
  USING (is_active = true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(preferred_date);
CREATE INDEX IF NOT EXISTS idx_availability_date ON availability_slots(slot_date);
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_astrologers_active ON astrologers(is_active);

-- Insert sample services
INSERT INTO services (name_en, name_hi, description_en, description_hi, duration_minutes, base_price, icon, category) VALUES
  ('Graha Shanti Puja', 'ग्रह शांति पूजा', 'A sacred ritual to pacify planetary influences and bring harmony to your life', 'ग्रहों के प्रभाव को शांत करने और जीवन में सामंजस्य लाने के लिए एक पवित्र अनुष्ठान', 120, 5100.00, 'planet', 'pooja'),
  ('Marriage Muhurat', 'विवाह मुहूर्त', 'Find the most auspicious time for your wedding ceremony based on Vedic astrology', 'वैदिक ज्योतिष के आधार पर अपने विवाह समारोह के लिए सबसे शुभ समय खोजें', 60, 3100.00, 'rings', 'muhurat'),
  ('Vastu Shanti Puja', 'वास्तु शांति पूजा', 'Harmonize your home or office with Vastu principles for prosperity and peace', 'समृद्धि और शांति के लिए वास्तु सिद्धांतों के साथ अपने घर या कार्यालय को सामंजस्यपूर्ण बनाएं', 150, 7100.00, 'home', 'pooja'),
  ('Satyanarayan Puja', 'सत्यनारायण पूजा', 'Traditional worship of Lord Vishnu for blessings and fulfillment of wishes', 'आशीर्वाद और इच्छाओं की पूर्ति के लिए भगवान विष्णु की पारंपरिक पूजा', 180, 4100.00, 'lotus', 'pooja'),
  ('Havan Ceremony', 'हवन समारोह', 'Sacred fire ritual for purification, prosperity, and divine blessings', 'शुद्धि, समृद्धि और दिव्य आशीर्वाद के लिए पवित्र अग्नि अनुष्ठान', 90, 3500.00, 'fire', 'havan'),
  ('Griha Pravesh Muhurat', 'गृह प्रवेश मुहूर्त', 'Determine the perfect time for housewarming ceremony', 'गृहप्रवेश समारोह के लिए सही समय निर्धारित करें', 45, 2100.00, 'door', 'muhurat'),
  ('Navgraha Puja', 'नवग्रह पूजा', 'Worship of nine celestial bodies to remove negative influences', 'नकारात्मक प्रभावों को दूर करने के लिए नौ ग्रहों की पूजा', 150, 6100.00, 'sun', 'pooja'),
  ('Rudrabhishek', 'रुद्राभिषेक', 'Sacred abhishek of Lord Shiva for health, prosperity and spiritual growth', 'स्वास्थ्य, समृद्धि और आध्यात्मिक विकास के लिए भगवान शिव का पवित्र अभिषेक', 120, 5500.00, 'shiva', 'pooja');

-- Insert sample testimonials
INSERT INTO testimonials (customer_name, customer_photo, rating, review_en, review_hi, ritual_name, is_featured) VALUES
  ('Rajesh Kumar', '', 5, 'The Graha Shanti Puja performed by Panditji was excellent. I felt immediate positive changes in my life. Highly recommended!', 'पंडितजी द्वारा किया गया ग्रह शांति पूजा उत्कृष्ट था। मुझे अपने जीवन में तत्काल सकारात्मक बदलाव महसूस हुए।', 'Graha Shanti Puja', true),
  ('Priya Sharma', '', 5, 'Very knowledgeable and professional. The Vastu Puja brought peace to our new home. Thank you!', 'बहुत जानकार और पेशेवर। वास्तु पूजा ने हमारे नए घर में शांति ला दी। धन्यवाद!', 'Vastu Shanti Puja', true),
  ('Amit Patel', '', 5, 'Perfect muhurat for our wedding. Everything went smoothly. Grateful for the guidance.', 'हमारी शादी के लिए एकदम सही मुहूर्त। सब कुछ आसानी से हो गया। मार्गदर्शन के लिए आभारी।', 'Marriage Muhurat', true),
  ('Sunita Devi', '', 5, 'The Satyanarayan Puja was performed with great devotion. Blessed to have found such a genuine astrologer.', 'सत्यनारायण पूजा बड़ी भक्ति के साथ की गई। ऐसे सच्चे ज्योतिषी को पाकर धन्य हुए।', 'Satyanarayan Puja', true);

-- Insert sample astrologers
INSERT INTO astrologers (name_en, name_hi, bio_en, bio_hi, photo_url, experience_years, specializations) VALUES
  ('Pandit Rajesh Sharma', 'पंडित राजेश शर्मा', 'Experienced Vedic astrologer with 15 years of practice, specializing in Graha Shanti and marriage compatibility.', '15 साल के अनुभव के साथ वैदिक ज्योतिषी, ग्रह शांति और विवाह मिलान में विशेषज्ञ।', '', 15, ARRAY['Vedic Astrology', 'Marriage Compatibility', 'Graha Shanti']),
  ('Acharya Vikram Singh', 'आचार्य विक्रम सिंह', 'Renowned Vastu expert and ritual performer with over 20 years of experience in traditional Hindu ceremonies.', '20 साल से अधिक अनुभव के साथ प्रसिद्ध वास्तु विशेषज्ञ और पारंपरिक हिंदू समारोहों के कलाकार।', '', 20, ARRAY['Vastu Shastra', 'Puja Rituals', 'Havan Ceremonies']),
  ('Dr. Priya Gupta', 'डॉ. प्रिया गुप्ता', 'PhD in Astrology with expertise in Navgraha Puja and spiritual counseling.', 'ज्योतिष में पीएचडी के साथ नवग्रह पूजा और आध्यात्मिक परामर्श में विशेषज्ञता।', '', 12, ARRAY['Navgraha Puja', 'Spiritual Counseling', 'Remedial Measures']),
  ('Pandit Anil Kumar', 'पंडित अनिल कुमार', 'Traditional priest specializing in Satyanarayan Puja and family rituals.', 'सत्यनारायण पूजा और पारिवारिक अनुष्ठानों में विशेषज्ञ पारंपरिक पुजारी।', '', 18, ARRAY['Satyanarayan Puja', 'Family Rituals', 'Muhurat Determination']);