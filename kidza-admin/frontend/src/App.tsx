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
  Calendar, 
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
  ShoppingBag
} from 'lucide-react';
import { mockDataEngine } from './utils/mockDataEngine';
import type { SchoolClass, Teacher, SchoolEvent, ShopItem, CartItem, SchoolNotice, ChatMessage } from './utils/mockDataEngine';
import './App.css';

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('home'); // 'home' | 'programs' | 'teachers' | 'shop' | 'notices' | 'gallery'
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Database State
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [events, setEvents] = useState<SchoolEvent[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notices, setNotices] = useState<SchoolNotice[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  
  // Interactive UI States
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  
  // Enroll Form States
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(3);
  const [childGender, setChildGender] = useState<'boy' | 'girl'>('boy');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [healthAlerts, setHealthAlerts] = useState('');

  // Shop States
  const [shopCategory, setShopCategory] = useState<string>('all');
  const [showCartPanel, setShowCartPanel] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Chat States
  const [chatRole, setChatRole] = useState<'principal' | 'parent'>('parent');
  const [typedMessage, setTypedMessage] = useState('');

  // Fetch Data
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
    // Auto-scroll hero carousel
    const timer = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName || !parentName || !parentPhone || !selectedClassId) {
      triggerToast("Please fill in all details! 🧸");
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

    // Reset Form
    setChildName('');
    setParentName('');
    setParentPhone('');
    setHealthAlerts('');
    setShowEnrollModal(false);
    loadData();
    triggerToast("Application submitted! We will contact you soon. 💌");
  };

  // Cart Handlers
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

  // Chat Messenger
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    mockDataEngine.sendMessage(chatRole, typedMessage.trim());
    setTypedMessage('');
    loadData();
    
    // Auto simulated reply from Principal after 1.5 seconds if sent by parent
    if (chatRole === 'parent') {
      setTimeout(() => {
        mockDataEngine.sendMessage(
          'principal',
          "Thank you for contacting Kidza Support! Miss Ruby Lawson has received your note and will review it shortly. Have a bright day! 🌞"
        );
        loadData();
      }, 1500);
    }
  };

  // Dynamic calculations
  const getDaysCount = (dateStr: string) => {
    const today = new Date('2026-06-15'); // local current date
    const target = new Date(dateStr);
    today.setHours(0,0,0,0);
    target.setHours(0,0,0,0);
    const diff = target.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today!';
    if (days < 0) return 'Passed';
    return `${days} Days Left`;
  };

  // Data helpers

  const getTeacherName = (tId: string) => {
    const target = teachers.find(t => t.id === tId);
    return target ? target.name : 'Miss Clara Henderson';
  };

  const getProductDetails = (id: string) => {
    return shopItems.find(p => p.id === id);
  };

  // Hero Carousel Slides Content
  const heroSlides = [
    {
      title: "Play, Learn, Grow & Excel!",
      subtitle: "Welcome to Kidza Pre-school & Nursery 🧸",
      desc: "Our child-centric early education curriculum focuses on fine motor skill development, creative thinking, and playful social interaction inside highly secure smart classrooms.",
      btn1: "Enroll My Child",
      btn2: "Browse Programs",
      img: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600"
    },
    {
      title: "Vibrant and Creative Classrooms",
      subtitle: "Nurturing Curious Creative Minds 🎨",
      desc: "Through finger painting, sensory sand play, storytelling, and interactive puppet theaters, we make every single school day a magical journey of discovery.",
      btn1: "Schedule Visit",
      btn2: "Meet Teachers",
      img: "https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=600"
    },
    {
      title: "Healthy Growth & Safety First",
      subtitle: "Certified Pediatric Care & Organic Meals 🍏",
      desc: "Kidza offers 100% nut-free organic meals daily, strict flu screening gates, and CPR-certified staff, ensuring parents sleep soundly while kids learn.",
      btn1: "View Menu",
      btn2: "School Security",
      img: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=600"
    }
  ];

  // Testimonials content
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

  return (
    <div className="site-wrapper">
      {/* Background doodles */}
      <div className="doodle-bg" />

      {/* Top Banner Ribbon */}
      <div 
        style={{ 
          backgroundColor: '#FF6B6B', 
          color: '#FFFFFF', 
          fontSize: '0.82rem', 
          fontWeight: '800', 
          padding: '8px 40px', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={14} />
          <span>Admissions open for Summer Semester 2026! Apply today.</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Phone size={13} /> +1 (800) 555-KIDZ
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={13} /> 74 Kidza Avenue, Creative Hills
          </span>
        </span>
      </div>

      {/* Sticky Navigation Header */}
      <header className="sticky-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('home')}>
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #FF6B6B, #FFD93D)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: '900',
              fontSize: '1.3rem',
              fontFamily: "'Fredoka', sans-serif",
              border: '2px solid #FFFFFF',
              boxShadow: '0 4px 10px rgba(255, 107, 107, 0.2)'
            }}
          >
            K
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontFamily: "'Fredoka', sans-serif", fontSize: '1.5rem', fontWeight: '900', color: '#2C3E50', lineHeight: '1.1' }}>
              Kidza
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: '800', color: '#FF6B6B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Kindergarten
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <ul className="nav-links">
          <li className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>Home</li>
          <li className={`nav-item ${activeTab === 'programs' ? 'active' : ''}`} onClick={() => setActiveTab('programs')}>Programs</li>
          <li className={`nav-item ${activeTab === 'teachers' ? 'active' : ''}`} onClick={() => setActiveTab('teachers')}>Teachers</li>
          <li className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`} onClick={() => setActiveTab('shop')}>E-Store</li>
          <li className={`nav-item ${activeTab === 'notices' ? 'active' : ''}`} onClick={() => { setActiveTab('notices'); loadData(); }}>Parent Portal & Chat</li>
        </ul>

        {/* Right Action Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Cart trigger */}
          <button 
            onClick={() => setShowCartPanel(true)}
            style={{
              position: 'relative',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#3D4A59',
              padding: '6px'
            }}
          >
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#FF6B6B',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: '900',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #FFFFFF'
                }}
              >
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          <button 
            onClick={() => {
              if (classes.length > 0) setSelectedClassId(classes[0].id);
              setShowEnrollModal(true);
            }} 
            className="kid-btn btn-pink"
            style={{ padding: '10px 24px', fontSize: '0.9rem' }}
          >
            Enroll Now <ArrowRight size={15} />
          </button>
        </div>
      </header>

      {/* RENDER VIEWS */}

      {activeTab === 'home' && (
        <>
          {/* HERO SECTION CAROUSEL */}
          <section className="hero-section">
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
                  className="kid-btn btn-pink"
                >
                  {heroSlides[heroIndex].btn1}
                </button>
                <button onClick={() => setActiveTab('programs')} className="kid-btn btn-yellow">
                  {heroSlides[heroIndex].btn2}
                </button>
              </div>

              {/* Dot Indicators */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '40px' }}>
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setHeroIndex(idx)}
                    style={{
                      width: heroIndex === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '99px',
                      border: 'none',
                      backgroundColor: heroIndex === idx ? '#FF6B6B' : '#E5DEC9',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="hero-image-area">
              <div className="hero-blob" />
              <img 
                src={heroSlides[heroIndex].img} 
                alt="Kidza Kids" 
                className="hero-img"
              />
              {/* Floating cute layout indicators */}
              <div 
                style={{
                  position: 'absolute',
                  top: '10%',
                  left: '10%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '10px 14px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transform: 'rotate(-8deg)',
                  zIndex: 10
                }}
                className="animate-float"
              >
                <Smile color="#FFD93D" size={20} />
                <span style={{ fontWeight: '800', fontSize: '0.8rem', color: '#3D4A59' }}>100% Fun Playtime</span>
              </div>
            </div>
          </section>

          {/* Section Divider Wave */}
          <div className="wave-divider" style={{ backgroundColor: '#FFFFFF' }}>
            <svg viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24C120 24 240 0 360 0C480 0 600 24 720 24C840 24 960 0 1080 0C1200 0 1320 24 1440 24V74H0V24Z" fill="#FAF8F5"/>
            </svg>
          </div>

          {/* FEATURED SERVICES SECTION */}
          <section className="section section-bg-light">
            <div className="section-title">
              <span style={{ backgroundColor: '#FFF0F0', color: '#FF6B6B' }}>Core Pillars</span>
              <h2>Why Parents Love Kidza</h2>
            </div>

            <div className="services-grid">
              
              <div className="service-card" style={{ borderBottom: '6px solid #FF6B6B' }}>
                <div className="service-icon-wrapper" style={{ backgroundColor: '#FFF0F0', color: '#FF6B6B' }}>
                  <Smile size={36} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px' }}>Interactive Play</h3>
                <p style={{ fontSize: '0.88rem', color: '#7F8C8D', lineHeight: '1.5' }}>
                  Fine motor skills and sensory developments via custom crafted playhouses and interactive sandboxes.
                </p>
              </div>

              <div className="service-card" style={{ borderBottom: '6px solid #FFD93D' }}>
                <div className="service-icon-wrapper" style={{ backgroundColor: '#FFFDF0', color: '#D4AF37' }}>
                  <Award size={36} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px' }}>Certified Staff</h3>
                <p style={{ fontSize: '0.88rem', color: '#7F8C8D', lineHeight: '1.5' }}>
                  Every educator has child psychology backgrounds and certified first-aid qualifications.
                </p>
              </div>

              <div className="service-card" style={{ borderBottom: '6px solid #4D96FF' }}>
                <div className="service-icon-wrapper" style={{ backgroundColor: '#F0F6FF', color: '#4D96FF' }}>
                  <Palette size={36} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '12px' }}>Creative Labs</h3>
                <p style={{ fontSize: '0.88rem', color: '#7F8C8D', lineHeight: '1.5' }}>
                  Dedicated music classrooms and painting nurseries to foster artistic genius in toddler years.
                </p>
              </div>

            </div>
          </section>

          {/* ABOUT US SECTION */}
          <section className="section section-bg-white">
            <div className="about-split">
              <div className="about-img-area">
                <img 
                  src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600" 
                  alt="Kindergarten Classroom" 
                  className="about-img-main"
                />
                <div className="about-img-badge">
                  <h4 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#FFFFFF', lineHeight: '1' }}>10+</h4>
                  <p style={{ fontSize: '0.75rem', fontWeight: '800', color: '#FFFFFF', textTransform: 'uppercase' }}>Years of trust</p>
                </div>
              </div>

              <div className="about-content">
                <span style={{ color: '#6BCB77', fontWeight: '800', textTransform: 'uppercase', fontSize: '0.85rem' }}>Welcome to learning</span>
                <h2 style={{ fontSize: '2.4rem', fontWeight: '900', marginTop: '8px', lineHeight: '1.2', fontFamily: "'Fredoka', sans-serif" }}>
                  A Safe, Vibrant & Caring Environment For Early Childhood Development
                </h2>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', marginTop: '16px', lineHeight: '1.6' }}>
                  Kidza provides a stimulating nursery and pre-school syllabus tailored specifically for children ages 2 to 6. Our smart classrooms encourage group activities, helping toddlers build communication skills, phonics reading habits, and geometric logic structures in a fun environment.
                </p>

                <ul className="about-list">
                  <li className="about-list-item">
                    <span className="about-list-icon">✓</span> <span>Modern Smart Toy Labs</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-icon">✓</span> <span>100% Certified Nut-free Meals</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-icon">✓</span> <span>Pediatrician Screenings Gate</span>
                  </li>
                  <li className="about-list-item">
                    <span className="about-list-icon">✓</span> <span>High Security Bus Transport</span>
                  </li>
                </ul>

                <button onClick={() => setActiveTab('programs')} className="kid-btn btn-pink">
                  Explore Programs <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>

          {/* DYNAMIC PROGRAMS / CLASSES GRID */}
          <section className="section section-bg-light">
            <div className="section-title">
              <span style={{ backgroundColor: '#F0FFF2', color: '#6BCB77' }}>Classes catalog</span>
              <h2>Our Academic Programs</h2>
            </div>

            <div className="classes-catalog">
              {classes.slice(0, 3).map((cls) => {
                const getThemeColor = (col: string) => {
                  if (col === 'pink') return '#FF6B6B';
                  if (col === 'yellow') return '#FFD93D';
                  if (col === 'blue') return '#4D96FF';
                  if (col === 'green') return '#6BCB77';
                  return '#9B72AA';
                };
                const colHex = getThemeColor(cls.color);

                return (
                  <div key={cls.id} className="class-item-card" style={{ borderTop: `8px solid ${colHex}` }}>
                    <img 
                      src={
                        cls.id === 'c1' ? "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300" :
                        cls.id === 'c2' ? "https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=300" :
                        "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300"
                      }
                      alt={cls.name} 
                      className="class-item-img"
                    />
                    
                    <div className="class-item-content">
                      <div>
                        <div className="class-item-header">
                          <span 
                            className="kid-badge" 
                            style={{ 
                              backgroundColor: cls.color === 'yellow' ? '#FFFDF0' : `${colHex}15`, 
                              color: cls.color === 'yellow' ? '#D4AF37' : colHex 
                            }}
                          >
                            {cls.ageGroup}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '800' }}>{cls.room}</span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#2C3E50', marginBottom: '12px' }}>
                          {cls.name}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#7F8C8D', lineHeight: '1.5' }}>
                          Structured daily syllabus covering basic phonics, numbers sorting, creative drawing classes, and music routines.
                        </p>
                      </div>

                      <div>
                        {/* Capacity meter */}
                        <div style={{ marginTop: '16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '800', marginBottom: '4px' }}>
                            <span>Enrollment Seats:</span>
                            <span>{cls.enrolled} / {cls.capacity} filled</span>
                          </div>
                          <div style={{ width: '100%', height: '8px', backgroundColor: '#F1ECE6', borderRadius: '99px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(cls.enrolled/cls.capacity)*100}%`, backgroundColor: colHex }} />
                          </div>
                        </div>

                        <div className="class-meta-row">
                          <span>{cls.schedule.split(' - ')[0]}</span>
                          <button 
                            onClick={() => {
                              setSelectedClassId(cls.id);
                              setShowEnrollModal(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: colHex,
                              fontWeight: '800',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '0.82rem'
                            }}
                          >
                            Enroll Now →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <button onClick={() => setActiveTab('programs')} className="kid-btn btn-yellow">
                View All Programs
              </button>
            </div>
          </section>

          {/* STATS COUNTER RIBBON */}
          <div className="stats-ribbon">
            <div>
              <div className="stat-num" style={{ color: '#FF6B6B' }}>150+</div>
              <div className="stat-label">Active Kids</div>
            </div>
            <div>
              <div className="stat-num" style={{ color: '#FFD93D' }}>12+</div>
              <div className="stat-label">Smart Rooms</div>
            </div>
            <div>
              <div className="stat-num" style={{ color: '#4D96FF' }}>100%</div>
              <div className="stat-label">Organic Menu</div>
            </div>
            <div>
              <div className="stat-num" style={{ color: '#6BCB77' }}>15+</div>
              <div className="stat-label">Activities</div>
            </div>
          </div>

          {/* SCHOOL EVENTS PREVIEW */}
          <section className="section section-bg-white">
            <div className="section-title">
              <span style={{ backgroundColor: '#F8F2FC', color: '#9B72AA' }}>Calendar</span>
              <h2>Upcoming Outings & Fests</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
              {events.slice(0, 2).map((event) => {
                const getTheme = (col: string) => {
                  if (col === 'pink') return '#FF6B6B';
                  if (col === 'blue') return '#4D96FF';
                  return '#9B72AA';
                };
                const color = getTheme(event.color);

                return (
                  <div 
                    key={event.id}
                    className="kid-card"
                    style={{
                      borderLeft: `8px solid ${color}`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '24px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: '800', color: '#5A6E7F' }}>
                          <Calendar size={15} style={{ color }} />
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="kid-badge" style={{ backgroundColor: `${color}15`, color }}>
                          {getDaysCount(event.date)}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>{event.title}</h3>
                      <p style={{ fontSize: '0.85rem', color: '#7F8C8D', lineHeight: '1.5', marginBottom: '16px' }}>{event.description}</p>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', borderTop: '1.5px dashed #F1ECE6', paddingTop: '12px', fontSize: '0.78rem', fontWeight: '800', color: '#8E9FAA' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} style={{ color }} /> {event.time}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} style={{ color }} /> {event.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* DYNAMIC PARENTS TESTIMONIALS */}
          <section className="section section-bg-light">
            <div className="section-title">
              <span style={{ backgroundColor: '#FFFDF0', color: '#D4AF37' }}>Social Proof</span>
              <h2>What Parents Say About Us</h2>
            </div>

            <div className="testimonials-area">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "{testimonials[testimonialIndex].text}"
                </p>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[testimonialIndex].avatar} 
                    alt={testimonials[testimonialIndex].author} 
                    className="testimonial-avatar"
                  />
                  <div style={{ textAlign: 'left' }}>
                    <h4 style={{ fontWeight: '800', fontSize: '1rem', color: '#2C3E50' }}>{testimonials[testimonialIndex].author}</h4>
                    <span style={{ fontSize: '0.8rem', color: '#7F8C8D', fontWeight: '700' }}>{testimonials[testimonialIndex].role}</span>
                  </div>
                </div>
              </div>

              {/* Sliders buttons */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
                <button 
                  onClick={() => setTestimonialIndex(prev => (prev - 1 + testimonials.length) % testimonials.length)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #F1ECE6',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8E9FAA',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => setTestimonialIndex(prev => (prev + 1) % testimonials.length)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    border: '2px solid #F1ECE6',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#8E9FAA',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </section>

          {/* DYNAMIC SCHOOL GALLERY */}
          <section className="section section-bg-white">
            <div className="section-title">
              <span style={{ backgroundColor: '#F0F6FF', color: '#4D96FF' }}>Our Memories</span>
              <h2>Nursery Gallery & Moments</h2>
            </div>

            <div className="gallery-grid">
              <div className="gallery-item"><img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=300" alt="Moment 1" /></div>
              <div className="gallery-item"><img src="https://images.unsplash.com/photo-1576489922094-2cfe89fb1733?w=300" alt="Moment 2" /></div>
              <div className="gallery-item"><img src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=300" alt="Moment 3" /></div>
              <div className="gallery-item"><img src="https://images.unsplash.com/photo-1540479859555-17af45c78602?w=300" alt="Moment 4" /></div>
            </div>
          </section>
        </>
      )}

      {/* PROGRAMS PAGE VIEW */}
      {activeTab === 'programs' && (
        <section className="section section-bg-light">
          <div className="section-title">
            <span style={{ backgroundColor: '#FFFDF0', color: '#D4AF37' }}>Syllabus</span>
            <h2>Our Education Curriculums</h2>
          </div>

          <div className="classes-catalog">
            {classes.map((cls) => {
              const getThemeColor = (col: string) => {
                if (col === 'pink') return '#FF6B6B';
                if (col === 'yellow') return '#FFD93D';
                if (col === 'blue') return '#4D96FF';
                if (col === 'green') return '#6BCB77';
                return '#9B72AA';
              };
              const colHex = getThemeColor(cls.color);

              return (
                <div key={cls.id} className="class-item-card" style={{ borderTop: `8px solid ${colHex}` }}>
                  <div className="class-item-content" style={{ minHeight: '220px' }}>
                    <div>
                      <div className="class-item-header">
                        <span 
                          className="kid-badge" 
                          style={{ 
                            backgroundColor: cls.color === 'yellow' ? '#FFFDF0' : `${colHex}15`, 
                            color: cls.color === 'yellow' ? '#D4AF37' : colHex 
                          }}
                        >
                          {cls.ageGroup}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#8E9FAA', fontWeight: '800' }}>{cls.room}</span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2C3E50', marginBottom: '12px' }}>
                        {cls.name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#7F8C8D', lineHeight: '1.5' }}>
                        Class timings: **{cls.schedule}**. Lead teacher: **{getTeacherName(cls.teacherId)}**. Designed for social and linguistic preparation.
                      </p>
                    </div>

                    <div>
                      {/* Capacity progress */}
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: '800', marginBottom: '4px' }}>
                          <span>Enrollment Capacity:</span>
                          <span>{cls.enrolled} / {cls.capacity} kids</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#F1ECE6', borderRadius: '99px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${(cls.enrolled/cls.capacity)*100}%`, backgroundColor: colHex }} />
                        </div>
                      </div>

                      <div className="class-meta-row">
                        <span>Daily Checked In</span>
                        <button 
                          onClick={() => {
                            setSelectedClassId(cls.id);
                            setShowEnrollModal(true);
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: colHex,
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.82rem'
                          }}
                        >
                          Enroll Child →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TEACHERS PAGE VIEW */}
      {activeTab === 'teachers' && (
        <section className="section section-bg-light">
          <div className="section-title">
            <span style={{ backgroundColor: '#F8F2FC', color: '#9B72AA' }}>Educators</span>
            <h2>Meet Our Expert Staff</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px', maxWidth: '1000px', margin: '0 auto' }}>
            {teachers.map((teacher) => {
              return (
                <div 
                  key={teacher.id} 
                  className="kid-card"
                  style={{
                    display: 'flex',
                    gap: '20px',
                    alignItems: 'flex-start'
                  }}
                >
                  <img 
                    src={teacher.avatar} 
                    alt={teacher.name} 
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '24px',
                      objectFit: 'cover',
                      border: '4px solid #F1ECE6'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#3D4A59' }}>{teacher.name}</h3>
                    <span className="kid-badge badge-purple" style={{ alignSelf: 'flex-start' }}>{teacher.subject}</span>
                    <p style={{ fontSize: '0.8rem', color: '#7F8C8D', lineHeight: '1.4', fontStyle: 'italic' }}>
                      "{teacher.bio}"
                    </p>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', fontWeight: '800', color: '#FFD93D', marginTop: '4px', borderTop: '1.5px dashed #F1ECE6', paddingTop: '10px' }}>
                      <Star size={15} fill="#FFD93D" />
                      <span style={{ color: '#3D4A59' }}>{teacher.rating} / 5.0 (Rating)</span>
                      <span style={{ color: '#8E9FAA', marginLeft: 'auto' }}>Exp: {teacher.experience}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SHOP PAGE VIEW */}
      {activeTab === 'shop' && (
        <section className="section section-bg-light">
          <div className="section-title">
            <span style={{ backgroundColor: '#FFF0F0', color: '#FF6B6B' }}>E-shop</span>
            <h2>School Accessories & Uniforms</h2>
          </div>

          {/* Catalog Controls */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', justifyContent: 'center', marginBottom: '24px' }}>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'uniforms', label: 'Uniforms' },
              { id: 'books', label: 'Books' },
              { id: 'kits', label: 'Art Kits' },
              { id: 'accessories', label: 'Accessories' }
            ].map(c => (
              <button
                key={c.id}
                onClick={() => setShopCategory(c.id)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  border: '2px solid #F1ECE6',
                  cursor: 'pointer',
                  backgroundColor: shopCategory === c.id ? '#FF6B6B' : '#FFFFFF',
                  color: shopCategory === c.id ? '#FFFFFF' : '#8E9FAA',
                  fontWeight: '800',
                  fontSize: '0.85rem'
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="classes-catalog">
            {shopItems.filter(p => shopCategory === 'all' || p.category === shopCategory).map((prod) => (
              <div key={prod.id} className="class-item-card" style={{ padding: '12px' }}>
                <div style={{ width: '100%', height: '180px', borderRadius: '20px', overflow: 'hidden', border: '1.5px solid #F1ECE6', position: 'relative' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {!prod.inStock && (
                    <div style={{ position: 'absolute', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFFFFF', fontWeight:'800', fontSize:'0.82rem' }}>
                      Out of Stock
                    </div>
                  )}
                </div>
                
                <div style={{ padding: '12px 6px 6px' }}>
                  <h4 style={{ fontWeight: '800', fontSize: '0.95rem', color: '#3D4A59', marginBottom: '6px' }}>{prod.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1.5px dashed #F1ECE6', paddingTop: '10px', marginTop: '10px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: '900', color: '#6BCB77' }}>${prod.price.toFixed(2)}</span>
                    <button 
                      disabled={!prod.inStock} 
                      onClick={() => handleAddToCart(prod.id)}
                      className="kid-btn btn-pink"
                      style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.78rem' }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NOTICE BOARD & CHAT PARENTS PORTAL */}
      {activeTab === 'notices' && (
        <section className="section section-bg-light" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Left: Notices */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#3D4A59' }}>School Announcements</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notices.map((n) => (
                <div 
                  key={n.id} 
                  className="kid-card"
                  style={{ 
                    borderLeft: `6px solid ${n.category === 'urgent' ? '#FF6B6B' : '#4D96FF'}`, 
                    padding: '16px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: '900', color: '#8E9FAA' }}>{n.category}</span>
                    <span style={{ fontSize: '0.7rem', color: '#8E9FAA', fontWeight: '700' }}>{n.date}</span>
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: '#3D4A59' }}>{n.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: '#7F8C8D', marginTop: '4px', lineHeight: '1.4' }}>{n.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Direct chat simulation */}
          <div className="kid-card" style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Toggle user role for testing chat */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #F1ECE6', paddingBottom: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src={chatRole === 'parent' 
                      ? "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150" // Ruby Lawson
                      : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" // Parent Datta
                    }
                    alt="co-ord"
                    style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '0.88rem', fontWeight: '800' }}>
                      {chatRole === 'parent' ? 'Miss Ruby Lawson (Principal)' : 'Datta Panchal (Parent)'}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: '#6BCB77', fontWeight: '800' }}>Active Chat Connection</span>
                  </div>
                </div>

                <button 
                  onClick={() => setChatRole(prev => prev === 'principal' ? 'parent' : 'principal')}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    border: '1.5px dashed #FF6B6B',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: '#FF6B6B',
                    backgroundColor: '#FFF0F0'
                  }}
                >
                  Send as: {chatRole === 'parent' ? 'Parent' : 'Principal'}
                </button>
              </div>
            </div>

            {/* Chat Box */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
              {chatMessages.map((msg) => {
                const isMe = (chatRole === 'parent' && msg.sender === 'parent') || 
                             (chatRole === 'principal' && msg.sender === 'principal');
                
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div 
                      style={{
                        padding: '10px 14px',
                        borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        backgroundColor: isMe ? '#FF6B6B' : '#F0F6FF',
                        color: isMe ? '#FFFFFF' : '#3D4A59',
                        maxWidth: '80%',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      <p>{msg.text}</p>
                      <span style={{ fontSize: '0.62rem', opacity: '0.8', display: 'block', textAlign: 'right', marginTop: '2px' }}>{msg.timestamp}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Send form */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                value={typedMessage} 
                onChange={e => setTypedMessage(e.target.value)} 
                placeholder="Type your message..." 
                className="kid-input" 
                style={{ flex: 1 }}
              />
              <button type="submit" className="kid-btn btn-pink" style={{ padding: '8px 12px', borderRadius: '10px' }}>
                <Send size={15} />
              </button>
            </form>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="cloud-footer">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 style={{ fontFamily: "'Fredoka', sans-serif" }}>About Kidza</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '16px', lineHeight: '1.6' }}>
              Kidza is a modern, colorful preschool and daycare center supporting play-based early learning, creative arts, and basic motor skill development for toddlers.
            </p>
          </div>

          <div className="footer-col">
            <h3>Quick Links</h3>
            <ul className="footer-links" style={{ marginTop: '16px' }}>
              <li onClick={() => setActiveTab('home')}>Homepage</li>
              <li onClick={() => setActiveTab('programs')}>Educational Syllabus</li>
              <li onClick={() => setActiveTab('teachers')}>School Faculty</li>
              <li onClick={() => setActiveTab('shop')}>Shopping Store</li>
              <li onClick={() => setActiveTab('notices')}>Notice Board</li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>School Hours</h3>
            <ul className="footer-links" style={{ marginTop: '16px', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              <li>Playgroup: 09:00 AM - 12:00 PM</li>
              <li>Nursery: 09:00 AM - 01:00 PM</li>
              <li>LKG & UKG: 08:30 AM - 02:00 PM</li>
              <li>Office Hours: Monday - Friday</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', borderTop: '2px solid #F1ECE6', marginTop: '50px', paddingTop: '20px', fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: '700' }}>
          © 2026 Kidza Pre-school Portal. Built with care for children, parents, and schools.
        </div>
      </footer>

      {/* ENROLL MODAL DIALOG */}
      {showEnrollModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(61, 74, 89, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div 
            className="kid-card animate-float"
            style={{
              width: '100%',
              maxWidth: '520px',
              backgroundColor: '#FFFFFF',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #F1ECE6', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <GraduationCap color="#FF6B6B" />
                <span>Admission Enrollment Application</span>
              </h3>
              <button 
                onClick={() => setShowEnrollModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
              >
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleEnrollSubmit}>
              <div className="form-group">
                <label>Child's Full Name</label>
                <input 
                  type="text" 
                  value={childName} 
                  onChange={e => setChildName(e.target.value)} 
                  placeholder="e.g. Aarav Panchal" 
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
                <label>Target Class / Program</label>
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

              <div className="form-group" style={{ marginBottom: '24px' }}>
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
                <button type="button" onClick={() => setShowEnrollModal(false)} className="kid-btn btn-outline" style={{ padding: '8px 18px', fontSize: '0.9rem' }}>
                  Cancel
                </button>
                <button type="submit" className="kid-btn btn-pink" style={{ padding: '8px 24px', fontSize: '0.9rem' }}>
                  Apply For Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING CART PANEL */}
      {showCartPanel && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(61, 74, 89, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 3000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '400px',
              backgroundColor: '#FFFFFF',
              height: '100%',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '-10px 0 30px rgba(0,0,0,0.1)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F1ECE6', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShoppingCart color="#FF6B6B" />
                  <span>Shopping Cart</span>
                </h3>
                <button 
                  onClick={() => setShowCartPanel(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8E9FAA' }}
                >
                  <X size={24} />
                </button>
              </div>

              {checkoutSuccess ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginTop: '60px' }}>
                  <CheckCircle size={56} color="#6BCB77" />
                  <h4 style={{ fontWeight: '800', fontSize: '1.15rem' }}>Order Placed Successfully!</h4>
                  <p style={{ fontSize: '0.85rem', color: '#8E9FAA', textAlign: 'center' }}>We have received your purchase and will prepare the packages shortly.</p>
                </div>
              ) : cart.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '60px', color: '#8E9FAA' }}>
                  <ShoppingBag size={42} />
                  <span style={{ fontWeight: '700' }}>Your bag is empty!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '60vh', overflowY: 'auto' }}>
                  {cart.map((cartItem) => {
                    const prod = getProductDetails(cartItem.itemId);
                    if (!prod) return null;

                    return (
                      <div 
                        key={cartItem.itemId}
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                          padding: '12px',
                          border: '2px solid #F1ECE6',
                          borderRadius: '16px'
                        }}
                      >
                        <img 
                          src={prod.image} 
                          alt={prod.name} 
                          style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '10px' }}
                        />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#3D4A59', lineHeight: '1.2' }}>{prod.name}</h4>
                          <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#6BCB77', marginTop: '2px', display: 'block' }}>
                            ${prod.price.toFixed(2)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FAF8F5', borderRadius: '8px', padding: '2px' }}>
                          <button onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity - 1)} style={{ background:'none', border:'none', cursor:'pointer' }}><Minus size={10} /></button>
                          <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>{cartItem.quantity}</span>
                          <button onClick={() => handleUpdateQty(cartItem.itemId, cartItem.quantity + 1)} style={{ background:'none', border:'none', cursor:'pointer' }}><Plus size={10} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {!checkoutSuccess && cart.length > 0 && (
              <div style={{ borderTop: '2px solid #F1ECE6', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.05rem', marginBottom: '16px' }}>
                  <span>Total Amount:</span>
                  <span style={{ color: '#6BCB77' }}>
                    ${cart.reduce((sum, item) => sum + ((getProductDetails(item.itemId)?.price || 0) * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                  <button 
                    onClick={() => {
                      mockDataEngine.clearCart();
                      setCart([]);
                    }}
                    style={{
                      border: '2px solid #FF6B6B',
                      backgroundColor: 'transparent',
                      color: '#FF6B6B',
                      padding: '12px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={16} />
                    <span>Clear</span>
                  </button>
                  <button onClick={handleCheckout} className="kid-btn btn-pink" style={{ padding: '12px', borderRadius: '12px' }}>
                    Checkout
                  </button>
                </div>
              </div>
            )}
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
