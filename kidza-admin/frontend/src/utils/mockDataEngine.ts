// Kidza Local Storage Mock Database Engine

export interface SchoolClass {
  id: string;
  name: string;
  ageGroup: string;
  capacity: number;
  enrolled: number;
  teacherId: string;
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'purple';
  schedule: string;
  room: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  age: number;
  gender: 'boy' | 'girl';
  attendanceStatus: 'present' | 'absent' | 'late' | 'none';
  parentName: string;
  parentPhone: string;
  avatar: string;
  healthNotes?: string;
  feesPaid: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  avatar: string;
  email: string;
  rating: number;
  experience: string;
  classes: string[];
  bio: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  color: 'pink' | 'yellow' | 'blue' | 'green' | 'purple';
  description: string;
}

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: 'uniforms' | 'books' | 'kits' | 'accessories';
  image: string;
  rating: number;
  inStock: boolean;
}

export interface CartItem {
  itemId: string;
  quantity: number;
}

export interface SchoolNotice {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'urgent' | 'general' | 'holiday' | 'event';
  postedBy: string;
}

export interface ChatMessage {
  id: string;
  sender: 'principal' | 'parent';
  text: string;
  timestamp: string;
}

// Initial Seed Data
const defaultClasses: SchoolClass[] = [
  { id: 'c1', name: 'Playgroup Jellyfish', ageGroup: '2 - 3 Years', capacity: 15, enrolled: 12, teacherId: 't1', color: 'pink', schedule: '09:00 AM - 12:00 PM', room: 'Room A (Sunbeams)' },
  { id: 'c2', name: 'Nursery Little Bears', ageGroup: '3 - 4 Years', capacity: 20, enrolled: 18, teacherId: 't2', color: 'yellow', schedule: '09:00 AM - 01:00 PM', room: 'Room B (Honey Pots)' },
  { id: 'c3', name: 'LKG Flying Birds', ageGroup: '4 - 5 Years', capacity: 20, enrolled: 19, teacherId: 't3', color: 'blue', schedule: '09:00 AM - 01:30 PM', room: 'Room C (Sky High)' },
  { id: 'c4', name: 'UKG Super Stars', ageGroup: '5 - 6 Years', capacity: 25, enrolled: 22, teacherId: 't4', color: 'green', schedule: '08:30 AM - 02:00 PM', room: 'Room D (Milky Way)' },
  { id: 'c5', name: 'Art & Craft Masters', ageGroup: '3 - 6 Years', capacity: 15, enrolled: 10, teacherId: 't1', color: 'purple', schedule: '02:30 PM - 04:00 PM', room: 'Creative Lab' }
];

const defaultTeachers: Teacher[] = [
  {
    id: 't1',
    name: 'Miss Clara Henderson',
    subject: 'Early Childhood Development & Art',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    email: 'clara.henderson@kidza.edu',
    rating: 4.9,
    experience: '6 Years',
    classes: ['Playgroup Jellyfish', 'Art & Craft Masters'],
    bio: 'Clara loves using finger painting and sensory learning to encourage creativity and muscle development in toddlers.'
  },
  {
    id: 't2',
    name: 'Mrs. Evelyn Stone',
    subject: 'Nursery Coordinator & Phonics',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    email: 'evelyn.stone@kidza.edu',
    rating: 4.8,
    experience: '8 Years',
    classes: ['Nursery Little Bears'],
    bio: 'Evelyn is a phonics specialist who makes reading fun for children through music, storytelling, and puppet shows.'
  },
  {
    id: 't3',
    name: 'Mr. David Archer',
    subject: 'LKG Advisor & Basic Math',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    email: 'david.archer@kidza.edu',
    rating: 4.7,
    experience: '5 Years',
    classes: ['LKG Flying Birds'],
    bio: 'David focuses on logical building, shapes sorting, and spatial intelligence games to build a strong math base early.'
  },
  {
    id: 't4',
    name: 'Miss Ruby Lawson',
    subject: 'UKG Main Coordinator & Languages',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    email: 'ruby.lawson@kidza.edu',
    rating: 5.0,
    experience: '10 Years',
    classes: ['UKG Super Stars'],
    bio: 'Ruby is passionate about child bilingual literacy and school readiness, preparing senior kids for primary school environments.'
  }
];

