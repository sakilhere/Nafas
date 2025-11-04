import type { VercelRequest, VercelResponse } from '@vercel/node';
import { head, put } from '@vercel/blob';
import { Testimonial } from '../types';

// Helper to fetch testimonials from blob storage
async function getTestimonials(): Promise<Testimonial[]> {
  try {
    // head() returns metadata or null if the blob doesn't exist.
    const blob = await head('testimonials.json');
    if (!blob) {
      return [];
    }
    const response = await fetch(blob.downloadUrl);
    if (!response.ok) {
      console.error('Failed to download testimonials blob:', response.status, response.statusText);
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    // head() can throw if there's a network or auth error.
    // We'll log it and return an empty array to allow the app to function.
    console.error('Error fetching testimonials from blob:', error);
    return [];
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const testimonials = await getTestimonials();
      return response.status(200).json(testimonials);
    } catch (error) {
      console.error('Error in GET /api/testimonials:', error);
      return response.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  }

  if (request.method === 'POST') {
    try {
      const { name, message, rating } = request.body;
      if (!name || !message || rating === undefined) {
        return response.status(400).json({ message: 'Missing required fields' });
      }

      const newTestimonial: Testimonial = {
        id: Date.now(),
        name,
        message,
        rating: Number(rating),
        date: new Date().toISOString(),
      };

      const testimonials = await getTestimonials();
      const updatedTestimonials = [newTestimonial, ...testimonials];

      await put('testimonials.json', JSON.stringify(updatedTestimonials, null, 2), {
        access: 'private',
        contentType: 'application/json',
      });

      return response.status(201).json(newTestimonial);
    } catch (error) {
      console.error('Error in POST /api/testimonials:', error);
      return response.status(500).json({ message: 'Failed to add testimonial' });
    }
  }

  // Handle other methods or return error
  response.setHeader('Allow', ['GET', 'POST']);
  return response.status(405).end(`Method ${request.method} Not Allowed`);
}
