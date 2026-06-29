// This registers the Draggable capability inside the GSAP engine
gsap.registerPlugin(Draggable);

// This single line turns your HTML canvas div into a fully draggable map!
Draggable.create("#canvas", {
    // Allows dragging both horizontally and vertically
    type: "x,y",

    // Adds a nice "rubber-band" bounce asset if they pull past boundaries
    edgeResistance: 0.65,

     // Keeps your content from getting lost in outer space
    bounds: { minX: -2000, maxX: 0, minY: -2000, maxY: 0 },
    inertia: true           // Gives it that smooth momentum/throwing glide effect
});

// to position the starting viewport when loading the page
gsap.set("#canvas", { 
    x: -1500, 
    y: -1500
});