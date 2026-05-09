// Automatic Image Slider
let slideIndex = 0;
let videoSlideIndex = 0;
let imageInterval;
let videoInterval;

function showSlides() {
    const slides = document.getElementsByClassName('slide');
    if (slides.length === 0) return;
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    
    slides[slideIndex - 1].classList.add('active');
}

function showVideoSlides() {
    const videoSlides = document.getElementsByClassName('video-slide');
    if (videoSlides.length === 0) return;
    
    for (let i = 0; i < videoSlides.length; i++) {
        videoSlides[i].classList.remove('active');
    }
    
    videoSlideIndex++;
    if (videoSlideIndex > videoSlides.length) { videoSlideIndex = 1; }
    
    if (videoSlides[videoSlideIndex - 1]) {
        videoSlides[videoSlideIndex - 1].classList.add('active');
        const video = videoSlides[videoSlideIndex - 1].querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play();
        }
    }
}

// Initialize sliders
function initSliders() {
    const slides = document.getElementsByClassName('slide');
    if (slides.length > 0) {
        imageInterval = setInterval(showSlides, 5000);
        showSlides();
    }
    
    const videoSlides = document.getElementsByClassName('video-slide');
    if (videoSlides.length > 0) {
        videoInterval = setInterval(showVideoSlides, 8000);
        showVideoSlides();
    }
}

// Navigation
function changeVideoSlide(direction) {
    const videoSlides = document.getElementsByClassName('video-slide');
    if (videoSlides.length === 0) return;
    
    for (let i = 0; i < videoSlides.length; i++) {
        videoSlides[i].classList.remove('active');
    }
    
    videoSlideIndex += direction;
    if (videoSlideIndex > videoSlides.length) { videoSlideIndex = 1; }
    if (videoSlideIndex < 1) { videoSlideIndex = videoSlides.length; }
    
    videoSlides[videoSlideIndex - 1].classList.add('active');
    const video = videoSlides[videoSlideIndex - 1].querySelector('video');
    if (video) {
        video.currentTime = 0;
        video.play();
    }
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return true;
    
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#f8d7da';
            isValid = false;
        } else {
            input.style.borderColor = '#ddd';
        }
        
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = '#f8d7da';
                isValid = false;
            }
        }
        
        if (input.type === 'password' && input.id === 'password' && input.value) {
            if (input.value.length < 6) {
                input.style.borderColor = '#f8d7da';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Contact Form Submission
function submitContactForm(event) {
    event.preventDefault();
    if (!validateForm('contactForm')) {
        alert('Please fill all fields correctly');
        return false;
    }
    
    const formData = new FormData(event.target);
    
    fetch('backend/contact.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
            event.target.reset();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error sending message');
    });
    
    return false;
}

// Load More Gallery Items
let galleryLoadCount = 6;

function loadMoreGallery() {
    galleryLoadCount += 6;
    const hiddenItems = document.querySelectorAll('.gallery-item.hidden');
    for (let i = 0; i < 6 && i < hiddenItems.length; i++) {
        hiddenItems[i].classList.remove('hidden');
    }
    
    if (document.querySelectorAll('.gallery-item.hidden').length === 0) {
        document.getElementById('loadMoreBtn')?.remove();
    }
}

// Scroll Animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.time-card, .gallery-item');
    elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initSliders();
    handleScrollAnimations();
    
    window.addEventListener('scroll', handleScrollAnimations);
    
    // Add load more button listener
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreGallery);
    }
    
    // Add contact form listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
});

// Cleanup intervals on page unload
window.addEventListener('beforeunload', () => {
    if (imageInterval) clearInterval(imageInterval);
    if (videoInterval) clearInterval(videoInterval);
});