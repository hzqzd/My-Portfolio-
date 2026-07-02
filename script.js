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

// --- REUSABLE IMAGE + TEXT SLIDER ---
// Builds a fully independent slider scoped to ONE section, so Education,
// Activities (and anything else that follows this pattern) never interfere
// with each other's buttons or slide index.
//
// sectionSelector : the section's id, e.g. '#education'
// imageSelector   : class on the slide images inside that section
// textSelector    : class on the matching text blocks inside that section
function setupImageSlider(sectionSelector, imageSelector, textSelector) {
    const section = document.querySelector(sectionSelector);
    if (!section) return; // Bail out quietly if that section doesn't exist

    // Only look for buttons/slides INSIDE this specific section
    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');
    const images = section.querySelectorAll(imageSelector);
    const texts = section.querySelectorAll(textSelector);

    let index = 0; // This section's own private slide tracker

    function show(newIndex) {
        images.forEach(img => img.classList.remove('active'));
        texts.forEach(text => text.classList.remove('active'));

        index = newIndex;
        images[index]?.classList.add('active');
        texts[index]?.classList.add('active');
    }

    nextBtn?.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevents the card from collapsing
        show((index + 1) % images.length); // Wraps back to 0 at the end
    });

    prevBtn?.addEventListener('click', function(event) {
        event.stopPropagation();
        show((index - 1 + images.length) % images.length); // Wraps to the last slide
    });
}

// Wire up each section that uses this image+text slider pattern
setupImageSlider('#education', '.education-image', '.expanded-elaboration');
setupImageSlider('#activities', '.activities-image', '.activities-expanded-elaboration');

// --- SKILLS CATEGORY SWITCHER ---
// Skills works a bit differently: instead of images + text, clicking a
// title (WEB DEVELOPMENT / BIG DATA / DIGITAL FORENSICS) swaps which
// tool-list-content panel is shown. The section's own prev/next buttons
// now do the same thing, cycling through the three categories.
function setupSkillsSlider() {
    const section = document.querySelector('#skills');
    if (!section) return;

    const prevBtn = section.querySelector('.prev-btn');
    const nextBtn = section.querySelector('.next-btn');
    const titles = section.querySelectorAll('.skill-title');
    const toolLists = section.querySelectorAll('.tool-list-content');

    let index = 0;

    function show(newIndex) {
        titles.forEach(t => t.classList.remove('active'));
        toolLists.forEach(list => list.classList.remove('active'));

        index = newIndex;
        titles[index].classList.add('active');
        toolLists[index].classList.add('active');
    }

    // Clicking a title jumps straight to its matching panel
    titles.forEach((title, i) => {
        title.addEventListener('click', function(event) {
            event.stopPropagation();
            show(i);
        });
    });

    // The section's prev/next buttons cycle through the categories too
    nextBtn?.addEventListener('click', function(event) {
        event.stopPropagation();
        show((index + 1) % titles.length);
    });

    prevBtn?.addEventListener('click', function(event) {
        event.stopPropagation();
        show((index - 1 + titles.length) % titles.length);
    });
}

setupSkillsSlider();