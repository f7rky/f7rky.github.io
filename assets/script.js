document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const videoLoading = document.getElementById('video-loading');
    const pauseBtn = document.getElementById('pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    const hideBtn = document.getElementById('hide-btn');
    const showBtn = document.getElementById('show-btn');
    const videoSource = 'https://dl.dropboxusercontent.com/scl/fi/ahxew70yan0zfatx39osc/background-video-muted-1080p-30fps-editbyitsmarian.mp4?rlkey=vkrhn2u1v9own6wjc78k0dppk&st=2qvtrs9j';
    
    let currentVideo = null;
    let isPaused = false;
    let isMuted = true;
    let isVideoHidden = localStorage.getItem('videoHidden') === 'true';

    function initializeVideo() {
        if (isVideoHidden) {
            videoLoading.style.display = 'none';
            document.querySelector('.video-overlay').style.background = '#000';
            hideBtn.style.display = 'none';
            showBtn.style.display = 'flex';
            pauseBtn.classList.add('disabled');
            muteBtn.classList.add('disabled');
        } else {
            createAndLoadVideo();
        }
    }
    
    function createAndLoadVideo() {
        if (currentVideo) {
            currentVideo.remove();
            currentVideo = null;
        }
        
        currentVideo = document.createElement('video');
        currentVideo.id = 'background-video';
        currentVideo.muted = isMuted;
        currentVideo.loop = true;
		currentVideo.autoplay = true;
        currentVideo.style.position = 'absolute';
        currentVideo.style.top = '0';
        currentVideo.style.left = '0';
        currentVideo.style.width = '100%';
        currentVideo.style.height = '100%';
        currentVideo.style.objectFit = 'cover';
        currentVideo.style.zIndex = '-1';
        currentVideo.style.opacity = '0';
        currentVideo.style.transition = 'opacity 1s ease';
        
        videoContainer.appendChild(currentVideo);
        
        videoLoading.style.display = 'flex';
        videoLoading.style.opacity = '1';
        
        currentVideo.src = videoSource;
        currentVideo.load();
        
        currentVideo.addEventListener('canplaythrough', function() {
            showVideoContent();
        });
        
        currentVideo.addEventListener('error', function(e) {
            videoLoading.innerHTML = '<p>Video konnte nicht geladen werden.</p>';
            setTimeout(function() {
                videoLoading.style.opacity = '0';
                setTimeout(function() {
                    videoLoading.style.display = 'none';
                }, 500);
            }, 3000);
        });
        
        setTimeout(function() {
            if (currentVideo && currentVideo.readyState < 3) {
                videoLoading.innerHTML = '<p>Video lädt langsam. Seite ist trotzdem nutzbar.</p>';
                setTimeout(function() {
                    if (currentVideo && !isVideoHidden) {
                        showVideoContent();
                    }
                }, 2000);
            }
        }, 8000);
    }
    
    function showVideoContent() {
        if (!currentVideo) return;
        
        videoLoading.style.opacity = '0';
        setTimeout(function() {
            currentVideo.style.opacity = '0.4';
            if (!isPaused) {
                currentVideo.play().catch(function(error) {
                    console.log('Video play failed:', error);
                });
            }
            videoLoading.style.display = 'none';
        }, 500);
    }
    
    pauseBtn.addEventListener('click', function() {
        if (isVideoHidden || !currentVideo) return;
        
        if (isPaused) {
            currentVideo.play().then(function() {
                pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                pauseBtn.title = 'Video pausieren';
                isPaused = false;
            }).catch(function(error) {
                console.log('Play failed:', error);
            });
        } else {
            currentVideo.pause();
            pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            pauseBtn.title = 'Video abspielen';
            isPaused = true;
        }
    });
    
    muteBtn.addEventListener('click', function() {
        if (isVideoHidden || !currentVideo) return;
        
        if (isMuted) {
            currentVideo.muted = false;
            muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            muteBtn.title = 'Ton aus';
        } else {
            currentVideo.muted = true;
            muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            muteBtn.title = 'Ton an';
        }
        isMuted = !isMuted;
        localStorage.setItem('videoMuted', isMuted.toString());
    });
    
    hideBtn.addEventListener('click', function() {
        hideVideo();
    });
    
    showBtn.addEventListener('click', function() {
        showVideo();
    });
    
    function hideVideo() {
        if (currentVideo) {
            currentVideo.pause();
            currentVideo.remove();
            currentVideo = null;
        }
        
        document.querySelector('.video-overlay').style.background = '#000';
        hideBtn.style.display = 'none';
        showBtn.style.display = 'flex';
        pauseBtn.classList.add('disabled');
        muteBtn.classList.add('disabled');
        
        isVideoHidden = true;
        localStorage.setItem('videoHidden', 'true');
    }
    
    function showVideo() {
        document.querySelector('.video-overlay').style.background = 
            'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.7) 100%)';
        showBtn.style.display = 'none';
        hideBtn.style.display = 'flex';
        pauseBtn.classList.remove('disabled');
        muteBtn.classList.remove('disabled');
        
        isVideoHidden = false;
        localStorage.setItem('videoHidden', 'false');
        
        createAndLoadVideo();
    }
    
    const savedMute = localStorage.getItem('videoMuted');
    if (savedMute !== null) {
        isMuted = savedMute === 'true';
    }
    
    initializeVideo();
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const elementsToAnimate = document.querySelectorAll('.stat-item, .achievement-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = 0;
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });
});