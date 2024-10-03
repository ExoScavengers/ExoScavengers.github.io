const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Resize canvas to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colors
const EARTH_OCEAN_BLUE = 'rgb(30, 144, 255)';
const EARTH_LAND_GREEN = 'rgb(34, 139, 34)';
const YELLOW = 'rgb(255, 255, 0)';
const AURORA_COLORS = ['rgba(0, 255, 255, 0.5)', 'rgba(173, 255, 47, 0.5)', 'rgba(0, 255, 127, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 20, 147, 0.5)'];
const SUN_RAYS_COLOR = 'rgba(255, 223, 0, 1)';

// Earth properties
const EARTH_RADIUS = 50;
const EARTH_POS = { x: canvas.width / 2, y: canvas.height / 2 };

// Sun properties
const SUN_RADIUS = 70;
const SUN_POS = { x: 150, y: canvas.height / 2 };

let frame = 0;

function drawEarth() {
    // Create gradient effect for Earth (blue for oceans, green for land)
    const gradient = ctx.createRadialGradient(EARTH_POS.x, EARTH_POS.y, EARTH_RADIUS * 0.6, EARTH_POS.x, EARTH_POS.y, EARTH_RADIUS);
    gradient.addColorStop(0, EARTH_OCEAN_BLUE);
    gradient.addColorStop(1, EARTH_LAND_GREEN);
    ctx.beginPath();
    ctx.arc(EARTH_POS.x, EARTH_POS.y, EARTH_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
}

function drawSun() {
    // Draw Sun
    ctx.beginPath();
    ctx.arc(SUN_POS.x, SUN_POS.y, SUN_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = YELLOW;
    ctx.fill();

    const numRays = 20;
    const rayLength = 150;

    for (let i = 0; i < numRays; i++) {
        const angle = (i * (2 * Math.PI / numRays)) + frame * 0.02;
        const xStart = SUN_POS.x + Math.cos(angle) * SUN_RADIUS;
        const yStart = SUN_POS.y + Math.sin(angle) * SUN_RADIUS;
        const xEnd = SUN_POS.x + Math.cos(angle) * (SUN_RADIUS + rayLength);
        const yEnd = SUN_POS.y + Math.sin(angle) * (SUN_RADIUS + rayLength);
        const transparency = Math.max(0, 255 - Math.floor(frame * 0.5) % 255);
        ctx.strokeStyle = `rgba(255, 223, 0, ${transparency / 255})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(xStart, yStart);
        ctx.lineTo(xEnd, yEnd);
        ctx.stroke();
    }
}

function drawMagneticField() {
    const numLines = 16;

    for (let i = 0; i < numLines; i++) {
        const angle = (i * (2 * Math.PI / numLines)) + frame * 0.02;

        for (let j = 0; j < 10; j++) {
            const xOffset = Math.cos(angle) * EARTH_RADIUS;
            const yOffset = Math.sin(angle) * EARTH_RADIUS;

            // Curve of the magnetic line
            const xStart = EARTH_POS.x + xOffset + j * (SUN_POS.x - EARTH_POS.x) / 10;
            const yStart = EARTH_POS.y + yOffset + j * (SUN_POS.y - EARTH_POS.y) / 10;

            const xEnd = EARTH_POS.x + Math.cos(angle) * 30 + j * (SUN_POS.x - EARTH_POS.x) / 10;
            const yEnd = EARTH_POS.y + Math.sin(angle) * 30 + j * (SUN_POS.y - EARTH_POS.y) / 10;

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xEnd, yEnd);
            ctx.stroke();
        }
    }
}

function drawAurora() {
    const numParticles = 120;

    for (let i = 0; i < numParticles; i++) {
        const color = AURORA_COLORS[Math.floor(Math.random() * AURORA_COLORS.length)];
        const radius = Math.floor(Math.random() * 7) + 2;
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.floor(Math.random() * (70 - EARTH_RADIUS)) + EARTH_RADIUS;

        // Aurora glow movement
        const animationOffset = Math.sin(frame * 0.1 + angle) * 10;

        // Position near north pole
        const xNorth = EARTH_POS.x + Math.cos(angle) * (distance + animationOffset);
        const yNorth = EARTH_POS.y - (distance + animationOffset);

        // Position near south pole
        const xSouth = EARTH_POS.x + Math.cos(angle) * (distance + animationOffset);
        const ySouth = EARTH_POS.y + (distance + animationOffset);

        // Draw with alpha blending for glow effect
        ctx.beginPath();
        ctx.arc(xNorth, yNorth, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(xSouth, ySouth, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear the canvas

    // Draw Sun, Earth, magnetic field lines, and aurora
    drawSun();
    drawEarth();
    drawMagneticField();
    drawAurora();

    frame++;  // Increment frame for animation
    requestAnimationFrame(animate);  // Request the next frame
}

// Start the animation loop
animate();
