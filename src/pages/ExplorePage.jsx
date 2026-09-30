import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Shirt, 
  Gem, 
  Music, 
  HeartHandshake, 
  Film, 
  Search, 
  Heart, 
  Bookmark, 
  Share2, 
  X, 
  ArrowRight, 
  Flame, 
  Check, 
  Zap, 
  Clock, 
  MapPin,
  Star,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playChime } from '../utils/audio';
import { MAHARASHTRA_DISHES } from '../data/maharashtraDishes';
import { MAHARASHTRA_FESTIVALS } from '../data/maharashtraFestivals';
import { MAHARASHTRA_CLOTHES } from '../data/maharashtraClothes';

export function ExplorePage({ onAwardXp, selectedState = 'Maharashtra' }) {
  const [activeSection, setActiveSection] = useState('all'); // 'all' or one of the 7 ids
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [shareModalItem, setShareModalItem] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [floatingXp, setFloatingXp] = useState(null);
  const [hoveredStars, setHoveredStars] = useState({});
  const [foodCategoryFilter, setFoodCategoryFilter] = useState('all');
  const [clothesCategoryFilter, setClothesCategoryFilter] = useState('all'); // 'all', 'men', 'women'
  const [ratingToast, setRatingToast] = useState(null);

  // The 7 Living Cultural Pillars
  const sevenParts = [
    {
      id: 'festivals',
      name: 'Festivals & Occasions',
      subtitle: 'Cosmic Calendars & Rhythmic Celebrations',
      icon: Sparkles,
      color: '#FF6600',
      bgColor: '#FFF6ED',
      accentGlow: 'rgba(255, 102, 0, 0.25)',
      description: 'Ganesh Chaturthi, Gudi Padwa, Dahi Handi, Makar Sankranti, Pandharpur Wari, Nag Panchami, Narali Pournima, Bhau Beej, Mangala Gauri & Bail Pola.',
      trivia: 'In 1893, Lokmanya Tilak transformed private Ganesh worship into Sarvajanik Ganeshotsav to unite all youth against British rule.'
    },
    {
      id: 'clothes',
      name: 'Clothes',
      subtitle: 'Living Weaves & Warrior Drapes: Men & Women Collections',
      icon: Shirt,
      color: '#FF7700',
      bgColor: '#FFF8F2',
      accentGlow: 'rgba(255, 119, 0, 0.25)',
      description: 'Men: Dhoti, Pheta (Pagdi), Kurta / Sadra, Bandi (Waistcoat), Kolhapuri Chappals. Women: Nauvari Saree, Choli, Paithani Saree, Mundavalya, Green Glass Bangles.',
      trivia: 'A master weaver can take up to 8 months to hand-weave a single pure silk-zari Paithani peacock pallu.'
    },
    {
      id: 'food',
      name: 'Food',
      subtitle: 'Maharashtra Culinary Legends & Sacred Recipes',
      icon: Utensils,
      color: '#FF5500',
      bgColor: '#FFF5F0',
      accentGlow: 'rgba(255, 85, 0, 0.25)',
      description: 'Vada Pav, Kolhapuri Misal, buttery Pav Bhaji, Chowpatty Bhel & Pani Puri, Varan Bhaat, Puran Poli, Pithla Bhakri, Zunka, Thalipeeth & Kothimbir Vadi.',
      trivia: 'Did you know? Maharashtra has over 20 unique regional chili varieties including the fiery Kolhapuri Lavangi and the aromatic Byadgi used in traditional goda masala.'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      subtitle: 'Royal Maratha Jewelry & Hand-Braided Leather',
      icon: Gem,
      color: '#E65100',
      bgColor: '#FFF3E8',
      accentGlow: 'rgba(230, 81, 0, 0.25)',
      description: 'Authentic Kolhapuri Chappals, Kolhapuri Saaj necklaces, Brahmani pearl naths, and regal pagdi turbans.',
      trivia: 'Authentic Kolhapuri chappals use zero metallic nails—vegetable-tanned leather is bound purely with sisal agave fibers.'
    },
    {
      id: 'music',
      name: 'Music',
      subtitle: 'Sacred Ragas & High-Voltage Dholki Beats',
      icon: Music,
      color: '#FF5500',
      bgColor: '#FFF5F0',
      accentGlow: 'rgba(255, 85, 0, 0.25)',
      description: 'Electrifying Lavani footwork, heroic Powada ballads celebrating Shivaji Maharaj, and timeless classical ragas.',
      trivia: 'Powada ballads were sung by Shahir bards atop mountain fortresses to inspire Maratha Mavlas before battle.'
    },
    {
      id: 'grandparents-stories',
      name: 'Grandparents Stories',
      subtitle: 'From Dadi’s Lap: Bedside Folklore & Moral Wit',
      icon: HeartHandshake,
      color: '#FF6600',
      bgColor: '#FFF6ED',
      accentGlow: 'rgba(255, 102, 0, 0.25)',
      description: 'Aaji’s tales of Rajmata Jijabai mentoring young Shivaji, Panchatantra wisdom, and bedtime terrace lore.',
      trivia: 'Oral bedtime stories in ancient India were mnemonic training to pass down statecraft, medicine, and survival ethics.'
    },
    {
      id: 'documentary-facts',
      name: 'Documentary & Facts',
      subtitle: 'Visual Docu-Bytes & Engineering Miracles',
      icon: Film,
      color: '#E64500',
      bgColor: '#FFF3E8',
      accentGlow: 'rgba(230, 69, 0, 0.25)',
      description: 'Ellora Kailasa Temple carved top-down from a single volcanic cliff, unconquered sea forts of Murud-Janjira, and Sushruta surgery.',
      trivia: 'Over 200,000 tonnes of basalt rock were chiseled top-to-bottom to create Cave 16 Kailasa at Ellora with zero room for error.'
    }
  ];

  // Base Cultural Items: 10 Festivals + 10 Clothes (Top 5 Men, Top 5 Women) + 11 Food Dishes + Other Pillars
  const initialExploreItems = [
    // 1. FESTIVALS AND OCCASIONS: The 10 Most Celebrated Maharashtra Festivals
    ...MAHARASHTRA_FESTIVALS,

    // 2. CLOTHES: Top 5 For Men and Top 5 For Women
    ...MAHARASHTRA_CLOTHES,

    // 3. FOOD: The 11 Authentic Maharashtrian Dishes
    ...MAHARASHTRA_DISHES,

    // 4. ACCESSORIES
    {
      id: 'accessories-kolhapuri-chappal',
      partId: 'accessories',
      partName: 'Accessories',
      region: 'Maharashtra',
      emoji: '👡',
      title: 'Kolhapuri Chappals: Hand-Braided Sahyadri Footwear',
      subtitle: 'GI-tagged vegetable-tanned buffalo leather crafted with zero nails and zero plastics',
      readTime: '2 min read',
      details: 'Patronized by the Maharaja of Kolhapur, Chhatrapati Shahu Maharaj, authentic Kolhapuri chappals are cut, carved, and stitched purely with sisal agave fibers or leather threads. Colored with natural babool bark dyes, their hollow soles contain natural seeds that produce a soft trademark squeak with every confident stride.',
      genZTakeaway: '100% biodegradable orthopedic sandals. High heat resistance, zero plastics, and indestructible mountain traction.',
      likes: 2890,
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 'accessories-jhumka-bells',
      partId: 'accessories',
      partName: 'Accessories',
      emoji: '💍',
      title: 'The Jhumka: Miniature Temple Bells for Your Ears',
      subtitle: 'From Chola temple bronze dancers to modern Bollywood ear candy',
      readTime: '2 min read',
      details: 'The classic conical bell shape with suspended droplets was engineered so that every gentle tilt of the dancer’s neck produced a soft metallic chime, aligning with ankle ghungroos during classical Bharatanatyam and Kathak performances.',
      genZTakeaway: 'Wearable acoustic jewelry. A dynamic balance of royal weight, filigree wirework, and musical presence.',
      likes: 2780,
      isLiked: true,
      isBookmarked: false,
    },

    // 5. MUSIC
    {
      id: 'music-lavani-dholki',
      partId: 'music',
      partName: 'Music',
      region: 'Maharashtra',
      emoji: '💃',
      title: 'Lavani & Powada: The Pulse of Maratha Forts',
      subtitle: 'High-voltage dholki percussion and heroic ballads sung by Shahirs for Shivaji’s army',
      readTime: '3 min read',
      details: 'Lavani combines sensual, rapid-fire poetic verse with blistering Dholki syncopation and heavy bronze Ghungroos weighing 3 kilograms per ankle. In contrast, Powada ballads were sung by Shahir bards perched on the parapets of forts like Raigad and Sinhagad to chronicle tactical victories like the Battle of Pratapgad.',
      genZTakeaway: 'The original Sahyadri battle rap and stadium folk concert. Raw acoustic adrenaline echoing across centuries of martial history.',
      likes: 3950,
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 'music-classical-ragas',
      partId: 'music',
      partName: 'Music',
      emoji: '🪕',
      title: 'Ragas: Frequencies Attuned to the Hours of the Day',
      subtitle: 'Why Indian classical ragas alter brainwave states from dawn to dusk',
      readTime: '3 min read',
      details: 'Unlike Western scales fixed to equal temperament, Indian microtones (Shrutis) divide an octave into 22 distinct intervals. Morning Ragas like Bhairav induce grounding calm, while midnight Ragas like Darbari Kanada resonate deep emotional introspection.',
      genZTakeaway: 'The original biohacking acoustic frequency playlist. Sound therapy developed 2,500 years before binaural beats were invented.',
      likes: 3340,
      isLiked: true,
      isBookmarked: true,
    },

    // 6. GRANDPARENTS STORIES
    {
      id: 'stories-jijabai-shivaji',
      partId: 'grandparents-stories',
      partName: 'Grandparents Stories',
      region: 'Maharashtra',
      emoji: '👑',
      title: 'Aaji’s Tale: How Rajmata Jijabai Forged Young Shivaji',
      subtitle: 'The bedside stories of justice and Swarajya told atop the crags of Shivneri Fort',
      readTime: '3 min read',
      details: 'Every night under the starry Sahyadri skies, Rajmata Jijabai narrated the epics of the Ramayana and Mahabharata to her young boy, Shivaji. She taught him that true royalty lies not in gold thrones, but in fiercely defending farmers, respecting all faiths, and protecting women. Young Shivaji absorbed those values into the very marrow of his soul.',
      genZTakeaway: 'True leadership is taught in grandmother’s bedtime stories before any business school exists. Integrity and fearless justice are timeless.',
      likes: 4790,
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: 'stories-dadi-lore',
      partId: 'grandparents-stories',
      partName: 'Grandparents Stories',
      emoji: '👵',
      title: 'The Moon, The Hare & The Fire: Dadi’s Bedtime Tale',
      subtitle: 'The timeless Panchatantra story grandmother told us before we fell asleep',
      readTime: '4 min read',
      details: 'Dadi would gently stroke our hair on the warm terrace and point to the moon: "Look closely at the dark patches—that is the brave hare who leaped into fire to feed a hungry wanderer. God was so moved by his pure sacrifice that he immortalized his silhouette on the face of the moon forever."',
      genZTakeaway: 'Moral courage isn’t about being the biggest or strongest animal in the forest—it’s about having the purest heart. That’s what grandma wanted us to remember.',
      likes: 4210,
      isLiked: true,
      isBookmarked: true,
    },

    // 7. DOCUMENTARY AND SOME FACTS
    {
      id: 'docu-ellora-kailash-cliff',
      partId: 'documentary-facts',
      partName: 'Documentary & Facts',
      region: 'Maharashtra',
      emoji: '🗿',
      title: 'Mind-Bending Fact: Kailasa Temple (Cave 16), Ellora',
      subtitle: 'A multi-story monolithic temple carved upside-down out of a single volcanic basalt mountain',
      readTime: '3 min read',
      details: 'Commissioned by Rashtrakuta King Krishna I in the 8th century, the Kailasa Temple at Ellora was not built stone by stone—it was carved from top to bottom out of a single solid basalt cliff! Over 200,000 tonnes of rock were chiseled away with zero structural errors. Modern civil engineers admit replicating this with today’s computer 3D laser-cutting would take decades.',
      genZTakeaway: 'The world’s most audacious monolithic sculpting marvel. An entire temple complex hollowed from a mountain with zero room for error.',
      likes: 5420,
      isLiked: true,
      isBookmarked: true,
    },
    {
      id: 'docu-rani-ki-vav',
      partId: 'documentary-facts',
      partName: 'Documentary & Facts',
      emoji: '🎬',
      title: 'Docu-Byte: Rani ki Vav (The Inverted Queen’s Stepwell)',
      subtitle: 'A 7-story subterranean temple built upside down into the earth of Patan, Gujarat',
      readTime: '3 min read',
      details: 'Commissioned by Queen Udayamati in 1063 CE as a memorial to her late husband, this UNESCO World Heritage marvel descends 7 levels below ground with over 500 major sculptures. It collected monsoon rainwater while cooling desert temperatures by 10 degrees Celsius.',
      genZTakeaway: 'An architectural inverted skyscraper honoring water as a sacred divinity. The world’s most breathtaking passive cooling system.',
      likes: 2980,
      isLiked: false,
      isBookmarked: true,
    }
  ];

  const [items, setItems] = useState(initialExploreItems);

  // Compute Food Ranks dynamically based on highest rating
  const foodRanks = useMemo(() => {
    const foodOnly = items
      .filter(i => i.partId === 'food')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.totalVotes || 0) - (a.totalVotes || 0));
    
    const rankMap = {};
    foodOnly.forEach((dish, idx) => {
      rankMap[dish.id] = idx + 1;
    });
    return rankMap;
  }, [items]);

  // Compute Clothes Ranks dynamically based on highest rating
  const clothesRanks = useMemo(() => {
    const clothesOnly = items
      .filter(i => i.partId === 'clothes')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.totalVotes || 0) - (a.totalVotes || 0));
    
    const rankMap = {};
    clothesOnly.forEach((cloth, idx) => {
      rankMap[cloth.id] = idx + 1;
    });
    return rankMap;
  }, [items]);

  // Filter items based on activeSection, search, category, gender, and AUTO-REARRANGE food & clothes by highest stars
  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => {
      const matchesSection = activeSection === 'all' || item.partId === activeSection;
      const matchesFoodCategory = activeSection !== 'food' || foodCategoryFilter === 'all' || item.category === foodCategoryFilter;
      const matchesClothesGender = activeSection !== 'clothes' || clothesCategoryFilter === 'all' || item.gender === clothesCategoryFilter;
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery = !query ||
        item.title.toLowerCase().includes(query) ||
        item.subtitle.toLowerCase().includes(query) ||
        (item.details && item.details.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.taste && item.taste.toLowerCase().includes(query)) ||
        (item.history && item.history.toLowerCase().includes(query)) ||
        (item.story && item.story.toLowerCase().includes(query)) ||
        item.partName.toLowerCase().includes(query);

      return matchesSection && matchesFoodCategory && matchesClothesGender && matchesQuery;
    });

    // Rearrange food and clothes items dynamically based on the highest number of stars / rating descending
    result = [...result].sort((a, b) => {
      if (a.partId === 'food' && b.partId === 'food') {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return (b.totalVotes || 0) - (a.totalVotes || 0);
      }
      if (a.partId === 'clothes' && b.partId === 'clothes') {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return (b.totalVotes || 0) - (a.totalVotes || 0);
      }
      return 0;
    });

    return result;
  }, [items, activeSection, foodCategoryFilter, clothesCategoryFilter, searchQuery]);

  // Interactive 5-Star Rating Handler (For Food Dishes & Traditional Clothes)
  const handleRateItem = (id, ratingValue, e) => {
    e?.stopPropagation?.();
    playChime();
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FFA500', '#FF5500', '#FFFFFF']
    });

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id) {
          const prevUserRating = item.userRating || 0;
          const currentTotal = item.totalVotes || 100;
          const newVotes = prevUserRating > 0 ? currentTotal : currentTotal + 1;
          const currentSum = (item.rating || 4.5) * currentTotal;
          const newSum = prevUserRating > 0 
            ? currentSum - prevUserRating + ratingValue
            : currentSum + ratingValue;
          const calculatedRating = Number((newSum / newVotes).toFixed(1));

          return {
            ...item,
            rating: calculatedRating,
            totalVotes: newVotes,
            userRating: ratingValue
          };
        }
        return item;
      });
    });

    // Sync active modal item if open
    setActiveModalItem(prev => {
      if (prev && prev.id === id) {
        const prevUserRating = prev.userRating || 0;
        const currentTotal = prev.totalVotes || 100;
        const newVotes = prevUserRating > 0 ? currentTotal : currentTotal + 1;
        const currentSum = (prev.rating || 4.5) * currentTotal;
        const newSum = prevUserRating > 0 
          ? currentSum - prevUserRating + ratingValue
          : currentSum + ratingValue;
        const calculatedRating = Number((newSum / newVotes).toFixed(1));

        return {
          ...prev,
          rating: calculatedRating,
          totalVotes: newVotes,
          userRating: ratingValue
        };
      }
      return prev;
    });

    const targetItem = items.find(i => i.id === id);
    const itemNoun = targetItem?.partId === 'food' ? 'Dish' : targetItem?.partId === 'clothes' ? 'Attire' : 'Item';
    setRatingToast(`⭐ You rated "${targetItem?.title || itemNoun}" ${ratingValue}/5 Stars! Live ranking updated.`);
    setTimeout(() => setRatingToast(null), 3200);
  };

  const handleLike = (id, e) => {
    e.stopPropagation();
    playChime();
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const nextLiked = !item.isLiked;
        return {
          ...item,
          isLiked: nextLiked,
          likes: nextLiked ? item.likes + 1 : item.likes - 1
        };
      }
      return item;
    }));

    onAwardXp?.(15);
    setFloatingXp({ id, text: '❤️ Loved!' });
    setTimeout(() => setFloatingXp(null), 1200);
  };

  const handleBookmark = (id, e) => {
    e.stopPropagation();
    playClick();
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, isBookmarked: !item.isBookmarked };
      }
      return item;
    }));
  };

  const handleShare = (item, e) => {
    e.stopPropagation();
    playClick();
    setShareModalItem(item);
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF5500', '#FF7700', '#FFAA00', '#FFFFFF']
    });
  };

  const handleCopyLink = () => {
    playClick();
    navigator.clipboard.writeText(`${window.location.origin}/#explore/${shareModalItem.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '90px' }}>
      
      {/* Hero Header */}
      <section style={{
        paddingTop: '46px',
        paddingBottom: '36px',
        borderBottom: '1px solid rgba(255, 85, 0, 0.15)',
        background: 'linear-gradient(180deg, rgba(255, 245, 240, 0.8) 0%, rgba(250, 251, 252, 0.95) 100%)'
      }}>
        <div className="container">
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <div className="badge-orange pulse-glow">
              <Sparkles size={14} color="#FF5500" />
              <span>INDIVERSE EXPLORE • THE 7 LIVING REALMS</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#FF5500', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
              • ORANGE & WHITE EDITION
            </span>
          </div>

          {/* Active State / UT Pilot Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '7px 16px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1.5px solid rgba(255, 85, 0, 0.3)',
            boxShadow: '0 4px 15px rgba(255, 85, 0, 0.08)',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: '#FF5500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}>
              <MapPin size={12} />
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A' }}>
              Active Cultural Realm: <strong style={{ color: '#FF5500' }}>{selectedState}</strong>
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: '800',
              padding: '2px 8px',
              borderRadius: '999px',
              background: '#DCFCE7',
              color: '#15803D',
              border: '1px solid #86EFAC'
            }}>
              🟢 Live Pilot Active
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.3rem, 5.5vw, 4rem)',
            fontWeight: '900',
            color: '#0F172A',
            letterSpacing: '-0.025em',
            marginBottom: '14px',
            lineHeight: '1.1'
          }}>
            Explore India Across <span className="gradient-text-orange-pure">7 Cultural Dimensions</span>
          </h1>

          <p style={{
            fontSize: '1.08rem',
            color: '#475569',
            maxWidth: '750px',
            lineHeight: '1.65',
            marginBottom: '32px'
          }}>
            From authentic street-food alchemy like Vada Pav and Kolhapuri Misal, to cosmic festivals, handwoven weaves, temple acoustics, grandma lore, and ancient scientific facts.
          </p>

          {/* Interactive Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderRadius: '18px',
            background: '#FFFFFF',
            border: '2px solid rgba(255, 85, 0, 0.25)',
            boxShadow: '0 8px 25px rgba(255, 85, 0, 0.08), 0 2px 6px rgba(15, 23, 42, 0.04)',
            maxWidth: '680px',
            marginBottom: '32px'
          }}>
            <Search size={22} color="#FF5500" />
            <input 
              type="text" 
              placeholder="Search across Vada Pav, Misal, Pav Bhaji, Ragas, Silk & Lore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#0F172A',
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94A3B8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* The 7 Interactive Pillar Switchers */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            overflowX: 'auto',
            paddingBottom: '10px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            <button
              onClick={() => { playClick(); setActiveSection('all'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                background: activeSection === 'all' 
                  ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                  : '#FFFFFF',
                color: activeSection === 'all' ? '#FFFFFF' : '#334155',
                border: activeSection === 'all' ? '1.5px solid #FF5500' : '1.5px solid rgba(255, 85, 0, 0.2)',
                boxShadow: activeSection === 'all' ? '0 4px 15px rgba(255, 85, 0, 0.3)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <Sparkles size={16} />
              <span>All 7 Realms ({items.length})</span>
            </button>

            {sevenParts.map((part) => {
              const Icon = part.icon;
              const isActive = activeSection === part.id;
              const count = items.filter(i => i.partId === part.id).length;
              return (
                <button
                  key={part.id}
                  onClick={() => { playClick(); setActiveSection(part.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '14px',
                    fontSize: '0.92rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isActive 
                      ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                      : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#334155',
                    border: isActive ? '1.5px solid #FF5500' : '1.5px solid rgba(255, 85, 0, 0.2)',
                    boxShadow: isActive ? '0 4px 15px rgba(255, 85, 0, 0.3)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? '#FFFFFF' : part.color} />
                  <span>{part.name} ({count})</span>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* Main Content Feed */}
      <section style={{ paddingTop: '36px' }}>
        <div className="container">
          
          {/* Active Pillar Spotlight Banner */}
          {activeSection !== 'all' && (() => {
            const currentPart = sevenParts.find(p => p.id === activeSection);
            if (!currentPart) return null;
            const Icon = currentPart.icon;
            return (
              <div 
                className="glass-panel"
                style={{
                  padding: '24px 30px',
                  borderRadius: '22px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
                  border: '2px solid rgba(255, 85, 0, 0.3)',
                  boxShadow: '0 12px 30px rgba(255, 85, 0, 0.1)',
                  marginBottom: '28px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    boxShadow: '0 8px 20px rgba(255, 85, 0, 0.35)'
                  }}>
                    <Icon size={30} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                      {currentPart.name}
                    </h2>
                    <p style={{ fontSize: '0.95rem', color: '#FF5500', fontWeight: '700', margin: '3px 0 0' }}>
                      {currentPart.subtitle}
                    </p>
                    <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0' }}>
                      {currentPart.description}
                    </p>
                  </div>
                </div>

                {/* Cultural Trivia Box */}
                <div style={{
                  padding: '12px 18px',
                  borderRadius: '14px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(255, 85, 0, 0.25)',
                  maxWidth: '380px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF5500', fontSize: '0.78rem', fontWeight: '800' }}>
                    <Zap size={14} />
                    <span>CULTURAL FACT</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#334155', margin: '4px 0 0', lineHeight: '1.45' }}>
                    {currentPart.trivia}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Live Dynamic Leaderboard Banner (For Food Dishes & Traditional Clothes) */}
          {(activeSection === 'food' || activeSection === 'clothes' || activeSection === 'all') && (
            <div style={{
              marginBottom: '26px',
              padding: '14px 20px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF2E8 100%)',
              border: '1.5px solid rgba(255, 85, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: '0 4px 16px rgba(255, 85, 0, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EAB308 0%, #F97316 100%)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(234, 179, 8, 0.35)'
                }}>
                  <Award size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.96rem', fontWeight: '900', color: '#0F172A' }}>
                      {activeSection === 'clothes' 
                        ? 'Live Clothes Leaderboard: Dynamic 5-Star Ranking' 
                        : activeSection === 'food' 
                          ? 'Live Dish Leaderboard: Dynamic 5-Star Ranking'
                          : 'Live Cultural Leaderboard: Dynamic Community Ranking'}
                    </span>
                    <span style={{
                      fontSize: '0.68rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC'
                    }}>
                      Auto-Rearranges by Stars ⭐
                    </span>
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748B' }}>
                    {activeSection === 'clothes'
                      ? 'Rate any traditional attire with 1-5 stars. Clothes automatically reorder based on the highest rating!'
                      : activeSection === 'food'
                        ? 'Rate any dish with 1-5 stars to boost its score. Dishes automatically reorder by highest rating!'
                        : 'Rate authentic dishes and traditional attires with 1-5 stars to elevate them on the leaderboard!'}
                  </p>
                </div>
              </div>

              {/* Food Category Quick Filter Pills */}
              {activeSection === 'food' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All 11 Dishes' },
                    { id: 'Street Snack', label: 'Street Snacks' },
                    { id: 'Traditional Meal', label: 'Meals' },
                    { id: 'Festive / Dessert', label: 'Festive Sweets' },
                    { id: 'Appetizer / Snack', label: 'Appetizers' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { playClick(); setFoodCategoryFilter(tab.id); }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        background: foodCategoryFilter === tab.id ? '#FF5500' : '#FFFFFF',
                        color: foodCategoryFilter === tab.id ? '#FFFFFF' : '#475569',
                        border: foodCategoryFilter === tab.id ? '1px solid #FF5500' : '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Clothes Gender Quick Filter Pills (Men / Women) */}
              {activeSection === 'clothes' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'all', label: 'All 10 Attires' },
                    { id: 'men', label: '👨 For Men (Top 5)' },
                    { id: 'women', label: '👩 For Women (Top 5)' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => { playClick(); setClothesCategoryFilter(tab.id); }}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        background: clothesCategoryFilter === tab.id ? '#FF5500' : '#FFFFFF',
                        color: clothesCategoryFilter === tab.id ? '#FFFFFF' : '#475569',
                        border: clothesCategoryFilter === tab.id ? '1px solid #FF5500' : '1px solid rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cards Grid: Appropriate & Crazy Card Zoom Animations */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
            gap: '26px'
          }}>
            {filteredAndSortedItems.map((item) => {
              const isFood = item.partId === 'food';
              const isClothes = item.partId === 'clothes';
              const isRanked = isFood || isClothes;
              const rank = isFood ? foodRanks[item.id] : isClothes ? clothesRanks[item.id] : null;

              return (
                <div
                  key={item.id}
                  onClick={() => { playClick(); setActiveModalItem(item); }}
                  className="card-hover-crazy"
                  style={{
                    background: '#FFFFFF',
                    borderRadius: '22px',
                    border: isRanked && rank === 1 
                      ? '2px solid #EAB308' 
                      : '1.5px solid rgba(255, 85, 0, 0.2)',
                    boxShadow: isRanked && rank === 1 
                      ? '0 12px 35px rgba(234, 179, 8, 0.18)' 
                      : '0 10px 30px rgba(15, 23, 42, 0.05)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative'
                  }}
                >
                  {/* Floating Action Feedback */}
                  {floatingXp && floatingXp.id === item.id && (
                    <div style={{
                      position: 'absolute',
                      top: '16px',
                      right: '16px',
                      background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                      color: '#FFFFFF',
                      padding: '5px 12px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: '800',
                      boxShadow: '0 4px 15px rgba(255, 85, 0, 0.5)',
                      animation: 'floatGentle 0.8s ease-out forwards',
                      zIndex: 20
                    }}>
                      {floatingXp.text}
                    </div>
                  )}

                  {/* Top Gourmet Photography Image (For Food Dishes, Clothes & Festivals) */}
                  {item.image ? (
                    <div style={{
                      width: '100%',
                      height: '215px',
                      position: 'relative',
                      overflow: 'hidden',
                      background: '#F1F5F9'
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="dish-card-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />

                      {/* Rank Overlay Badge (For Food & Clothes) or Festive Timing Badge */}
                      {isRanked && rank ? (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: rank === 1 
                            ? 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)' 
                            : rank === 2
                              ? 'linear-gradient(135deg, #94A3B8 0%, #64748B 100%)'
                              : rank === 3
                                ? 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)'
                                : 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(6px)',
                          color: '#FFFFFF',
                          padding: '4px 11px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: '900',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                          zIndex: 2
                        }}>
                          {rank === 1 ? '🥇 #1 Top Rated' : rank === 2 ? '🥈 #2 Top Rated' : rank === 3 ? '🥉 #3' : `#${rank}`}
                        </div>
                      ) : item.timing ? (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          background: 'linear-gradient(135deg, rgba(255, 85, 0, 0.95) 0%, rgba(224, 72, 0, 0.95) 100%)',
                          backdropFilter: 'blur(6px)',
                          color: '#FFFFFF',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '0.68rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.28)',
                          zIndex: 2
                        }}>
                          <Sparkles size={11} />
                          <span>{item.timing.split('(')[0].trim()}</span>
                        </div>
                      ) : null}

                      {/* Region & Cuisine / Culture Tag Overlay */}
                      <div style={{
                        position: 'absolute',
                        bottom: '10px',
                        left: '12px',
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(8px)',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        color: '#C2410C',
                        border: '1px solid rgba(255, 85, 0, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                      }}>
                        <MapPin size={11} color="#FF5500" />
                        <span>{item.region?.split(',')[0] || 'Maharashtra'}</span>
                      </div>

                      {/* Right Overlay: Rating for Food & Clothes, or Read Time for Others */}
                      {isRanked ? (
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '12px',
                          background: 'rgba(15, 23, 42, 0.88)',
                          backdropFilter: 'blur(8px)',
                          color: '#FDE047',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.76rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                          <Star size={13} fill="#FDE047" color="#FDE047" />
                          <span style={{ color: '#FFFFFF' }}>{item.rating?.toFixed(1) || '4.8'}</span>
                          <span style={{ color: '#94A3B8', fontSize: '0.65rem' }}>({item.totalVotes})</span>
                        </div>
                      ) : (
                        <div style={{
                          position: 'absolute',
                          bottom: '10px',
                          right: '12px',
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(8px)',
                          color: '#FFFFFF',
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)'
                        }}>
                          <Clock size={11} color="#FFA066" />
                          <span>{item.readTime}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Non-Image Card Header (Emojis) */
                    <div style={{
                      padding: '24px 24px 14px',
                      borderBottom: '1px solid rgba(255, 85, 0, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'linear-gradient(180deg, #FFF9F6 0%, #FFFFFF 100%)'
                    }}>
                      <div style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '16px',
                        background: '#FFF0EA',
                        border: '1px solid rgba(255, 85, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.8rem',
                        boxShadow: '0 4px 12px rgba(255, 85, 0, 0.1)'
                      }}>
                        {item.emoji}
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '4px' }}>
                          {item.region && (
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                              fontSize: '0.66rem',
                              color: '#C2410C',
                              background: '#FFEDD5',
                              border: '1px solid #FDBA74',
                              padding: '2px 8px',
                              borderRadius: '999px',
                              fontWeight: '800'
                            }}>
                              <MapPin size={10} color="#EA580C" />
                              <span>Maharashtra</span>
                            </span>
                          )}
                          <span style={{
                            display: 'inline-block',
                            fontSize: '0.72rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#FF5500',
                            padding: '4px 10px',
                            borderRadius: '999px',
                            background: 'rgba(255, 85, 0, 0.1)',
                            border: '1px solid rgba(255, 85, 0, 0.25)',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em'
                          }}>
                            {item.partName}
                          </span>
                        </div>
                        <div style={{
                          fontSize: '0.72rem',
                          color: '#94A3B8',
                          marginTop: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          justifyContent: 'flex-end'
                        }}>
                          <Clock size={11} />
                          <span>{item.readTime}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div style={{ padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <h3 style={{
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        color: '#0F172A',
                        lineHeight: '1.3',
                        margin: 0
                      }}>
                        {item.title}
                      </h3>
                      {isFood && (
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#FFF5F0',
                          border: '1px solid rgba(255, 85, 0, 0.2)',
                          color: '#EA580C',
                          fontWeight: '700'
                        }}>
                          {item.category}
                        </span>
                      )}
                      {isClothes && (
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: item.gender === 'men' ? '#EFF6FF' : '#FDF2F8',
                          border: item.gender === 'men' ? '1px solid #BFDBFE' : '1px solid #FBCFE8',
                          color: item.gender === 'men' ? '#1D4ED8' : '#BE185D',
                          fontWeight: '800'
                        }}>
                          {item.gender === 'men' ? '👨 For Men' : '👩 For Women'}
                        </span>
                      )}
                      {!isFood && !isClothes && item.partId === 'festivals' && (
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#FFF5F0',
                          border: '1px solid rgba(255, 85, 0, 0.2)',
                          color: '#EA580C',
                          fontWeight: '700'
                        }}>
                          Festival
                        </span>
                      )}
                    </div>

                    <p style={{
                      fontSize: '0.86rem',
                      color: '#E04800',
                      fontWeight: '600',
                      marginBottom: '14px',
                      lineHeight: '1.4'
                    }}>
                      "{item.subtitle}"
                    </p>

                    {/* Taste Profile Callout for Dishes */}
                    {item.taste && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#FFF9F6',
                        border: '1px solid rgba(255, 85, 0, 0.15)',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#B43403', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                          <span>😋 TASTE & FLAVOR PROFILE</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: '1.5' }}>
                          {item.taste}
                        </p>
                      </div>
                    )}

                    {/* Historical Story Snippet for Clothes */}
                    {item.story && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#F8FAFC',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                          <span>📜 HISTORICAL STORY & ROOTS</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.story}
                        </p>
                      </div>
                    )}

                    {/* History Origin Snippet for Festivals & Food */}
                    {item.history && !item.story && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#F8FAFC',
                        border: '1px solid rgba(0, 0, 0, 0.06)',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#475569', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                          <span>🏛️ HERITAGE & ORIGIN</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#475569', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.history}
                        </p>
                      </div>
                    )}

                    {/* Facts Preview for Clothes */}
                    {item.facts && item.facts.length > 0 && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#FFF8F2',
                        border: '1px solid rgba(255, 85, 0, 0.2)',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#C2410C', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                          <Sparkles size={12} color="#FF5500" />
                          <span>TEXTILE & CRAFT FACT</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.facts[0]}
                        </p>
                      </div>
                    )}

                    {/* Interesting Fact Preview for Festivals */}
                    {item.interestingFacts && item.interestingFacts.length > 0 && (
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#FFF8F2',
                        border: '1px solid rgba(255, 85, 0, 0.2)',
                        marginBottom: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', color: '#C2410C', fontWeight: '800', textTransform: 'uppercase', marginBottom: '3px' }}>
                          <Sparkles size={12} color="#FF5500" />
                          <span>DID YOU KNOW?</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {item.interestingFacts[0]}
                        </p>
                      </div>
                    )}

                    {!isFood && !item.story && (
                      <p style={{
                        fontSize: '0.88rem',
                        color: '#475569',
                        lineHeight: '1.6',
                        marginBottom: '18px',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {item.description || item.details}
                      </p>
                    )}

                    {/* Interactive 5-Star Rating Widget (For Food Dishes & Traditional Clothes) */}
                    {isRanked && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '14px',
                          background: '#FFF9F6',
                          border: '1.5px solid rgba(255, 85, 0, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '8px'
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {item.userRating ? `Your Rating: ${item.userRating}★ (Click to change)` : `Rate this ${isFood ? 'Dish' : 'Attire'} (1-5★)`}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isFilled = (hoveredStars[item.id] || item.userRating || 0) >= star;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={(e) => handleRateItem(item.id, star, e)}
                                  onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [item.id]: star }))}
                                  onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [item.id]: null }))}
                                  title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                  className="star-btn-hover"
                                  style={{
                                    border: 'none',
                                    background: 'transparent',
                                    padding: '2px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Star 
                                    size={18} 
                                    color={isFilled ? '#EAB308' : '#CBD5E1'} 
                                    fill={isFilled ? '#EAB308' : 'none'} 
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.95rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                            <Star size={14} fill="#EAB308" color="#EAB308" />
                            <span>{item.rating?.toFixed(1) || '4.8'}</span>
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>
                            {item.totalVotes || 100} ratings
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Footer Actions */}
                  <div style={{
                    padding: '14px 24px',
                    borderTop: '1px solid rgba(255, 85, 0, 0.1)',
                    background: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    {/* Likes */}
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: item.isLiked ? '#FF5500' : '#64748B',
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        border: 'none',
                        background: 'transparent'
                      }}
                    >
                      <Heart 
                        size={18} 
                        color={item.isLiked ? '#FF5500' : 'currentColor'} 
                        fill={item.isLiked ? '#FF5500' : 'none'} 
                      />
                      <span>{item.likes}</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      {/* Bookmark */}
                      <button
                        onClick={(e) => handleBookmark(item.id, e)}
                        title={item.isBookmarked ? "Saved" : "Save this discovery"}
                        style={{
                          color: item.isBookmarked ? '#FF8800' : '#94A3B8',
                          cursor: 'pointer',
                          border: 'none',
                          background: 'transparent'
                        }}
                      >
                        <Bookmark 
                          size={18} 
                          color={item.isBookmarked ? '#FF8800' : 'currentColor'} 
                          fill={item.isBookmarked ? '#FF8800' : 'none'} 
                        />
                      </button>

                      {/* Share */}
                      <button
                        onClick={(e) => handleShare(item, e)}
                        title="Share discovery"
                        style={{ color: '#94A3B8', cursor: 'pointer', border: 'none', background: 'transparent' }}
                      >
                        <Share2 size={17} />
                      </button>

                      {/* Deep Dive prompt */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        color: '#FF5500',
                        fontSize: '0.82rem',
                        fontWeight: '800',
                        marginLeft: '4px'
                      }}>
                        <span>{isFood ? 'Full Recipe & Lore' : isClothes ? 'Style & History' : item.partId === 'festivals' ? 'History & Facts' : 'Full Story & Lore'}</span>
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredAndSortedItems.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#64748B'
            }}>
              <Search size={40} color="#FF5500" style={{ margin: '0 auto 12px', opacity: 0.6 }} />
              <p style={{ fontSize: '1.2rem', color: '#0F172A', fontWeight: '700' }}>No dishes or stories found matching "{searchQuery}"</p>
              <p style={{ fontSize: '0.9rem' }}>Try clearing your search query or selecting a different pillar.</p>
              <button 
                onClick={() => { setActiveSection('all'); setSearchQuery(''); setFoodCategoryFilter('all'); }}
                className="btn-secondary"
                style={{ marginTop: '16px' }}
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Deep-Dive Lore, Dish & Festival Modal */}
      {activeModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(12px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setActiveModalItem(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '740px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '26px',
              background: '#FFFFFF',
              border: '2px solid #FF5500',
              boxShadow: '0 25px 60px rgba(255, 85, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)',
              padding: '32px',
              position: 'relative'
            }}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveModalItem(null)}
              aria-label="Close modal"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#FFF5F0',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                color: '#FF5500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 10
              }}
            >
              <X size={20} />
            </button>

            {/* Modal Image Header (If Item Has Image) */}
            {activeModalItem.image && (
              <div style={{
                width: '100%',
                height: '280px',
                borderRadius: '18px',
                overflow: 'hidden',
                marginBottom: '20px',
                position: 'relative',
                boxShadow: '0 6px 20px rgba(0,0,0,0.1)'
              }}>
                <img 
                  src={activeModalItem.image} 
                  alt={activeModalItem.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(8px)',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: '800',
                  color: '#C2410C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin size={12} color="#FF5500" />
                  <span>{activeModalItem.region || 'Maharashtra'}</span>
                </div>

                {activeModalItem.timing && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.88)',
                    backdropFilter: 'blur(8px)',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.74rem',
                    fontWeight: '800',
                    color: '#FFA066',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Clock size={12} />
                    <span>{activeModalItem.timing}</span>
                  </div>
                )}
              </div>
            )}

            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
              <span style={{ fontSize: '2.5rem' }}>{activeModalItem.emoji}</span>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="badge-orange" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                    {activeModalItem.partName}
                  </span>
                  {activeModalItem.gender ? (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: activeModalItem.gender === 'men' ? '#EFF6FF' : '#FDF2F8',
                      color: activeModalItem.gender === 'men' ? '#1D4ED8' : '#BE185D',
                      border: `1px solid ${activeModalItem.gender === 'men' ? '#93C5FD' : '#F472B6'}`,
                      fontWeight: '800'
                    }}>
                      {activeModalItem.gender === 'men' ? '👨 For Men (Top 5)' : '👩 For Women (Top 5)'}
                    </span>
                  ) : activeModalItem.category ? (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#F1F5F9',
                      color: '#475569',
                      fontWeight: '700'
                    }}>
                      {activeModalItem.category}
                    </span>
                  ) : null}
                  {activeModalItem.spiceLevel && (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#FEF2F2',
                      color: '#DC2626',
                      fontWeight: '800'
                    }}>
                      {activeModalItem.spiceLevel}
                    </span>
                  )}
                  {activeModalItem.timing && (
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: '#FFEDD5',
                      color: '#C2410C',
                      border: '1px solid #FDBA74',
                      fontWeight: '800'
                    }}>
                      📅 {activeModalItem.timing.split('(')[0].trim()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A', lineHeight: '1.2', marginBottom: '6px' }}>
              {activeModalItem.title}
            </h2>

            <p style={{ fontSize: '1rem', color: '#FF5500', fontWeight: '700', marginBottom: '20px' }}>
              "{activeModalItem.subtitle}"
            </p>

            {/* Interactive Rating Row in Modal (For Food & Clothes) */}
            {(activeModalItem.partId === 'food' || activeModalItem.partId === 'clothes') && (
              <div style={{
                padding: '12px 18px',
                borderRadius: '16px',
                background: '#FFF9F6',
                border: '1.5px solid rgba(255, 85, 0, 0.3)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>
                    {activeModalItem.userRating ? `Your Rating: ${activeModalItem.userRating} / 5 Stars` : `Cast Your Community ${activeModalItem.partId === 'clothes' ? 'Attire' : 'Dish'} Rating`}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' }}>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoveredStars[activeModalItem.id] || activeModalItem.userRating || 0) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={(e) => handleRateItem(activeModalItem.id, star, e)}
                          onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [activeModalItem.id]: star }))}
                          onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [activeModalItem.id]: null }))}
                          style={{
                            border: 'none',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '2px',
                            transition: 'transform 0.15s ease'
                          }}
                        >
                          <Star 
                            size={22} 
                            color={isFilled ? '#EAB308' : '#CBD5E1'} 
                            fill={isFilled ? '#EAB308' : 'none'} 
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Star size={16} fill="#EAB308" color="#EAB308" />
                    <span>{activeModalItem.rating?.toFixed(1) || '4.8'} / 5.0</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {activeModalItem.totalVotes || 100} verified {activeModalItem.partId === 'clothes' ? 'attire' : 'foodie'} ratings
                  </div>
                </div>
              </div>
            )}

            {/* Description & Cultural Essence */}
            {activeModalItem.description && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: '#FFF7F2',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#FF5500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  📖 Description & Cultural Significance
                </h4>
                <p style={{ color: '#1E293B', fontSize: '0.94rem', lineHeight: '1.65', margin: 0 }}>
                  {activeModalItem.description}
                </p>
              </div>
            )}

            {/* Taste Profile Section (For Dishes) */}
            {activeModalItem.taste && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: '#FFF7F2',
                border: '1px solid rgba(255, 85, 0, 0.25)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#FF5500', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  😋 The Taste & Texture Profile
                </h4>
                <p style={{ color: '#1E293B', fontSize: '0.94rem', lineHeight: '1.65', margin: 0 }}>
                  {activeModalItem.taste}
                </p>
              </div>
            )}

            {/* History Section (For Food, Festivals & Clothes) */}
            {(activeModalItem.history || activeModalItem.story) && (
              <div style={{
                padding: '16px 20px',
                borderRadius: '16px',
                background: '#F8FAFC',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 6px', fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {activeModalItem.partId === 'clothes' ? '📜 Historical Story & Heritage Legacy' : '🏛️ Historical Origins & Cultural Legacy'}
                </h4>
                <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.65', margin: 0 }}>
                  {activeModalItem.story || activeModalItem.history}
                </p>
              </div>
            )}

            {/* Mind-Blowing & Interesting Facts Section */}
            {((activeModalItem.interestingFacts && activeModalItem.interestingFacts.length > 0) || (activeModalItem.facts && activeModalItem.facts.length > 0)) && (
              <div style={{
                padding: '18px 20px',
                borderRadius: '16px',
                background: '#FFF9F5',
                border: '1.5px solid rgba(255, 85, 0, 0.25)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.84rem', fontFamily: 'var(--font-mono)', color: '#C2410C', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="#FF5500" />
                  <span>{activeModalItem.partId === 'clothes' ? 'Craftsmanship, Drape & Textile Facts' : 'Mind-Blowing & Interesting Facts'}</span>
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(activeModalItem.facts || activeModalItem.interestingFacts).map((fact, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        background: '#FFEDD5',
                        color: '#C2410C',
                        fontSize: '0.75rem',
                        fontWeight: '900',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        {idx + 1}
                      </span>
                      <p style={{ margin: 0, color: '#334155', fontSize: '0.92rem', lineHeight: '1.6' }}>
                        {fact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Materials & Weaves (For Clothes) */}
            {activeModalItem.materials && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#C2410C', textTransform: 'uppercase' }}>
                  🧵 Authentic Materials & Traditional Weaves
                </h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  {activeModalItem.materials}
                </p>
              </div>
            )}

            {/* Traditional Occasions & Ceremonies (For Clothes) */}
            {activeModalItem.occasions && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#C2410C', textTransform: 'uppercase' }}>
                  🪔 Traditional Occasions & Ritual Wearing
                </h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  {activeModalItem.occasions}
                </p>
              </div>
            )}

            {/* Key Ingredients Section (For Food) */}
            {activeModalItem.ingredients && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#C2410C', textTransform: 'uppercase' }}>
                  🥘 Key Authentic Ingredients
                </h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0 }}>
                  {activeModalItem.ingredients}
                </p>
              </div>
            )}

            {/* Sacred Rituals Section (For Festivals) */}
            {activeModalItem.rituals && (
              <div style={{
                padding: '14px 18px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <h4 style={{ margin: '0 0 4px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#C2410C', textTransform: 'uppercase' }}>
                  🪔 Sacred Ceremonies & Offerings
                </h4>
                <p style={{ color: '#475569', fontSize: '0.88rem', margin: 0, lineHeight: '1.6' }}>
                  {activeModalItem.rituals}
                </p>
              </div>
            )}

            {/* Non-Food Details Narrative (Fallback for other pillars) */}
            {!activeModalItem.taste && !activeModalItem.description && !activeModalItem.story && activeModalItem.details && (
              <div style={{
                padding: '18px 20px',
                borderRadius: '16px',
                background: '#FFF7F2',
                border: '1px solid rgba(255, 85, 0, 0.2)',
                marginBottom: '20px'
              }}>
                <h4 style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#FF5500', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                  Cultural Narrative & Origins
                </h4>
                <p style={{ color: '#1E293B', fontSize: '0.95rem', lineHeight: '1.7', margin: 0 }}>
                  {activeModalItem.details}
                </p>
              </div>
            )}

            {/* Gen Z Takeaway */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '16px',
              background: '#FFFFFF',
              border: '1.5px solid #FF5500',
              boxShadow: '0 4px 18px rgba(255, 85, 0, 0.1)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#E04800', fontWeight: '800', fontSize: '0.88rem', marginBottom: '4px' }}>
                <Flame size={16} />
                <span>GEN Z TAKEAWAY</span>
              </div>
              <p style={{ color: '#334155', fontSize: '0.92rem', lineHeight: '1.6', margin: 0 }}>
                {activeModalItem.genZTakeaway}
              </p>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(15, 23, 42, 0.08)', paddingTop: '18px' }}>
              <button
                onClick={(e) => handleLike(activeModalItem.id, e)}
                className="btn-primary"
                style={{ padding: '12px 24px' }}
              >
                <Heart size={18} fill={activeModalItem.isLiked ? "#FFFFFF" : "none"} />
                <span>{activeModalItem.isLiked ? (activeModalItem.partId === 'food' ? 'Liked Dish' : activeModalItem.partId === 'clothes' ? 'Liked Attire' : 'Liked Festival') : (activeModalItem.partId === 'food' ? 'Like Dish' : activeModalItem.partId === 'clothes' ? 'Like Attire' : 'Like Festival')}</span>
              </button>

              <button
                onClick={() => setActiveModalItem(null)}
                className="btn-secondary"
                style={{ padding: '12px 22px' }}
              >
                Close Story
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Share Discovery Modal */}
      {shareModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setShareModalItem(null)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '460px',
              borderRadius: '24px',
              background: '#FFFFFF',
              border: '2px solid #FF5500',
              boxShadow: '0 25px 60px rgba(255, 85, 0, 0.3)',
              padding: '30px',
              textAlign: 'center'
            }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#FFF5F0',
              border: '1.5px solid rgba(255, 85, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: '#FF5500'
            }}>
              <Share2 size={24} />
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#0F172A', marginBottom: '8px' }}>
              Share this Cultural Discovery
            </h3>

            <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '22px' }}>
              "{shareModalItem.title}"
            </p>

            <button
              onClick={handleCopyLink}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginBottom: '12px' }}
            >
              {copiedLink ? <Check size={18} /> : <Share2 size={18} />}
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Direct Link'}</span>
            </button>

            <button
              onClick={() => setShareModalItem(null)}
              className="btn-secondary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Rating Feedback Toast Notification */}
      {ratingToast && (
        <div className="xp-toast" role="status" aria-live="polite">
          <Star size={18} fill="#FFFFFF" />
          <span>{ratingToast}</span>
        </div>
      )}

    </div>
  );
}

export default ExplorePage;
