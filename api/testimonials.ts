import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { Testimonial } from '../types';

const TESTIMONIALS_KEY = 'testimonials';

const sampleTestimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Anjali & Rohan',
      message: 'Nafas performed at our wedding, and they were absolutely magical. Their Sufi-Bollywood fusion created the most soulful and romantic atmosphere. Our guests are still talking about it!',
      rating: 5,
      date: '2024-05-20T12:00:00Z',
    },
    {
      id: 2,
      name: 'Corporate Event Manager',
      message: 'We booked Nafas for our annual corporate dinner. Their professionalism and incredible talent were outstanding. They set the perfect elegant and uplifting tone for the evening.',
      rating: 5,
      date: '2024-04-15T12:00:00Z',
    },
    {
      id: 3,
      name: 'Aarav Gupta',
      message: "An unforgettable night of music. Sanna's voice and Sabir's guitar are a match made in heaven. It was pure bliss. Can't wait to see them live again!",
      rating: 5,
      date: '2024-03-10T12:00:00Z',
    }
];

async function getTestimonials(): Promise<Testimonial[]> {
    try {
        const isKvAvailable = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
        if (!isKvAvailable) {
            return sampleTestimonials;
        }

        const testimonials = await kv.lrange<Testimonial>(TESTIMONIALS_KEY, 0, -1);
        if (!testimonials || testimonials.length === 0) {
            return sampleTestimonials;
        }
        return testimonials;
    } catch (error) {
        console.error('Error fetching testimonials, falling back to samples:', error);
        return sampleTestimonials;
    }
}

async function addTestimonial(testimonialData: any): Promise<Testimonial> {
    const { name, message, rating } = testimonialData;
    if (!name || !message || rating === undefined) {
        throw new Error('Missing required fields');
    }

    const newTestimonial: Testimonial = {
        id: Date.now(),
        name,
        message,
        rating: Number(rating),
        date: new Date().toISOString(),
    };
      
    const isKvAvailable = !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;
    if (isKvAvailable) {
        await kv.lpush(TESTIMONIALS_KEY, newTestimonial);
    } else {
        console.log('KV not configured. Testimonial not persisted.');
    }

    return newTestimonial;
}


export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
    try {
        if (request.method === 'GET') {
            const testimonials = await getTestimonials();
            return response.status(200).json(testimonials);
        }

        if (request.method === 'POST') {
            const newTestimonial = await addTestimonial(request.body);
            return response.status(201).json(newTestimonial);
        }

        response.setHeader('Allow', ['GET', 'POST']);
        return response.status(405).json({ message: `Method ${request.method} Not Allowed` });

    } catch (error) {
        console.error('API Error:', error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred';
        
        if (errorMessage === 'Missing required fields') {
             return response.status(400).json({ message: errorMessage });
        }
        return response.status(500).json({ message: 'An internal server error occurred.' });
    }
}