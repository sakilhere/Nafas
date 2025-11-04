import React, { useState, useEffect, useRef } from 'react';
import { Music, Star, Users, Send, Heart, Quote, Menu, X, Instagram, Mail, Phone, MessageSquare, CheckCircle, LoaderCircle } from 'lucide-react';
import { Artist, PricingTier, Testimonial, BookingForm, TestimonialForm } from '../types';
import Chatbot from './Chatbot';

const useIsVisible = (ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit & { triggerOnce?: boolean }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options?.triggerOnce) {
          observer.unobserve(element);
        }
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [ref, options]);

  return isVisible;
};

// Extracted component to fix hook error
const ArtistCard: React.FC<{ artist: Artist; isActive: boolean; onClick: () => void; delay: number }> = ({ artist, isActive, onClick, delay }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIsVisible(ref, { triggerOnce: true });

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`relative group cursor-pointer scroll-animate ${isVisible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-3xl p-8 border-2 transition-all duration-500 ${isActive ? 'border-yellow-400 scale-105 shadow-2xl shadow-yellow-500/50' : 'border-yellow-500/30 hover:border-yellow-400/60 hover:scale-[1.02] hover:shadow-lg hover:shadow-yellow-500/20'}`}>
        <div className="text-center mb-6">
          <div className={`text-8xl mb-4 transition-transform duration-700 ${isActive ? 'scale-125 rotate-12' : 'group-hover:scale-110'}`}>
            {artist.image}
          </div>
          <h3 className="text-3xl font-bold text-yellow-300 mb-2">{artist.name}</h3>
          <p className="text-orange-300 text-lg">{artist.role}</p>
        </div>
        
        <div className={`grid transition-all duration-500 ease-in-out ${isActive ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
            <div className="overflow-hidden">
              <p className="text-gray-300 mb-6 leading-relaxed">{artist.bio}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {artist.skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-yellow-500/20 rounded-full text-sm border border-yellow-500/50 text-yellow-300">
                    {skill}
                  </span>
                ))}
              </div>
              {artist.instagram && (
                <div className="mt-6 flex justify-center">
                    <a
                        href={artist.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${artist.name} on Instagram`}
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-pink-500 transition-colors p-2 rounded-lg hover:bg-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Instagram size={24} />
                        <span className="font-semibold">Follow on Instagram</span>
                    </a>
                </div>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

