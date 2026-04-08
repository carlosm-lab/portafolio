/**
 * ════════════════════════════════════════════════════════════════════════════
 * FIREFLY EFFECT - Interactive cursor-following firefly with trail
 * Part of Dark Luxury Portfolio
 * ════════════════════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const container = document.getElementById('fireflyContainer');
    if (!container) return;

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Create main firefly with SVG
    const firefly = document.createElement('div');
    firefly.className = 'firefly-main';
    firefly.innerHTML = `
        <svg viewBox="0 0 50 50" width="30" height="30">
            <!-- Wings -->
            <ellipse cx="15" cy="20" rx="12" ry="8" fill="url(#wingGrad)" transform="rotate(-30 15 20)" opacity="0.9"/>
            <ellipse cx="35" cy="20" rx="12" ry="8" fill="url(#wingGrad)" transform="rotate(30 35 20)" opacity="0.9"/>
            <!-- Body -->
            <ellipse cx="25" cy="25" rx="6" ry="10" fill="#4a3728"/>
            <!-- Head -->
            <circle cx="25" cy="13" r="5" fill="#5a4738"/>
            <!-- Antennae -->
            <circle cx="21" cy="8" r="2" fill="#6a5748"/>
            <circle cx="29" cy="8" r="2" fill="#6a5748"/>
            <!-- Glowing abdomen -->
            <ellipse cx="25" cy="38" rx="7" ry="9" fill="url(#glowGrad)"/>
            <!-- Gradients -->
            <defs>
                <radialGradient id="glowGrad">
                    <stop offset="0%" stop-color="#ffff00"/>
                    <stop offset="50%" stop-color="#ffcc00"/>
                    <stop offset="100%" stop-color="#ff9900"/>
                </radialGradient>
                <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#cc6600"/>
                    <stop offset="50%" stop-color="#aa4400"/>
                    <stop offset="100%" stop-color="#882200"/>
                </linearGradient>
            </defs>
        </svg>
    `;
    container.appendChild(firefly);

    let currentRotation = 0;

    // Trail particles
    const trailCount = 8;
    const trail = [];
    for (let i = 0; i < trailCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'firefly-trail';
        particle.style.opacity = (1 - i / trailCount) * 0.6;
        particle.style.transform = `scale(${1 - i / trailCount * 0.7})`;
        container.appendChild(particle);
        trail.push({ el: particle, x: 0, y: 0 });
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let fireflyX = mouseX;
    let fireflyY = mouseY;
    let velocityX = 0;
    let velocityY = 0;
    let lastMouseMove = Date.now();
    let isIdle = false;
    let wanderAngle = Math.random() * Math.PI * 2;

    // Autonomous flying targets
    let targetX = Math.random() * window.innerWidth;
    let targetY = Math.random() * window.innerHeight;
    let nextTargetTime = 0;

    // Kitten tracking for memorial section
    let kittenOrbitAngle = 0;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMouseMove = Date.now();
            isIdle = false;
        });
    }

    function getKittenPosition() {
        const kitten = document.querySelector('.kitten-svg');
        if (kitten) {
            const rect = kitten.getBoundingClientRect();
            return {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2,
                visible: rect.top < window.innerHeight && rect.bottom > 0
            };
        }
        return null;
    }

    function updateTarget() {
        targetX = Math.random() * window.innerWidth;
        targetY = Math.random() * window.innerHeight;
        nextTargetTime = Date.now() + 5000 + Math.random() * 6000;
    }

    function animateFirefly() {
        const now = Date.now();

        // Check if kitten is visible
        const kittenPos = getKittenPosition();
        if (kittenPos && kittenPos.visible) {
            // Orbit around the kitten
            kittenOrbitAngle += 0.02;

            const orbitRadiusX = 60 + Math.sin(now * 0.001) * 15;
            const orbitRadiusY = 40 + Math.cos(now * 0.0015) * 10;
            const orbitTargetX = kittenPos.x + Math.cos(kittenOrbitAngle) * orbitRadiusX;
            const orbitTargetY = kittenPos.y + Math.sin(kittenOrbitAngle) * orbitRadiusY - 20;

            const dx = orbitTargetX - fireflyX;
            const dy = orbitTargetY - fireflyY;

            velocityX += dx * 0.03;
            velocityY += dy * 0.03;

            // Add playful wobble
            velocityX += Math.sin(now * 0.005) * 0.1;
            velocityY += Math.cos(now * 0.006) * 0.1;

        } else if (isTouchDevice || isIdle) {
            // Autonomous / Idle wandering mode
            if (now > nextTargetTime ||
                Math.hypot(fireflyX - targetX, fireflyY - targetY) < 30) {
                updateTarget();
            }

            wanderAngle += (Math.random() - 0.5) * 0.05;
            const wanderForce = 0.1;

            const dx = targetX - fireflyX;
            const dy = targetY - fireflyY;
            const dist = Math.hypot(dx, dy);
            const attractionStrength = 0.005;

            velocityX += (dx / dist) * attractionStrength + Math.cos(wanderAngle) * wanderForce * 0.05;
            velocityY += (dy / dist) * attractionStrength + Math.sin(wanderAngle) * wanderForce * 0.05;

            velocityX += Math.sin(now * 0.001) * 0.02;
            velocityY += Math.cos(now * 0.0012) * 0.02;

        } else {
            // Following cursor mode
            const dx = mouseX - fireflyX;
            const dy = mouseY - fireflyY;

            velocityX += dx * 0.008;
            velocityY += dy * 0.008;

            velocityX += Math.sin(now * 0.003) * 0.08;
            velocityY += Math.cos(now * 0.004) * 0.08;
        }

        // Check idle state
        if (!isTouchDevice && now - lastMouseMove > 1500) {
            isIdle = true;
            if (nextTargetTime === 0) updateTarget();
        }

        // Apply friction
        velocityX *= 0.96;
        velocityY *= 0.96;

        // Limit speed
        const speed = Math.hypot(velocityX, velocityY);
        const maxSpeed = isTouchDevice ? 1.5 : 2.5;
        if (speed > maxSpeed) {
            velocityX = (velocityX / speed) * maxSpeed;
            velocityY = (velocityY / speed) * maxSpeed;
        }

        // Update position
        fireflyX += velocityX;
        fireflyY += velocityY;

        // Keep on screen
        fireflyX = Math.max(10, Math.min(window.innerWidth - 10, fireflyX));
        fireflyY = Math.max(10, Math.min(window.innerHeight - 10, fireflyY));

        // Calculate rotation
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
            const targetRotation = Math.atan2(velocityY, velocityX) * (180 / Math.PI) + 90;
            let rotationDiff = targetRotation - currentRotation;
            if (rotationDiff > 180) rotationDiff -= 360;
            if (rotationDiff < -180) rotationDiff += 360;
            currentRotation += rotationDiff * 0.1;
        }

        // Update main firefly position
        firefly.style.left = fireflyX + 'px';
        firefly.style.top = fireflyY + 'px';
        firefly.style.transform = `translate(-50%, -50%) rotate(${currentRotation}deg)`;

        // Update trail
        for (let i = trail.length - 1; i >= 0; i--) {
            const prev = i === 0 ? { x: fireflyX, y: fireflyY } : trail[i - 1];
            trail[i].x += (prev.x - trail[i].x) * 0.3;
            trail[i].y += (prev.y - trail[i].y) * 0.3;
            trail[i].el.style.left = trail[i].x + 'px';
            trail[i].el.style.top = trail[i].y + 'px';
        }

        requestAnimationFrame(animateFirefly);
    }

    // Initialize trail positions
    for (let i = 0; i < trail.length; i++) {
        trail[i].x = fireflyX;
        trail[i].y = fireflyY;
    }

    // Eye tracking for the kitten
    const leftPupil = document.getElementById('leftPupil');
    const rightPupil = document.getElementById('rightPupil');
    const leftHighlight = document.getElementById('leftHighlight');
    const rightHighlight = document.getElementById('rightHighlight');

    const leftEyeCenter = { x: 28, y: 40 };
    const rightEyeCenter = { x: 52, y: 40 };
    const maxPupilMove = 3;

    let leftPupilX = leftEyeCenter.x;
    let leftPupilY = leftEyeCenter.y;
    let rightPupilX = rightEyeCenter.x;
    let rightPupilY = rightEyeCenter.y;

    function updateEyes() {
        const kittenSvg = document.querySelector('.kitten-svg');
        if (!kittenSvg || !leftPupil || !rightPupil) return;

        const svgRect = kittenSvg.getBoundingClientRect();

        const svgScaleX = 80 / svgRect.width;
        const svgScaleY = 70 / svgRect.height;
        const fireflyInSvgX = (fireflyX - svgRect.left) * svgScaleX;
        const fireflyInSvgY = (fireflyY - svgRect.top) * svgScaleY;

        let leftDx = fireflyInSvgX - leftEyeCenter.x;
        let leftDy = fireflyInSvgY - leftEyeCenter.y;
        let leftDist = Math.sqrt(leftDx * leftDx + leftDy * leftDy);
        if (leftDist > 0) {
            leftDx = (leftDx / leftDist) * Math.min(leftDist * 0.05, maxPupilMove);
            leftDy = (leftDy / leftDist) * Math.min(leftDist * 0.05, maxPupilMove);
        }

        let rightDx = fireflyInSvgX - rightEyeCenter.x;
        let rightDy = fireflyInSvgY - rightEyeCenter.y;
        let rightDist = Math.sqrt(rightDx * rightDx + rightDy * rightDy);
        if (rightDist > 0) {
            rightDx = (rightDx / rightDist) * Math.min(rightDist * 0.05, maxPupilMove);
            rightDy = (rightDy / rightDist) * Math.min(rightDist * 0.05, maxPupilMove);
        }

        const easing = 0.08;
        leftPupilX += ((leftEyeCenter.x + leftDx) - leftPupilX) * easing;
        leftPupilY += ((leftEyeCenter.y + leftDy) - leftPupilY) * easing;
        rightPupilX += ((rightEyeCenter.x + rightDx) - rightPupilX) * easing;
        rightPupilY += ((rightEyeCenter.y + rightDy) - rightPupilY) * easing;

        leftPupil.setAttribute('cx', leftPupilX);
        leftPupil.setAttribute('cy', leftPupilY);
        leftHighlight.setAttribute('cx', leftPupilX + 1);
        leftHighlight.setAttribute('cy', leftPupilY - 3);

        rightPupil.setAttribute('cx', rightPupilX);
        rightPupil.setAttribute('cy', rightPupilY);
        rightHighlight.setAttribute('cx', rightPupilX + 1);
        rightHighlight.setAttribute('cy', rightPupilY - 3);

        requestAnimationFrame(updateEyes);
    }

    updateTarget();
    animateFirefly();
    updateEyes();
})();