const defaultStudents: Student[] = [
  { id: 's1', name: 'Aarav Panchal', classId: 'c2', age: 3, gender: 'boy', attendanceStatus: 'present', parentName: 'Datta Panchal', parentPhone: '+91 98765 43210', avatar: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=150', healthNotes: 'Allergic to Peanuts', feesPaid: true },
  { id: 's2', name: 'Mia Watson', classId: 'c1', age: 2, gender: 'girl', attendanceStatus: 'present', parentName: 'John Watson', parentPhone: '+1 415 555 2671', avatar: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=150', healthNotes: 'Asthmatic, inhaler in backpack', feesPaid: true },
  { id: 's3', name: 'Arjun Sharma', classId: 'c3', age: 4, gender: 'boy', attendanceStatus: 'late', parentName: 'Ramesh Sharma', parentPhone: '+91 99887 76655', avatar: 'https://images.unsplash.com/photo-1602052786794-70642a0b3967?w=150', feesPaid: false },
  { id: 's4', name: 'Chloe Miller', classId: 'c3', age: 4, gender: 'girl', attendanceStatus: 'absent', parentName: 'Sarah Miller', parentPhone: '+1 650 555 0192', avatar: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=150', healthNotes: 'Lactose Intolerant', feesPaid: true },
  { id: 's5', name: 'Ryan Geller', classId: 'c4', age: 5, gender: 'boy', attendanceStatus: 'present', parentName: 'Monica Geller', parentPhone: '+1 212 555 8899', avatar: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=150', feesPaid: true },
  { id: 's6', name: 'Sophia Chen', classId: 'c4', age: 5, gender: 'girl', attendanceStatus: 'present', parentName: 'Li Chen', parentPhone: '+1 408 555 1204', avatar: 'https://images.unsplash.com/photo-1563530669-865a7f726a45?w=150', feesPaid: true },
  { id: 's7', name: 'Leo Martinez', classId: 'c2', age: 3, gender: 'boy', attendanceStatus: 'absent', parentName: 'Carlos Martinez', parentPhone: '+1 305 555 7711', avatar: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?w=150', feesPaid: false },
  { id: 's8', name: 'Emily Bennett', classId: 'c1', age: 2, gender: 'girl', attendanceStatus: 'present', parentName: 'Emma Bennett', parentPhone: '+44 7911 123456', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', feesPaid: true },
  { id: 's9', name: 'Kabir Verma', classId: 'c4', age: 5, gender: 'boy', attendanceStatus: 'present', parentName: 'Priya Verma', parentPhone: '+91 91122 33445', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', feesPaid: true },
  { id: 's10', name: 'Zara Patel', classId: 'c3', age: 4, gender: 'girl', attendanceStatus: 'present', parentName: 'Sanjay Patel', parentPhone: '+91 95555 00112', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', feesPaid: true }
];

const defaultEvents: SchoolEvent[] = [
  { id: 'e1', title: 'Grand Annual Sports Day', date: '2026-06-25', time: '09:00 AM', location: 'School Playground', color: 'pink', description: 'Fun sports activities, hurdle runs, sack races, and parent-teacher friendly tug-of-war.' },
  { id: 'e2', title: 'Splash Water Play Party', date: '2026-06-30', time: '10:30 AM', location: 'Kidza Mini Pool Area', color: 'blue', description: 'Inflatable pools, water sprinkler slides, and fresh melon snacks. Send swimsuits!' },
  { id: 'e3', title: 'Summer Art & Craft Exhibition', date: '2026-07-10', time: '02:00 PM', location: 'Exhibition Hall', color: 'purple', description: 'A showcase of finger paintings, clay creations, and papercrafts designed by our students.' },
  { id: 'e4', title: 'Daycare Excursion to City Zoo', date: '2026-07-20', time: '08:00 AM', location: 'City Zoological Park', color: 'green', description: 'Guided children safari tour to learn about wild animals, followed by a picnic lunch.' }
];

const defaultShopItems: ShopItem[] = [
  { id: 'sh1', name: 'Kidza Summer Dress Uniform', price: 24.99, category: 'uniforms', image: 'https://images.unsplash.com/photo-1622353110243-73d6ebef4271?w=300', rating: 4.8, inStock: true },
  { id: 'sh2', name: 'Kidza Dinosaur Ergonomic Backpack', price: 18.50, category: 'accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300', rating: 4.9, inStock: true },
  { id: 'sh3', name: 'Junior Finger Paint Kit (12 Colors)', price: 12.00, category: 'kits', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300', rating: 4.7, inStock: true },
  { id: 'sh4', name: 'Kidza Water bottle & Lunchbox Combo', price: 15.00, category: 'accessories', image: 'https://images.unsplash.com/photo-1591901007204-77209b0b4b24?w=300', rating: 4.6, inStock: true },
  { id: 'sh5', name: 'First Phonics Reading Book Series', price: 9.99, category: 'books', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300', rating: 5.0, inStock: true },
  { id: 'sh6', name: 'Safe Montessori Wooden Stacking Toys', price: 21.00, category: 'kits', image: 'https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=300', rating: 4.9, inStock: false }
];

const defaultNotices: SchoolNotice[] = [
  { id: 'n1', title: 'Summer Vacations Announcement', content: 'Dear parents, Kidza will remain closed for summer vacations from July 1st to July 15th. Daycare services will run at 50% capacity for working parents with advance booking.', date: '2026-06-12', category: 'holiday', postedBy: 'Principal Lawson' },
  { id: 'n2', title: 'Monsoon Flu Warning & Safety Measures', content: 'In light of seasonal viral changes, we request parents to keep kids home if they show symptoms of fever or cold. Daily temperature screenings are active at the school entrance gate.', date: '2026-06-14', category: 'urgent', postedBy: 'School Nurse Sarah' },
  { id: 'n3', title: 'Field Trip Permission Slips Due', content: 'Please submit the physical City Zoo permission slips and fee by June 28th to finalize the bus seating arrangements for your children.', date: '2026-06-15', category: 'event', postedBy: 'Admin Office' }
];

const defaultMessages: ChatMessage[] = [
  { id: 'm1', sender: 'parent', text: 'Hello, is Aarav taking his afternoon nap properly today?', timestamp: '01:15 PM' },
  { id: 'm2', sender: 'principal', text: 'Hello Datta! Yes, Aarav slept for 45 minutes after lunch and finished his fruits. He is now playing in the sandbox.', timestamp: '01:30 PM' },
  { id: 'm3', sender: 'parent', text: 'Great to hear! I will pick him up early at 4 PM today.', timestamp: '01:45 PM' }
];

// Helper to load/save in localStorage
const load = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(`kidza_${key}`);
  return data ? JSON.parse(data) : fallback;
};

const save = <T>(key: string, data: T): void => {
  localStorage.setItem(`kidza_${key}`, JSON.stringify(data));
};

// Database Engine Methods
export const mockDataEngine = {
  // Portal Roles
  getCurrentRole: (): 'admin' | 'parent' => {
    return load<'admin' | 'parent'>('user_role', 'admin');
  },
  
  setCurrentRole: (role: 'admin' | 'parent'): void => {
    save<'admin' | 'parent'>('user_role', role);
  },

  // Classes CRUD
  getClasses: (): SchoolClass[] => {
    return load<SchoolClass[]>('classes', defaultClasses);
  },

  addClass: (newClass: Omit<SchoolClass, 'id' | 'enrolled'>): SchoolClass => {
    const classes = mockDataEngine.getClasses();
    const createdClass: SchoolClass = {
      ...newClass,
      id: `c_${Date.now()}`,
      enrolled: 0
    };
    classes.push(createdClass);
    save('classes', classes);
    return createdClass;
  },

  updateClassEnrollment: (classId: string, diff: number): void => {
    const classes = mockDataEngine.getClasses();
    const target = classes.find(c => c.id === classId);
    if (target) {
      target.enrolled = Math.max(0, Math.min(target.capacity, target.enrolled + diff));
      save('classes', classes);
    }
  },

  // Students CRUD
  getStudents: (): Student[] => {
    return load<Student[]>('students', defaultStudents);
  },

  enrollStudent: (newStudent: Omit<Student, 'id' | 'attendanceStatus'>): Student => {
    const students = mockDataEngine.getStudents();
    const enrolledStudent: Student = {
      ...newStudent,
      id: `s_${Date.now()}`,
      attendanceStatus: 'none'
    };
    students.push(enrolledStudent);
    save('students', students);
    
    // Increment class size
    mockDataEngine.updateClassEnrollment(newStudent.classId, 1);
    
    return enrolledStudent;
  },

  deleteStudent: (studentId: string): void => {
    const students = mockDataEngine.getStudents();
    const target = students.find(s => s.id === studentId);
    if (target) {
      // Decrement class size
      mockDataEngine.updateClassEnrollment(target.classId, -1);
      const updated = students.filter(s => s.id !== studentId);
      save('students', updated);
    }
  },

  toggleAttendance: (studentId: string, status: Student['attendanceStatus']): void => {
    const students = mockDataEngine.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.attendanceStatus = status;
      save('students', students);
    }
  },

  updateStudentFees: (studentId: string, paid: boolean): void => {
    const students = mockDataEngine.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.feesPaid = paid;
      save('students', students);
    }
  },

  // Teachers CRUD
  getTeachers: (): Teacher[] => {
    return load<Teacher[]>('teachers', defaultTeachers);
  },

  rateTeacher: (teacherId: string, stars: number): void => {
    const teachers = mockDataEngine.getTeachers();
    const teacher = teachers.find(t => t.id === teacherId);
    if (teacher) {
      // Simple moving average simulation
      teacher.rating = parseFloat(((teacher.rating * 4 + stars) / 5).toFixed(2));
      save('teachers', teachers);
    }
  },

  // Events CRUD
  getEvents: (): SchoolEvent[] => {
    return load<SchoolEvent[]>('events', defaultEvents);
  },

  addEvent: (newEvent: Omit<SchoolEvent, 'id'>): SchoolEvent => {
    const events = mockDataEngine.getEvents();
    const createdEvent: SchoolEvent = {
      ...newEvent,
      id: `e_${Date.now()}`
    };
    events.push(createdEvent);
    save('events', events);
    return createdEvent;
  },

  // Notices CRUD
  getNotices: (): SchoolNotice[] => {
    return load<SchoolNotice[]>('notices', defaultNotices);
  },

  addNotice: (newNotice: Omit<SchoolNotice, 'id' | 'date'>): SchoolNotice => {
    const notices = mockDataEngine.getNotices();
    const createdNotice: SchoolNotice = {
      ...newNotice,
      id: `n_${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    notices.push(createdNotice);
    // Sort new notices first
    notices.sort((a, b) => b.date.localeCompare(a.date));
    save('notices', notices);
    return createdNotice;
  },

  // Shop & Shopping Cart
  getShopItems: (): ShopItem[] => {
    return load<ShopItem[]>('shop_items', defaultShopItems);
  },

  getCart: (): CartItem[] => {
    return load<CartItem[]>('cart', []);
  },

  addToCart: (itemId: string): void => {
    const cart = mockDataEngine.getCart();
    const existing = cart.find(c => c.itemId === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ itemId, quantity: 1 });
    }
    save('cart', cart);
  },

  updateCartQuantity: (itemId: string, quantity: number): void => {
    let cart = mockDataEngine.getCart();
    if (quantity <= 0) {
      cart = cart.filter(c => c.itemId !== itemId);
    } else {
      const item = cart.find(c => c.itemId === itemId);
      if (item) item.quantity = quantity;
    }
    save('cart', cart);
  },

  clearCart: (): void => {
    save('cart', []);
  },

  // Messages Chat Simulation
  getMessages: (): ChatMessage[] => {
    return load<ChatMessage[]>('messages', defaultMessages);
  },

  sendMessage: (sender: 'principal' | 'parent', text: string): ChatMessage => {
    const messages = mockDataEngine.getMessages();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender,
      text,
      timestamp: time
    };
    messages.push(newMessage);
    save('messages', messages);
    return newMessage;
  }
};
