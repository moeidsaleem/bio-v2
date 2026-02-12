/**
 * MOEID SALEEM KHAN - Shared Application JS
 * Page transitions, navigation, animations, particles
 */
(function () {
    'use strict';

    // ===== Page Transition System =====
    var transition = document.querySelector('.page-transition');
    if (!transition) {
        transition = document.createElement('div');
        transition.className = 'page-transition';
        transition.innerHTML = '<div class="transition-inner"><div class="transition-bar"></div><div class="transition-bar"></div><div class="transition-bar"></div><div class="transition-bar"></div><div class="transition-bar"></div></div>';
        document.body.appendChild(transition);
    }

    // Page entry animation
    window.addEventListener('load', function () {
        document.body.classList.add('page-loaded');
        // Hide preloader
        var preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('loaded');
    });

    // Intercept navigation links for page transitions
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var href = link.getAttribute('href');
        if (!href) return;

        // Skip external links, anchors, mailto, tel, etc.
        if (link.target === '_blank' || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http') || href.startsWith('javascript')) return;

        // Internal page link - animate transition
        if (href.endsWith('.html') || href === '/' || href === './') {
            e.preventDefault();
            document.body.classList.add('page-leaving');
            transition.classList.add('active');
            setTimeout(function () {
                window.location.href = href;
            }, 600);
        }
    });

    // ===== Preloader =====
    window.addEventListener('load', function () {
        var preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function () {
                preloader.classList.add('loaded');
            }, 300);
        }
    });

    // ===== Mobile Nav Toggle =====
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');
    if (navToggle) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link, .nav-cta').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu) navMenu.classList.remove('open');
            if (navToggle) navToggle.classList.remove('active');
        });
    });

    // ===== Sticky Navbar =====
    var navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
        // Check on load
        if (window.scrollY > 50) navbar.classList.add('scrolled');
    }

    // ===== Active Nav Link (for anchor sections on same page) =====
    var sections = document.querySelectorAll('section[id]');
    if (sections.length > 3) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY + 100;
            sections.forEach(function (section) {
                var top = section.offsetTop;
                var height = section.offsetHeight;
                var id = section.getAttribute('id');
                var link = document.querySelector('.nav-link[href="#' + id + '"]');
                if (link) {
                    if (scrollY >= top && scrollY < top + height) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });
        });
    }

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            var target = document.querySelector(href);
            if (target) {
                var offset = navbar ? navbar.offsetHeight + 20 : 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // ===== Scroll Reveal (Intersection Observer) =====
    var revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .animate-in, .stagger-item');
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Trigger counters
                if (entry.target.classList.contains('hero-stats') || entry.target.closest && entry.target.closest('.hero-stats')) {
                    animateCounters();
                }
                // Trigger progress bars
                if (entry.target.classList.contains('skill-progress')) {
                    var bar = entry.target.querySelector('.skill-bar-fill');
                    if (bar) bar.style.width = bar.dataset.width;
                }
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(function (el) { observer.observe(el); });

    // Also observe hero stats
    var heroStats = document.querySelector('.hero-stats');
    if (heroStats) observer.observe(heroStats);

    // ===== Counter Animation =====
    window.animateCounters = function () {
        document.querySelectorAll('.stat-number, .counter-number').forEach(function (counter) {
            if (counter.dataset.animated) return;
            var target = parseInt(counter.dataset.count);
            if (!target) return;
            var duration = 2000;
            var startTime = null;
            function step(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = Math.min((timestamp - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    counter.textContent = target;
                }
            }
            counter.dataset.animated = 'true';
            requestAnimationFrame(step);
        });
    };

    // ===== Typing Effect =====
    window.initTypingEffect = function (elementId, phrases) {
        var typed = document.getElementById(elementId);
        if (!typed || !phrases || !phrases.length) return;
        var phraseIndex = 0, charIndex = 0, isDeleting = false;
        function typeEffect() {
            var current = phrases[phraseIndex];
            if (isDeleting) {
                typed.textContent = current.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typed.textContent = current.substring(0, charIndex + 1);
                charIndex++;
            }
            if (!isDeleting && charIndex === current.length) {
                setTimeout(function () { isDeleting = true; typeEffect(); }, 2000);
                return;
            }
            if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
            setTimeout(typeEffect, isDeleting ? 30 : 80);
        }
        setTimeout(typeEffect, 1000);
    };

    // ===== Particle Canvas =====
    window.initParticles = function (canvasId) {
        var canvas = document.getElementById(canvasId);
        if (!canvas) return;
        var ctx, particles = [], w, h;
        function initCanvas() {
            canvas.width = w = canvas.parentElement.offsetWidth || window.innerWidth;
            canvas.height = h = canvas.parentElement.offsetHeight || window.innerHeight;
            ctx = canvas.getContext('2d');
        }
        function createParticles() {
            particles = [];
            var count = Math.min(60, Math.floor((w * h) / 15000));
            for (var i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    r: Math.random() * 2 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1
                });
            }
        }
        function draw() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(function (p) {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0) p.x = w;
                if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h;
                if (p.y > h) p.y = 0;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(102, 126, 234, ' + p.opacity + ')';
                ctx.fill();
            });
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(102, 126, 234, ' + (0.1 * (1 - dist / 120)) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }
        initCanvas();
        createParticles();
        draw();
        window.addEventListener('resize', function () { initCanvas(); createParticles(); });
    };

    // ===== Testimonial Slider =====
    window.initTestimonialSlider = function () {
        var testimonials = document.querySelectorAll('.testimonial-card');
        var currentTestimonial = 0;
        var dotsContainer = document.querySelector('.testimonial-dots');
        if (!dotsContainer || testimonials.length === 0) return;

        testimonials.forEach(function (_, i) {
            var dot = document.createElement('button');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
            dot.addEventListener('click', function () { goToTestimonial(i); });
            dotsContainer.appendChild(dot);
        });

        function goToTestimonial(index) {
            testimonials[currentTestimonial].classList.remove('active');
            dotsContainer.children[currentTestimonial].classList.remove('active');
            currentTestimonial = index;
            testimonials[currentTestimonial].classList.add('active');
            dotsContainer.children[currentTestimonial].classList.add('active');
        }

        var prev = document.querySelector('.testimonial-prev');
        var next = document.querySelector('.testimonial-next');
        if (prev) prev.addEventListener('click', function () {
            goToTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
        });
        if (next) next.addEventListener('click', function () {
            goToTestimonial((currentTestimonial + 1) % testimonials.length);
        });

        setInterval(function () {
            goToTestimonial((currentTestimonial + 1) % testimonials.length);
        }, 6000);
    };

    // ===== Blog Feed from Medium =====
    window.loadBlogFeed = function (containerId, count) {
        var grid = document.getElementById(containerId);
        if (!grid) return;
        count = count || 6;
        var rssUrl = 'https://medium.com/feed/@moeidsaleem';
        var apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);

        fetch(apiUrl)
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.status !== 'ok') throw new Error('Feed error');
                var html = '';
                data.items.slice(0, count).forEach(function (item, index) {
                    var src = '';
                    var imgMatch = item.description.match(/<img[^>]+src="([^"]+)"/);
                    if (imgMatch) src = imgMatch[1];
                    src = src || 'https://miro.medium.com/max/1200/1*jfdwtvU6V6g99q3G7gq7dQ.png';
                    var text = item.description.replace(/<[^>]*>/g, '');
                    text = text.length > 120 ? text.substr(0, text.lastIndexOf(' ', 120)) + '...' : text;
                    var date = new Date(item.pubDate);
                    var dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    var categories = (item.categories || []).slice(0, 3);
                    var tagsHtml = categories.map(function (cat) {
                        return '<span class="blog-tag">' + cat + '</span>';
                    }).join('');

                    html += '<article class="blog-card reveal-up" style="--delay: ' + (index * 0.1) + 's">' +
                        '<div class="blog-card-img"><img src="' + src + '" alt="' + item.title.replace(/"/g, '&quot;') + '" loading="lazy"></div>' +
                        '<div class="blog-card-body">' +
                        '<span class="blog-date">' + dateStr + '</span>' +
                        (tagsHtml ? '<div class="blog-tags">' + tagsHtml + '</div>' : '') +
                        '<h3><a href="' + item.link + '" target="_blank" rel="noopener noreferrer">' + item.title + '</a></h3>' +
                        '<p>' + text + '</p>' +
                        '<a href="' + item.link + '" class="blog-read-more" target="_blank" rel="noopener noreferrer">Read More <i class="fas fa-arrow-right"></i></a>' +
                        '</div></article>';
                });
                grid.innerHTML = html;
                // Re-observe new elements
                grid.querySelectorAll('.reveal-up').forEach(function (el) { observer.observe(el); });
            })
            .catch(function () {
                grid.innerHTML = '<p style="text-align:center;color:#666;grid-column:1/-1;">Unable to load articles. Visit <a href="https://medium.com/@moeidsaleem" target="_blank" rel="noopener noreferrer" style="color:#667eea;">my Medium</a> directly.</p>';
            });
    };

    // ===== FAQ Accordion =====
    window.initAccordion = function () {
        document.querySelectorAll('.faq-question').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var item = this.closest('.faq-item');
                var isOpen = item.classList.contains('open');
                // Close all
                document.querySelectorAll('.faq-item.open').forEach(function (el) {
                    el.classList.remove('open');
                });
                // Open clicked if it wasn't already open
                if (!isOpen) item.classList.add('open');
            });
        });
    };

    // ===== Portfolio Filter =====
    window.initPortfolioFilter = function () {
        var filterBtns = document.querySelectorAll('.filter-btn');
        var cards = document.querySelectorAll('.portfolio-item');
        if (!filterBtns.length || !cards.length) return;

        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');
                var filter = this.dataset.filter;

                cards.forEach(function (card) {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = '';
                        setTimeout(function () { card.classList.add('show'); }, 50);
                    } else {
                        card.classList.remove('show');
                        setTimeout(function () { card.style.display = 'none'; }, 400);
                    }
                });
            });
        });

        // Show all on init
        cards.forEach(function (card) { card.classList.add('show'); });
    };

    // ===== Interactive Timeline =====
    window.initInteractiveTimeline = function () {
        var items = document.querySelectorAll('.journey-item');
        if (!items.length) return;

        items.forEach(function (item) {
            item.addEventListener('click', function () {
                var isExpanded = this.classList.contains('expanded');
                items.forEach(function (el) { el.classList.remove('expanded'); });
                if (!isExpanded) this.classList.add('expanded');
            });
        });
    };

    // ===== Magnetic Cursor Effect (for hero CTAs) =====
    if (window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.magnetic').forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                var rect = el.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                el.style.transform = 'translate(' + x * 0.3 + 'px, ' + y * 0.3 + 'px)';
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    // ===== Parallax on scroll =====
    var parallaxEls = document.querySelectorAll('[data-parallax]');
    if (parallaxEls.length) {
        window.addEventListener('scroll', function () {
            var scrollY = window.scrollY;
            parallaxEls.forEach(function (el) {
                var speed = parseFloat(el.dataset.parallax) || 0.5;
                var rect = el.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    el.style.transform = 'translateY(' + (scrollY * speed * 0.1) + 'px)';
                }
            });
        });
    }

})();
