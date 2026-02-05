// main.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Nike Website - Main JS Loaded');
    
    // Initialize components
    initCursor();
    initPageLoader();
    initNavbar();
    initProductCards();
    initProductViewer();
    initSizeSelector();
    initForms();
    initFilters();
    initAnimations();
    
    // Start animations after a short delay
    setTimeout(() => {
        animateHero();
    }, 100);
});

// Custom Cursor
function initCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, .product-card, .size-option, .form-input, .thumbnail'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // Smooth cursor animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

// Page Loader
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    
    if (!loader || !loaderProgress) return;
    
    // Animate progress bar
    gsap.to(loaderProgress, {
        width: '100%',
        duration: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            // Hide loader
            gsap.to(loader, {
                opacity: 0,
                duration: 0.5,
                delay: 0.3,
                onComplete: () => {
                    loader.style.display = 'none';
                }
            });
        }
    });
}

// Navbar Scroll Effect
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Initial state
    setTimeout(() => {
        if (window.pageYOffset > 100) {
            navbar.classList.add('scrolled');
        }
    }, 100);
}

// Product Card Hover Effects
function initProductCards() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            card.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Product Viewer
function initProductViewer() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    if (!thumbnails.length || !mainImage) return;
    
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            mainImage.src = this.src;
            
            // Add transition effect
            mainImage.style.opacity = '0.7';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 150);
        });
    });
}

// Size Selector
function initSizeSelector() {
    const sizeOptions = document.querySelectorAll('.size-option');
    
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            sizeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Ripple effect
            createRippleEffect(this);
        });
    });
}

// Ripple Effect
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.height / 2 - size / 2) + 'px';
    ripple.classList.add('ripple');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Form Handling
function initForms() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');
            const email = emailInput.value;
            
            if (!validateEmail(email)) {
                showFormError(emailInput, 'Please enter a valid email address');
                return;
            }
            
            // Add loading state
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Subscribing...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/subscribe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success animation
                    submitBtn.textContent = 'Subscribed! ✓';
                    submitBtn.style.background = 'var(--nike-green)';
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error:', error);
                showFormError(emailInput, 'Something went wrong. Please try again.');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: this.querySelector('[name="name"]').value,
                email: this.querySelector('[name="email"]').value,
                message: this.querySelector('[name="message"]').value
            };
            
            // Validate
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields');
                return;
            }
            
            if (!validateEmail(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Add loading state
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch('/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Success animation
                    submitBtn.textContent = 'Sent! ✓';
                    submitBtn.style.background = 'var(--nike-green)';
                    
                    // Reset form
                    setTimeout(() => {
                        this.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                    }, 2000);
                }
            } catch (error) {
                console.error('Error:', error);
                submitBtn.textContent = 'Error, try again';
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
    }
    
    // Floating labels
    const formInputs = document.querySelectorAll('.form-input');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check initial value
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
}

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFormError(input, message) {
    // Create error element
    let errorEl = input.parentElement.querySelector('.form-error');
    if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.style.color = 'var(--nike-red)';
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '0.5rem';
        input.parentElement.appendChild(errorEl);
    }
    
    errorEl.textContent = message;
    
    // Highlight input
    input.style.borderBottomColor = 'var(--nike-red)';
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorEl.remove();
        input.style.borderBottomColor = '';
    }, 3000);
}

// Product Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Animate filtering
            productCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    gsap.to(card, {
                        duration: 0.5,
                        opacity: 1,
                        scale: 1,
                        display: 'block',
                        ease: 'power3.out'
                    });
                } else {
                    gsap.to(card, {
                        duration: 0.5,
                        opacity: 0,
                        scale: 0.8,
                        display: 'none',
                        ease: 'power3.out'
                    });
                }
            });
        });
    });
}

// GSAP Animations
function initAnimations() {
    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded');
        setTimeout(initAnimations, 100);
        return;
    }
    
    // Register ScrollTrigger plugin
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Section title animations
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out'
            });
        });
        
        // Product cards animation on products page
        gsap.utils.toArray('.product-card').forEach((card, i) => {
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: i * 0.1,
                ease: 'power3.out'
            });
        });
        
        // Timeline items animation
        gsap.utils.toArray('.timeline-item').forEach((item, i) => {
            gsap.from(item, {
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                x: i % 2 === 0 ? -50 : 50,
                duration: 1,
                delay: i * 0.2,
                ease: 'power3.out'
            });
        });
    }
}

// Hero Animations
function animateHero() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const ctaButton = document.querySelector('.cta-button');
    
    if (heroTitle) {
        gsap.to(heroTitle, {
            duration: 1.5,
            opacity: 1,
            y: 0,
            ease: 'power3.out'
        });
    }
    
    if (heroSubtitle) {
        gsap.to(heroSubtitle, {
            duration: 1.2,
            opacity: 1,
            y: 0,
            delay: 0.2,
            ease: 'power3.out'
        });
    }
    
    if (ctaButton) {
        gsap.to(ctaButton, {
            duration: 1,
            opacity: 1,
            y: 0,
            delay: 0.4,
            ease: 'power3.out'
        });
    }
}

// Add to Cart Button Animation
document.addEventListener('DOMContentLoaded', function() {
    const addToCartBtn = document.querySelector('.add-to-cart');
    if (!addToCartBtn) return;
    
    // Magnetic effect
    addToCartBtn.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) * 0.1;
        const deltaY = (y - centerY) * 0.1;
        
        gsap.to(this, {
            duration: 0.3,
            x: deltaX,
            y: deltaY,
            ease: 'power2.out'
        });
    });
    
    addToCartBtn.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            x: 0,
            y: 0,
            ease: 'power2.out'
        });
    });
    
    // Click animation
    addToCartBtn.addEventListener('click', function() {
        // Pulse animation
        gsap.to(this, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: 'power2.inOut'
        });
        
        // Change text temporarily
        const originalText = this.textContent;
        this.textContent = 'Added to Cart! ✓';
        this.style.background = 'var(--nike-green)';
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 2000);
    });
});

// Parallax effect for hero video
window.addEventListener('scroll', function() {
    const heroVideo = document.querySelector('.hero-video');
    if (!heroVideo) return;
    
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    heroVideo.style.transform = `translate3d(0, ${rate}px, 0)`;
});