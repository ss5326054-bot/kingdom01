// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Setup GSAP
gsap.registerPlugin(ScrollTrigger);

// Link GSAP and Lenis
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);

// ── Mobile hamburger menu ──────────────────────────────────
const hamburgerBtn = document.getElementById('hamburger');
const navLinks     = document.getElementById('nav-links');

if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('open');
        navLinks.classList.toggle('mobile-open');
    });

    // Close on link click (smooth UX)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        });
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#main-nav')) {
            hamburgerBtn.classList.remove('open');
            navLinks.classList.remove('mobile-open');
        }
    });
}



// Product Data Object
const productData = {
    "1": {
        name: "Obsidian Pendant",
        price: "₹9,900",
        desc: "A masterwork of minimalism. The Obsidian Pendant combines deep-grained textures with precision optics to create a focus that is both intense and ethereal. Perfect for minimalist dining rooms or modern gallery spaces.",
        images: {
            "Black": "assets/img/modern_pendant_1772958479252.png",
            "Gold": "assets/img/obsidian_pendant_gold.png",
            "Silver": "assets/img/obsidian_pendant_silver.png"
        },
        colors: {
            "Black": "#111",
            "Gold": "#d4af37",
            "Silver": "#c0c0c0"
        }
    },
    "2": {
        name: "Aura Floor Lamp",
        price: "₹12,500",
        desc: "Standing tall as a beacon of modern elegance. The Aura Floor Lamp features a unique sweeping arc that provides soft, indirect lighting suited for luxury lounges and sophisticated workspaces.",
        images: {
            "Brass": "assets/img/brass_floor_lamp_1772958507827.png",
            "Black": "assets/img/aura_floor_lamp_black.png"
        },
        colors: {
            "Brass": "#b5a642",
            "Black": "#000"
        }
    },
    "3": {
        name: "Orbital Cascade",
        price: "₹50,000",
        desc: "Inspired by celestial movement, the Orbital Cascade features floating glass orbs that captured light within their crystalline structures. A centerpiece that commands any grand foyer.",
        images: {
            "Clear": "assets/img/glass_chandelier_1772958522961.png"
        },
        colors: {
            "Clear": "#e0e0e0"
        }
    }
};

