import type { VercelRequest, VercelResponse } from '@vercel/node';
import { kv } from '@vercel/kv';
import { Testimonial } from '../types';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const testimonials = await kv.get<Testimonial[]>('testimonials') || [];
      return response.status(200).json(testimonials);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  }

  if (request.method === 'POST') {
    try {
      const { name, message, rating } = request.body;
      if (!name || !message || !rating) {
        return response.status(400).json({ message: 'Missing required fields' });
      }

      const newTestimonial: Testimonial = {
        id: Date.now(),
        name,
        message,
        rating,
        date: new Date().toISOString(),
      };

      const testimonials = await kv.get<Testimonial[]>('testimonials') || [];
      const updatedTestimonials = [newTestimonial, ...testimonials];

      await kv.set('testimonials', updatedTestimonials);

      return response.status(201).json(newTestimonial);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: 'Failed to add testimonial' });
    }
  }

  // Handle other methods or return error
  response.setHeader('Allow', ['GET', 'POST']);
  return response.status(405).end(`Method ${request.method} Not Allowed`);
}
