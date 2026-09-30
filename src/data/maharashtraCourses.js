// Maharashtra Cultural Academies & Micro-Courses Dataset
// Sourced from accredited universities (SNDT, Mumbai University, COEP, BORI)
// and state artisan mastercraft guilds. Exactly 10 courses: 3 unlocked & 7 locked.
// Each course includes xpReward for gamified academy learning.

export const MAHARASHTRA_COURSES = [
  // ==========================================
  // UNLOCKED COURSES (1 to 3)
  // ==========================================
  {
    id: 'warli-painting',
    title: 'Warli Painting: The Tribal Art of Maharashtra',
    subtitle: 'Geometric Vocabulary of Triangles, Circles & Lines Depicting Daily Tribal Life',
    isLocked: false,
    category: 'Tribal Folk Art',
    level: 'Beginner to Intermediate',
    duration: '3 Modules • 6 Hours',
    rating: 4.9,
    enrolledCount: 3820,
    image: '/marketplace/warli_art.jpg',
    stamp: 'Warli Storyteller',
    xpReward: 150,
    overview: 'This course introduces learners to Warli painting, the ancient tribal art form of the Warli community from the Thane and Palghar districts of Maharashtra. Students learn the distinctive geometric vocabulary—triangles, circles, and lines—used to depict daily life, rituals, and nature.',
    structure: [
      {
        unit: 'Module 1',
        title: 'Introduction to Warli Art',
        desc: 'History, cultural context, and symbolism of motifs like the chauk (sacred square) and tarpa dance.'
      },
      {
        unit: 'Module 2',
        title: 'Techniques and Composition',
        desc: 'Use of natural colours (rice paste, mud), brush control, and constructing village life scenes.'
      },
      {
        unit: 'Module 3',
        title: 'Creative Application',
        desc: 'Creating original Warli compositions on canvas, fabric, or home decor items.'
      }
    ],
    interactivity: 'Each module ends with a "Warli Challenge" where learners recreate a scene from a folk tale using only Warli figures. Completing all three modules earns a "Warli Storyteller" stamp.',
    providers: 'SNDT University offers a credited course in Warli and Madhubani Art. Online platforms like Penkraft and Rooftop offer certified Warli courses with lifetime access.'
  },
  {
    id: 'lavani-dance',
    title: 'Lavani Dance: The Rhythm of Maharashtra',
    subtitle: 'Mujra Footwork, Dholki Cycles & Theatrical Abhinaya',
    isLocked: false,
    category: 'Performing Arts & Dance',
    level: 'Beginner to Advanced',
    duration: '4 Weeks • 8 Hours',
    rating: 4.8,
    enrolledCount: 2940,
    image: '/clothes/nauvari_saree.jpg',
    stamp: 'Lavani Star',
    xpReward: 200,
    overview: 'Lavani is Maharashtra\'s most expressive folk dance form, combining graceful mujra movements, rhythmic footwork, and theatrical expression (abhinaya). This course teaches the basics in a structured, culturally respectful environment.',
    structure: [
      {
        unit: 'Week 1',
        title: 'Introduction to Lavani',
        desc: 'History, the ghungroo (anklet bells), and the dholki rhythm cycle.'
      },
      {
        unit: 'Week 2',
        title: 'Footwork and Posture',
        desc: 'Theka (basic rhythm), mujra (salutation), and gavlan (village woman\'s style).'
      },
      {
        unit: 'Week 3',
        title: 'Expression and Choreography',
        desc: 'Facial expressions, hand gestures, and a complete sringarik lavani piece.'
      },
      {
        unit: 'Week 4',
        title: 'Performance & Costume',
        desc: 'Costume guidance, 9-yard Nauvari styling, and a final recorded performance.'
      }
    ],
    interactivity: 'Learners record a 60-second Lavani performance and share it in the Indiverse community for peer voting. Top performers earn a "Lavani Star" badge.',
    providers: 'The Maharashtra government\'s Directorate of Cultural Affairs conducts Lavani training camps. Aditi Bhagwat\'s Lavani workshops are available on District.in, and Udemy offers a beginner-friendly Lavani course with choreography.'
  },
  {
    id: 'paithani-weaving',
    title: 'Paithani Weaving: The Queen of Silks',
    subtitle: 'Yarn Preparation, Loom Setup & Royal Zari Peacock Motifs',
    isLocked: false,
    category: 'Textile Crafts & Handlooms',
    level: '3 Levels • Masterclass',
    duration: '3 Levels • 12 Hours',
    rating: 4.9,
    enrolledCount: 1850,
    image: '/clothes/paithani_saree.jpg',
    stamp: "Weaver's Apprentice",
    xpReward: 250,
    overview: 'Paithani is a handwoven silk saree from Paithan, Maharashtra, famous for its rich zari border and peacock or lotus motifs. This course covers the art of Paithani weaving, from yarn preparation to the final pallu design.',
    structure: [
      {
        unit: 'Level 1',
        title: 'Introduction to Paithani (Basic)',
        desc: 'History, GI status, and types (Yeola Paithani vs. Paithan Paithani).'
      },
      {
        unit: 'Level 2',
        title: 'Loom Setup & Motif Drafting (Intermediate)',
        desc: 'Loom setup, basic weave structures, and motif drafting (peacock, lotus, bangdi-mor).'
      },
      {
        unit: 'Level 3',
        title: 'Zari Work & Pallu Tapestry (Advanced)',
        desc: 'Zari work, colour blending, and creating a small Paithani sample.'
      }
    ],
    interactivity: 'Learners track their progress on a virtual loom. Completing Level 2 unlocks a "Weaver\'s Apprentice" stamp.',
    providers: 'MSSIDC and Snehalaya offer a nine-month Paithani weaving course with 20% theory and 80% practical training by traditional artisans. A Paithani Training and Development Centre was inaugurated at Jeevan Vikas Mahavidyalaya in Chhatrapati Sambhajinagar.'
  },

  // ==========================================
  // LOCKED COURSES (4 to 10 - Exactly 7 Locked)
  // ==========================================
  {
    id: 'natya-sangeet',
    title: 'Natya Sangeet: The Soul of Marathi Theatre',
    subtitle: 'Classical Raga Structures, Devotional Lok Sangeet & Natyageet',
    isLocked: true,
    category: 'Music & Theatre',
    level: 'Intermediate to Advanced',
    duration: '3 Units • 10 Hours',
    rating: 4.9,
    enrolledCount: 840,
    image: '/clothes/pheta.jpg',
    stamp: 'Natya Virtuoso',
    xpReward: 220,
    unlockRequirement: '🔒 Complete Warli Art & Lavani to unlock this masterclass',
    overview: 'Natya Sangeet is the musical backbone of Marathi theatre (Marathi Rangabhoomi), blending classical raga structures with devotional and theatrical expression. This course teaches the fundamentals of singing Natya Sangeet, from sargam exercises to performing a complete natyageet.',
    structure: [
      {
        unit: 'Unit 1',
        title: 'Folk Roots (Lok Sangeet)',
        desc: 'Ovi, bharud, powada, and koli geet.'
      },
      {
        unit: 'Unit 2',
        title: 'Devotional Forms (Dharma Sangeet)',
        desc: 'Abhang, viraani, aarti, and gondhal geet.'
      },
      {
        unit: 'Unit 3',
        title: 'Popular Forms (Jana Sangeet)',
        desc: 'Natyageet, lavani, and bhaveget.'
      }
    ],
    interactivity: 'Each unit includes a "Sing Along" exercise where learners record a short clip and receive AI-powered pitch and rhythm feedback.',
    providers: 'Modern College, Pune offers a credited TYBA Music course covering these forms. BV University also offers a curriculum covering bharud, gondhal, powada, and kirtan traditions.'
  },
  {
    id: 'dholki-tamasha',
    title: 'Dholki: The Rhythm of Tamasha',
    subtitle: 'Traditional Bols, Phunk Strokes, Powada & Lavani Thekas',
    isLocked: true,
    category: 'Percussion & Folk Rhythm',
    level: 'Beginner to Advanced',
    duration: '3 Tiers • 8 Hours',
    rating: 4.8,
    enrolledCount: 620,
    image: '/clothes/bandi_waistcoat.jpg',
    stamp: 'Rhythm Master',
    xpReward: 180,
    unlockRequirement: '🔒 Unlocks upon achieving Level 2 Rhythm Explorer',
    overview: 'The dholki (also called nal) is a barrel-shaped drum central to Maharashtra\'s Tamasha street performances and Lavani music. This course teaches the traditional rhythms of Maharashtra from the foundational theka to advanced laggis.',
    structure: [
      {
        unit: 'Beginner',
        title: 'Foundational Bols & Positioning',
        desc: 'Basic bols (strokes), hand positioning, and the theka for Lavani.'
      },
      {
        unit: 'Intermediate',
        title: 'Lag Patterns & Powada Accompaniment',
        desc: 'Lag patterns, phunk strokes, and accompanying powada rhythms.'
      },
      {
        unit: 'Advanced',
        title: 'Solo Stage Improvisation & Kirtan',
        desc: 'Solo improvisation, stage performance techniques, and kirtan accompaniment.'
      }
    ],
    interactivity: 'Learners unlock rhythm challenges as they progress. Completing the intermediate level earns a "Rhythm Master" stamp.',
    providers: 'Padmini Sangeet Vidyalay in Pune offers structured Dholki classes covering Marathi folk dholki, devotional beats, and kirtan rhythms. Ipassio offers an online Dholki course specifically focused on Tamasha and Lavani rhythms.'
  },
  {
    id: 'marathi-shivankala',
    title: 'Marathi Shivankala: Traditional Maharashtrian Embroidery',
    subtitle: 'Banjara Mirror-Work, Cowrie Shells & Aari Blouse Craft',
    isLocked: true,
    category: 'Handicrafts & Textile Arts',
    level: '3 Levels • Hands-On',
    duration: '3 Levels • 9 Hours',
    rating: 4.8,
    enrolledCount: 510,
    image: '/clothes/choli_blouse.jpg',
    stamp: 'Thread Artist',
    xpReward: 190,
    unlockRequirement: '🔒 Prerequisite: Paithani Weaving Level 1 required',
    overview: 'Marathi Shivankala (traditional Maharashtrian embroidery) includes techniques like Banjara embroidery, Aari work, and the embroidery styles found on nauvari sarees and Paithani blouses. This course covers both traditional and modern embroidery techniques.',
    structure: [
      {
        unit: 'Level 1',
        title: 'Basic Stitches & Mirror Work',
        desc: 'Running stitch, chain stitch, and authentic mirror work.'
      },
      {
        unit: 'Level 2',
        title: 'Banjara Tribal Embroidery',
        desc: 'Colourful threads, mirrors, cowrie shells, and beads.'
      },
      {
        unit: 'Level 3',
        title: 'Aari Work & Nauvari Saree Embroidery',
        desc: 'Designing and executing a complete choli or blouse piece.'
      }
    ],
    interactivity: 'Each completed embroidery sample is photographed and added to the learner\'s digital "Craft Portfolio." Completing all levels earns a "Thread Artist" stamp.',
    providers: 'The Marathi Shivankala app offers a comprehensive platform with video tutorials and personalized learning paths. Banjara embroidery workshops are conducted by artisans like Rohit Shankar Rathod from Beed district.'
  },
  {
    id: 'heritage-of-mumbai',
    title: "Heritage of Mumbai: The City's Hidden Stories",
    subtitle: 'From Kanheri Buddhist Caves & Fort Gothic to Art Deco Mill Lands',
    isLocked: true,
    category: 'History, Architecture & Anthropology',
    level: 'Academic & Explorer',
    duration: '3 Modules • 30 Hours',
    rating: 4.9,
    enrolledCount: 1120,
    image: '/dishes/vada_pav.jpg',
    stamp: 'Mumbai Explorer',
    xpReward: 210,
    unlockRequirement: '🔒 Unlocks with Explorer Badge Level 2',
    overview: "This course explores Mumbai's layered history, from the Kanheri Caves and Elephanta Island to the Gothic and Art Deco buildings of the Fort district. It blends history, architecture, and cultural anthropology.",
    structure: [
      {
        unit: 'Module 1',
        title: 'Ancient Mumbai & Buddhist Heritage',
        desc: 'Kanheri Caves, Mahakali Caves, and the city\'s Buddhist rock-cut sanctuary heritage.'
      },
      {
        unit: 'Module 2',
        title: 'Colonial Architecture & Freedom Epoch',
        desc: 'Fort district, Gateway of India, and the city\'s role in the Indian freedom movement.'
      },
      {
        unit: 'Module 3',
        title: 'Modern Mumbai & Cultural Institutions',
        desc: 'Art Deco architecture, mill lands, and the city\'s contemporary cultural institutions.'
      }
    ],
    interactivity: 'A "Mumbai Explorer" challenge requires learners to visit (or virtually tour) at least three heritage sites and submit a photo essay.',
    providers: 'SNDT University offers a 30-hour "Heritage of Mumbai" blended course for approximately ₹1,000. Somaiya Vidyavihar offers a Diploma in Archaeological Sources of Buddhist History with a focus on the Kanheri Caves in Mumbai.'
  },
  {
    id: 'tribal-art-craft',
    title: 'Tribal Art and Craft: Traditions and Skill Development',
    subtitle: 'Indigenous Knowledge, Bamboo Work, Pottery & Micro-Enterprise',
    isLocked: true,
    category: 'Indigenous Traditions & NEP Certified',
    level: 'Credit Course • University Grade',
    duration: '3 Units • 15 Hours',
    rating: 4.8,
    enrolledCount: 780,
    image: '/fusion/skateboard_deck.jpg',
    stamp: 'Tribal Archivist',
    xpReward: 230,
    unlockRequirement: '🔒 Prerequisite: Warli Painting Module 3 completion',
    overview: 'This course explores the rich heritage, cultural significance, and traditional knowledge systems embedded in tribal art and craft practices across Maharashtra and other indigenous regions.',
    structure: [
      {
        unit: 'Unit 1',
        title: 'Introduction to Tribal Art Forms',
        desc: 'Warli, Gond, Bhil, and Banjara indigenous art forms.'
      },
      {
        unit: 'Unit 2',
        title: 'Craft Traditions & Natural Materials',
        desc: 'Bamboo work, pottery, and natural organic dyeing.'
      },
      {
        unit: 'Unit 3',
        title: 'Skill Development & Artisan Entrepreneurship',
        desc: 'Product design, marketing, and entrepreneurship for tribal artisans.'
      }
    ],
    interactivity: 'Learners create a "Tribal Art Journal" documenting motifs, materials, and the cultural stories behind each craft form.',
    providers: 'The University of Mumbai offers a credited course on "Tribal Art and Craft: Traditions and Skill Development". The Maharashtra government has launched online courses on indigenous folk art and handicrafts under NEP, covering Warli painting, pottery, bamboo work, and weaving.'
  },
  {
    id: 'kolhapuri-chappal-craft',
    title: 'Kolhapuri Chappal Craftsmanship: From Leather to Legacy',
    subtitle: 'Vegetable Tanning, Signature Braiding & Ergonomic Sole Engineering',
    isLocked: true,
    category: 'Heritage Footwear & Leather Guilds',
    level: 'Professional Apprenticeship',
    duration: '3 Modules • 10 Hours',
    rating: 4.9,
    enrolledCount: 940,
    image: '/clothes/kolhapuri_chappals.jpg',
    stamp: 'Master Craftsman',
    xpReward: 240,
    unlockRequirement: '🔒 Earn 500 Academy XP to unlock this masterclass',
    overview: 'Kolhapuri chappals are handcrafted leather sandals with a distinctive woven pattern, originating from Kolhapur. This course covers the entire craft process, from leather selection to the final stitching and finishing.',
    structure: [
      {
        unit: 'Module 1',
        title: 'Leather Selection and Preparation',
        desc: 'Types of leather, vegetable tanning using babool bark, and precision cutting.'
      },
      {
        unit: 'Module 2',
        title: 'Braiding and Weaving Techniques',
        desc: 'The signature Kolhapuri weave, patta work, and sole nail-free construction.'
      },
      {
        unit: 'Module 3',
        title: 'Finishing and Modern Design Adaptations',
        desc: 'Colouring, polishing, and modern contemporary design adaptations.'
      }
    ],
    interactivity: 'Learners design their own Kolhapuri chappal pattern and submit it for peer review. Completing the course earns a "Master Craftsman" stamp.',
    providers: 'Prada Group has launched a three-year artisan training program for Kolhapuri chappal makers, running in structured six-month modules. CSIR-Central Leather Research Institute has conducted design and modern concept training for Kolhapuri footwear artisans.'
  },
  {
    id: 'indian-knowledge-systems',
    title: "Indian Knowledge Systems: Maharashtra's Philosophical Heritage",
    subtitle: 'Varkari Movement, Bhakti Saints, Dnyaneshwari & Modern Leadership',
    isLocked: true,
    category: 'Philosophy & Indian Knowledge Systems (IKS)',
    level: 'Scholarly • NEP Accredited',
    duration: '3 Units • 20 Hours',
    rating: 5.0,
    enrolledCount: 1450,
    image: '/festivals/pandharpur_wari.jpg',
    stamp: 'Vedic Philosopher',
    xpReward: 250,
    unlockRequirement: '🔒 Advanced Scholar Tier • Unlocks with 600 Academy XP',
    overview: "This course explores Maharashtra's contribution to Indian Knowledge Systems (IKS), including the Varkari movement, the Bhakti saints (Dnyaneshwar, Tukaram, Namdev), and the philosophical underpinnings of Marathi culture.",
    structure: [
      {
        unit: 'Unit 1',
        title: 'The Varkari Tradition & Pandharpur Wari',
        desc: 'Abhangas, the Pandharpur Wari pilgrimage, and the philosophy of bhakti equality.'
      },
      {
        unit: 'Unit 2',
        title: 'Marathi Saints, Dnyaneshwari & Dasbodh',
        desc: 'Dnyaneshwari, Tukaram\'s abhangas, and Ramdas Swami\'s Dasbodh leadership tenets.'
      },
      {
        unit: 'Unit 3',
        title: 'Contemporary Relevance & Leadership',
        desc: 'How IKS principles apply to modern education, leadership, and community building.'
      }
    ],
    interactivity: 'Learners participate in a virtual Wari simulation, walking through the pilgrimage route and unlocking stories of the saints at each stop.',
    providers: 'COEP Technological University offers a free Indian Knowledge Systems course in collaboration with BORI (Bhandarkar Oriental Research Institute), covering Indian heritage, philosophy, architecture, and culture.'
  }
];
