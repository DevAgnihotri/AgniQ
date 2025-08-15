const canvas = document.getElementById('thermoCanvas');
		const ctx = canvas.getContext('2d');
		const energyInput = document.getElementById('energy');
		const deltaSInput = document.getElementById('deltaS');
		const residualSInput = document.getElementById('residualS');
		const energyValue = document.getElementById('energyValue');
		const deltaSValue = document.getElementById('deltaSValue');
		const residualSValue = document.getElementById('residualSValue');

		let particles = [];
		const numParticles = 100;
		let time = 0;

		// Listen for messages from parent window
		window.addEventListener('message', function(event) {
			if (event.data.type === 'setEnergy') {
				energyInput.value = event.data.value;
				drawVisualization();
			} else if (event.data.type === 'setCycle') {
				// Adjust parameters based on cycle
				switch(event.data.value) {
					case 'carnot':
						energyInput.value = 1.5;
						deltaSInput.value = 1.2;
						break;
					case 'otto':
						energyInput.value = 2.0;
						deltaSInput.value = 1.5;
						break;
					case 'diesel':
						energyInput.value = 2.5;
						deltaSInput.value = 1.8;
						break;
				}
				drawVisualization();
			}
		});

		function initializeParticles() {
			particles = [];
			for (let i = 0; i < numParticles; i++) {
				particles.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					vx: 0,
					vy: 0
				});
			}
		}

		// Initialize particles on load
		initializeParticles();

		function resetAnimation() {
			time = 0;
			initializeParticles();
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			drawVisualization();
		}

		function drawVisualization() {
			const E = parseFloat(energyInput.value);
			const deltaS = parseFloat(deltaSInput.value);
			const Sr = parseFloat(residualSInput.value);
			energyValue.textContent = E.toFixed(1);
			deltaSValue.textContent = deltaS.toFixed(1);
			residualSValue.textContent = Sr.toFixed(1);

			// Clear canvas with semi-transparent background
			ctx.fillStyle = 'rgba(10, 10, 35, 0.1)';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Center of pattern formation
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;

			// Update and draw particles
			particles.forEach(p => {
				// Calculate distance to center
				const dx = p.x - centerX;
				const dy = p.y - centerY;
				const r = Math.sqrt(dx * dx + dy * dy) || 0.01;

				// Thermodynamic force: energy and entropy change drive order
				const force = E * deltaS * Math.sin(time + r / 50) / (r * 5); // Energy and entropy drive
				const forceX = -force * dx;
				const forceY = -force * dy;

				// Residual entropy adds randomness
				const randomForce = Sr * (Math.random() - 0.5) * 2;

				// Update velocity and position
				p.vx = 0.95 * p.vx + 0.05 * (forceX + randomForce);
				p.vy = 0.95 * p.vy + 0.05 * (forceY + randomForce);
				p.x += p.vx;
				p.y += p.vy;

				// Bounce off edges
				if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
				if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

				// Draw particle
				ctx.beginPath();
				ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
				ctx.fillStyle = `hsl(${r % 360}, 70%, 50%)`;
				ctx.fill();
			});

			// Draw center point (representing ordered state)
			ctx.beginPath();
			ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
			ctx.fillStyle = 'white';
			ctx.fill();

			time += 0.03;
			requestAnimationFrame(drawVisualization);
		}

		energyInput.addEventListener('input', () => drawVisualization());
		deltaSInput.addEventListener('input', () => drawVisualization());
		residualSInput.addEventListener('input', () => drawVisualization());

		// Start animation
		drawVisualization();