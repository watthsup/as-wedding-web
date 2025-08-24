import type { Route } from "./+types/home";
import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCountdown } from "../hooks/useCountdown";
import { fromZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { config } from "../configs";
import { RSVPForm } from "../components/RSVPForm";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "22 NOV 2025 - " + config.name },
    { name: "description", content: "Join us for our special day!" },
  ];
}

export default function Home() {
  // Wedding date setup
  const weddingDate = useMemo(() => {
    return fromZonedTime(config.weddingDate, "Asia/Bangkok");
  }, []);

  // Helper functions for calendar functionality
  const downloadICalFile = (startDate: Date, endDate: Date) => {
    try {
      const icalData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Wedding Website//Calendar Event//EN',
        'BEGIN:VEVENT',
        `DTSTART:${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `DTEND:${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
        `SUMMARY:${config.name} Wedding`,
        `DESCRIPTION:Join us for our special day at ${config.venue.name}\\n\\nWedding Website: https://as-wedding-web.vercel.app/`,
        `LOCATION:${config.venue.name}`,
        // Add multiple reminder notifications
        'BEGIN:VALARM',
        'TRIGGER:-P1D',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Wedding tomorrow!',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT1H',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Wedding in 1 hour!',
        'END:VALARM',
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Wedding in 15 minutes!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');
      
      const blob = new Blob([icalData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${config.name.replace(/\s+/g, '_')}_Wedding.ics`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error creating iCal file:', error);
      alert('Unable to create calendar file. Please try again.');
    }
  };

  const openGoogleCalendar = (startDate: Date, endDate: Date) => {
    try {
      // Format time for title (e.g., "6:00 PM")
      const timeString = startDate.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
      
      const event = {
        title: `[${timeString}] ${config.name} Wedding`,
        start: startDate,
        end: endDate,
        description: `Join us for our special day at ${config.venue.name}\n\nWedding Website: https://as-wedding-web.vercel.app/`,
        location: config.venue.name,
      };
      
      // Google Calendar with proper date and time from config, plus 1 day before reminder at 6 PM
      const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=20251122/20251122&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&reminders=popup,1440`;
      
      window.open(googleUrl, '_blank');
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      // Fallback to iCal download
      downloadICalFile(startDate, endDate);
    }
  };

  const timeLeft = useCountdown(weddingDate);

  const formattedWeddingDate = useMemo(() => {
    return format(weddingDate, "EEEE, d MMMM yyyy");
  }, [weddingDate]);

  const formattedWeddingTime = useMemo(() => {
    return "at Six o'clock in the Evening";
  }, []);

  // Image slideshow state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    "/2.jpg",
    "/9.jpg",
    "/5.jpg",
    "/10.jpg",
    "/3.jpg",
    "/14.jpg",
    "/11.jpg",
    "/12.jpg",
  ];

  // Preload images for smooth transitions
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Auto-advance slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Scroll navigation state
  const [activeSection, setActiveSection] = useState(0);
  const sections = ["hero", "countdown", "location", "rsvp-form"];

  // Scroll to section function
  const scrollToSection = (sectionId: string, index: number) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(index);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(index);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #F5F1EB 0%, #F9F7F4 100%)",
      }}
    >


      {/* Section 1: Hero - Bride & Groom Image Slideshow */}
      <section
        id="hero"
        className="scroll-section relative min-h-screen overflow-hidden"
      >
        {/* Image Slideshow */}
        <div className="absolute inset-0">
          {images.map((image, index) => (
            <motion.div
              key={image}
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{
                opacity: index === currentImageIndex ? 1 : 0,
                scale: index === currentImageIndex ? 1 : 1.1,
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Left Navigation Arrow */}
        <button
          onClick={() => setCurrentImageIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
          )}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous image"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => setCurrentImageIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
          )}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next image"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Slideshow indicators */}
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-20">
          <div className="slideshow-indicators flex space-x-2 md:space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-500 ${
                  index === currentImageIndex
                    ? "bg-white scale-125 shadow-lg"
                    : "bg-white/50 hover:bg-white/75 hover:scale-110"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/10" />

        <motion.div
          className="relative z-10 flex flex-col min-h-screen text-white px-6"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          {/* Names positioned at top on mobile/tablet, center on desktop */}
          <motion.div
            className="text-center pt-16 lg:pt-0 lg:flex-1 lg:flex lg:items-center lg:justify-center"
            variants={fadeInUp}
          >
            <div>
              <div className="w-16 h-px bg-white/40 mx-auto mb-6 md:mb-8"></div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-serif font-extralight tracking-wider mb-3 md:mb-4">
                {config.name}
              </h1>
              <div className="w-16 h-px bg-white/40 mx-auto mt-6 md:mt-8 mb-4 md:mb-6"></div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-widest uppercase opacity-90">
                Together Forever
              </p>
            </div>
          </motion.div>

          {/* Scroll indicator - positioned at bottom */}
          <motion.div
            className="absolute bottom-8 md:bottom-12 left-0 right-0 text-center"
            variants={fadeInUp}
          >
            <motion.button
              onClick={() => scrollToSection("countdown", 1)}
              className="cursor-pointer focus:outline-none"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6 mx-auto text-white opacity-70 hover:opacity-100 transition-opacity"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
              <p className="text-xs font-light tracking-widest uppercase mt-1 md:mt-2 opacity-70">
                Scroll to explore
              </p>
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 2: Countdown & RSVP */}
      <section
        id="countdown"
        className="scroll-section min-h-screen flex items-center justify-center px-6 py-20"
      >
        <motion.div
          className="text-center max-w-6xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
          style={{ color: "#6B5B47" }}
        >
          <motion.div className="mb-8" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide">
              Our Wedding Day
            </h2>
            <div
              className="w-20 h-px mx-auto mb-8"
              style={{ backgroundColor: "#8B7355" }}
            ></div>
            <p className="text-xl md:text-3xl font-light mb-4 tracking-wide">
              {formattedWeddingDate}
            </p>
            <p className="text-base font-light opacity-80 tracking-wider">
              {formattedWeddingTime} • {config.location}
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center">
            <fieldset
              className="relative rounded-2xl px-6 py-4 mb-12 inline-block"
              style={{
                border: "1px solid #6B5B47",
              }}
            >
              <legend
                className="px-3 text-lg font-light tracking-wide"
                style={{ color: "#6B5B47" }}
              >
                Wedding Theme
              </legend>
              <div className="flex items-center space-x-3 mt-1">
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#f4dddb" }}
                  title="#f4dddb"
                ></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#e4d0cb" }}
                  title="#e4d0cb"
                ></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#c8a6a0" }}
                  title="#c8a6a0"
                ></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#f3e8d2" }}
                  title="#f3e8d2"
                ></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#b29b88" }}
                  title="#b29b88"
                ></div>
                <div
                  className="w-5 h-5 rounded-full"
                  style={{ backgroundColor: "#8a6b54" }}
                  title="#8a6b54"
                ></div>
              </div>
            </fieldset>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16"
            variants={staggerChildren}
          >
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <motion.div key={item.label} variants={fadeInUp}>
                <div
                  className="backdrop-blur-sm rounded-3xl p-8 md:p-10 text-center shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
                  style={{
                    backgroundColor: "#F9F7F4",
                    border: "1px solid #E8E0D6",
                  }}
                >
                  <motion.div
                    className="text-3xl md:text-5xl font-extralight tabular-nums mb-3"
                    style={{ color: "#8B7355" }}
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.value.toString().padStart(2, "0")}
                  </motion.div>
                  <div
                    className="text-sm font-light tracking-widest uppercase opacity-70"
                    style={{ color: "#A68B5B" }}
                  >
                    {item.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="text-center flex flex-col sm:flex-row items-center gap-6"
            variants={fadeInUp}
          >
            {/* Smart Add to Calendar Button */}
            <motion.button
              onClick={() => {
                try {
                  const startDate = new Date(config.weddingDate);
                  const endDate = new Date(startDate.getTime() + 4 * 60 * 60 * 1000);
                  
                  // Detect platform and device type
                  const userAgent = navigator.userAgent.toLowerCase();
                  const isMobile = /mobile|android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
                  const isIOS = /iphone|ipad|ipod/i.test(userAgent);
                  const isAndroid = /android/i.test(userAgent);
                  const isMac = /macintosh|mac os x/i.test(userAgent);
                  
                  // Platform detection logic
                  if (isIOS || isMac) {
                    // iOS/Mac users - download iCal file (best experience)
                    downloadICalFile(startDate, endDate);
                  } else if (isAndroid) {
                    // Android users - try Google Calendar first, fallback to iCal
                    openGoogleCalendar(startDate, endDate);
                  } else if (isMobile) {
                    // Other mobile devices - download iCal file (universal)
                    downloadICalFile(startDate, endDate);
                  } else {
                    // Desktop users - try Google Calendar first, fallback to iCal
                    openGoogleCalendar(startDate, endDate);
                  }
                } catch (error) {
                  console.error('Error detecting platform:', error);
                  // Fallback: download iCal file (works everywhere)
                  downloadICalFile(new Date(config.weddingDate), new Date(new Date(config.weddingDate).getTime() + 4 * 60 * 60 * 1000));
                }
              }}
              className="inline-flex items-center justify-center bg-white border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-12 py-5 rounded-full font-light text-lg tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Add to Calendar</span>
            </motion.button>

            {/* RSVP Now Button */}
            <motion.a
              href="#rsvp-form"
              className="inline-flex items-center justify-center text-white px-16 py-5 rounded-full font-light text-lg tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
              style={{
                backgroundColor: "#8B7355",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#6B5B47")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.backgroundColor = "#8B7355")
              }
            >
              <span>RSVP Now</span>
              <motion.svg
                className="w-5 h-5 ml-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 3: Location & Map */}
      <section
        id="location"
        className="scroll-section min-h-screen flex items-center justify-center px-6 py-20"
        style={{ backgroundColor: "#F9F7F4" }}
      >
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div className="mb-16" variants={fadeInUp}>
            <h2
              className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide"
              style={{ color: "#6B5B47" }}
            >
              Wedding Location
            </h2>
            <div
              className="w-20 h-px mx-auto mb-8"
              style={{ backgroundColor: "#8B7355" }}
            ></div>
            <p className="text-xl font-light mb-4" style={{ color: "#6B5B47" }}>
              {config.venue.name}
            </p>
            <p className="text-lg font-light mb-8" style={{ color: "#A68B5B" }}>
              {config.venue.address}
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-12"
            variants={fadeInUp}
          >
            <div className="aspect-w-16 aspect-h-9 h-96 md:h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.41677881696!2d100.7240468!3d13.722985099999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d6726f5f65a13%3A0x7cc19760143e1d2!2sThe%20Park%20Nine%20Hotel%20Suvarnabhumi!5e1!3m2!1sen!2sth!4v1756030301464!5m2!1sen!2sth"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3xl"
              ></iframe>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <motion.a
              href={config.locationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-white border-2 border-[#8B7355] text-[#8B7355] hover:bg-[#8B7355] hover:text-white px-12 py-4 rounded-full font-light text-lg tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Open in Google Maps</span>
            </motion.a>
          </motion.div>
        </motion.div>
      </section>

      {/* Section 4: RSVP Form */}
      <section
        id="rsvp-form"
        className="scroll-section min-h-screen flex items-center justify-center px-6 py-20 bg-gradient-to-br from-[#F5F1EB] to-[#F9F7F4]"
      >
        <motion.div
          className="max-w-2xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif font-light mb-6 tracking-wide text-[#8B7355]">
              RSVP
            </h2>
            <div className="w-20 h-px bg-[#8B7355] mx-auto mb-8"></div>
            <p className="text-lg font-light text-[#8B7355]">
              Please let us know if you'll be joining our celebration
            </p>
          </motion.div>

          <RSVPForm />
          {/* Contact Information */}
          <div className="text-center mt-8">
            <p className="text-lg font-light text-[#8B7355]">
              Contact Information
            </p>
            <p className="text-sm font-light text-[#8B7355]">
              {config.contact.phone}
            </p>
            <p className="text-sm font-light text-[#8B7355]">
              {config.contact.email}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
