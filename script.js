// This registers the Draggable capability inside the GSAP engine
gsap.registerPlugin(Draggable);

// This single line turns your HTML canvas div into a fully draggable map!
Draggable.create("#canvas", {
    type: "x,y",            // Allows dragging both horizontally and vertically
    edgeResistance: 0.65,   // Adds a nice "rubber-band" bounce asset if they pull past boundaries
    bounds: { minX: -2000, maxX: 0, minY: -2000, maxY: 0 }, // Keeps your content from getting lost in outer space
    inertia: true           // Gives it that smooth momentum/throwing glide effect
});

// to position the starting viewport when loading the page
gsap.set("#canvas", { 
    x: -1200, 
    y: -200 
});