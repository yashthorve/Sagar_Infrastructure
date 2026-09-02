document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Navbar ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.fade-in-up, .reveal-left, .reveal-right, .reveal-up');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Dynamic Logo Swapping ---
    const logoSubtextHeader = document.getElementById('logo-subtext-header');
    const interiorsSection = document.querySelector('.interiors-section');
    
    if (logoSubtextHeader && interiorsSection) {
        const logoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    logoSubtextHeader.style.opacity = '0';
                    setTimeout(() => {
                        logoSubtextHeader.textContent = 'INTERIORS';
                        logoSubtextHeader.style.opacity = '1';
                    }, 150);
                } else {
                    logoSubtextHeader.style.opacity = '0';
                    setTimeout(() => {
                        logoSubtextHeader.textContent = 'INFRASTRUCTURE';
                        logoSubtextHeader.style.opacity = '1';
                    }, 150);
                }
            });
        }, { threshold: 0.2 });
        
        logoObserver.observe(interiorsSection);
    }

    // --- Lightbox ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.getAttribute('data-src'));

    function openLightbox(index) {
        if (index < 0 || index >= images.length) return;
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }
});

// Form Handling
const quoteForm = document.getElementById("quote-form");
if (quoteForm) {
    quoteForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const submitBtn = document.getElementById("submit-btn");
        const errorMsg = document.getElementById("form-error");
        
        // Basic phone validation for Indian numbers
        const phoneInput = document.getElementById("phone").value;
        if (!/^[0-9]{10}$/.test(phoneInput)) {
            errorMsg.textContent = "Please enter a valid 10-digit phone number.";
            errorMsg.style.display = "block";
            return;
        }
        
        submitBtn.classList.add("is-loading");
        errorMsg.style.display = "none";
        
        try {
            const formData = new FormData(quoteForm);
            
            // Capture UTM parameters from URL if they exist
            const urlParams = new URLSearchParams(window.location.search);
            ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
                if (urlParams.has(param)) {
                    formData.append(param, urlParams.get(param));
                }
            });
            
            const response = await fetch(quoteForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    "Accept": "application/json"
                }
            });
            
            if (response.ok) {
                quoteForm.style.display = "none";
                document.getElementById("form-success").style.display = "flex";
            } else {
                const data = await response.json();
                if (Object.hasOwn(data, "errors")) {
                    errorMsg.textContent = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    errorMsg.textContent = "Oops! There was a problem submitting your form";
                }
                errorMsg.style.display = "block";
            }
        } catch (error) {
            errorMsg.textContent = "Oops! There was a problem submitting your form";
            errorMsg.style.display = "block";
        } finally {
            submitBtn.classList.remove("is-loading");
        }
    });
}

// Advanced Animations & Parallax
const parallaxElements = document.querySelectorAll(".parallax-bg, .division");
window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    parallaxElements.forEach(el => {
        const limit = el.offsetTop + el.offsetHeight;
        if (scrolled > el.offsetTop - window.innerHeight && scrolled <= limit) {
            el.style.backgroundPositionY = (scrolled - el.offsetTop) * 0.15 + "px";
        }
    });
});

// Magnetic Buttons
const magneticBtns = document.querySelectorAll(".magnetic-btn, .submit-btn");
magneticBtns.forEach(btn => {
    btn.addEventListener("mousemove", function(e) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener("mouseleave", function() {
        btn.style.transform = "translate(0px, 0px)";
    });
});

