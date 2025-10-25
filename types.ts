export interface Artist {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  skills: string[];
  instagram?: string;
}

export interface PricingTier {
  type: string;
  perHour: number;
  minHours: number;
  audience: string;
  features: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
  date: string;
}

export interface BookingForm {
  name: string;
  email: string;
  phone: string;
  eventType: 'get-together' | 'private-event' | 'corporate' | 'wedding' | 'cafe-gig';
  date: string;
  audience: string;
  hours: string;
}

export interface TestimonialForm {
  name: string;
  message: string;
  rating: number;
}