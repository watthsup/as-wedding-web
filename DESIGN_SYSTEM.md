# Wedding RSVP Website - Design System & Mood/Tone Guide

## 🎨 **Overall Mood & Tone**

### **Primary Aesthetic**
- **Elegant & Minimal**: Clean, sophisticated design with plenty of white space
- **Romantic & Dreamy**: Soft gradients, gentle animations, ethereal feel
- **Modern Luxury**: Glass morphism, subtle shadows, premium typography
- **Timeless**: Classic serif fonts with contemporary layout

### **Emotional Goals**
- Create anticipation and excitement for the wedding
- Convey sophistication and elegance
- Feel personal and intimate, not corporate
- Inspire romance and celebration

---

## 🎭 **Visual Language**

### **Typography Hierarchy**
```css
/* Primary Heading - Couple Names */
font-family: "Cormorant Garamond" (serif)
font-weight: 200 (extralight)
size: text-5xl md:text-7xl
tracking: tracking-wider
usage: Main couple names, hero titles

/* Secondary Heading - Section Titles */
font-family: "Inter" (sans-serif)
font-weight: 300 (light)
size: text-xl md:text-2xl
tracking: tracking-wide
usage: "Our Wedding Day", section headers

/* Body Text - Descriptions */
font-family: "Inter" (sans-serif)
font-weight: 300 (light)
size: text-sm md:text-base
tracking: tracking-wide
usage: Dates, times, descriptions

/* Accent Text - Labels & UI */
font-family: "Inter" (sans-serif)
font-weight: 300 (light)
size: text-xs
tracking: tracking-widest
transform: uppercase
usage: Countdown labels, timezone info
```

### **Color Palette**
```css
/* Background Gradients */
primary: bg-gradient-to-br from-rose-50 to-pink-50
overlay: bg-gradient-to-b from-black/30 via-black/20 to-black/40

/* Glass Morphism Elements */
glass-light: bg-white/10 backdrop-blur-md border-white/20
glass-hover: bg-white/15 border-white/30
glass-strong: bg-white/20 backdrop-blur-sm

/* Text Colors */
primary: text-white
secondary: opacity-90, opacity-80, opacity-70
accent: text-gray-900 (for buttons on white)

/* Divider Lines */
subtle: bg-white/40, bg-white/50
```

### **Spacing & Layout**
```css
/* Container Spacing */
section-padding: px-6, px-4
vertical-spacing: mb-12, mt-12
element-gap: gap-6 md:gap-8

/* Micro Spacing */
text-spacing: mb-2, mb-3, mb-4
icon-spacing: mr-2, ml-2
divider-spacing: mb-6, mt-6
```

---

## ✨ **Animation & Interactions**

### **Animation Principles**
- **Subtle & Elegant**: No aggressive or bouncy animations
- **Smooth Transitions**: 300-700ms duration
- **Purposeful**: Animations enhance UX, not distract
- **Gentle Easing**: cubic-bezier(0.4, 0, 0.2, 1)

### **Hover States**
```css
/* Cards */
transform: translateY(-2px)
scale: hover:scale-105
glow: subtle box-shadow animation

/* Buttons */
background: hover:bg-white/25
border: hover:border-white/50
scale: hover:scale-105

/* Text Elements */
opacity: gentle fade transitions
```

### **Loading Animations**
```css
/* Fade In Up */
@keyframes fadeInUp {
  from: opacity-0, translateY(30px)
  to: opacity-1, translateY(0)
}

/* Gentle Pulse for Countdown */
animation: gentle opacity fade (2s ease-in-out infinite)
```

---

## 🏗️ **Component Patterns**

### **Glass Morphism Cards**
```jsx
className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 md:p-8 transition-all duration-700 hover:bg-white/15 hover:border-white/30"
```

### **Elegant Dividers**
```jsx
<div className="w-12 h-px bg-white/50 mx-auto"></div>
```

### **Countdown Cards**
- Rounded corners: `rounded-2xl`
- Glass effect with hover states
- Tabular numbers for consistency
- Responsive padding: `p-6 md:p-8`

### **Buttons**
```jsx
className="rsvp-button inline-flex items-center justify-center bg-white/15 backdrop-blur-md border border-white/30 text-white px-12 py-4 rounded-full font-light text-sm tracking-widest uppercase hover:bg-white/25 hover:border-white/50 hover:scale-105 group"
```

---

## 📱 **Responsive Design**

### **Breakpoint Strategy**
- Mobile First: Base styles for mobile
- md: 768px+ (tablet and desktop)
- Fluid scaling for text and spacing

### **Mobile Considerations**
- Larger touch targets (min 44px)
- Readable text sizes
- Simplified layouts
- Background-attachment: scroll (not fixed)

---

## 🌐 **Localization & Cultural Elements**

### **Thai Language Integration**
- Thai text mixed naturally with English
- Proper font support for Thai characters
- Cultural time format: "09:00 น."
- Timezone clarity: "เวลาประเทศไทย (GMT+7)"

### **Cultural Sensitivity**
- Respectful use of Thai language
- Clear timezone communication
- Elegant presentation appropriate for wedding context

---

## 🎯 **Future Feature Guidelines**

When adding new features, maintain these principles:

### **Visual Consistency**
- Use established color palette and typography
- Follow glass morphism pattern for cards/modals
- Maintain spacing rhythm and grid system

### **Interaction Patterns**
- Gentle, purposeful animations
- Consistent hover states
- Smooth transitions (300-700ms)

### **Content Tone**
- Elegant and sophisticated language
- Personal but not overly casual
- Clear and informative
- Bilingual when appropriate (Thai/English)

### **Component Examples for Future Features**
```jsx
// Modal/Dialog
"bg-white/95 backdrop-blur-xl border border-white/30 rounded-3xl"

// Form Inputs
"bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl"

// Navigation
"bg-white/15 backdrop-blur-md border-b border-white/20"

// Gallery Cards
"bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500"
```

---

## 📋 **Component Checklist**

For any new component, ensure:
- [ ] Follows glass morphism design pattern
- [ ] Uses established typography scale
- [ ] Has appropriate hover/focus states
- [ ] Responsive on mobile and desktop
- [ ] Smooth transitions (300-700ms)
- [ ] Accessible color contrast
- [ ] Consistent spacing rhythm
- [ ] Elegant, minimal aesthetic

---

*This design system ensures all future features maintain the romantic, elegant, and sophisticated mood of your wedding RSVP website.*
