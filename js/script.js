/* =========================================================
   MENU MOBILE
========================================================= */

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const isOpen = navMenu.classList.contains("active");

        menuToggle.setAttribute("aria-expanded", isOpen);

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fermer le menu" : "Ouvrir le menu"
        );

    });


    /* Fermer le menu après avoir cliqué sur un lien */

    const navLinks = navMenu.querySelectorAll("a");

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            navMenu.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                "Ouvrir le menu"
            );

        });

    });

}


/* =========================================================
   ANNÉE AUTOMATIQUE DU FOOTER
========================================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* =========================================================
   APPARITION DES ÉLÉMENTS AU DÉFILEMENT
========================================================= */

const animatedElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-text, " +
    ".about-card, " +
    ".skill-item, " +
    ".timeline-item, " +
    ".project-featured, " +
    ".project-coming, " +
    ".service-card, " +
    ".contact-box"
);


const observer = new IntersectionObserver(
    (entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


animatedElements.forEach(element => {

    element.classList.add("animate-on-scroll");

    observer.observe(element);

});


/* =========================================================
   EFFET DE NAVIGATION AU DÉFILEMENT
========================================================= */

const header = document.querySelector(".site-header");

let lastScrollPosition = 0;

window.addEventListener(
    "scroll",
    () => {

        const currentScrollPosition = window.scrollY;

        if (!header) {
            return;
        }

        if (currentScrollPosition > 50) {

            header.classList.add("scrolled");

        } else {

            header.classList.remove("scrolled");

        }

        lastScrollPosition = currentScrollPosition;

    },
    { passive: true }
);


/* =========================================================
   LIEN ACTIF DANS LA NAVIGATION
========================================================= */

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-menu a");

const sectionObserver = new IntersectionObserver(
    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const sectionId = entry.target.getAttribute("id");

                navigationLinks.forEach(link => {

                    link.classList.remove("active");

                    if (
                        link.getAttribute("href") ===
                        `#${sectionId}`
                    ) {

                        link.classList.add("active");

                    }

                });

            }

        });

    },
    {
        rootMargin: "-35% 0px -55% 0px"
    }
);


sections.forEach(section => {
    sectionObserver.observe(section);
});

/* =========================================================
   PORTRAIT ET FORMULAIRE DE CONTACT
========================================================= */

document.querySelectorAll(".profile-photo").forEach(image => {
    const container = image.parentElement;

    if (!container) {
        return;
    }

    const updatePhotoState = () => {
        container.classList.toggle("has-photo", image.naturalWidth > 0);
        container.classList.toggle("photo-unavailable", image.naturalWidth === 0);
    };

    if (image.complete) {
        updatePhotoState();
    } else {
        image.addEventListener("load", updatePhotoState, { once: true });
        image.addEventListener("error", updatePhotoState, { once: true });
    }
});

const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", event => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();
        const subject = `Message du portfolio — ${name}`;
        const body = `Nom : ${name}\nE-mail : ${email}\n\nMessage :\n${message}`;
        const mailtoUrl =
            `mailto:paolodev8@gmail.com?subject=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.location.href = mailtoUrl;
    });
}

// =========================================================
// SLIDER — SECOURS BÉNIN
// =========================================================

const projectSlider = document.querySelector(".project-slider");

if (projectSlider) {

    const slides = projectSlider.querySelectorAll(".project-slide");
    const dots = projectSlider.querySelectorAll(".project-slider-dot");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let currentSlide = 0;
    let isAnimating = false;
    let sliderInterval = null;
    let transitionFrame = null;
    let transitionTimeout = null;

    function updateDots(index) {
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === index);
        });
    }

    function showSlide(index) {

        if (
            index < 0 ||
            index >= slides.length ||
            index === currentSlide ||
            isAnimating
        ) {
            return;
        }

        const current = slides[currentSlide];
        const next = slides[index];

        updateDots(index);

        if (reducedMotion.matches) {
            current.classList.remove("active");
            current.style.transform = "";
            next.style.transform = "";
            next.classList.add("active");
            currentSlide = index;
            return;
        }

        isAnimating = true;

        next.style.transform = "translateX(106%)";
        next.classList.add("active");

        transitionFrame = requestAnimationFrame(() => {
            transitionFrame = null;
            current.style.transform = "translateX(-100%)";
            next.style.transform = "translateX(0)";

            transitionTimeout = setTimeout(() => {
                current.classList.remove("active");
                current.style.transform = "";

                currentSlide = index;
                isAnimating = false;
                transitionTimeout = null;
            }, 700);
        });
    }

    function stopSlider() {
        if (sliderInterval !== null) {
            clearInterval(sliderInterval);
            sliderInterval = null;
        }

        if (transitionFrame !== null) {
            cancelAnimationFrame(transitionFrame);
            transitionFrame = null;
        }

        if (transitionTimeout !== null) {
            clearTimeout(transitionTimeout);
            transitionTimeout = null;
        }

        isAnimating = false;
    }

    function resetSlider() {
        currentSlide = 0;

        slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === 0);
            slide.style.transform = "";
        });

        updateDots(0);
    }

    function nextSlide() {
        if (currentSlide >= slides.length - 1) {
            stopSlider();
            return;
        }

        showSlide(currentSlide + 1);
    }

    function startSlider() {
        stopSlider();
        resetSlider();

        if (reducedMotion.matches || slides.length < 2) {
            return;
        }

        sliderInterval = setInterval(nextSlide, 3000);
    }

    if (slides.length > 0) {
        resetSlider();

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
            });
        });

        const projectsSliderObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startSlider();
                } else {
                    stopSlider();
                }
            });
        }, {
            threshold: 0.2
        });

        projectsSliderObserver.observe(projectSlider);
    }

}