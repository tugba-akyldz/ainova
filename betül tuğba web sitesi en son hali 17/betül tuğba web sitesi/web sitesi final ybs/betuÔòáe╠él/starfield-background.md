# Starfield background (canvas + Three.js particles)

## HTML
```html
<canvas id="bg-canvas"></canvas>
```

Place it right after `<body>` so it sits behind all content.

## CSS
```css
#bg-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: -1;
    outline: none;
}

#content-wrapper {
    position: relative;
    z-index: 1;
}
```

## JavaScript
```js
if (window.THREE) {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 15;

    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('#bg-canvas'),
        alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (Math.random() * 50);
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.025,
        color: 0xffffff,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.5;
        mouseY = (event.clientY - windowHalfY) * 0.5;
    });

    const clock = new THREE.Clock();
    const animate = () => {
        const elapsedTime = clock.getElapsedTime();

        const positions = particlesGeometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3 + 1] += 0.02;
            positions[i3] += Math.sin(elapsedTime + i) * 0.001;
            if (positions[i3 + 1] > 20) {
                positions[i3] = (Math.random() - 0.5) * 50;
                positions[i3 + 1] = -20;
                positions[i3 + 2] = (Math.random() - 0.5) * 50;
            }
        }
        particlesGeometry.attributes.position.needsUpdate = true;

        camera.position.x += (mouseX - camera.position.x) * 0.0001;
        camera.position.y += (-mouseY - camera.position.y) * 0.0001;

        renderer.render(scene, camera);
        window.requestAnimationFrame(animate);
    };

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    animate();
}
```

Re-add this block near the end of `index.html` before other closing scripts when you want the starfield back.
