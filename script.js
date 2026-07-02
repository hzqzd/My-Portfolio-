// This registers the Draggable capability inside the GSAP engine
gsap.registerPlugin(Draggable);

// 1. Create a function that calculates the limits based on the screen size
function updateBounds() {
    // Get the actual width and height of the visible right-side screen window
    const windowWidth = document.querySelector('.canvas-window').offsetWidth;
    const windowHeight = document.querySelector('.canvas-window').offsetHeight;

    // Calculate the maximum negative drag limits (Screen Size - 3000px Canvas)
    const calculatedMinX = windowWidth - 3000;
    const calculatedMinY = windowHeight - 3000;

    // Return the dynamically calculated bounding box configuration
    return { 
        minX: calculatedMinX, 
        maxX: 0, 
        minY: calculatedMinY, 
        maxY: 0 
    };
}

// 2. Initialize the Draggable engine using our automatic calculations
Draggable.create("#canvas", {
    type: "x,y",
    edgeResistance: 0.65,
    inertia: true,
    
    // Call our function to set up the perfect bounding wall instantly
    bounds: updateBounds(),
    
    // Optional: Recalculate bounds on the fly if the user resizes their browser window
    onPress: function() {
        this.updateBounds(updateBounds());
    }
});

// Set the starting camera view position centered on load
gsap.set("#canvas", { 
    x: 0, 
    y: 0
});

// 1. Find all the navigation links inside your sidebar
const navLinks = document.querySelectorAll('.nav-links a');

// 2. Loop through each link and listen for a click event
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Prevent the browser from instantly jumping to the section raw
        e.preventDefault();

        // Get the target ID from the href attribute (e.g., "#about", "#projects")
        const targetId = this.getAttribute('href');
        
        // Find the physical section element on the canvas
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Move the camera to center this section!
            centerSection(targetSection);
        }
    });
});

function centerSection(section) {
    // A. Get the size of the visible viewing window
    const windowWidth = document.querySelector('.canvas-window').offsetWidth;
    const windowHeight = document.querySelector('.canvas-window').offsetHeight;

    // B. Find where the section card sits inside the 3000px canvas
    const sectionLeft = section.offsetLeft;
    const sectionTop = section.offsetTop;
    const sectionWidth = section.offsetWidth;
    const sectionHeight = section.offsetHeight;

    // C. MATH: Calculate the exact coordinates to pull the section to the dead center of the screen
    let targetX = -(sectionLeft - (windowWidth / 2) + (sectionWidth / 2));
    let targetY = -(sectionTop - (windowHeight / 2) + (sectionHeight / 2));

    // D. SAFETY CHECK: Keep the camera from sliding past our boundary walls into the blank background
    const bounds = updateBounds(); // Uses our automatic bounds function from earlier
    targetX = Math.max(bounds.minX, Math.min(bounds.maxX, targetX));
    targetY = Math.max(bounds.minY, Math.min(bounds.maxY, targetY));

    // E. GSAP ANIMATION: Smoothly slide the canvas to the target positions over 1.5 seconds
    gsap.to("#canvas", {
        x: targetX,
        y: targetY,
        duration: 1.5,
        ease: "power2.out"
    });
}

// Line 1: Go into index.html and find EVERY single element that has class="portfolio-section".
// Store them all together inside a list variable called allCards.
const allCards = document.querySelectorAll('.portfolio-section');

// Line 2: Because allCards is a list of multiple cards, we use .forEach() 
// to look through them one by one. Think of this like dealing a deck of cards out on a table.
allCards.forEach(card => {
    
    // Line 3: For each individual card on the table, attach a sensor that 
    // listens for a physical finger tap or mouse click event.
    card.addEventListener('click', function() {
        
        // Line 4: "this" means the exact card you just clicked. 
        // Go to its class list, look for the word "expanded". 
        // If it's not there, add it. If it is there, delete it.
        this.classList.toggle('expanded');
        
    });
});

// 1. Grab all the slides and navigation buttons
const explainations = document.querySelectorAll('.expanded-elaboration');
const educationImages = document.querySelectorAll('.education-image');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

let currentSlideIndex = 0; // Track which slide number is currently on screen

// 2. Create a function to refresh which slide gets shown
function updateSlides() {
    // Look through all slides, remove the 'active' class to hide them
    explainations.forEach(explaination => explaination.classList.remove('active'));
    educationImages.forEach(image => image.classList.remove('active'));
    
    // Add 'active' back to just the single slide at our current index tracking number
    explainations[currentSlideIndex].classList.add('active');
    educationImages[currentSlideIndex].classList.add('active');
}

// 3. Monitor when the user clicks 'Next'
nextBtn.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevents the card click from triggering/closing
    
    currentSlideIndex++; // Move up by 1 slide position
    if (currentSlideIndex >= explainations.length && educationImages.length > 0) 
        {
        currentSlideIndex = 0; // Loop back around to the first slide
        }
    updateSlides();
});

// 4. Monitor when the user clicks 'Prev'
prevBtn.addEventListener('click', function(event) {
    event.stopPropagation(); // Prevents conflicts
    
    currentSlideIndex--; // Go down by 1 slide position
    if (currentSlideIndex < 0 && educationImages.length > 0) 
        {
        currentSlideIndex = explainations.length - 1; // Loop to the very last slide
        }
    updateSlides();
});