import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Star, 
  Phone, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CheckCircle, 
  Send, 
  GraduationCap,
  Award,
  Sparkles,
  Palette,
  X,
  ShoppingBag,
  Calculator,
  BookOpen,
  Bus,
  Utensils,
  Search,
  Heart,
  MessageCircle,
  Clock3
} from 'lucide-react';
import { mockDataEngine } from './utils/mockDataEngine';
import type { SchoolClass, Teacher, SchoolEvent, ShopItem, CartItem, SchoolNotice, ChatMessage } from './utils/mockDataEngine';
import './App.css';

function App() {
  // Navigation & UI States
  const [activeSection, setActiveSection] = useState<string>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Database state
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Interactive Component States
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('c1');
  
  // Enroll Form States
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(3);
  const [childGender, setChildGender] = useState<'boy' | 'girl'>('boy');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [healthAlerts, setHealthAlerts] = useState('');

  // Tuition Advisor States
  const [calcAgeGroup, setCalcAgeGroup] = useState('c2'); // default to Nursery
  const [calcMealOption, setCalcMealOption] = useState('organic'); // 'organic' | 'standard' | 'none'
  const [calcTransport, setCalcTransport] = useState('two-way'); // 'none' | 'two-way' | 'one-way'
  const [calcDays, setCalcDays] = useState(5); // 3 | 5 days a week

  // Schedule States
  const [scheduleActiveDay, setScheduleActiveDay] = useState<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'>('monday');

  // Gallery States
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'art' | 'sports' | 'trips' | 'science'>('all');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [lightboxTitle, setLightboxTitle] = useState<string | null>(null);

  // Shop States
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Chat States
  const [typedMessage, setTypedMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load Database Engine
  const loadData = () => {
    setClasses(mockDataEngine.getClasses());
    setTeachers(mockDataEngine.getTeachers());
    setEvents(mockDataEngine.getEvents());
    setShopItems(mockDataEngine.getShopItems());
    setCart(mockDataEngine.getCart());
    setNotices(mockDataEngine.getNotices());
    setChatMessages(mockDataEngine.getMessages());
  };

  useEffect(() => {
    loadData();
    // Autoplay Hero Carousel
    const heroTimer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 6000);

    // Watch scroll position to highlight nav links
    const handleScroll = () => {
      const sections = ['home', 'about', 'programs', 'schedule', 'teachers', 'events', 'portal', 'estore'];
      const scrollPos = window.scrollY + 160;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      clearInterval(heroTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 90; // sticky header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  // Admission Enrollment Submit
  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !parentName || !parentPhone || !selectedClassId) {
      triggerToast("Please fill in all child details! 🧸");
      return;
    }

    const boyAvatars = [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150',
      'https://images.unsplash.com/photo-1602052786794-70642a0b3967?w=150'
    ];
    const girlAvatars = [
      'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=150',
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150'
    ];
    const pool = childGender === 'boy' ? boyAvatars : girlAvatars;
    const avatar = pool[Math.floor(Math.random() * pool.length)];

    mockDataEngine.enrollStudent({
      name: childName,
      classId: selectedClassId,
      age: childAge,
      gender: childGender,
      parentName,
      parentPhone,
      avatar,
      healthNotes: healthAlerts || undefined,
      feesPaid: true
    });

    // Reset fields
    setChildName('');
    setParentName('');
    setParentPhone('');
    setHealthAlerts('');
    setShowEnrollModal(false);
    loadData();
    triggerToast("Application submitted! We will contact you soon. 💌");
  };

  // E-Store Add to Cart
  const handleAddToCart = (id: string) => {
    mockDataEngine.addToCart(id);
    loadData();
    triggerToast("Added to shopping bag! 🎒");
  };

  const handleUpdateQty = (id: string, qty: number) => {
    mockDataEngine.updateCartQuantity(id, qty);
    loadData();
  };

  const handleCheckout = () => {
    mockDataEngine.clearCart();
    setCart([]);
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setShowCartPanel(false);
    }, 2800);
    triggerToast("Order placed successfully! 🛒");
  };

  // Live Chat send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    mockDataEngine.sendMessage('parent', typedMessage.trim());
    setTypedMessage('');
    loadData();
    
    // Principal reply simulation after 1.5s
    setIsTyping(true);
    setTimeout(() => {
      mockDataEngine.sendMessage(
        'principal',
        "Hello! Thank you for writing to me. I've received your note and will get back to you shortly. Have a magical day at Kidza! 🌞"
      );
      setIsTyping(false);
      loadData();
      triggerToast("Reply received from Miss Ruby! 📬");
    }, 1500);
  };

  // Predefined Chat Questions handler
  const handleQuickQuestionClick = (question: string, answer: string) => {
    mockDataEngine.sendMessage('parent', question);
    loadData();
    setIsTyping(true);
    setTimeout(() => {
      mockDataEngine.sendMessage('principal', answer);
      setIsTyping(false);
      loadData();
      triggerToast("Reply received from Miss Ruby! 📬");
    }, 1200);
  };

  // Date and Countdown helpers
  const getDaysCount = (dateStr: string) => {
    const today = new Date('2026-06-15');
    const target = new Date(dateStr);
    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today!';
    if (days < 0) return 'Passed';
    return `${days} Days Left`;
  };

  const getTeacherName = (tId: string) => {
    const target = teachers.find(t => t.id === tId);
    return target ? target.name : 'Miss Clara Henderson';
  };

  const getTeacherAvatar = (tId: string) => {
    const target = teachers.find(t => t.id === tId);
    return target ? target.avatar : 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100';
  };

  const getProductDetails = (id: string) => {
    return shopItems.find(p => p.id === id);
  };

  // Tuition Fee Estimate computation
  const getCalculatedFee = () => {
    const baseRates: Record<string, number> = {
      c1: 340, // Jellyfish
      c2: 380, // Little Bears
      c3: 420, // Flying Birds
      c4: 460, // Super Stars
      c5: 240  // Art Masters
    };
    const base = baseRates[calcAgeGroup] || 380;
    const daysMultiplier = calcDays === 3 ? 0.75 : 1.0;
    const mealAddon = calcMealOption === 'organic' ? 90 : calcMealOption === 'standard' ? 55 : 0;
    const transportAddon = calcTransport === 'two-way' ? 120 : calcTransport === 'one-way' ? 75 : 0;
    return (base * daysMultiplier) + mealAddon + transportAddon;
  };

  const getSelectedClassName = () => {
    const cls = classes.find(c => c.id === calcAgeGroup);
    return cls ? cls.name : 'Little Bears Program';
  };

  // Static Data
  const heroSlides = [
    {
      title: "Play, Learn, Grow & Excel!",
      subtitle: "Welcome to Kidza Nursery 🧸",
      desc: "Our child-centric early education curriculum focuses on fine motor skill development, creative thinking, and playful social interaction inside highly secure smart classrooms.",
      btn1: "Enroll My Child",
      btn2: "Browse Programs",
      img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600"
    },
    {
      title: "Vibrant and Creative Classrooms",
      subtitle: "Nurturing Curious Creative Minds 🎨",
      desc: "Through finger painting, sensory sand play, storytelling, and interactive puppet theaters, we make every single school day a magical journey of discovery.",
      btn1: "Book School Visit",
      btn2: "Meet Our Teachers",
      img: "https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=600"
    },
    {
      title: "Healthy Growth & Safety First",
      subtitle: "Certified Pediatric Care & Organic Meals 🍏",
      desc: "Kidza offers 100% nut-free organic meals daily, strict flu screening gates, and CPR-certified staff, ensuring parents sleep soundly while kids learn.",
      btn1: "Check Food Menu",
      btn2: "Security Systems",
      img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600"
    }
  ];

  const testimonials = [
    {
      text: "Kidza has been a blessing for Arjun! He used to be shy, but within months of play-based reading at Jellyfish, he is now asking questions and singing nursery rhymes at home. The teachers are incredibly caring.",
      author: "Priya Sharma",
      role: "Arjun's Parent",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100"
    },
    {
      text: "The security, daily health reports, and nut-free organic lunches give me complete peace of mind. Aarav loves the creative sandbox hours! I highly recommend Kidza to all working parents.",
      author: "Datta Panchal",
      role: "Aarav's Parent",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
    }
  ];

  const scheduleData = {
    monday: [
      { time: '09:00 AM - 09:30 AM', title: 'Circle Time & Greetings ☀️', desc: 'Starting the day with nursery songs, attendance check, and name matching cards.', teacherId: 't1' },
      { time: '09:30 AM - 10:30 AM', title: 'Sensory Sand Play & Toys 🧸', desc: 'Building motor skills, sorting geometric shapes, and playing in the indoor sandbox.', teacherId: 't2' },
      { time: '10:30 AM - 11:00 AM', title: 'Healthy Fruit Break 🍎', desc: 'Fresh apple, banana, and berry slices with lactose-free milk or juices.', teacherId: 't1' },
      { time: '11:00 AM - 12:00 PM', title: 'Phonics Story Hour 📚', desc: 'Fairy tales reading, phonics sounds matching, and cute puppy puppet theaters.', teacherId: 't4' },
      { time: '12:00 PM - 01:00 PM', title: 'Creative Painting Lab 🎨', desc: 'Finger painting, coloring books, and playdough crafting.', teacherId: 't3' }
    ],
    tuesday: [
      { time: '09:00 AM - 09:30 AM', title: 'Morning Music & Dance 🎵', desc: 'Rhythmic clap exercises, tambourine playing, and bouncy dance games.', teacherId: 't2' },
      { time: '09:30 AM - 10:30 AM', title: 'Numbers & Math Puzzles 🔢', desc: 'Counting colorful beads, sorting wooden blocks, and basic shapes recognition.', teacherId: 't3' },
      { time: '10:30 AM - 11:00 AM', title: 'Organic Snack Hour 🥦', desc: 'Healthy vegetable purees, multi-grain cookies, and refreshing fruit cups.', teacherId: 't4' },
      { time: '11:00 AM - 12:00 PM', title: 'Gardening & Nature Walks 🌱', desc: 'Planting miniature sunflower seeds and finding colorful bugs in the garden.', teacherId: 't1' },
      { time: '12:00 PM - 01:00 PM', title: 'Interactive Toy Theater 🎭', desc: 'Educational cartoons on the smart screen and group dollhouses play.', teacherId: 't2' }
    ],
    wednesday: [
      { time: '09:00 AM - 09:30 AM', title: 'Show & Tell Session 🗣️', desc: 'Children bring their favorite teddy bear and describe it in a fun circle group.', teacherId: 't4' },
      { time: '09:30 AM - 10:30 AM', title: 'Art: Clay Modelling 🏺', desc: 'Squeezing, folding, and shaping non-toxic clay into fruits and animal shapes.', teacherId: 't1' },
      { time: '10:30 AM - 11:00 AM', title: 'Fresh Juice & Cookie Time 🍪', desc: 'Oatmeal cookies with fresh squeezed orange juice.', teacherId: 't2' },
      { time: '11:00 AM - 12:00 PM', title: 'Kids Yoga & Bouncing Fun 🧘', desc: 'Light cartoon stretching exercises, balancing on foam blocks, and mini trampoline jumps.', teacherId: 't3' },
      { time: '12:00 PM - 01:00 PM', title: 'Words Spelling Puzzle 📝', desc: 'Alphabet block sorting, coloring matching letter pages, and spelling names.', teacherId: 't4' }
    ],
    thursday: [
      { time: '09:00 AM - 09:30 AM', title: 'Rhymes & Singing Recitals 🎤', desc: 'Singing Twinkle Twinkle, Humpty Dumpty, and Old MacDonald with cute instruments.', teacherId: 't1' },
      { time: '09:30 AM - 10:30 AM', title: 'Science Lab: Water & Colors 🧪', desc: 'Mixing primary colors in water cups, seeing what objects float vs sink.', teacherId: 't3' },
      { time: '10:30 AM - 11:00 AM', title: 'Organic Fruit Yogurt Bowl 🍓', desc: 'Yogurt topped with honey, strawberries, and soft grain oats.', teacherId: 't4' },
      { time: '11:00 AM - 12:00 PM', title: 'Building Lego Cities 🧱', desc: 'Cooperative block assembly to build towers, cars, and kid structures.', teacherId: 't2' },
      { time: '12:00 PM - 01:00 PM', title: 'Puppet Story Show 🦊', desc: 'Creative storytelling with woodland animals puppet setups by Evelyn.', teacherId: 't2' }
    ],
    friday: [
      { time: '09:00 AM - 09:30 AM', title: 'Daily Fitness & Running 🏃', desc: 'Warmup runs, chasing colorful balloons, and jumping hoops in the playground.', teacherId: 't3' },
      { time: '09:30 AM - 10:30 AM', title: 'Baking Day: Mini Cupcakes 🧁', desc: 'Spreading sprinkles and counting baking molds (no hot oven access).', teacherId: 't1' },
      { time: '10:30 AM - 11:00 AM', title: 'Sweet Potato & milk Snack 🍠', desc: 'Warm mashed sweet potato cups and fresh warm honey milk.', teacherId: 't4' },
      { time: '11:00 AM - 12:00 PM', title: 'Weekly Puppet Theater Fest 🎪', desc: 'Teachers perform a mini play with puppets, followed by kids dance hour.', teacherId: 't2' },
      { time: '12:00 PM - 01:00 PM', title: 'Good Behavior Awards 🏅', desc: 'Distributing shiny golden star stickers and packing bags for weekend pickup.', teacherId: 't4' }
    ]
  };

  const galleryData = [
    { id: 'g1', tag: 'art', title: 'Creative Painting Lab 🎨', url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600' },
    { id: 'g2', tag: 'sports', title: 'Outdoor Play & Sports 🏃', url: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600' },
    { id: 'g3', tag: 'science', title: 'Water Science Session 🧪', url: 'https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=600' },
    { id: 'g4', tag: 'trips', title: 'City Zoo Excursion 🦁', url: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600' },
    { id: 'g5', tag: 'art', title: 'Montessori Sandbox Toys 🏺', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600' },
    { id: 'g6', tag: 'sports', title: 'Water Pool Splash Party 💦', url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600' }
  ];

  // Helper for Shipping Thresholds
  const cartSubtotal = cart.reduce((sum, item) => sum + ((getProductDetails(item.itemId)?.price || 0) * item.quantity), 0);
  const isFreeShipping = cartSubtotal >= 50.0;
  const shippingPercent = Math.min(100, (cartSubtotal / 50.0) * 100);

  return (
    <div className="site-wrapper">
      {/* Absolute Decorative Floating Doodles */}
      <div className="doodle-item" style={{ top: '15%', left: '4%', animationDelay: '0s' }}>
        <Sparkles size={28} color="var(--color-pink)" />
      </div>
      <div className="doodle-item" style={{ top: '22%', right: '5%', animationDelay: '1s' }}>
        <Heart size={24} color="var(--color-yellow)" />
      </div>
      <div className="doodle-item" style={{ top: '50%', left: '2%', animationDelay: '2s' }}>
        <Smile size={30} color="var(--color-blue)" />
      </div>
      <div className="doodle-item" style={{ top: '75%', right: '3%', animationDelay: '3s' }}>
        <Palette size={26} color="var(--color-purple)" />
      </div>

      {/* Top Banner Ribbon */}
      <div className="top-ribbon">
        <div className="top-ribbon-left">
          <span className="top-ribbon-item">
            <Sparkles size={14} color="var(--color-yellow)" />
            <span>Summer Admissions open for Session 2026! Apply now.</span>
          </span>
        </div>
        <div className="top-ribbon-right">
          <span className="top-ribbon-item">
            <Phone size={13} color="var(--color-pink)" />
            <span>+1 (800) 555-KIDZ</span>
          </span>
          <span className="top-ribbon-item">
            <MapPin size={13} color="var(--color-blue)" />
            <span>74 Kidza Avenue, Creative Hills</span>
          </span>
        </div>
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky-header">
        <div className="logo-area" onClick={() => scrollToSection('home')}>
          <div className="logo-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--color-pink), var(--color-yellow))' }}>
            K
          </div>
          <div className="logo-text-wrap">
            <div className="logo-letters">
              <span className="logo-letter" style={{ color: 'var(--color-pink)' }}>K</span>
              <span className="logo-letter" style={{ color: 'var(--color-yellow-hover)' }}>i</span>
              <span className="logo-letter" style={{ color: 'var(--color-blue)' }}>d</span>
              <span className="logo-letter" style={{ color: 'var(--color-green)' }}>z</span>
              <span className="logo-letter" style={{ color: 'var(--color-purple)' }}>a</span>
            </div>
            <span className="logo-sub">Kindergarten & School</span>
          </div>
        </div>

        {/* Menu Navigation (Smooth scroll triggers) */}
        <ul className="nav-links">
          <li className={`nav-item ${activeSection === 'home' ? 'active' : ''}`} onClick={() => scrollToSection('home')}>Home</li>
          <li className={`nav-item ${activeSection === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>About</li>
          <li className={`nav-item ${activeSection === 'programs' ? 'active' : ''}`} onClick={() => scrollToSection('programs')}>Programs</li>
          <li className={`nav-item ${activeSection === 'schedule' ? 'active' : ''}`} onClick={() => scrollToSection('schedule')}>Daily Schedule</li>
          <li className={`nav-item ${activeSection === 'teachers' ? 'active' : ''}`} onClick={() => scrollToSection('teachers')}>Teachers</li>
          <li className={`nav-item ${activeSection === 'events' ? 'active' : ''}`} onClick={() => scrollToSection('events')}>Events</li>
          <li className={`nav-item ${activeSection === 'portal' ? 'active' : ''}`} onClick={() => scrollToSection('portal')}>Parent Portal</li>
          <li className={`nav-item ${activeSection === 'estore' ? 'active' : ''}`} onClick={() => scrollToSection('estore')}>E-Shop</li>
        </ul>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Cart Icon trigger */}
          <button 
            onClick={() => setShowCartPanel(true)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-dark)',
              padding: '6px'
            }}
          >
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--color-pink)',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: '900',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF'
                }}
              >
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => {
              if (classes.length > 0) setSelectedClassId(classes[0].id);
              setShowEnrollModal(true);
            }} 
            className="bubble-btn bubble-btn-pink"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Enroll Now <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* 1. HERO CAROUSEL SECTION */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <span className="hero-subtitle">{heroSlides[heroIndex].subtitle}</span>
          <h1 className="hero-title">{heroSlides[heroIndex].title}</h1>
          <p className="hero-desc">{heroSlides[heroIndex].desc}</p>
          
          <div className="hero-buttons">
            <button 
              onClick={() => {
                if (classes.length > 0) setSelectedClassId(classes[0].id);
                setShowEnrollModal(true);
              }}
              className="bubble-btn bubble-btn-pink"
            >
              {heroSlides[heroIndex].btn1}
            </button>
            <button onClick={() => scrollToSection('programs')} className="bubble-btn bubble-btn-yellow">
              {heroSlides[heroIndex].btn2}
            </button>
          </div>

          {/* Slider dot indicators */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '40px' }}>
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                style={{
                  width: heroIndex === idx ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '99px',
                  border: 'none',
                  backgroundColor: heroIndex === idx ? 'var(--color-pink)' : '#E5DEC9',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div className="hero-image-area">
          <div className="hero-blob" />
          <div className="hero-img-container">
            <img 
              src={heroSlides[heroIndex].img} 
              alt="Kidza Classroom Activities" 
              className="hero-img"
            />
            {/* Floating Cute badge */}
            <div 
              className="hero-floating-tag"
              style={{
                top: '8%',
                left: '2%',
                transform: 'rotate(-6deg)'
              }}
            >
              <Smile color="var(--color-yellow-hover)" fill="var(--color-yellow)" size={20} />
              <span>100% Fun Playtime</span>
            </div>
            <div 
              className="hero-floating-tag"
              style={{
                bottom: '12%',
                right: '4%',
                transform: 'rotate(5deg)'
              }}
            >
              <Award color="var(--color-pink)" size={18} />
              <span>Certified Caregivers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 2. CORE FEATURES / PILLARS */}
      <section className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-pink)' }}>Pillars of early learning</span>
          <h2>Why Parents Trust Kidza</h2>
        </div>

        <div className="services-grid">
          <div className="service-card bubble-card" style={{ borderBottom: '8px solid var(--color-pink)' }}>
            <div className="service-icon-wrapper" style={{ backgroundColor: 'var(--color-pink-light)', color: 'var(--color-pink)' }}>
              <Smile size={38} />
            </div>
            <h3>Interactive Learning</h3>
            <p>We nurture fine motor skill development and sensory capabilities through sandplay, Lego assembly, and custom educational toy labs.</p>
          </div>

          <div className="service-card bubble-card" style={{ borderBottom: '8px solid var(--color-yellow)' }}>
            <div className="service-icon-wrapper" style={{ backgroundColor: 'var(--color-yellow-light)', color: 'var(--color-yellow-hover)' }}>
              <Award size={38} />
            </div>
            <h3>Certified Faculty</h3>
            <p>Every single teacher holds credentials in child psychology and active pediatric first-aid certifications to ensure total toddler safety.</p>
          </div>

          <div className="service-card bubble-card" style={{ borderBottom: '8px solid var(--color-blue)' }}>
            <div className="service-icon-wrapper" style={{ backgroundColor: 'var(--color-blue-light)', color: 'var(--color-blue)' }}>
              <Palette size={38} />
            </div>
            <h3>Creative Studios</h3>
            <p>Dedicated toddler music chambers, finger painting nurseries, and storytelling puppet theaters foster natural creative geniuses.</p>
          </div>
        </div>
      </section>

      {/* Cloud Divider */}
      <div className="cloud-divider" style={{ backgroundColor: 'var(--color-bg)' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* 3. ABOUT US COLLAGE */}
      <section id="about" className="section section-bg-white">
        <div className="about-split">
          <div className="about-img-area">
            <div className="about-polaroid-collage">
              <div className="about-polaroid about-polaroid-1">
                <img src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500" alt="Kindergarten painting classroom" />
                <p style={{ marginTop: '10px', fontWeight: '800', textAlign: 'center', fontSize: '0.88rem' }}>Creative Sandplay Day</p>
              </div>
              <div className="about-polaroid about-polaroid-2">
                <img src="https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=500" alt="Child building blocks" />
                <p style={{ marginTop: '10px', fontWeight: '800', textAlign: 'center', fontSize: '0.88rem' }}>Building Tiny Worlds</p>
              </div>
              <div className="about-badge-starburst">
                <h4 style={{ fontSize: '1.6rem', fontWeight: '900', lineHeight: '1' }}>10+</h4>
                <span style={{ fontSize: '0.62rem', fontWeight: '800', textTransform: 'uppercase' }}>Years Trust</span>
              </div>
            </div>
          </div>

          <div className="about-content">
            <span style={{ color: 'var(--color-green)', fontWeight: '900', textTransform: 'uppercase', fontSize: '0.85rem' }}>Welcome to early childhood daycare</span>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginTop: '8px', lineHeight: '1.15' }}>
              A Loving, Smart & Protected Nursery for Creative Development
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.02rem', marginTop: '18px', lineHeight: '1.6', fontWeight: '600' }}>
              Kidza provides a stimulating nursery and pre-school syllabus tailored specifically for children ages 2 to 6. Our smart classrooms encourage group activities, helping toddlers build communication skills, phonics reading habits, and geometric logic structures in a fun, caring environment.
            </p>

            <ul className="about-list">
              <li className="about-list-item">
                <span className="about-list-icon">✓</span> <span>Interactive Toy Sandbox</span>
              </li>
              <li className="about-list-item">
                <span className="about-list-icon">✓</span> <span>100% Certified Nut-free Meals</span>
              </li>
              <li className="about-list-item">
                <span className="about-list-icon">✓</span> <span>Daily Pediatric Screenings</span>
              </li>
              <li className="about-list-item">
                <span className="about-list-icon">✓</span> <span>High Security Bus GPS Tracking</span>
              </li>
            </ul>

            <button onClick={() => scrollToSection('programs')} className="bubble-btn bubble-btn-pink">
              Explore Academic Programs <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 4. ACADEMIC PROGRAMS */}
      <section id="programs" className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-blue)' }}>Classes & age groups</span>
          <h2>Our Curated Educational Programs</h2>
        </div>

        <div className="classes-grid">
          {classes.map((cls) => {
            const colors: Record<string, string> = {
              pink: 'var(--color-pink)',
              yellow: 'var(--color-yellow)',
              blue: 'var(--color-blue)',
              green: 'var(--color-green)',
              purple: 'var(--color-purple)'
            };
            const colHex = colors[cls.color] || 'var(--color-pink)';

            const imgUrls: Record<string, string> = {
              c1: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500", // Jellyfish
              c2: "https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=500", // Little Bears
              c3: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500", // Flying Birds
              c4: "https://images.unsplash.com/photo-1540479859555-17af45c78602?w=500", // Super Stars
              c5: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500"  // Art Masters
            };
            const cardImg = imgUrls[cls.id] || "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=500";

            return (
              <div 
                key={cls.id} 
                className="class-card bubble-card" 
                style={{ borderTop: `10px solid ${colHex}` }}
              >
                <div className="class-card-img-wrap">
                  <img src={cardImg} alt={cls.name} className="class-card-img" />
                  <span className="class-card-badge" style={{ color: colHex }}>
                    {cls.ageGroup}
                  </span>
                </div>

                <div className="class-card-content">
                  <div>
                    <div className="class-card-header">
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '800' }}>
                        {cls.room}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: '800', color: colHex }}>
                        {cls.schedule.split(' - ')[0]}
                      </span>
                    </div>

                    <h3>{cls.name}</h3>
                    <p>Designed for basic motor prep, sensory playrooms, early language phonics building, and collaborative sandbox activities.</p>
                  </div>

                  <div>
                    {/* Capacity meter */}
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '900', marginBottom: '5px' }}>
                        <span>Seats Occupied:</span>
                        <span>{cls.enrolled} / {cls.capacity} kids</span>
                      </div>
                      <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-bg)', borderRadius: '99px', overflow: 'hidden', border: '2px solid var(--color-dark)' }}>
                        <div style={{ height: '100%', width: `${(cls.enrolled/cls.capacity)*100}%`, backgroundColor: colHex }} />
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="class-meta-row">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img 
                          src={getTeacherAvatar(cls.teacherId)} 
                          alt={getTeacherName(cls.teacherId)} 
                          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid var(--color-dark)', objectFit: 'cover' }}
                        />
                        <span style={{ fontSize: '0.78rem', fontWeight: '800', color: 'var(--color-dark)' }}>
                          {getTeacherName(cls.teacherId).split(' ')[1] || getTeacherName(cls.teacherId)}
                        </span>
                      </div>
                      
                      <button 
                        onClick={() => {
                          setSelectedClassId(cls.id);
                          setShowEnrollModal(true);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: colHex,
                          fontWeight: '900',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontSize: '0.82rem'
                        }}
                      >
                        Join →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: 'var(--color-bg)' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* 5. INTERACTIVE TIMETABLE SCHEDULE BOARD */}
      <section id="schedule" className="section section-bg-white">
        <div className="section-title">
          <span style={{ color: 'var(--color-yellow-hover)', backgroundColor: 'var(--color-yellow-light)' }}>Weekly Agenda</span>
          <h2>A Typical Day at Kidza</h2>
        </div>

        {/* Timetable Tab Selection */}
        <div className="schedule-tabs-container">
          {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((day) => (
            <button
              key={day}
              onClick={() => setScheduleActiveDay(day)}
              className={`schedule-tab-btn ${scheduleActiveDay === day ? 'active' : ''}`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        {/* Timetable slots listing */}
        <div className="schedule-timeline">
          {scheduleData[scheduleActiveDay].map((slot, index) => (
            <div key={index} className="schedule-slot">
              <div className="schedule-slot-time">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                  <Clock3 size={15} />
                  <span>Time</span>
                </div>
                <div style={{ fontSize: '0.72rem', marginTop: '4px', color: 'var(--color-text-muted)' }}>
                  {slot.time.replace('AM', '').replace('PM', '')}
                </div>
              </div>

              <div className="schedule-slot-info">
                <h4>{slot.title}</h4>
                <p>{slot.desc}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <img 
                  src={getTeacherAvatar(slot.teacherId)} 
                  alt="Teacher" 
                  className="schedule-slot-avatar"
                />
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--color-text-muted)' }}>
                  {getTeacherName(slot.teacherId).split(' ')[1] || 'Miss Ruby'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 6. TUITION FEE CALCULATOR & ADVISOR */}
      <section className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-green)', backgroundColor: 'var(--color-green-light)' }}>Fee Advisor</span>
          <h2>Interactive Tuition Estimator</h2>
        </div>

        <div className="calc-container bubble-card">
          {/* Form Side */}
          <div className="calc-form">
            <h3 style={{ fontSize: '1.5rem', fontWeight: '900', borderBottom: '3px dashed var(--color-border)', paddingBottom: '10px' }}>
              Estimate Your Package
            </h3>

            <div className="form-group">
              <label>1. Select Class / Age Group</label>
              <select 
                value={calcAgeGroup} 
                onChange={e => setCalcAgeGroup(e.target.value)} 
                className="kid-input"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.ageGroup})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>2. School Attendance</label>
                <select 
                  value={calcDays} 
                  onChange={e => setCalcDays(parseInt(e.target.value))} 
                  className="kid-input"
                >
                  <option value={5}>5 Days a Week</option>
                  <option value={3}>3 Days a Week</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>3. Meal Program</label>
                <select 
                  value={calcMealOption} 
                  onChange={e => setCalcMealOption(e.target.value)} 
                  className="kid-input"
                >
                  <option value="organic">Organic Lunches & Milk (+$90)</option>
                  <option value="standard">Standard Snacks (+$55)</option>
                  <option value="none">No Meal Package (+$0)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>4. School Bus Transportation</label>
              <select 
                value={calcTransport} 
                onChange={e => setCalcTransport(e.target.value)} 
                className="kid-input"
              >
                <option value="two-way">Two-way GPS pickup/drop (+$120)</option>
                <option value="one-way">One-way pickup/drop (+$75)</option>
                <option value="none">Self commute / None (+$0)</option>
              </select>
            </div>
          </div>

          {/* Results Side */}
          <div className="calc-results-card" style={{ backgroundColor: 'var(--color-bg)', padding: '30px', borderRadius: '24px', border: '3px dashed var(--color-dark)' }}>
            <Calculator size={38} color="var(--color-green)" />
            <h4 style={{ fontWeight: '900', marginTop: '10px', fontSize: '1.2rem', textTransform: 'uppercase' }}>
              Calculated Monthly Tuition
            </h4>
            <div className="calc-price">
              ${getCalculatedFee().toFixed(2)}
              <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', fontWeight: '700' }}> / month</span>
            </div>
            
            <div className="calc-recommendation">
              🎒 Recommended Class: <strong>{getSelectedClassName()}</strong>
              <div style={{ fontSize: '0.75rem', marginTop: '6px', fontWeight: '500', opacity: 0.9 }}>
                Includes daily attendance reports, toy lab access, first aid screenings and digital notifications.
              </div>
            </div>

            <button 
              onClick={() => {
                setSelectedClassId(calcAgeGroup);
                setShowEnrollModal(true);
              }}
              className="bubble-btn bubble-btn-pink"
              style={{ marginTop: '24px', width: '100%' }}
            >
              Apply With This Package
            </button>
          </div>
        </div>
      </section>

      {/* 7. STATS COUNTER RIBBON */}
      <div className="stats-ribbon">
        <div className="stat-item">
          <Smile size={32} color="var(--color-pink)" style={{ marginBottom: '10px' }} />
          <div className="stat-num" style={{ color: 'var(--color-pink)' }}>180+</div>
          <div className="stat-label">Active Kids</div>
        </div>
        <div className="stat-item">
          <BookOpen size={32} color="var(--color-yellow)" style={{ marginBottom: '10px' }} />
          <div className="stat-num" style={{ color: 'var(--color-yellow)' }}>14+</div>
          <div className="stat-label">Smart Rooms</div>
        </div>
        <div className="stat-item">
          <Utensils size={32} color="var(--color-blue)" style={{ marginBottom: '10px' }} />
          <div className="stat-num" style={{ color: 'var(--color-blue)' }}>100%</div>
          <div className="stat-label">Organic Menu</div>
        </div>
        <div className="stat-item">
          <Bus size={32} color="var(--color-green)" style={{ marginBottom: '10px' }} />
          <div className="stat-num" style={{ color: 'var(--color-green)' }}>12+</div>
          <div className="stat-label">Bus Routes</div>
        </div>
      </div>

      {/* 8. SCHOOL FACULTY / TEACHERS */}
      <section id="teachers" className="section section-bg-white">
        <div className="section-title">
          <span style={{ color: 'var(--color-purple)', backgroundColor: 'var(--color-purple-light)' }}>Expert Staff</span>
          <h2>Meet Our School Coordinators</h2>
        </div>

        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="teacher-card">
              <div className="teacher-img-wrap">
                <img src={teacher.avatar} alt={teacher.name} className="teacher-img" />
              </div>
              <h3>{teacher.name}</h3>
              <div className="teacher-card-subject">{teacher.subject}</div>
              <p className="teacher-card-bio">"{teacher.bio}"</p>
              
              <div className="teacher-card-footer">
                <div className="teacher-rating">
                  <Star size={15} fill="var(--color-yellow)" color="var(--color-yellow-hover)" />
                  <span style={{ color: 'var(--color-dark)' }}>{teacher.rating} / 5.0</span>
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontWeight: '800' }}>
                  Exp: {teacher.experience}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 9. OUTINGS & EVENTS CALENDAR */}
      <section id="events" className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-pink)', backgroundColor: 'var(--color-pink-light)' }}>Calendar Outings</span>
          <h2>Upcoming Outings & Fests</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px', maxWidth: '1200px', margin: '0 auto' }}>
          {events.map((event) => {
            const colors: Record<string, string> = {
              pink: 'var(--color-pink)',
              blue: 'var(--color-blue)',
              purple: 'var(--color-purple)',
              green: 'var(--color-green)'
            };
            const col = colors[event.color] || 'var(--color-pink)';
            const eventDate = new Date(event.date);
            const dateNum = eventDate.getDate();
            const dateMonth = eventDate.toLocaleDateString('en-US', { month: 'short' });

            return (
              <div key={event.id} className="event-card bubble-card" style={{ borderLeft: `10px solid ${col}` }}>
                <div>
                  <div className="event-top">
                    <div className="event-date-block" style={{ backgroundColor: col }}>
                      <span className="event-date-num">{dateNum}</span>
                      <span className="event-date-month">{dateMonth}</span>
                    </div>
                    
                    <span className="event-countdown-tag" style={{ color: col }}>
                      {getDaysCount(event.date)}
                    </span>
                  </div>

                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>

                <div className="event-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} style={{ color: col }} /> {event.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} style={{ color: col }} /> {event.location}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: 'var(--color-bg)' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* 10. PARENTS TESTIMONIALS */}
      <section className="section section-bg-white">
        <div className="section-title">
          <span style={{ color: 'var(--color-yellow-hover)', backgroundColor: 'var(--color-yellow-light)' }}>Feedback</span>
          <h2>What Parents Say About Us</h2>
        </div>

        <div className="testimonial-container">
          <div className="testimonial-bubble">
            <p className="testimonial-quote">
              "{testimonials[testimonialIndex].text}"
            </p>
            
            <div className="testimonial-author-wrap">
              <img 
                src={testimonials[testimonialIndex].avatar} 
                alt={testimonials[testimonialIndex].author} 
                className="testimonial-profile"
              />
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--color-dark)' }}>
                  {testimonials[testimonialIndex].author}
                </h4>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '800' }}>
                  {testimonials[testimonialIndex].role}
                </span>
              </div>
            </div>
          </div>

          {/* Testimonial slider buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '30px' }}>
            <button 
              onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
              className="bubble-btn bubble-btn-outline"
              style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}
              className="bubble-btn bubble-btn-outline"
              style={{ width: '46px', height: '46px', padding: 0, borderRadius: '50%' }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 11. KIDS ADVENTURE GALLERY */}
      <section className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-blue)', backgroundColor: 'var(--color-blue-light)' }}>School Memories</span>
          <h2>Kidza Adventure Gallery</h2>
        </div>

        {/* Gallery Filter buttons */}
        <div className="gallery-filter-bar">
          {[
            { id: 'all', label: 'All Activities 🎨' },
            { id: 'art', label: 'Arts & Clay' },
            { id: 'sports', label: 'Swimming & Races' },
            { id: 'trips', label: 'Outdoor Trips' },
            { id: 'science', label: 'Science Room' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setGalleryFilter(f.id as any)}
              className={`schedule-tab-btn ${galleryFilter === f.id ? 'active' : ''}`}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Mosaic Grid */}
        <div className="gallery-grid-mosaic">
          {galleryData.filter(g => galleryFilter === 'all' || g.tag === galleryFilter).map((item) => (
            <div 
              key={item.id} 
              className="gallery-card"
              onClick={() => {
                setLightboxImg(item.url);
                setLightboxTitle(item.title);
              }}
            >
              <img src={item.url} alt={item.title} />
              <div className="gallery-hover-overlay">
                <Search size={32} style={{ marginBottom: '8px' }} />
                <h4 style={{ fontWeight: '900', color: '#FFFFFF', fontSize: '1rem' }}>{item.title}</h4>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-yellow)' }}>
                  View Fullscreen
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: 'var(--color-bg)' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* 12. PARENTS PORTAL & CHAT WIDGET */}
      <section id="portal" className="section section-bg-white">
        <div className="section-title">
          <span style={{ color: 'var(--color-pink)', backgroundColor: 'var(--color-pink-light)' }}>Coordinators Corner</span>
          <h2>Notices Board & Parent Helpdesk</h2>
        </div>

        <div className="portal-split">
          {/* Notices sticky note board */}
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '20px', borderBottom: '3px dashed var(--color-border)', paddingBottom: '10px' }}>
              Latest Announcements
            </h3>
            
            <div className="sticky-notes-container">
              {notices.map((n, index) => {
                const noteColors = ['#FFFDF0', '#FFF0F0', '#F0F6FF'];
                const noteBg = noteColors[index % noteColors.length];
                return (
                  <div key={n.id} className="sticky-note" style={{ backgroundColor: noteBg }}>
                    <div className="sticky-note-pin" />
                    <div className="sticky-note-date">{n.date} • {n.postedBy.split(' ')[1] || n.postedBy}</div>
                    <h4>{n.title}</h4>
                    <p>{n.content}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Principal Chat */}
          <div className="chat-widget bubble-card" style={{ borderTop: '10px solid var(--color-pink)' }}>
            <div className="chat-header">
              <div className="chat-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" 
                  alt="Principal Miss Ruby" 
                  className="chat-avatar"
                />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '900' }}>Miss Ruby Lawson</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-green)', fontWeight: '800' }}>
                    Active • Principal & Support
                  </span>
                </div>
              </div>
              <span className="class-card-badge" style={{ position: 'relative', top: 0, left: 0, padding: '4px 10px' }}>
                Chat Helpdesk
              </span>
            </div>

            {/* Message log */}
            <div className="chat-body-logs">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`chat-msg-bubble ${msg.sender === 'parent' ? 'chat-msg-sent' : 'chat-msg-rec'}`}
                >
                  <p>{msg.text}</p>
                  <span className="chat-msg-time">{msg.timestamp}</span>
                </div>
              ))}

              {isTyping && (
                <div className="chat-typing-indicator">
                  <span>Miss Ruby is typing</span>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              )}
            </div>

            {/* Quick Questions buttons */}
            <div className="chat-quick-queries">
              <button 
                onClick={() => handleQuickQuestionClick(
                  "What are school hours? 🕒", 
                  "Hello! Our regular kindergarten hours are 09:00 AM - 01:00 PM. Daycare is open until 06:00 PM for working parents. 🧸"
                )}
                className="chat-quick-btn"
              >
                School Hours? 🕒
              </button>
              <button 
                onClick={() => handleQuickQuestionClick(
                  "Is transport provided? 🚍", 
                  "Yes! Kidza operates high-security school vans covering Creative Hills, Sunnyside, and Riverwood neighborhoods. All buses are fully air-conditioned and have CCTV. 🚍"
                )}
                className="chat-quick-btn"
              >
                Bus Service? 🚍
              </button>
              <button 
                onClick={() => handleQuickQuestionClick(
                  "Are meals organic? 🍏", 
                  "Absolutely! We serve 100% nut-free organic snacks and hot lunches cooked daily in our sanitary school kitchen. Gluten-free options are available! 🍏"
                )}
                className="chat-quick-btn"
              >
                Organic Lunches? 🍏
              </button>
            </div>

            {/* Chat Send Row */}
            <form onSubmit={handleSendMessage} className="chat-input-row">
              <input 
                type="text" 
                value={typedMessage} 
                onChange={e => setTypedMessage(e.target.value)} 
                placeholder="Ask Miss Ruby a custom question..." 
                className="kid-input" 
              />
              <button type="submit" className="bubble-btn bubble-btn-pink" style={{ padding: '12px 16px', borderRadius: '18px' }}>
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: '#FFFFFF' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="var(--color-bg)"/>
        </svg>
      </div>

      {/* 13. E-STORE ACCESSORIES */}
      <section id="estore" className="section section-bg-light">
        <div className="section-title">
          <span style={{ color: 'var(--color-pink)', backgroundColor: 'var(--color-pink-light)' }}>Kidza Shop</span>
          <h2>Uniforms & Art Kits Store</h2>
        </div>

        {/* Catalog Category selector */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '14px', justifyContent: 'center', marginBottom: '32px' }}>
          {[
            { id: 'all', label: 'All Accessories 🎒' },
            { id: 'uniforms', label: 'Uniforms' },
            { id: 'books', label: 'Reading Books' },
            { id: 'kits', label: 'Art Kits' },
            { id: 'accessories', label: 'Lunchbox & Accessories' }
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setShopCategory(c.id)}
              className={`schedule-tab-btn ${shopCategory === c.id ? 'active' : ''}`}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="store-grid">
          {shopItems.filter(p => shopCategory === 'all' || p.category === shopCategory).map((prod) => (
            <div key={prod.id} className="store-card bubble-card">
              <div className="store-img-wrap">
                <img src={prod.image} alt={prod.name} className="store-img" />
                {!prod.inStock && (
                  <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(44,62,80,0.6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFFFFF', fontWeight:'900', fontSize:'0.85rem' }}>
                    Sold Out
                  </div>
                )}
                {prod.price > 20 && prod.inStock && (
                  <span className="store-sale-badge">SALE</span>
                )}
              </div>
              
              <h4>{prod.name}</h4>
              
              <div style={{ display: 'flex', gap: '4px', color: 'var(--color-yellow-hover)', fontSize: '0.8rem', marginTop: '6px' }}>
                <Star size={14} fill="var(--color-yellow)" color="var(--color-yellow-hover)" />
                <span style={{ fontWeight: '800', color: 'var(--color-dark)' }}>{prod.rating}</span>
              </div>

              <div className="store-card-footer">
                <span className="store-price">${prod.price.toFixed(2)}</span>
                <button 
                  disabled={!prod.inStock} 
                  onClick={() => handleAddToCart(prod.id)}
                  className="bubble-btn bubble-btn-pink"
                  style={{ padding: '8px 18px', borderRadius: '12px', fontSize: '0.82rem' }}
                >
                  Add To Bag
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cloud divider wave transition */}
      <div className="cloud-divider" style={{ backgroundColor: 'var(--color-bg)' }}>
        <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FFFFFF"/>
        </svg>
      </div>

      {/* 14. NEWSLETTER CTA */}
      <section className="section section-bg-white" style={{ paddingBottom: '20px' }}>
        <div className="newsletter-banner">
          <div className="newsletter-doodles" style={{ top: '10px', left: '10px' }}><Sparkles color="var(--color-pink)" size={24} /></div>
          <div className="newsletter-doodles" style={{ bottom: '10px', right: '10px' }}><Heart color="var(--color-yellow-hover)" size={24} /></div>

          <span style={{ color: 'var(--color-orange)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.82rem' }}>
            Subscribe Newsletter
          </span>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginTop: '10px', color: 'var(--color-dark)' }}>
            Get Weekly Kids Activities & Schedule Reports
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginTop: '12px', fontWeight: '600', maxWidth: '600px', margin: '12px auto 0' }}>
            Enter your email to receive direct preschool schedules, nutrition tips, organic meal menus, and announcements.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); triggerToast("Successfully subscribed to newsletter! 📧"); }} className="newsletter-inputs">
            <input 
              type="email" 
              placeholder="Enter your email address..." 
              className="kid-input" 
              style={{ maxWidth: '360px', backgroundColor: '#FFFFFF' }}
              required
            />
            <button type="submit" className="bubble-btn bubble-btn-pink">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      {/* 15. CLOUD WAVY FOOTER */}
      <footer className="cloud-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 style={{ fontFamily: "'Fredoka', sans-serif" }}>About Kidza</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', marginTop: '16px', lineHeight: '1.6', fontWeight: '600' }}>
              Kidza is a modern, colorful preschool and daycare center supporting play-based early learning, creative arts, and basic motor skill development for toddlers.
            </p>
            <div className="footer-socials">
              <div className="footer-social-btn"><Smile size={18} color="var(--color-pink)" /></div>
              <div className="footer-social-btn"><Heart size={18} color="var(--color-yellow-hover)" /></div>
              <div className="footer-social-btn"><MessageCircle size={18} color="var(--color-blue)" /></div>
            </div>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links" style={{ marginTop: '16px' }}>
              <li onClick={() => scrollToSection('home')}>Home Overview</li>
              <li onClick={() => scrollToSection('about')}>About Academy</li>
              <li onClick={() => scrollToSection('programs')}>Curriculums</li>
              <li onClick={() => scrollToSection('schedule')}>Daily Agenda</li>
              <li onClick={() => scrollToSection('teachers')}>School coordinators</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>School Hours</h3>
            <ul className="footer-links" style={{ marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.88rem', fontWeight: '700' }}>
              <li>Playgroup: 09:00 AM - 12:00 PM</li>
              <li>Nursery: 09:00 AM - 01:00 PM</li>
              <li>LKG & UKG: 08:30 AM - 02:00 PM</li>
              <li>Office Hours: Monday - Friday</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '2px dashed var(--color-border)', marginTop: '60px', paddingTop: '24px', fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: '800' }}>
          © 2026 Kidza Pre-school Portal. Built with care for children, parents, and schools.
        </div>
      </footer>

      {/* ADMISSION ENROLL MODAL DIALOG */}
      {showEnrollModal && (
        <div className="modal-overlay">
          <div className="modal-content bubble-card" style={{ borderTop: '10px solid var(--color-pink)' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.4rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap color="var(--color-pink)" size={24} />
                <span>Admission Application</span>
              </h3>
              <button 
                onClick={() => setShowEnrollModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit}>
              <div className="form-group">
                <label>Child's Full Name</label>
                <input 
                  type="text" 
                  value={childName} 
                  onChange={e => setChildName(e.target.value)} 
                  placeholder="e.g. Aarav Datta Panchal" 
                  className="kid-input" 
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Age (Years)</label>
                  <input 
                    type="number" 
                    value={childAge} 
                    onChange={e => setChildAge(parseInt(e.target.value))} 
                    min={2} 
                    max={6} 
                    className="kid-input" 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select 
                    value={childGender} 
                    onChange={e => setChildGender(e.target.value as any)} 
                    className="kid-input"
                  >
                    <option value="boy">Boy</option>
                    <option value="girl">Girl</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Target Classroom Program</label>
                <select 
                  value={selectedClassId} 
                  onChange={e => setSelectedClassId(e.target.value)} 
                  className="kid-input"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.ageGroup})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Parent / Guardian Name</label>
                <input 
                  type="text" 
                  value={parentName} 
                  onChange={e => setParentName(e.target.value)} 
                  placeholder="e.g. Datta Panchal" 
                  className="kid-input" 
                  required 
                />
              </div>

              <div className="form-group">
                <label>Parent Contact Phone</label>
                <input 
                  type="text" 
                  value={parentPhone} 
                  onChange={e => setParentPhone(e.target.value)} 
                  placeholder="e.g. +91 98765 43210" 
                  className="kid-input" 
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: '28px' }}>
                <label>Medical Allergies or Food Restrictions (Optional)</label>
                <input 
                  type="text" 
                  value={healthAlerts} 
                  onChange={e => setHealthAlerts(e.target.value)} 
                  placeholder="e.g. Peanut allergy, gluten-free" 
                  className="kid-input" 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowEnrollModal(false)} className="bubble-btn bubble-btn-outline" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                  Cancel
                </button>
                <button type="submit" className="bubble-btn bubble-btn-pink" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                  Apply For Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING CART SIDEBAR DRAWER */}
      {showCartPanel && (
        <div className="drawer-overlay" onClick={() => setShowCartPanel(false)}>
          <div className="drawer-container" onClick={e => e.stopPropagation()}>
            <div>
              <div className="drawer-header">
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart color="var(--color-pink)" />
                  <span>Shopping Cart</span>
                </h3>
                <button 
                  onClick={() => setShowCartPanel(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={26} />
                </button>
              </div>

              {/* Free Shipping Progress Tracker */}
              {cart.length > 0 && !checkoutSuccess && (
                <div className="drawer-shipping-meter">
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800' }}>
                    <span>{isFreeShipping ? '🎉 Free Sticker Pack Unlocked!' : 'Free Sticker Pack Progress'}</span>
                    <span style={{ color: 'var(--color-green)' }}>{isFreeShipping ? 'Qualified!' : `$${(50 - cartSubtotal).toFixed(2)} left`}</span>
                  </div>
                  <div className="drawer-shipping-bar">
                    <div style={{ height: '100%', width: `${shippingPercent}%`, backgroundColor: 'var(--color-green)' }} />
                  </div>
                </div>
              )}

              {checkoutSuccess ? (
                <div className="success-checkout-wrap">
                  <CheckCircle size={60} color="var(--color-green)" />
                  <h4 style={{ fontWeight: '900', fontSize: '1.25rem' }}>Purchase Successful!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', fontWeight: '600' }}>
                    We have received your purchase and will prepare the packages shortly.
                  </p>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '80px', color: 'var(--color-text-muted)' }}>
                  <ShoppingBag size={48} />
                  <span style={{ fontWeight: '800', fontSize: '1rem' }}>Your bag is empty!</span>
                  <button onClick={() => { setShowCartPanel(false); scrollToSection('estore'); }} className="bubble-btn bubble-btn-pink" style={{ padding: '8px 18px', fontSize: '0.82rem', marginTop: '10px' }}>
                    Browse Shop Items
                  </button>
                </div>
              ) : (
                <div className="drawer-items-list">
                  {cart.map((cartItem) => {
                    const prod = getProductDetails(cartItem.itemId);
                    if (!prod) return null;

                    return (
                      <div key={cartItem.itemId} className="drawer-item-row">
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          className="drawer-item-img"
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--color-dark)', lineHeight: '1.2' }}>
                            {prod.name}
                          </h4>
                          <span style={{ fontSize: '0.82rem', fontWeight: '900', color: 'var(--color-green)', marginTop: '2px', display: 'block' }}>
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="drawer-qty-controls">
                          <button 
                            onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity - 1)} 
                            className="drawer-qty-btn"
                          >
                            <Minus size={10} style={{ strokeWidth: 3 }} />
                          </button>
                          <span style={{ fontSize: '0.82rem', fontWeight: '900' }}>{cartItem.quantity}</span>
                          <button 
                            onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity + 1)} 
                            className="drawer-qty-btn"
                          >
                            <Plus size={10} style={{ strokeWidth: 3 }} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!checkoutSuccess && cart.length > 0 && (
              <div style={{ borderTop: '2px dashed var(--color-border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1.15rem', marginBottom: '20px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: 'var(--color-green)' }}>
                    ${cartSubtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      mockDataEngine.clearCart();
                      setCart([]);
                    }}
                    className="bubble-btn bubble-btn-outline"
                    style={{ padding: '12px' }}
                  >
                    <Trash2 size={16} />
                    <span>Clear</span>
                  </button>
                  <button onClick={handleCheckout} className="bubble-btn bubble-btn-pink" style={{ padding: '12px' }}>
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* GALLERY LIGHTBOX POPUP */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <img src={lightboxImg} alt="Lightbox View" className="lightbox-img" />
            <div 
              style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '100%', 
                backgroundColor: 'rgba(44, 62, 80, 0.8)', 
                color: '#FFFFFF', 
                padding: '16px 24px', 
                fontWeight: '800' 
              }}
            >
              {lightboxTitle}
            </div>
            <button className="lightbox-close" onClick={() => setLightboxImg(null)}>
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING TOAST */}
      {toastMessage && (
        <div className="toast-notif">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default App;
