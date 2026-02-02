const neinBtn = document.getElementById('nein-btn');
const jaBtn = document.getElementById('ja-btn');
const successMsg = document.getElementById('success');
const buttonsContainer = document.querySelector('.buttons');
const question = document.querySelector('.question');
const videoOverlay = document.getElementById('videoOverlay');
const loveVideo = document.getElementById('loveVideo');
const closeVideo = document.getElementById('closeVideo');

function moveButton() {
	const btnRect = neinBtn.getBoundingClientRect();

	const maxX = window.innerWidth - btnRect.width - 100;
	const maxY = window.innerHeight - btnRect.height - 100;

	const randomX = Math.random() * (maxX - 100) + 50;
	const randomY = Math.random() * (maxY - 100) + 50;

	neinBtn.style.position = 'fixed';
	neinBtn.style.left = randomX + 'px';
	neinBtn.style.top = randomY + 'px';
}

neinBtn.addEventListener('mouseenter', moveButton);

neinBtn.addEventListener('touchstart', (e) => {
	e.preventDefault();
	moveButton();
});

neinBtn.addEventListener('mousedown', (e) => {
	e.preventDefault();
	moveButton();
});

jaBtn.addEventListener('click', () => {
	buttonsContainer.style.display = 'none';
	question.style.display = 'none';
	successMsg.style.display = 'block';

	for (let i = 0; i < 20; i++) {
		setTimeout(() => {
			createFallingHeart();
		}, i * 100);
	}

	setTimeout(() => {
		showRandomImages();
	}, 1000);

	setTimeout(() => {
		showVideo();
	}, 3000);
});

function createFallingHeart() {
	const heart = document.createElement('div');
	heart.innerHTML = '💖';
	heart.style.position = 'fixed';
	heart.style.left = Math.random() * window.innerWidth + 'px';
	heart.style.top = '-50px';
	heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
	heart.style.zIndex = '1000';
	heart.style.pointerEvents = 'none';
	document.body.appendChild(heart);

	let pos = -50;
	const fallInterval = setInterval(() => {
		pos += 5;
		heart.style.top = pos + 'px';

		if (pos > window.innerHeight) {
			clearInterval(fallInterval);
			heart.remove();
		}
	}, 20);
}

function showRandomImages() {
	const imageCount = 7;
	const usedPositions = [];

	for (let i = 1; i <= imageCount; i++) {
		setTimeout(() => {
			const img = document.createElement('img');
			img.src = `/assets/img/image${i}.jpg`;
			img.className = 'popup-image';

			let randomX, randomY;
			let validPosition = false;
			let attempts = 0;

			while (!validPosition && attempts < 50) {
				randomX = Math.random() * (window.innerWidth - 150) + 25;
				randomY = Math.random() * (window.innerHeight - 200) + 25;

				validPosition = true;
				for (let pos of usedPositions) {
					const distance = Math.sqrt(Math.pow(randomX - pos.x, 2) + Math.pow(randomY - pos.y, 2));
					if (distance < 250) {
						validPosition = false;
						break;
					}
				}
				attempts++;
			}

			usedPositions.push({
				x: randomX,
				y: randomY
			});

			img.style.left = randomX + 'px';
			img.style.top = randomY + 'px';

			document.body.appendChild(img);
		}, i * 300);
	}
}

function showVideo() {
	videoOverlay.style.display = 'flex';
	loveVideo.play();
}

closeVideo.addEventListener('click', () => {
	videoOverlay.style.display = 'none';
	loveVideo.pause();
	loveVideo.currentTime = 0;
});

videoOverlay.addEventListener('click', (e) => {
	if (e.target === videoOverlay) {
		videoOverlay.style.display = 'none';
		loveVideo.pause();
		loveVideo.currentTime = 0;
	}
});