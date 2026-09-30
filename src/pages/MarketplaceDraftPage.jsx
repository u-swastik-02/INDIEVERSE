import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  Search, 
  X, 
  Store, 
  Plus, 
  Trash2, 
  Upload, 
  Camera, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Check, 
  Bell, 
  Package, 
  Clock, 
  Eye, 
  Award, 
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick, playChime, playCelebration } from '../utils/audio';
import { 
  INITIAL_MARKETPLACE_PRODUCTS, 
  MARKETPLACE_CATEGORIES, 
  PRESET_IMAGE_OPTIONS 
} from '../data/marketplaceProducts';

export function MarketplaceDraftPage({ onNavigate }) {
  // Mode toggle: 'shop' (Customer Upcoming Drops Showcase) vs 'seller' (Admin / Seller Portal)
  const [viewMode, setViewMode] = useState('shop');

  // Products state persisted in localStorage
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('indiverse_marketplace_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved products', e);
    }
    return INITIAL_MARKETPLACE_PRODUCTS;
  });

  // Notified list state (products user requested notifications for when listed soon)
  const [notifiedProductIds, setNotifiedProductIds] = useState(() => {
    try {
      const saved = localStorage.getItem('indiverse_marketplace_notified');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load notified products', e);
    }
    return ['prod-fusion-paithani-denim'];
  });

  // Notified drawer toggle
  const [isNotifiedDrawerOpen, setIsNotifiedDrawerOpen] = useState(false);

  // VIP global email alert subscription
  const [vipEmail, setVipEmail] = useState('');
  const [isVipSubscribed, setIsVipSubscribed] = useState(() => {
    return localStorage.getItem('indiverse_vip_subscribed') === 'true';
  });

  // Filters and search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modal preview state
  const [activeProductModal, setActiveProductModal] = useState(null);
  const [modalActiveImageIndex, setModalActiveImageIndex] = useState(0);
  const [cardActiveImageIndex, setCardActiveImageIndex] = useState({});

  // Toast notification
  const [toastMessage, setToastMessage] = useState(null);
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Admin / Seller state
  const [adminTab, setAdminTab] = useState('inventory');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [newProduct, setNewProduct] = useState({
    title: '',
    subtitle: '',
    category: 'streetwear',
    artisan: '',
    region: 'Maharashtra',
    price: '',
    originalPrice: '',
    stock: 15,
    badge: 'To Be Listed Soon • Artisan Batch',
    sizes: 'S, M, L, XL',
    description: '',
    materials: '',
    careInstructions: ''
  });

  // Persist products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('indiverse_marketplace_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Persist notified IDs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('indiverse_marketplace_notified', JSON.stringify(notifiedProductIds));
    } catch (e) {
      console.error(e);
    }
  }, [notifiedProductIds]);

  // Toggle notification for a product
  const handleToggleNotification = (productId, e) => {
    e?.stopPropagation();
    playChime();
    setNotifiedProductIds(prev => {
      if (prev.includes(productId)) {
        showToast('Notification preference removed.');
        return prev.filter(id => id !== productId);
      } else {
        playCelebration();
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7 }
        });
        showToast('🔔 Awesome! You will be notified the instant this product is listed.');
        return [...prev, productId];
      }
    });
  };

  // VIP email subscription
  const handleVipSubscribe = (e) => {
    e.preventDefault();
    if (!vipEmail.trim() || !vipEmail.includes('@')) {
      showToast('⚠️ Please enter a valid email address.');
      return;
    }
    playCelebration();
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsVipSubscribed(true);
    localStorage.setItem('indiverse_vip_subscribed', 'true');
    showToast(`🎉 VIP Access Confirmed! We'll email ${vipEmail} when products are listed.`);
    setVipEmail('');
  };

  // Filtered and sorted upcoming products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = prod.title?.toLowerCase().includes(q);
        const matchesArtisan = prod.artisan?.toLowerCase().includes(q);
        const matchesRegion = prod.region?.toLowerCase().includes(q);
        const matchesDesc = prod.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesArtisan && !matchesRegion && !matchesDesc) {
          return false;
        }
      }
      // Price filter
      if (priceFilter === 'under1500' && prod.price >= 1500) return false;
      if (priceFilter === '1500to3000' && (prod.price < 1500 || prod.price > 3000)) return false;
      if (priceFilter === '3000to5000' && (prod.price < 3000 || prod.price > 5000)) return false;
      if (priceFilter === 'above5000' && prod.price <= 5000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 4.9) - (a.rating || 4.9);
      if (sortBy === 'newest') return new Date(b.createdDate || 0) - new Date(a.createdDate || 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  // Host device image uploader handler
  const handleHostFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (uploadedImages.length + files.length > 3) {
      alert('You can upload a maximum of 3 images for a single product.');
      return;
    }

    setIsUploading(true);
    let loadedCount = 0;
    const newImgs = [...uploadedImages];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        loadedCount++;
        if (loadedCount === files.length) setIsUploading(false);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (newImgs.length < 3) {
          newImgs.push(event.target.result);
        }
        loadedCount++;
        if (loadedCount === files.length) {
          setUploadedImages(newImgs);
          setIsUploading(false);
          playChime();
          showToast(`📸 ${newImgs.length}/3 photos added from your device!`);
        }
      };
      reader.onerror = () => {
        loadedCount++;
        if (loadedCount === files.length) setIsUploading(false);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add preset photo
  const handleAddPresetPhoto = (url) => {
    if (uploadedImages.length >= 3) {
      showToast('Maximum 3 photos per product reached.');
      return;
    }
    playClick();
    const updated = [...uploadedImages, url];
    setUploadedImages(updated);
    showToast(`📸 Added angle (${updated.length}/3 photos)`);
  };

  // Remove photo from uploader
  const handleRemovePhoto = (idx) => {
    playClick();
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  // Admin: Submit new upcoming product
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title.trim() || !newProduct.price) {
      showToast('⚠️ Please provide a product title and estimated price.');
      return;
    }

    const finalImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ['/fusion/denim_jacket.jpg'];

    const newlyCreated = {
      id: `prod-custom-${Date.now()}`,
      title: newProduct.title.trim(),
      subtitle: newProduct.subtitle.trim() || 'Handcrafted Artisan Edition',
      category: newProduct.category,
      categoryLabel: MARKETPLACE_CATEGORIES.find(c => c.id === newProduct.category)?.label || 'Heritage Fusion',
      artisan: newProduct.artisan.trim() || 'Maharashtra Artisan Cooperative',
      region: newProduct.region.trim() || 'Maharashtra, India',
      price: Number(newProduct.price),
      originalPrice: Number(newProduct.originalPrice) || Math.round(Number(newProduct.price) * 1.35),
      discountPercent: Math.round(((Number(newProduct.originalPrice || Number(newProduct.price) * 1.35) - Number(newProduct.price)) / Number(newProduct.originalPrice || Number(newProduct.price) * 1.35)) * 100),
      rating: 5.0,
      reviewsCount: 1,
      stock: Number(newProduct.stock) || 12,
      image: finalImages[0],
      images: finalImages,
      badge: 'To Be Listed Soon • New Staged Drop',
      deliveryDays: 2,
      freeDelivery: true,
      sizes: newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean),
      description: newProduct.description.trim() || 'Scheduled to be listed soon. Crafted with traditional craftsmanship and contemporary aesthetics.',
      specifications: {
        'Materials Used': newProduct.materials.trim() || 'Authentic Handloom & Eco-friendly components',
        'Origin Cluster': newProduct.region.trim() || 'Maharashtra Artisan Cluster',
        'Care Instructions': newProduct.careInstructions.trim() || 'Handle with artisan care; Dry clean recommended',
        'Status': 'To Be Listed Soon'
      },
      isFeatured: true,
      createdDate: new Date().toISOString()
    };

    setProducts(prev => [newlyCreated, ...prev]);
    playCelebration();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
    setIsAddProductOpen(false);
    setUploadedImages([]);
    showToast(`🎉 Upcoming product "${newlyCreated.title}" staged to be listed soon!`);

    setNewProduct({
      title: '',
      subtitle: '',
      category: 'streetwear',
      artisan: '',
      region: 'Maharashtra',
      price: '',
      originalPrice: '',
      stock: 15,
      badge: 'To Be Listed Soon • Artisan Batch',
      sizes: 'S, M, L, XL',
      description: '',
      materials: '',
      careInstructions: ''
    });
  };

  // Admin: Delete Product
  const handleDeleteProduct = (productId) => {
    if (window.confirm('Remove this upcoming product from the preview list?')) {
      playClick();
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product removed.');
    }
  };

  // Admin: Reset catalog
  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog back to initial 10 upcoming fusion products?')) {
      playClick();
      setProducts(INITIAL_MARKETPLACE_PRODUCTS);
      showToast('Catalog restored to default 10 upcoming fusion drops.');
    }
  };

  return (
    <div style={{ position: 'relative', zIndex: 1, paddingBottom: '90px', minHeight: '100vh' }}>
      
      {/* ============================================================== */}
      {/* TOP HEADER / APP BAR FOR MARKETPLACE */}
      {/* ============================================================== */}
      <section style={{
        background: '#FFFFFF',
        borderBottom: '1.5px solid rgba(255, 85, 0, 0.2)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        position: 'sticky',
        top: '76px',
        zIndex: 30
      }}>
        <div className="container" style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Brand & Back */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => { playClick(); onNavigate('home'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#64748B',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.86rem'
              }}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div style={{ height: '20px', width: '1px', background: '#E2E8F0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(255, 85, 0, 0.35)'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#0F172A', letterSpacing: '-0.01em' }}>
                  INDIVERSE <span style={{ color: '#FF5500' }}>MARKETPLACE</span>
                </span>
                <span style={{
                  fontSize: '0.66rem',
                  fontWeight: '900',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: '#FEF3C7',
                  color: '#B45309',
                  border: '1px solid #FCD34D',
                  marginLeft: '8px'
                }}>
                  ⏳ PRODUCTS TO BE LISTED SOON
                </span>
              </div>
            </div>
          </div>

          {/* Center: Mode Switcher (Customer Drops Showcase vs Seller Admin) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '12px'
          }}>
            <button
              onClick={() => { playClick(); setViewMode('shop'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: '800',
                cursor: 'pointer',
                border: 'none',
                background: viewMode === 'shop' ? '#FFFFFF' : 'transparent',
                color: viewMode === 'shop' ? '#FF5500' : '#475569',
                boxShadow: viewMode === 'shop' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Clock size={15} />
              <span>Upcoming Drops</span>
            </button>

            <button
              onClick={() => { playClick(); setViewMode('seller'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '10px',
                fontSize: '0.84rem',
                fontWeight: '800',
                cursor: 'pointer',
                border: 'none',
                background: viewMode === 'seller' ? '#FF5500' : 'transparent',
                color: viewMode === 'seller' ? '#FFFFFF' : '#475569',
                boxShadow: viewMode === 'seller' ? '0 2px 8px rgba(255,85,0,0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <Store size={15} />
              <span>Seller Portal</span>
              <span style={{
                fontSize: '0.62rem',
                background: viewMode === 'seller' ? 'rgba(255,255,255,0.25)' : '#E2E8F0',
                color: viewMode === 'seller' ? '#FFFFFF' : '#0F172A',
                padding: '1px 6px',
                borderRadius: '999px',
                fontWeight: '900'
              }}>
                ADMIN
              </span>
            </button>
          </div>

          {/* Right Action: Notified Products Drawer Trigger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => { playClick(); setIsNotifiedDrawerOpen(true); }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: '800',
                fontSize: '0.84rem',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(255, 85, 0, 0.3)'
              }}
            >
              <Bell size={16} />
              <span>Notify List ({notifiedProductIds.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* CUSTOMER VIEW: PRODUCTS TO BE LISTED SOON */}
      {/* ============================================================== */}
      {viewMode === 'shop' && (
        <div className="container" style={{ paddingTop: '24px' }}>
          
          {/* Hero Promotional Banner: "Products to be listed soon" */}
          <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #090D16 0%, #1E1B4B 40%, #B91C1C 80%, #EA580C 100%)',
            color: '#FFFFFF',
            padding: '38px 42px',
            marginBottom: '32px',
            boxShadow: '0 14px 40px rgba(255, 85, 0, 0.18)'
          }}>
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '780px' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '5px 14px', 
                borderRadius: '999px', 
                background: 'rgba(255, 255, 255, 0.14)', 
                backdropFilter: 'blur(8px)', 
                border: '1px solid rgba(255, 255, 255, 0.25)', 
                marginBottom: '14px' 
              }}>
                <Clock size={14} color="#FDE047" />
                <span style={{ fontSize: '0.76rem', fontWeight: '900', letterSpacing: '0.04em', color: '#FDE047' }}>
                  CURATION IN PROGRESS • DEBUT BATCH 2026
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.1rem, 4.4vw, 3.1rem)',
                fontWeight: '900',
                lineHeight: '1.1',
                marginBottom: '14px',
                letterSpacing: '-0.02em'
              }}>
                Products to be listed soon
              </h1>

              <p style={{ fontSize: '1.02rem', color: '#E2E8F0', lineHeight: '1.65', marginBottom: '24px' }}>
                All active retail products have been removed from the live marketplace while our artisan mastercraft guilds across Maharashtra and India complete small-batch handcrafting, GI authentication, and premium packaging. Browse the upcoming fusion drops below and sign up to receive VIP early access the moment each product is listed!
              </p>

              {/* VIP Early Access Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {!isVipSubscribed ? (
                  <form onSubmit={handleVipSubscribe} style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '520px' }}>
                    <input 
                      type="email"
                      placeholder="Enter your email or WhatsApp number"
                      value={vipEmail}
                      onChange={(e) => setVipEmail(e.target.value)}
                      style={{
                        flex: '1 1 240px',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        border: '1.5px solid rgba(255,255,255,0.4)',
                        background: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(10px)',
                        color: '#FFFFFF',
                        fontSize: '0.9rem',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '11px 22px',
                        borderRadius: '12px',
                        background: '#FDE047',
                        color: '#0F172A',
                        fontWeight: '900',
                        fontSize: '0.88rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 14px rgba(253, 224, 71, 0.4)'
                      }}
                    >
                      <Bell size={16} />
                      <span>Notify Me For All Drops</span>
                    </button>
                  </form>
                ) : (
                  <div style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    background: 'rgba(34, 197, 94, 0.2)',
                    border: '1.5px solid #86EFAC',
                    color: '#86EFAC',
                    fontWeight: '800',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Check size={18} />
                    <span>✓ You are on the VIP Launch Notification list!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Background Watermark */}
            <div style={{
              position: 'absolute',
              right: '-30px',
              bottom: '-40px',
              fontSize: '16rem',
              opacity: '0.07',
              userSelect: 'none',
              pointerEvents: 'none'
            }}>
              ⏳
            </div>
          </div>

          {/* Category Ribbon Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '12px',
            marginBottom: '24px',
            scrollbarWidth: 'none'
          }}>
            {MARKETPLACE_CATEGORIES.map(cat => {
              const count = cat.id === 'all' 
                ? products.length 
                : products.filter(p => p.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => { playClick(); setSelectedCategory(cat.id); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '16px',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? '800' : '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    background: isSelected 
                      ? 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)' 
                      : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: isSelected ? '1.5px solid #FF5500' : '1.5px solid rgba(255, 85, 0, 0.18)',
                    boxShadow: isSelected ? '0 4px 15px rgba(255, 85, 0, 0.3)' : '0 2px 6px rgba(0,0,0,0.02)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '1.1rem' }}>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isSelected ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#64748B',
                    fontWeight: '800'
                  }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            background: '#FFFFFF',
            padding: '18px 22px',
            borderRadius: '20px',
            border: '1.5px solid rgba(255, 85, 0, 0.2)',
            boxShadow: '0 6px 25px rgba(15, 23, 42, 0.04)',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              
              {/* Search Box */}
              <div style={{
                flex: '1 1 320px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '14px',
                padding: '10px 16px'
              }}>
                <Search size={18} color="#FF5500" />
                <input 
                  type="text"
                  placeholder="Search upcoming Paithani denim, Sanskrit hoodie, Neo-Kolhapuris, Warli skate, Petrichor attar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: '#0F172A',
                    fontWeight: '500'
                  }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort By Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => { playClick(); setSortBy(e.target.value); }}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    color: '#0F172A',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="featured">Featured Drops</option>
                  <option value="price-asc">Expected Price: Low to High</option>
                  <option value="price-desc">Expected Price: High to Low</option>
                  <option value="rating">Top Rated Mastercraft</option>
                  <option value="newest">Latest Staged Drops</option>
                </select>
              </div>
            </div>

            {/* Quick Price Range Filters */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748B', fontSize: '0.8rem', fontWeight: '800', marginRight: '6px' }}>
                <SlidersHorizontal size={14} />
                <span>Price Bracket:</span>
              </div>

              {[
                { id: 'all', label: 'All Ranges' },
                { id: 'under1500', label: 'Under ₹1,500' },
                { id: '1500to3000', label: '₹1,500 - ₹3,000' },
                { id: '3000to5000', label: '₹3,000 - ₹5,000' },
                { id: 'above5000', label: 'Above ₹5,000' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => { playClick(); setPriceFilter(p.id); }}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '999px',
                    fontSize: '0.76rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    background: priceFilter === p.id ? '#0F172A' : '#F1F5F9',
                    color: priceFilter === p.id ? '#FFFFFF' : '#475569',
                    border: priceFilter === p.id ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              ))}

              {(searchQuery || selectedCategory !== 'all' || priceFilter !== 'all') && (
                <button
                  onClick={() => {
                    playClick();
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setPriceFilter('all');
                    setSortBy('featured');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#FF5500',
                    fontSize: '0.78rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    marginLeft: '8px'
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>

          {/* Results Summary Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.92rem', color: '#475569', fontWeight: '700' }}>
              Showing <strong style={{ color: '#0F172A' }}>{filteredProducts.length}</strong> products to be listed soon
            </span>

            <span style={{ fontSize: '0.8rem', color: '#B45309', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#B45309" />
              <span>Certified Handcrafted Authenticity Guaranteed</span>
            </span>
          </div>

          {/* Products To Be Listed Soon Grid */}
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              borderRadius: '24px',
              background: '#FFFFFF',
              border: '1.5px dashed rgba(255, 85, 0, 0.3)'
            }}>
              <Package size={48} color="#FF5500" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
                No Upcoming Products Match Your Criteria
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '18px' }}>
                Try adjusting your search terms or resetting the category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setPriceFilter('all');
                }}
                className="btn-primary"
              >
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '24px'
            }}>
              {filteredProducts.map((product) => {
                const isNotified = notifiedProductIds.includes(product.id);
                const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                const activeImgIdx = cardActiveImageIndex[product.id] || 0;
                const activeCardImage = productImages[activeImgIdx] || product.image;

                return (
                  <div
                    key={product.id}
                    onClick={() => {
                      playClick();
                      setActiveProductModal(product);
                      setModalActiveImageIndex(activeImgIdx);
                    }}
                    className="card-hover-crazy"
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '22px',
                      border: '1.5px solid rgba(255, 85, 0, 0.2)',
                      boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      position: 'relative'
                    }}
                  >
                    {/* Top Image Container with 3-Image Preview Switcher */}
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '260px',
                      background: '#F8FAFC',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={activeCardImage} 
                        alt={product.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease'
                        }}
                      />

                      {/* Prominent "To Be Listed Soon" Badge */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        zIndex: 2
                      }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '8px',
                          background: 'rgba(15, 23, 42, 0.92)',
                          backdropFilter: 'blur(8px)',
                          color: '#FDE047',
                          fontSize: '0.72rem',
                          fontWeight: '900',
                          letterSpacing: '0.03em',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          <Clock size={12} color="#FDE047" />
                          <span>TO BE LISTED SOON</span>
                        </span>

                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(234, 88, 12, 0.9)',
                          color: '#FFFFFF',
                          fontSize: '0.64rem',
                          fontWeight: '800'
                        }}>
                          Crafting Batch 01
                        </span>
                      </div>

                      {/* Multi-Image Indicator Pill (Up to 3 images) */}
                      {productImages.length > 1 && (
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(15, 23, 42, 0.8)',
                          backdropFilter: 'blur(6px)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.65rem',
                          fontWeight: '800',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          zIndex: 2
                        }}>
                          <Camera size={11} />
                          <span>{activeImgIdx + 1}/{productImages.length}</span>
                        </div>
                      )}

                      {/* Region Tag */}
                      <div style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        background: 'rgba(255, 255, 255, 0.94)',
                        backdropFilter: 'blur(6px)',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.68rem',
                        fontWeight: '800',
                        color: '#C2410C',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}>
                        <MapPin size={11} color="#FF5500" />
                        <span>{product.region?.split(',')[0]}</span>
                      </div>

                      {/* Image Thumbnail Dots Switcher */}
                      {productImages.length > 1 && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            position: 'absolute',
                            bottom: '12px',
                            right: '12px',
                            display: 'flex',
                            gap: '4px',
                            background: 'rgba(15, 23, 42, 0.7)',
                            backdropFilter: 'blur(6px)',
                            padding: '3px 6px',
                            borderRadius: '999px',
                            zIndex: 3
                          }}
                        >
                          {productImages.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardActiveImageIndex(prev => ({ ...prev, [product.id]: dotIdx }));
                              }}
                              style={{
                                width: '7px',
                                height: '7px',
                                borderRadius: '50%',
                                border: 'none',
                                background: activeImgIdx === dotIdx ? '#FF5500' : 'rgba(255, 255, 255, 0.5)',
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'all 0.15s ease'
                              }}
                              title={`View photo ${dotIdx + 1} of ${productImages.length}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Product Card Details */}
                    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      
                      {/* Artisan Guild Name */}
                      <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                        {product.artisan}
                      </div>

                      {/* Title */}
                      <h3 style={{
                        fontSize: '1.04rem',
                        fontWeight: '800',
                        color: '#0F172A',
                        lineHeight: '1.35',
                        margin: '0 0 6px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.title}
                      </h3>

                      {/* Subtitle / Description teaser */}
                      <p style={{
                        fontSize: '0.82rem',
                        color: '#64748B',
                        margin: '0 0 12px',
                        lineHeight: '1.5',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.subtitle || product.description}
                      </p>

                      {/* Pricing Row: Expected Launch Price */}
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                        <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>
                          Expected:
                        </span>
                        <span style={{ fontSize: '1.35rem', fontWeight: '900', color: '#0F172A' }}>
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span style={{ fontSize: '0.85rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        <span style={{ fontSize: '0.72rem', color: '#C2410C', fontWeight: '800', background: '#FFEDD5', padding: '1px 6px', borderRadius: '4px' }}>
                          Debut Price
                        </span>
                      </div>

                      {/* Action Buttons: Notify Me When Listed & Quick Preview */}
                      <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                        <button
                          onClick={(e) => handleToggleNotification(product.id, e)}
                          style={{
                            flex: 1,
                            padding: '10px 12px',
                            borderRadius: '12px',
                            background: isNotified ? '#ECFDF5' : 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                            border: isNotified ? '1.5px solid #10B981' : 'none',
                            color: isNotified ? '#065F46' : '#FFFFFF',
                            fontSize: '0.84rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: isNotified ? 'none' : '0 4px 12px rgba(255, 85, 0, 0.25)',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {isNotified ? (
                            <>
                              <Check size={15} color="#10B981" />
                              <span>✓ Notification Set!</span>
                            </>
                          ) : (
                            <>
                              <Bell size={15} />
                              <span>Notify When Listed</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                            setActiveProductModal(product);
                            setModalActiveImageIndex(activeImgIdx);
                          }}
                          style={{
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: '#F1F5F9',
                            border: '1px solid #CBD5E1',
                            color: '#334155',
                            fontSize: '0.84rem',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                          title="Quick preview details & specifications"
                        >
                          <Eye size={15} />
                          <span>Preview</span>
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* SELLER / ADMIN PORTAL */}
      {/* ============================================================== */}
      {viewMode === 'seller' && (
        <div className="container" style={{ paddingTop: '28px' }}>
          
          {/* Seller Portal Header Banner */}
          <div style={{
            padding: '28px 32px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F0 100%)',
            border: '2px solid #FF5500',
            boxShadow: '0 10px 30px rgba(255, 85, 0, 0.08)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: '#FFEDD5', color: '#C2410C', fontWeight: '800', fontSize: '0.76rem', marginBottom: '8px' }}>
                  <Store size={14} />
                  <span>SELLER & ADMIN PORTAL • MANAGE UPCOMING PRODUCTS</span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: '900', color: '#0F172A', margin: '0 0 6px' }}>
                  Stage & Manage Products to be Listed Soon
                </h1>
                <p style={{ color: '#475569', fontSize: '0.94rem', margin: 0, maxWidth: '640px' }}>
                  Upload up to 3 photography angles directly from your host device, stage new fusion batches, configure estimated pricing, and manage subscriber notifications.
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => { playClick(); setIsAddProductOpen(true); }}
                  style={{
                    padding: '12px 22px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                    border: 'none',
                    color: '#FFFFFF',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 6px 18px rgba(255, 85, 0, 0.35)'
                  }}
                >
                  <Plus size={18} />
                  <span>Stage New Product</span>
                </button>

                <button
                  onClick={handleResetCatalog}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    border: '1.5px solid #CBD5E1',
                    color: '#475569',
                    fontWeight: '700',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  title="Reset to default 10 upcoming products"
                >
                  <RotateCcw size={15} />
                  <span>Reset Catalog</span>
                </button>
              </div>
            </div>
          </div>

          {/* Admin KPI Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '32px'
          }}>
            {[
              {
                label: 'Products To Be Listed',
                value: products.length,
                icon: Package,
                color: '#FF5500',
                bg: '#FFF5F0'
              },
              {
                label: 'Active Notification Alerts',
                value: notifiedProductIds.length,
                icon: Bell,
                color: '#15803D',
                bg: '#DCFCE7'
              },
              {
                label: 'Estimated Batch Value',
                value: `₹${products.reduce((acc, p) => acc + (p.price * (p.stock || 12)), 0).toLocaleString('en-IN')}`,
                icon: Award,
                color: '#B45309',
                bg: '#FEF3C7'
              },
              {
                label: 'Listing Status',
                value: 'Staging Phase',
                icon: Clock,
                color: '#2563EB',
                bg: '#EFF6FF'
              }
            ].map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <div key={idx} style={{
                  padding: '20px',
                  borderRadius: '18px',
                  background: '#FFFFFF',
                  border: '1.5px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: kpi.bg,
                    color: kpi.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase' }}>
                      {kpi.label}
                    </div>
                    <div style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
                      {kpi.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Admin Navigation Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => { playClick(); setAdminTab('inventory'); }}
              style={{
                padding: '9px 18px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: '800',
                cursor: 'pointer',
                border: 'none',
                background: adminTab === 'inventory' ? '#0F172A' : '#FFFFFF',
                color: adminTab === 'inventory' ? '#FFFFFF' : '#475569',
                boxShadow: adminTab === 'inventory' ? '0 4px 12px rgba(15,23,42,0.2)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              Catalog Inventory ({products.length})
            </button>

            <button
              onClick={() => { playClick(); setAdminTab('subscribers'); }}
              style={{
                padding: '9px 18px',
                borderRadius: '12px',
                fontSize: '0.88rem',
                fontWeight: '800',
                cursor: 'pointer',
                border: 'none',
                background: adminTab === 'subscribers' ? '#0F172A' : '#FFFFFF',
                color: adminTab === 'subscribers' ? '#FFFFFF' : '#475569',
                boxShadow: adminTab === 'subscribers' ? '0 4px 12px rgba(15,23,42,0.2)' : '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              Launch Alerts ({notifiedProductIds.length})
            </button>
          </div>

          {/* Admin Inventory Table */}
          {adminTab === 'inventory' && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
              overflow: 'hidden'
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '780px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0' }}>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Photos (Up to 3)</th>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Product Title</th>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Artisan & Region</th>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Expected Price</th>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '14px 18px', fontSize: '0.78rem', fontWeight: '800', color: '#475569', textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((prod) => {
                      const imgs = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
                      return (
                        <tr key={prod.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                              {imgs.map((src, i) => (
                                <img 
                                  key={i} 
                                  src={src} 
                                  alt="" 
                                  style={{ width: '38px', height: '38px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #CBD5E1' }} 
                                />
                              ))}
                              <span style={{ fontSize: '0.68rem', fontWeight: '800', color: '#64748B', marginLeft: '4px' }}>
                                ({imgs.length}/3)
                              </span>
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.9rem' }}>
                              {prod.title}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#64748B' }}>
                              {prod.categoryLabel}
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '0.84rem', color: '#0F172A', fontWeight: '700' }}>
                              {prod.artisan}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#C2410C' }}>
                              {prod.region}
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontSize: '0.92rem', fontWeight: '900', color: '#0F172A' }}>
                              ₹{prod.price.toLocaleString('en-IN')}
                            </div>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: '#FEF3C7',
                              color: '#92400E',
                              fontSize: '0.74rem',
                              fontWeight: '800',
                              border: '1px solid #FCD34D'
                            }}>
                              ⏳ To Be Listed Soon
                            </span>
                          </td>

                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => {
                                  setActiveProductModal(prod);
                                  setModalActiveImageIndex(0);
                                }}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  background: '#F1F5F9',
                                  border: '1px solid #CBD5E1',
                                  fontSize: '0.76rem',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  background: '#FEE2E2',
                                  border: '1px solid #FCA5A5',
                                  color: '#DC2626',
                                  fontSize: '0.76rem',
                                  fontWeight: '700',
                                  cursor: 'pointer'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Admin Subscribers / Notifications Tab */}
          {adminTab === 'subscribers' && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '24px',
              border: '1.5px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0F172A', marginBottom: '8px' }}>
                Subscriber Notification Registrations
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '20px' }}>
                Products queued with customer alert requests. When inventory is switched to "Live", automatic notifications will dispatch.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifiedProductIds.map(id => {
                  const p = products.find(prod => prod.id === id);
                  if (!p) return null;
                  return (
                    <div key={id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 18px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img src={p.image} alt="" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: '800', color: '#0F172A', fontSize: '0.9rem' }}>{p.title}</div>
                          <div style={{ fontSize: '0.76rem', color: '#64748B' }}>{p.artisan} • Expected ₹{p.price}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#15803D', fontWeight: '800' }}>
                        🔔 High Launch Demand
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* PRODUCT DETAILS MODAL (PREVIEW UPCOMING DROPS) */}
      {/* ============================================================== */}
      {activeProductModal && (() => {
        const modalImages = activeProductModal.images && activeProductModal.images.length > 0 
          ? activeProductModal.images 
          : [activeProductModal.image];
        const isNotified = notifiedProductIds.includes(activeProductModal.id);

        return (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }} onClick={() => setActiveProductModal(null)}>
            
            <div 
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '920px',
                maxHeight: '90vh',
                background: '#FFFFFF',
                borderRadius: '26px',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '28px'
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveProductModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1.5px solid #CBD5E1',
                  color: '#0F172A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 10
                }}
              >
                <X size={18} />
              </button>

              {/* Left Column: 3-Image Photography Gallery */}
              <div style={{ padding: '28px 0 28px 28px' }}>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '380px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  background: '#F1F5F9'
                }}>
                  <img 
                    src={modalImages[modalActiveImageIndex] || activeProductModal.image} 
                    alt={activeProductModal.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Left / Right Nav Arrows if multiple images */}
                  {modalImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalActiveImageIndex(prev => (prev > 0 ? prev - 1 : modalImages.length - 1));
                        }}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F172A',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalActiveImageIndex(prev => (prev < modalImages.length - 1 ? prev + 1 : 0));
                        }}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.9)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#0F172A',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}

                  {/* Photo index indicator */}
                  <span style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    backdropFilter: 'blur(6px)',
                    color: '#FFFFFF',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: '800'
                  }}>
                    Photo {modalActiveImageIndex + 1} of {modalImages.length}
                  </span>
                </div>

                {/* 3-Image Thumbnail Strip */}
                {modalImages.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    marginTop: '14px',
                    justifyContent: 'center'
                  }}>
                    {modalImages.map((thumbSrc, tIdx) => (
                      <div
                        key={tIdx}
                        onClick={() => { playClick(); setModalActiveImageIndex(tIdx); }}
                        style={{
                          width: '74px',
                          height: '64px',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: modalActiveImageIndex === tIdx ? '2.5px solid #FF5500' : '1.5px solid #CBD5E1',
                          boxShadow: modalActiveImageIndex === tIdx ? '0 4px 12px rgba(255, 85, 0, 0.3)' : 'none',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <img 
                          src={thumbSrc} 
                          alt=""
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Provenance Box */}
                <div style={{
                  marginTop: '16px',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  background: '#FFF9F6',
                  border: '1px solid rgba(255, 85, 0, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#FFEDD5',
                    color: '#C2410C',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '800', color: '#0F172A' }}>
                      Certified Artisan Production
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      Crafted by {activeProductModal.artisan} ({activeProductModal.region})
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Information & Notification Subscription */}
              <div style={{ padding: '28px 28px 28px 0', display: 'flex', flexDirection: 'column' }}>
                
                {/* To Be Listed Soon Status Pill */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '999px', background: '#FEF3C7', color: '#92400E', fontWeight: '800', fontSize: '0.76rem', border: '1px solid #FCD34D', marginBottom: '10px', alignSelf: 'flex-start' }}>
                  <Clock size={13} />
                  <span>STATUS: TO BE LISTED SOON</span>
                </div>

                <h2 style={{ fontSize: '1.45rem', fontWeight: '900', color: '#0F172A', lineHeight: '1.25', margin: '0 0 8px' }}>
                  {activeProductModal.title}
                </h2>

                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 16px', lineHeight: '1.5' }}>
                  {activeProductModal.subtitle}
                </p>

                {/* Estimated Price Box */}
                <div style={{
                  padding: '14px 18px',
                  borderRadius: '16px',
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  marginBottom: '18px'
                }}>
                  <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: '800', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                    Estimated Launch Price
                  </span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0F172A' }}>
                      ₹{activeProductModal.price.toLocaleString('en-IN')}
                    </span>
                    {activeProductModal.originalPrice > activeProductModal.price && (
                      <span style={{ fontSize: '1rem', color: '#94A3B8', textDecoration: 'line-through' }}>
                        M.R.P: ₹{activeProductModal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.74rem', color: '#16A34A', fontWeight: '700' }}>
                    ✓ Early bird reservation price lock
                  </span>
                </div>

                {/* Description */}
                <p style={{ color: '#334155', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '16px' }}>
                  {activeProductModal.description}
                </p>

                {/* Specifications Table */}
                {activeProductModal.specifications && (
                  <div style={{
                    marginBottom: '20px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    overflow: 'hidden',
                    fontSize: '0.82rem'
                  }}>
                    {Object.entries(activeProductModal.specifications).map(([k, v], idx) => (
                      <div key={k} style={{
                        display: 'flex',
                        padding: '8px 12px',
                        background: idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF',
                        borderBottom: idx === Object.keys(activeProductModal.specifications).length - 1 ? 'none' : '1px solid #E2E8F0'
                      }}>
                        <span style={{ width: '130px', fontWeight: '800', color: '#475569', flexShrink: 0 }}>{k}:</span>
                        <span style={{ color: '#0F172A' }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Bottom Notification Call To Action */}
                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={(e) => handleToggleNotification(activeProductModal.id, e)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '14px',
                      background: isNotified ? '#ECFDF5' : 'linear-gradient(135deg, #FF6600 0%, #FF3D00 100%)',
                      border: isNotified ? '2px solid #10B981' : 'none',
                      color: isNotified ? '#065F46' : '#FFFFFF',
                      fontSize: '0.95rem',
                      fontWeight: '900',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: isNotified ? 'none' : '0 6px 20px rgba(255, 85, 0, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isNotified ? (
                      <>
                        <Check size={18} color="#10B981" />
                        <span>✓ You Will Be Notified on Listing Day</span>
                      </>
                    ) : (
                      <>
                        <Bell size={18} />
                        <span>Notify Me When Listed Soon</span>
                      </>
                    )}
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '0.74rem', color: '#64748B' }}>
                    🔒 We will only alert you when this specific handcrafted batch is made live for ordering.
                  </div>
                </div>

              </div>
            </div>
          </div>
        );
      })()}

      {/* ============================================================== */}
      {/* NOTIFIED PRODUCTS SLIDE-OVER DRAWER */}
      {/* ============================================================== */}
      {isNotifiedDrawerOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 90,
          display: 'flex',
          justifyContent: 'flex-end'
        }} onClick={() => setIsNotifiedDrawerOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              background: '#FFFFFF',
              boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInRight 0.25s ease-out'
            }}
          >
            {/* Drawer Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1.5px solid #F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={20} color="#FF5500" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Upcoming Drop Alerts ({notifiedProductIds.length})
                </h3>
              </div>

              <button
                onClick={() => setIsNotifiedDrawerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* List */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px 24px' }}>
              {notifiedProductIds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <Bell size={48} color="#CBD5E1" style={{ marginBottom: '14px' }} />
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0F172A', marginBottom: '6px' }}>
                    No Alerts Subscribed
                  </h4>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', marginBottom: '20px' }}>
                    Click "Notify When Listed" on any upcoming item to receive instant launch alerts.
                  </p>
                  <button
                    onClick={() => setIsNotifiedDrawerOpen(false)}
                    className="btn-primary"
                    style={{ padding: '10px 22px' }}
                  >
                    <span>Browse Upcoming Drops</span>
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {notifiedProductIds.map(id => {
                    const product = products.find(p => p.id === id);
                    if (!product) return null;
                    return (
                      <div key={id} style={{
                        display: 'flex',
                        gap: '14px',
                        padding: '14px',
                        borderRadius: '16px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        alignItems: 'center'
                      }}>
                        <img 
                          src={product.image} 
                          alt="" 
                          style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} 
                        />
                        <div style={{ flexGrow: 1 }}>
                          <h4 style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0F172A', margin: '0 0 3px', lineHeight: '1.3' }}>
                            {product.title}
                          </h4>
                          <div style={{ fontSize: '0.74rem', color: '#C2410C', fontWeight: '700' }}>
                            Expected: ₹{product.price.toLocaleString('en-IN')}
                          </div>
                          <span style={{ fontSize: '0.68rem', color: '#16A34A', fontWeight: '800' }}>
                            ✓ Alert Active • Listing Soon
                          </span>
                        </div>

                        <button
                          onClick={() => handleToggleNotification(id)}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '6px' }}
                          title="Remove alert"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div style={{ padding: '18px 24px', borderTop: '1.5px solid #F1F5F9' }}>
              <button
                onClick={() => setIsNotifiedDrawerOpen(false)}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <span>Continue Browsing Drops</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SELLER MODAL: STAGE NEW PRODUCT WITH UP TO 3 IMAGES */}
      {/* ============================================================== */}
      {isAddProductOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }} onClick={() => setIsAddProductOpen(false)}>
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '28px',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.25)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1.5px solid #F1F5F9', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={20} color="#FF5500" />
                <h3 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#0F172A', margin: 0 }}>
                  Stage Product to be Listed Soon
                </h3>
              </div>
              <button onClick={() => setIsAddProductOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Image Upload Zone (Up to 3 images) */}
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Product Photos (Up to 3 from host device or presets):
                </label>

                {/* Uploaded Preview Strip */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {uploadedImages.map((imgSrc, idx) => (
                    <div key={idx} style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '2px solid #FF5500'
                    }}>
                      <img src={imgSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.9)',
                          color: '#FFFFFF',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: 0
                        }}
                      >
                        <X size={12} />
                      </button>
                      <span style={{
                        position: 'absolute',
                        bottom: '2px',
                        left: '4px',
                        fontSize: '0.62rem',
                        fontWeight: '800',
                        color: '#FFFFFF',
                        background: 'rgba(0,0,0,0.65)',
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        #{idx + 1}
                      </span>
                    </div>
                  ))}

                  {uploadedImages.length < 3 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        border: '2px dashed #FF5500',
                        background: '#FFF5F0',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        color: '#C2410C',
                        fontSize: '0.72rem',
                        fontWeight: '800'
                      }}
                    >
                      <Upload size={18} />
                      <span>{isUploading ? 'Loading...' : `Upload`}</span>
                    </button>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  multiple
                  onChange={handleHostFileUpload}
                />

                {/* Quick Presets */}
                <div style={{ marginTop: '8px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: '700' }}>Or select quick presets:</span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                    {PRESET_IMAGE_OPTIONS.slice(0, 6).map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleAddPresetPhoto(preset.url)}
                        disabled={uploadedImages.length >= 3}
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          cursor: uploadedImages.length >= 3 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        + {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Title & Category */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Product Title *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Warli Hand-Painted Denim Shacket"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Category
                  </label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem', background: '#FFFFFF' }}
                  >
                    {MARKETPLACE_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle & Artisan */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Subtitle / Craft Style
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Acid-wash denim with authentic Warli motif"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Artisan Guild & Region
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Palghar Warli Guild • Maharashtra"
                    value={newProduct.artisan}
                    onChange={(e) => setNewProduct({ ...newProduct, artisan: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Price & Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Expected Launch Price (₹) *
                  </label>
                  <input 
                    type="number"
                    required
                    placeholder="e.g. 3499"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    Batch Units to be Produced
                  </label>
                  <input 
                    type="number"
                    placeholder="e.g. 15"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem' }}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                  Full Narrative & Specifications
                </label>
                <textarea 
                  rows={3}
                  placeholder="Describe the cultural craft history, materials used, and why it will be listed soon..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '0.86rem', resize: 'vertical' }}
                />
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  <Plus size={16} />
                  <span>Stage Product (To Be Listed Soon)</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="xp-toast" role="status" aria-live="polite">
          <Sparkles size={18} fill="#FFFFFF" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}

export default MarketplaceDraftPage;