// Extracted component to fix hook error
const PricingTierCard: React.FC<{ tier: PricingTier; delay: number }> = ({ tier, delay }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref, { triggerOnce: true });

    return (
        <div ref={ref} className={`bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-lg rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-400 transition-all hover:scale-105 flex flex-col scroll-animate ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
          <h3 className="text-xl font-bold text-yellow-300 mb-2 h-14">{tier.type}</h3>
          <div className="mb-4">
            <span className="text-4xl font-bold text-white">₹{tier.perHour.toLocaleString('en-IN')}</span>
            <span className="text-gray-400 text-sm block">per hour</span>
          </div>
          <div className="flex items-center gap-2 text-orange-300 mb-4">
            <Users size={18} />
            <span>{tier.audience} guests</span>
          </div>
          <ul className="space-y-2 flex-grow">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300">
                <Star size={16} className="text-yellow-400 mt-1 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
    );
};

// Extracted component to fix hook error
const TestimonialCard: React.FC<{ testimonial: Testimonial; delay: number }> = ({ testimonial, delay }) => {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIsVisible(ref, { triggerOnce: true });

    return (
        <div ref={ref} className={`bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-lg rounded-xl p-6 border border-yellow-500/20 hover:border-yellow-400/50 transition-all scroll-animate ${isVisible ? 'is-visible' : ''}`} style={{ transitionDelay: `${delay}ms` }}>
          <div className="flex items-start gap-4">
            <Quote className="text-yellow-400 flex-shrink-0" size={32} />
            <div className="flex-1">
              <p className="text-gray-300 mb-4 italic">"{testimonial.message}"</p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-bold text-yellow-300">{testimonial.name}</p>
                  <p className="text-sm text-gray-400">{new Date(testimonial.date).toLocaleDateString('en-IN', {year: 'numeric', month: 'long', day: 'numeric'})}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};


const NafasPortfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('home');
  const [activeArtist, setActiveArtist] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: '', email: '', phone: '', eventType: 'get-together', 
    date: '', audience: '15', hours: '2'
  });
  
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>({
    name: '', message: '', rating: 5
  });

  const [ratingHover, setRatingHover] = useState<number>(0);
  const [testimonialSubmissionStatus, setTestimonialSubmissionStatus] = useState<'idle' | 'submitting' | 'submitted'>('idle');
  
  const [bookingRequestReady, setBookingRequestReady] = useState<boolean>(false);

  const minBookingDate = new Date().toISOString().split('T')[0];

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [testimonialError, setTestimonialError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
        try {
            const response = await fetch('/api/testimonials');
            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }
            const data = await response.json();
            setTestimonials(data);
            setTestimonialError(null);
        } catch (error) {
            console.error(error);
            setTestimonialError('Could not load testimonials. Please try again later.');
        } finally {
            setIsLoadingTestimonials(false);
        }
    };

    if (activeSection === 'testimonials') {
      fetchTestimonials();
    }
  }, [activeSection]);


  const artists: Artist[] = [
    {
      id: 1,
      name: 'Sanna Sakil',
      role: 'Lead Vocalist',
      bio: 'A versatile vocalist whose intricate melodies and harmonies form the backbone of Nafas. His passion for fusion creates a unique and captivating soundscape. A voice that holds melancholic weightage and love just as Arijit Singh and Atif Aslam.',
      image: '👨🏻‍🎤',
      skills: ['Bollywood Hits', 'Soulful Vocals', 'Soothing Voice'],
      instagram: 'https://www.instagram.com/sakilsanna/'
    },
    {
      id: 2,
      name: 'Sheikh Sabir Ali',
      role: 'Guitarist & Vocalist',
      image: '👨🏻‍🎤',
      bio: 'A masterful guitarist and soulful vocalist, Sheikh Sabir Ali lays down the rhythmic and harmonic foundation for Nafas. His intricate fingerstyle and emotive vocals add depth and energy to their performances.',
      skills: ['Acoustic & Electric Guitar', 'Vocal Harmonies', 'Song Arrangement', 'Rhythm Guitar'],
      instagram: 'https://www.instagram.com/sabirishere/'
    }
  ];

  const pricingTiers: PricingTier[] = [
    {
      type: 'Private Get-Together and Reunion',
      perHour: 9000,
      minHours: 1,
      audience: '4-30',
      features: ['Minimum 2 hours booking', 'Raw acoustic jamming (no mics/sound needed)', '2 artists']
    },
    {
      type: 'Private Big Events',
      perHour: 12500,
      minHours: 1,
      audience: '30-100',
      features: ['Minimum 2 hours booking', 'Live performance', 'Song requests accepted beforehand', '2 artists', 'Mics & sound system by venue']
    },
    {
      type: 'Cafe & Restaurant Gigs',
      perHour: 14999,
      minHours: 1,
      audience: '∞ (Venue Capacity)',
      features: ['Minimum 2 hours booking', 'Live acoustic jamming', '2 artists', 'Mics & sound system by venue']
    },
    {
      type: 'Corporate Events',
      perHour: 16000,
      minHours: 1,
      audience: '100-200',
      features: ['Minimum 2 hours booking', 'Professional live performance', 'Song requests accepted beforehand', '2 artists', 'Mics & sound system by venue']
    },
    {
      type: 'Weddings & Large Events',
      perHour: 23000,
      minHours: 1,
      audience: '200+',
      features: ['Minimum 2 hours booking', 'Full evening performance', 'Multiple song sets', 'Song requests accepted beforehand', '2 artists', 'Mics & sound system by venue']
    }
  ];
  
  const audienceLimits = {
    'get-together': { min: 4, max: 30, default: 15 },
    'private-event': { min: 31, max: 100, default: 50 },
    'cafe-gig': { min: 10, max: 99999, default: 40 },
    'corporate': { min: 101, max: 200, default: 150 },
    'wedding': { min: 201, max: 1000, default: 250 }
  };
  
  // Refs for animations
  const homeHeroRef = useRef<HTMLDivElement>(null);
  const isHomeHeroVisible = useIsVisible(homeHeroRef, { triggerOnce: true });

  const artistsTitleRef = useRef<HTMLHeadingElement>(null);
  const isArtistsTitleVisible = useIsVisible(artistsTitleRef, { triggerOnce: true });

  const bookingTitleRef = useRef<HTMLHeadingElement>(null);
  const isBookingTitleVisible = useIsVisible(bookingTitleRef, { triggerOnce: true });
  const bookingPoliciesRef = useRef<HTMLDivElement>(null);
  const isBookingPoliciesVisible = useIsVisible(bookingPoliciesRef, { triggerOnce: true });
  const bookingFormRef = useRef<HTMLDivElement>(null);
  const isBookingFormVisible = useIsVisible(bookingFormRef, { triggerOnce: true });

  const testimonialsTitleRef = useRef<HTMLHeadingElement>(null);
  const isTestimonialsTitleVisible = useIsVisible(testimonialsTitleRef, { triggerOnce: true });
  const testimonialFormRef = useRef<HTMLDivElement>(null);
  const isTestimonialFormVisible = useIsVisible(testimonialFormRef, { triggerOnce: true });


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let particles: Particle[] = [];
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      
      draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
    
    let animationFrameId: number;
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 5, 25, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const getCurrentTierIndex = () => {
    switch(bookingForm.eventType) {
      case 'get-together': return 0;
      case 'private-event': return 1;
      case 'cafe-gig': return 2;
      case 'corporate': return 3;
      case 'wedding': return 4;
      default: return 0;
    }
  }

  const calculatePrice = () => {
    const hours = parseInt(bookingForm.hours) || 0;
    const tierIndex = getCurrentTierIndex();
    const tier = pricingTiers[tierIndex];

    const effectiveHours = Math.max(hours, tier.minHours);

    if (effectiveHours === 1) {
      return tier.perHour + 1000;
    }
    
    return tier.perHour * effectiveHours;
  };

  const getSoundSystemNote = () => {
    const tierIndex = getCurrentTierIndex();
    if (tierIndex >= 1) {
      return "Please note: You are responsible for providing a professional microphone and sound system for this event if required.";
    } else {
      return "This is a raw acoustic jamming session. No microphones or sound system are needed.";
    }
  };

  const formatEventType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  const getBookingDetailsText = () => {
    const price = calculatePrice();
    const advance = price / 2;

    const formattedDate = bookingForm.date 
        ? new Date(bookingForm.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'Awaiting confirmation';

    const bodyLines = [
      `Hello Nafas Team,`,
      ``,
      `I would love to book you for an upcoming event. Please find the details of my request below for your consideration.`,
      ``,
      `--- BOOKING DETAILS ---`,
      `• Event Type: ${formatEventType(bookingForm.eventType)}`,
      `• Preferred Date: ${formattedDate}`,
      `• Number of Guests: ${bookingForm.audience}`,
      `• Performance Duration: ${bookingForm.hours} hours`,
      ``,
      `--- MY CONTACT INFORMATION ---`,
      `• Name: ${bookingForm.name}`,
      `• Email: ${bookingForm.email}`,
      `• Phone: ${bookingForm.phone || 'Not provided'}`,
      ``,
      `--- PRELIMINARY ESTIMATE ---`,
      `Based on the website's calculator, the estimated cost is ₹${price.toLocaleString('en-IN')}, with a 50% advance of ₹${advance.toLocaleString('en-IN')} to confirm.`,
      `(${getSoundSystemNote()})`,
      ``,
      `--- NEXT STEPS ---`,
      `I understand this is a preliminary request and look forward to hearing from you within 24 hours to confirm availability and finalize the details.`,
      ``,
      `If I don't receive a reply in that time, I will reach out via WhatsApp (8347896010) or call 7980389399.`,
      ``,
      `Thank you,`,
      `${bookingForm.name}`
    ];
    return bodyLines.join('\n');
  }

  const handleBookingSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || !bookingForm.date) {
      alert("Please fill in your name, email, and the event date.");
      return;
    }
    setBookingRequestReady(true);
  };
  
  const handleSendEmail = () => {
    const recipientEmail = 'sannasakil92@gmail.com';
    const formattedDateForSubject = bookingForm.date 
        ? new Date(bookingForm.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
        : 'Future Event';

    const subject = `Booking Inquiry for Nafas: ${formatEventType(bookingForm.eventType)} on ${formattedDateForSubject}`;
    const body = getBookingDetailsText();
    const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleSendWhatsApp = () => {
      const phoneNumber = '918347896010';
      const body = getBookingDetailsText();
      const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(body)}`;
      window.open(whatsappLink, '_blank');
  };


  const handleTestimonialSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
     if (!testimonialForm.name || !testimonialForm.message) {
      alert("Please fill in your name and message.");
      return;
    }
    setTestimonialSubmissionStatus('submitting');
    
    try {
        const response = await fetch('/api/testimonials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testimonialForm),
        });

        if (!response.ok) {
            throw new Error('Failed to submit testimonial');
        }

        const newTestimonial = await response.json();

        setTestimonials(prev => [newTestimonial, ...prev]);
        setTestimonialForm({ name: '', message: '', rating: 5 });
        setTestimonialSubmissionStatus('submitted');

        setTimeout(() => {
          setTestimonialSubmissionStatus('idle');
        }, 4000);

    } catch (error) {
        console.error(error);
        alert('Sorry, there was an error submitting your testimonial. Please try again.');
        setTestimonialSubmissionStatus('idle');
    }
  };
  
  const handleBookingFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      
      setBookingForm(prev => {
        let newFormState: BookingForm = { ...prev, [name]: value };

        if (name === 'eventType') {
          const limits = audienceLimits[value as keyof typeof audienceLimits];
          newFormState.audience = String(limits.default);
          newFormState.hours = '2';
        }
        
        if (name === 'audience') {
            const audienceNum = parseInt(value, 10);

            if (!isNaN(audienceNum) && prev.eventType !== 'cafe-gig') {
                let newEventType: BookingForm['eventType'] = prev.eventType;

                if (audienceNum <= audienceLimits['get-together'].max) {
                    newEventType = 'get-together';
                } else if (audienceNum <= audienceLimits['private-event'].max) {
                    newEventType = 'private-event';
                } else if (audienceNum <= audienceLimits['corporate'].max) {
                    newEventType = 'corporate';
                } else {
                    newEventType = 'wedding';
                }
                
                if (newEventType !== prev.eventType) {
                    newFormState.eventType = newEventType;
                    newFormState.hours = '2';
                }
            }
        }
        
        return newFormState;
      });
  }
  
  const handleAudienceBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const limits = audienceLimits[bookingForm.eventType];
    let audienceNum = parseInt(e.target.value, 10);
    
    if (isNaN(audienceNum)) {
        audienceNum = limits.min;
    }

    let clampedValue = audienceNum;
    if (audienceNum < limits.min) {
        clampedValue = limits.min;
    } else if (audienceNum > limits.max) {
        clampedValue = limits.max;
    }

    if (String(clampedValue) !== e.target.value) {
        setBookingForm(prev => ({ ...prev, audience: String(clampedValue) }));
    }
  };

  const handleHoursBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const tier = pricingTiers[getCurrentTierIndex()];
    let hoursNum = parseInt(e.target.value, 10);
    
    if (isNaN(hoursNum) || hoursNum < tier.minHours) {
        hoursNum = tier.minHours;
    }

    if (String(hoursNum) !== e.target.value) {
        setBookingForm(prev => ({ ...prev, hours: String(hoursNum) }));
    }
  };

  const handleTestimonialFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setTestimonialForm(prev => ({ ...prev, [name]: value }));
  }

  const formattedBookingDate = bookingForm.date
    ? new Date(bookingForm.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Not specified';

  const navigateToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    // Optionally, scroll to the section
    // document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const CelebrationParticles: React.FC = () => {
    return (
      <>
        <style>{`
          @keyframes particle-fall {
            from {
              transform: translateY(-10vh) scale(0.5);
              opacity: 1;
            }
            to {
              transform: translateY(40vh) scale(1);
              opacity: 0;
            }
          }
          .celebration-particle {
            position: absolute;
            top: 0;
            background-color: #fde047; /* yellow-300 */
            border-radius: 50%;
            box-shadow: 0 0 10px #facc15, 0 0 20px #f59e0b; /* yellow-400, amber-500 glow */
            animation-name: particle-fall;
            animation-timing-function: linear;
            animation-iteration-count: 1;
            pointer-events: none;
          }
        `}</style>
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className="celebration-particle"
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 2}px`,
                height: `${Math.random() * 3 + 2}px`,
                animationDuration: `${Math.random() * 2 + 3}s`,
                animationDelay: `${Math.random() * 1}s`,
              }}
            />
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-purple-900 text-white font-[sans-serif] overflow-x-hidden">
      <style>{`
          .scroll-animate {
            opacity: 0;
            transform: translateY(2rem);
            transition: opacity 0.7s cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.7s cubic-bezier(0.645, 0.045, 0.355, 1);
            will-change: opacity, transform;
          }
          .scroll-animate.is-visible {
            opacity: 1;
            transform: translateY(0);
          }
      `}</style>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      
      {/* Navigation */}
      <nav className="relative z-50 bg-black/30 backdrop-blur-md border-b border-yellow-500/20 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Music className="w-8 h-8 text-yellow-400 animate-pulse" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Nafas</h1>
            </div>
            
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-yellow-400">
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            
            <div className={`${menuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-0 flex-col md:flex-row gap-2 md:gap-6 bg-black/90 md:bg-transparent p-4 md:p-0 z-50`}>
              {['home', 'artists', 'booking', 'testimonials'].map(section => (
                <button
                  key={section}
                  onClick={() => { setActiveSection(section); setMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg transition-all capitalize w-full md:w-auto text-left md:text-center ${activeSection === section ? 'bg-yellow-500 text-black' : 'hover:bg-yellow-500/20'}`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Home Section */}
        {activeSection === 'home' && (
          <section id="home" className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
            <div ref={homeHeroRef} className={`text-center max-w-4xl scroll-animate ${isHomeHeroVisible ? 'is-visible' : ''}`}>
              <div className="mb-8 animate-bounce" style={{animationDuration: '2s'}}>
                <div className="text-9xl">🎸</div>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 bg-clip-text text-transparent">Nafas</h2>
              <p className="text-2xl md:text-3xl mb-4 text-yellow-200">Where Souls Meet Melody</p>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">Experience the magical fusion of Sufi mysticism and Bollywood charm. Two voices, one soul, infinite emotions.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button onClick={() => setActiveSection('booking')} className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/50">
                  Book Now
                </button>
                <button onClick={() => setActiveSection('artists')} className="px-8 py-4 bg-white/10 backdrop-blur-sm rounded-full font-bold text-lg hover:bg-white/20 transition-all border border-yellow-500/50">
                  Meet the Artists
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Artists Section */}
        {activeSection === 'artists' && (
          <section id="artists" className="min-h-screen py-20 px-4">
            <h2 ref={artistsTitleRef} className={`text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent scroll-animate ${isArtistsTitleVisible ? 'is-visible' : ''}`}>The Souls Behind Nafas</h2>
            
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
              {artists.map((artist, index) => (
                <ArtistCard
                  key={artist.id}
                  artist={artist}
                  isActive={activeArtist === artist.id}
                  onClick={() => setActiveArtist(activeArtist === artist.id ? null : artist.id)}
                  delay={index === 1 ? 200 : 0}
                />
              ))}
            </div>
          </section>
        )}

        {/* Booking Section */}
        {activeSection === 'booking' && (
          <section id="booking" className="min-h-screen py-20 px-4">
            <h2 ref={bookingTitleRef} className={`text-5xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent scroll-animate ${isBookingTitleVisible ? 'is-visible' : ''}`}>Book Nafas</h2>
            <p className={`text-center text-gray-300 mb-16 text-lg scroll-animate ${isBookingTitleVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>Let us make your event unforgettable</p>
            
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 xl:grid-cols-5 gap-8 mb-16">
              {pricingTiers.map((tier, idx) => (
                <PricingTierCard key={idx} tier={tier} delay={idx * 100} />
              ))}
            </div>

            <div ref={bookingPoliciesRef} className={`max-w-4xl mx-auto bg-black/20 border border-yellow-500/30 rounded-lg p-6 mb-12 scroll-animate ${isBookingPoliciesVisible ? 'is-visible' : ''}`}>
              <h3 className="text-2xl font-bold text-yellow-300 mb-4 text-center">Important Booking Policies</h3>
              <ul className="text-gray-300 space-y-2 list-disc list-inside text-left max-w-2xl mx-auto">
                <li>Please finalize the exact timing and dates beforehand to avoid scheduling conflicts.</li>
                <li>A 50% advance payment is required to reserve your date and confirm the booking.</li>
                <li>Once a booking is confirmed with an advance payment, the date is final and cannot be changed or rescheduled.</li>
                <li>The standard minimum booking duration is 2 hours. A 1-hour express booking is available with a ₹1,000 surcharge.</li>
                <li>Overtime is charged per hour at the tier's rate plus an additional ₹1,000 (e.g., if the hourly rate is ₹9,000, one hour of overtime will be billed at ₹10,000).</li>
              </ul>
            </div>


            <div ref={bookingFormRef} className={`max-w-2xl mx-auto bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 scroll-animate ${isBookingFormVisible ? 'is-visible' : ''}`}>
              {!bookingRequestReady ? (
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <input name="name" type="text" placeholder="Your Name" value={bookingForm.name} onChange={handleBookingFormChange} className="bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                    <input name="email" type="email" placeholder="Email" value={bookingForm.email} onChange={handleBookingFormChange} className="bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                  </div>
                  <input name="phone" type="tel" placeholder="Phone Number" value={bookingForm.phone} onChange={handleBookingFormChange} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Event Type</label>
                      <select name="eventType" value={bookingForm.eventType} onChange={handleBookingFormChange} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none appearance-none">
                        <option value="get-together">Get-Together</option>
                        <option value="private-event">Private Event</option>
                        <option value="cafe-gig">Cafe/Restaurant Gig</option>
                        <option value="corporate">Corporate Event</option>
                        <option value="wedding">Wedding/Large Event</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">
                        Audience Size {bookingForm.eventType === 'cafe-gig' && <span className="text-yellow-400 text-lg font-bold ml-1">∞</span>}
                      </label>
                      <input name="audience" type="number" value={bookingForm.audience} onChange={handleBookingFormChange} onBlur={handleAudienceBlur} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Duration (hrs)</label>
                      <input name="hours" type="number" value={bookingForm.hours} onChange={handleBookingFormChange} onBlur={handleHoursBlur} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                    </div>
                  </div>
                  <input name="date" type="date" value={bookingForm.date} onChange={handleBookingFormChange} min={minBookingDate} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                    <p className="text-yellow-300 font-semibold text-lg">Estimated Cost: ₹{calculatePrice().toLocaleString('en-IN')}</p>
                    {parseInt(bookingForm.hours) === 1 && (
                      <p className="text-xs text-yellow-300 mt-1">(Includes ₹1,000 surcharge for 1-hour event)</p>
                    )}
                    <p className="text-sm text-gray-400 mt-1">Final price may vary based on requirements.</p>
                    <p className="text-sm text-yellow-400 font-semibold mt-2">50% advance (₹{(calculatePrice() / 2).toLocaleString('en-IN')}) required to confirm booking.</p>
                    <p className="text-xs text-gray-500 mt-2">{getSoundSystemNote()}</p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={!bookingForm.name || !bookingForm.email || !bookingForm.date}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-yellow-500/50 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                  >
                    <Send size={20} /> Request Booking
                  </button>
                </form>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center space-y-4 transition-all duration-500">
                  <h3 className="text-2xl font-bold text-green-300">Thank you, {bookingForm.name}!</h3>
                  <p className="text-gray-300">Please review your details below and send your booking inquiry. We're excited to hear from you!</p>
                  
                  <div className="text-left bg-black/20 p-4 rounded-lg border border-yellow-500/20 space-y-2">
                      <p><span className="font-semibold text-gray-400">Event:</span> <span className="text-white">{formatEventType(bookingForm.eventType)}</span></p>
                      <p><span className="font-semibold text-gray-400">Date:</span> <span className="text-white">{formattedBookingDate}</span></p>
                      <p><span className="font-semibold text-gray-400">Estimated Cost:</span> <span className="text-white">₹{calculatePrice().toLocaleString('en-IN')}</span></p>
                  </div>

                  <p className="text-sm text-gray-400">Choose your preferred method to send:</p>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      type="button"
                      onClick={handleSendEmail}
                      className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail size={20} /> Send via Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSendWhatsApp}
                      className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={20} /> Send via WhatsApp
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBookingRequestReady(false)}
                    className="text-gray-400 hover:text-white text-sm pt-2"
                  >
                    Edit Booking Details
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Testimonials Section */}
        {activeSection === 'testimonials' && (
          <section id="testimonials" className="min-h-screen py-20 px-4">
            <h2 ref={testimonialsTitleRef} className={`text-5xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent scroll-animate ${isTestimonialsTitleVisible ? 'is-visible' : ''}`}>What People Say</h2>
            <p className={`text-center text-gray-300 mb-16 text-lg scroll-animate ${isTestimonialsTitleVisible ? 'is-visible' : ''}`} style={{ transitionDelay: '100ms' }}>Hear from those who experienced the magic</p>
            
            <div className="max-w-4xl mx-auto mb-16">
              <div ref={testimonialFormRef} className={`bg-gradient-to-br from-purple-900/70 to-indigo-900/70 backdrop-blur-lg rounded-2xl p-8 border border-yellow-500/30 mb-8 scroll-animate ${isTestimonialFormVisible ? 'is-visible' : ''}`}>
                <h3 className="text-2xl font-bold text-yellow-300 mb-6">Share Your Experience</h3>
                {testimonialSubmissionStatus === 'submitted' ? (
                  <div className="relative text-center py-8 bg-green-500/10 border border-green-400/50 rounded-lg transition-all duration-300 overflow-hidden">
                    <CelebrationParticles />
                    <div className="relative z-10">
                      <CheckCircle size={48} className="mx-auto text-green-400 mb-4 animate-pulse" />
                      <h4 className="text-xl font-bold text-green-300">Thank You!</h4>
                      <p className="text-gray-300 mt-2">Your feedback is invaluable to us.</p>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4">
                    <input name="name" type="text" placeholder="Your Name" value={testimonialForm.name} onChange={handleTestimonialFormChange} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none" />
                    <textarea name="message" placeholder="Your testimonial..." rows={4} value={testimonialForm.message} onChange={handleTestimonialFormChange} className="w-full bg-black/30 border border-yellow-500/30 rounded-lg px-4 py-3 focus:border-yellow-400 focus:outline-none resize-none" />
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300">Your Rating:</span>
                      <div className="flex gap-1" onMouseLeave={() => setRatingHover(0)}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star
                            key={star}
                            size={24}
                            className={`cursor-pointer transition-all duration-150 ${star <= (ratingHover || testimonialForm.rating) ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-500'}`}
                            onClick={() => setTestimonialForm({ ...testimonialForm, rating: star })}
                            onMouseEnter={() => setRatingHover(star)}
                          />
                        ))}
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleTestimonialSubmit} 
                      disabled={testimonialSubmissionStatus === 'submitting'}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg shadow-yellow-500/50 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                    >
                      {testimonialSubmissionStatus === 'submitting' && <LoaderCircle size={20} className="animate-spin" />}
                      Submit Testimonial
                    </button>
                  </form>
                )}
              </div>

              <div className="space-y-6">
                {isLoadingTestimonials && (
                  <div className="flex justify-center items-center gap-3 text-yellow-300 py-8">
                    <LoaderCircle size={24} className="animate-spin" />
                    <p className="text-lg">Loading testimonials...</p>
                  </div>
                )}
                {testimonialError && <p className="text-center text-red-400 py-8">{testimonialError}</p>}
                {!isLoadingTestimonials && !testimonialError && testimonials.length === 0 && (
                   <p className="text-center text-gray-400 py-8">Be the first to leave a testimonial!</p>
                )}
                {!isLoadingTestimonials && !testimonialError && testimonials.map((testimonial, index) => (
                   <TestimonialCard key={testimonial.id} testimonial={testimonial} delay={index * 150} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-md border-t border-yellow-500/20 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="text-red-500" size={24} />
            <span className="text-xl text-gray-300">Made with soul and passion</span>
          </div>
          <p className="text-gray-400">© 2024 Nafas - All Rights Reserved</p>
          <p className="text-orange-300 font-semibold mt-4">Refund and Reschedule is not available in case of anything</p>
          <div className="text-sm text-gray-500 mt-4 flex justify-center items-center gap-x-6 gap-y-2 flex-wrap">
              <a href="mailto:sannasakil92@gmail.com" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <Mail size={18} />
                <span>sannasakil92@gmail.com</span>
              </a>
              <a href="https://wa.me/918347896010" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <MessageSquare size={18} />
                <span>8347896010</span>
              </a>
              <a href="tel:7980389399" className="flex items-center gap-2 hover:text-yellow-300 transition-colors">
                <Phone size={18} />
                <span>7980389399</span>
              </a>
            </div>
        </div>
      </footer>
      <Chatbot navigateToSection={navigateToSection} />
    </div>
  );
};

export default NafasPortfolio;