// --- HOMEPAGE SPECIFIC LOGIC ---
if (document.querySelector('.hero-section')) {
    // Loader Animation
    const tlLoader = gsap.timeline();
    const skipIntro = sessionStorage.getItem('backFromDetail') === 'true';

    if (document.querySelector('.loader-overlay')) {
        if (skipIntro) {
            // Coming back from detail — clear flag, skip intro, jump to collection
            sessionStorage.removeItem('backFromDetail');
            gsap.set('.loader-overlay', { yPercent: -100 });
            gsap.set('.navbar', { y: 0, opacity: 1 });
            gsap.set('.hero-title', { y: 0, opacity: 1 });
            gsap.set('.hero-subtitle', { opacity: 1 });
            gsap.set('.cta-button', { opacity: 1 });
            gsap.set('.floating-lamp', { opacity: 1 });
            // Scroll to collection after lenis is ready
            setTimeout(() => {
                const target = document.getElementById('collection');
                if (target && typeof lenis !== 'undefined') lenis.scrollTo(target, { duration: 0 });
            }, 100);
        } else {
            // Fresh load or refresh — play full intro
            tlLoader.to('.word-1', { opacity: 1, duration: 0.8, ease: "power2.inOut" })
                .to('.word-1', { opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.inOut" })
                .to('.word-2', { opacity: 1, duration: 0.8, ease: "power2.inOut" })
                .to('.word-2', { opacity: 0, duration: 0.8, delay: 0.2, ease: "power2.inOut" })
                .to('.loader-overlay', { yPercent: -100, duration: 1.2, ease: "expo.inOut" });

            tlLoader.to('.navbar', { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.2")
                .to('.hero-title', { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "-=0.5")
                .to('.hero-subtitle', { opacity: 1, duration: 1, ease: "power2.out" }, "-=1")
                .to('.cta-button', { opacity: 1, duration: 1, ease: "power2.out" }, "-=0.8")
                .to('.floating-lamp', { opacity: 1, duration: 2, ease: "power2.out" }, "-=1.5");
        }
    }

    // Navbar scroll effect for glassmorphism
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Lamp Interactivity
    const lampContainer = document.querySelector('.hero-3d-container');
    const lamp = document.querySelector('.floating-lamp');

    if (lampContainer && lamp) {
        lampContainer.addEventListener('mousemove', (e) => {
            const rect = lampContainer.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            
            const x = (relX / rect.width - 0.5) * 20;
            const y = (relY / rect.height - 0.5) * 20;

            gsap.to(lamp, {
                rotationY: x,
                rotationX: -y,
                x: x * 2,
                y: y * 2,
                duration: 1,
                ease: "power2.out",
                transformPerspective: 900,
                transformOrigin: "center center"
            });
        });

        lampContainer.addEventListener('mouseleave', () => {
            gsap.to(lamp, {
                rotationY: 0,
                rotationX: 0,
                x: 0,
                y: 0,
                duration: 1.5,
                ease: "power3.out"
            });
        });
    }

    // Continuous float
    gsap.to('.floating-lamp img', {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
    });

    // Text Rotator (Transition Section)
    const rotatorItems = gsap.utils.toArray('.rotator-item');
    if (rotatorItems.length > 0) {
        let currentIndex = 0;
        function rotateText() {
            const nextIndex = (currentIndex + 1) % rotatorItems.length;
            const currentItem = rotatorItems[currentIndex];
            const nextItem = rotatorItems[nextIndex];
            const tl = gsap.timeline();
            tl.to(currentItem, { opacity: 0, y: -30, scale: 0.98, duration: 0.6, ease: "power2.in" });
            tl.fromTo(nextItem, { opacity: 0, y: 30, scale: 1.02 }, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out" }, "-=0.2");
            currentIndex = nextIndex;
        }
        gsap.set(rotatorItems[0], { opacity: 1, y: 0 });
        let rotationInterval;
        ScrollTrigger.create({
            trigger: '.transition-section',
            start: 'top center',
            onEnter: () => rotationInterval = setInterval(rotateText, 3000),
            onLeave: () => clearInterval(rotationInterval),
            onEnterBack: () => rotationInterval = setInterval(rotateText, 3000),
            onLeaveBack: () => clearInterval(rotationInterval)
        });
    }

    // Hero Word Rotator
    const heroRotator = document.getElementById('hero-rotator');
    if (heroRotator) {
        const heroWords = ["HOME", "OFFICE", "LIFE", "PLACE"];
        let heroWordIndex = 0;
        setInterval(() => {
            const nextIndex = (heroWordIndex + 1) % heroWords.length;
            const nextWord = heroWords[nextIndex];
            const tl = gsap.timeline();
            tl.to(heroRotator, {
                rotationX: 90, opacity: 0, y: -20, duration: 0.5, ease: "power2.in",
                onComplete: () => {
                    heroRotator.textContent = nextWord;
                    gsap.set(heroRotator, { rotationX: -90, y: 20 });
                }
            }).to(heroRotator, { rotationX: 0, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.5)" });
            heroWordIndex = nextIndex;
        }, 2500);
    }

    // Catalog Animations
    gsap.from('.catalog-header h2, .catalog-header p', {
        scrollTrigger: { trigger: '.catalog-section', start: 'top 80%' },
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out"
    });

    gsap.utils.toArray('.product-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: { trigger: card, start: 'top 85%' },
            y: 100, opacity: 0, duration: 1.2, ease: "power4.out", delay: i * 0.1
        });
    });

    // Fringe Lights Generation and Interactivity
    const fringeContainer = document.querySelector('.fringe-lights');
    if (fringeContainer) {
        function initFringe() {
            fringeContainer.innerHTML = '';
            // Kill any old ScrollTriggers tied to fringe
            ScrollTrigger.getAll()
                .filter(st => st.vars && st.vars._isFringe)
                .forEach(st => st.kill());

            const width = fringeContainer.offsetWidth;
            const bulbCount = Math.floor(width / 60);

            const minWireH = 30;   // shortest — appears at center
            const maxWireH = 180;  // longest  — appears at far edges

            for (let i = 0; i < bulbCount; i++) {
                const wrapper = document.createElement('div');
                wrapper.className = 'bulb-wrapper';

                // Normalised distance from center (0 = center, 1 = edge)
                const centerRatio = Math.abs((i / (bulbCount - 1)) - 0.5) * 2;
                // Stair-step in 5 discrete levels for a clean stepped look
                const steps = 5;
                const step = Math.round(centerRatio * steps) / steps;
                const wireHeight = minWireH + step * (maxWireH - minWireH);

                wrapper.innerHTML = `
                    <div class="bulb-wire" style="height: ${wireHeight}px"></div>
                    <div class="bulb"></div>
                `;

                // Gentle idle sway (not scroll-based)
                gsap.to(wrapper, {
                    rotation: -2 + Math.random() * 4,
                    duration: 2 + Math.random() * 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: Math.random() * 2
                });

                // ── Long-press (1.5s) = toggle ALL, short click = toggle one ──
                let pressTimer = null;
                let longPressFired = false;

                wrapper.addEventListener('mousedown', () => {
                    longPressFired = false;
                    wrapper.classList.add('pressing');
                    pressTimer = setTimeout(() => {
                        longPressFired = true;
                        const allBulbs = document.querySelectorAll('.bulb');
                        const allOn = document.querySelectorAll('.bulb.active').length === allBulbs.length;

                        allBulbs.forEach((b, idx) => {
                            const delay = idx * 40; // cascade wave
                            setTimeout(() => {
                                const shouldBeOn = !allOn;
                                if (shouldBeOn) b.classList.add('active');
                                else b.classList.remove('active');
                                gsap.fromTo(b, { scale: 1.4 }, { scale: 1, duration: 0.45, ease: "back.out(2)" });
                            }, delay);
                        });

                        // Wait for cascade to finish then check reveal
                        setTimeout(checkAllLit, allBulbs.length * 40 + 100);
                    }, 800);
                });

                wrapper.addEventListener('mouseup', () => {
                    clearTimeout(pressTimer);
                    wrapper.classList.remove('pressing');
                });
                wrapper.addEventListener('mouseleave', () => {
                    clearTimeout(pressTimer);
                    wrapper.classList.remove('pressing');
                });

                // Short click = individual toggle
                wrapper.addEventListener('click', () => {
                    if (longPressFired) return; // ignore click fired after long-press
                    const bulb = wrapper.querySelector('.bulb');
                    bulb.classList.toggle('active');
                    gsap.fromTo(bulb, { scale: 1.3 }, { scale: 1, duration: 0.4, ease: "back.out(2)" });
                    checkAllLit();
                });

                fringeContainer.appendChild(wrapper);
            }
        }

        initFringe();

        // ── All-Lit Reveal ──────────────────────────────────────────
        const wallScene = document.querySelector('.wall-scene');
        const wallTexts = document.querySelectorAll('.frame-text');

        // Flash overlay for the explosion burst
        const flashEl = document.createElement('div');
        flashEl.style.cssText = `
            position:absolute; inset:0; background:#fff;
            opacity:0; pointer-events:none; z-index:10;
        `;
        document.querySelector('.transition-section').appendChild(flashEl);

        // Hide wall text initially
        gsap.set(wallScene, { opacity: 0, scale: 0.8 });

        let revealed = false;

        function checkAllLit() {
            const allBulbs = document.querySelectorAll('.bulb');
            const litBulbs = document.querySelectorAll('.bulb.active');
            const allOn = allBulbs.length > 0 && litBulbs.length === allBulbs.length;
            const rotatorText = document.querySelector('.transition-text');
            const welcomeEl   = document.querySelector('.welcome-tagline');

            if (allOn && !revealed) {
                revealed = true;

                // Clear any running rotator resume timer
                clearTimeout(window.rotatorResumeTimer);

                // Pause rotator text immediately
                gsap.to(rotatorText, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' });

                const tl = gsap.timeline();

                // Stage 1 — white flash
                tl.to(flashEl, { opacity: 0.85, duration: 0.12, ease: 'power4.out' })
                  .to(flashEl, { opacity: 0, duration: 0.9, ease: 'power2.out' })

                  // Stage 2 — NIVASA and HOMES burst in
                  .to(wallScene, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.7)' }, '<0.05')

                  // Stage 3 — "welcomes you" rises in with delay
                  .fromTo(welcomeEl,
                    { opacity: 0, y: 30, letterSpacing: '0.5em' },
                    { opacity: 1, y: 0, letterSpacing: '0.25em', duration: 0.9, ease: 'power3.out' },
                    '-=0.1')

                  // Stage 4 — upgrade rotator item styles to lit version
                  .call(() => {
                    document.querySelectorAll('.rotator-item').forEach(el => el.classList.add('lit'));
                  });

                // After 2.5 seconds, hide everything and resume rotator
                window.rotatorResumeTimer = setTimeout(() => {
                    // Fade out wall scene
                    gsap.to(wallScene, { opacity: 0, scale: 0.9, duration: 0.8, ease: 'power2.in' });
                    gsap.to(welcomeEl, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' });

                    // Resume rotating text with upgraded style still applied
                    setTimeout(() => {
                        revealed = false;
                        gsap.to(rotatorText, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
                    }, 600);
                }, 2500);

            } else if (!allOn && revealed) {
                revealed = false;
                clearTimeout(window.rotatorResumeTimer);

                // Snap hide
                gsap.to(wallScene,  { opacity: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' });
                gsap.to(welcomeEl,  { opacity: 0, duration: 0.25, ease: 'power2.in' });

                // Strip lit style and restore rotator
                document.querySelectorAll('.rotator-item').forEach(el => el.classList.remove('lit'));
                setTimeout(() => {
                    gsap.to(rotatorText, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
                }, 350);
            }
        }

        window.addEventListener('resize', () => {
            clearTimeout(window.fringeResizeTimer);
            window.fringeResizeTimer = setTimeout(initFringe, 250);
        });

        // Mouse nearness effect
        window.addEventListener('mousemove', (e) => {
            const wrappers = document.querySelectorAll('.bulb-wrapper');
            wrappers.forEach(wrapper => {
                const rect = wrapper.getBoundingClientRect();
                const bulbCenterX = rect.left + rect.width / 2;
                const bulbCenterY = rect.top + rect.height / 2;
                
                const dx = e.clientX - bulbCenterX;
                const dy = e.clientY - bulbCenterY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 200) {
                    const power = (200 - distance) / 200;
                    gsap.to(wrapper, {
                        x: -dx * 0.1 * power,
                        y: -dy * 0.1 * power,
                        rotation: -dx * 0.05 * power,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                } else {
                    gsap.to(wrapper, {
                        x: 0,
                        y: 0,
                        rotation: 0,
                        duration: 0.6,
                        ease: "power2.out"
                    });
                }
            });
        });
    }
}

// --- PRODUCT DETAIL PAGE LOGIC ---
if (document.body.classList.contains('detail-page')) {

    // Back button: set flag so homepage skips intro and lands on collection
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.setItem('backFromDetail', 'true');
            window.location.href = backBtn.getAttribute('href');
        });
    }

    const initDetailPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id') || "1";
        const product = productData[productId];

        if (product) {
            // Populate Main Data
            document.getElementById('product-title').innerText = product.name;
            document.getElementById('product-price').innerText = product.price;
            document.getElementById('product-desc').innerText = product.desc;
            const mainImg = document.getElementById('main-product-image');
            const imgSection = document.querySelector('.detail-image-section');
            
            // Use the first image as base
            mainImg.src = Object.values(product.images)[0];

            // Define vibrant light colors for the glow
            const lightColors = {
                "Black": "rgba(255, 255, 255, 0.1)", // Subtle white/neutral
                "Gold": "rgba(212, 175, 55, 0.5)",   // Amber/Gold glow
                "Silver": "rgba(192, 192, 192, 0.4)", // Cool white glow
                "Brass": "rgba(181, 166, 66, 0.5)",  // Warm brass glow
                "Clear": "rgba(224, 224, 224, 0.6)"  // Bright white/crystal glow
            };

            // Initial Glow
            const initialFinish = Object.keys(product.colors)[0];
            imgSection.style.setProperty('--glow-color', lightColors[initialFinish] || 'transparent');

            // Populate Finishes as Light Selectors
            const swatchesContainer = document.getElementById('color-swatches');
            swatchesContainer.innerHTML = '';
            Object.entries(product.colors).forEach(([name, color], index) => {
                const swatch = document.createElement('div');
                swatch.className = `swatch ${index === 0 ? 'active' : ''}`;
                swatch.innerHTML = `<div class="swatch-color" style="background: ${color}"></div>`;
                swatch.title = `Change Light: ${name}`;
                swatch.addEventListener('click', () => {
                    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
                    swatch.classList.add('active');
                    
                    // Update only the glow color, not the image
                    const newGlow = lightColors[name] || color;
                    gsap.to(imgSection, {
                        "--glow-color": newGlow,
                        duration: 1,
                        ease: "power2.out"
                    });
                });
                swatchesContainer.appendChild(swatch);
            });

            // Populate Similar Products
            const similarGrid = document.getElementById('similar-grid');
            similarGrid.innerHTML = '';
            Object.entries(productData).forEach(([id, p]) => {
                if (id !== productId) {
                    const card = document.createElement('div');
                    card.className = "product-card";
                    card.innerHTML = `
                        <div class="product-image-wrap">
                            <img src="${Object.values(p.images)[0]}" alt="${p.name}">
                            <a href="product-detail.html?id=${id}" class="overlay">View Details</a>
                        </div>
                        <div class="product-info">
                            <h3>${p.name}</h3>
                            <p>${p.price}</p>
                        </div>
                    `;
                    similarGrid.appendChild(card);
                }
            });

            // Entry Animations
            gsap.from('.detail-image-section', { opacity: 0, x: -50, duration: 1.2, ease: "power4.out" });
            gsap.from(['#product-title', '#product-price', '.product-description', '.color-selection', '.detail-actions'], { 
                opacity: 0, 
                x: 50, 
                duration: 1, 
                stagger: 0.1, 
                ease: "power3.out" 
            });
            gsap.from('.similar-products', { opacity: 0, y: 50, duration: 1, scrollTrigger: { trigger: '.similar-products', start: 'top 80%' } });
        }
    };

    initDetailPage();

    // Buy Now button — visual feedback only (CartManager handles #add-to-cart)
    const buyBtn = document.getElementById('buy-now');
    if(buyBtn) {
        buyBtn.addEventListener('click', function() {
            const originalText = this.innerText;
            this.innerText = "Redirecting...";
            setTimeout(() => { this.innerText = originalText; }, 2000);
        });
    }
}

// About Section Animation (Shared or Homepage specific)
if (document.querySelector('.about-section')) {
    gsap.from('.about-content h2, .about-content p', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
        },
        y: 50,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out"
    });

    gsap.from('.about-image', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%',
        },
        scale: 0.9,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out"
    });
}

// Contact Section Animation (Shared)
if (document.querySelector('.contact-section')) {
    gsap.from('.contact-container h2, .contact-email', {
        scrollTrigger: {
            trigger: '.contact-section',
            start: 'top 70%',
        },
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "expo.out"
    });
}

// --- SHOPPING CART LOGIC ---
const CartManager = {
    items: JSON.parse(localStorage.getItem('nivasa_cart')) || [],
    drawer: document.getElementById('cart-drawer'),
    overlay: document.querySelector('.cart-overlay'),
    itemsContainer: document.getElementById('cart-items'),
    totalPriceEl: document.getElementById('cart-total-price'),
    cartBtn: document.getElementById('cart-main-btn'),

    init() {
        this.render();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Toggle Drawer
        if(this.cartBtn) {
            this.cartBtn.addEventListener('click', () => this.open());
        }
        
        const closeBtn = document.getElementById('close-cart-btn');
        if(closeBtn) closeBtn.addEventListener('click', () => this.close());
        
        if(this.overlay) this.overlay.addEventListener('click', () => this.close());

        // Handle Add to Cart from Detail Page
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#add-to-cart');
            if (btn) {
                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id') || "1";
                this.addItem(id);
                this.open();

                // Visual feedback on the button
                const addBtn = document.getElementById('add-to-cart');
                if (addBtn) {
                    const origText = addBtn.innerText;
                    const origBg = addBtn.style.background;
                    addBtn.innerText = "Added!";
                    addBtn.style.background = "#22c55e";
                    setTimeout(() => {
                        addBtn.innerText = origText;
                        addBtn.style.background = origBg;
                    }, 800);
                }
            }
        });

        // Proceed Button
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('#proceed-checkout');
            if(btn) {
                btn.classList.add('success');
                btn.innerText = "Order Placed";
                setTimeout(() => {
                    btn.classList.remove('success');
                    btn.innerText = "Proceed to Checkout";
                    this.items = []; // Clear cart on "checkout"
                    this.save();
                    this.render();
                    setTimeout(() => this.close(), 1000);
                }, 2000);
            }
        });
    },

    addItem(id) {
        const product = productData[id];
        if (!product) return;

        const existingItem = this.items.find(item => item.id === id);
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            this.items.push({
                id,
                name: product.name,
                price: product.price,
                img: Object.values(product.images)[0],
                qty: 1,
                numericPrice: parseInt(product.price.replace(/[^\d]/g, ''))
            });
        }

        this.save();
        this.render();
        
        if(this.cartBtn) {
            gsap.fromTo(this.cartBtn, { scale: 1.2 }, { scale: 1, duration: 0.5, ease: "back.out(2)" });
        }
    },

    updateQty(id, delta) {
        const item = this.items.find(item => item.id === id);
        if (!item) return;

        item.qty += delta;
        if (item.qty <= 0) {
            this.items = this.items.filter(i => i.id !== id);
        }

        this.save();
        this.render();
    },

    save() {
        localStorage.setItem('nivasa_cart', JSON.stringify(this.items));
    },

    open() {
        if(this.drawer) this.drawer.classList.add('open');
        if(this.overlay) this.overlay.classList.add('active');
        if(typeof lenis !== 'undefined') lenis.stop();
    },

    close() {
        if(this.drawer) this.drawer.classList.remove('open');
        if(this.overlay) this.overlay.classList.remove('active');
        if(typeof lenis !== 'undefined') lenis.start();
    },

    render() {
        if (!this.itemsContainer) return;

        this.itemsContainer.innerHTML = '';
        let total = 0;
        let count = 0;

        if (this.items.length === 0) {
            this.itemsContainer.innerHTML = '<p class="cart-empty">Your sanctuary awaits a masterpiece.</p>';
        }

        this.items.forEach(item => {
            total += item.numericPrice * item.qty;
            count += item.qty;

            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${item.price}</span>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn minus" data-id="${item.id}">-</button>
                    <span class="qty-val">${item.qty}</span>
                    <button class="qty-btn plus" data-id="${item.id}">+</button>
                </div>
            `;
            this.itemsContainer.appendChild(itemEl);
        });

        if(this.totalPriceEl) {
            this.totalPriceEl.innerText = '₹' + total.toLocaleString();
        }

        if(this.cartBtn) {
            this.cartBtn.innerText = `Cart (${count})`;
        }

        this.itemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.dataset.id;
                const delta = btn.classList.contains('plus') ? 1 : -1;
                this.updateQty(id, delta);
            });
        });
    }
};

CartManager.init();
