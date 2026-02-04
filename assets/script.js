document.addEventListener('DOMContentLoaded', function() {
    const videoContainer = document.getElementById('video-container');
    const videoLoading = document.getElementById('video-loading');
    const pauseBtn = document.getElementById('pause-btn');
    const muteBtn = document.getElementById('mute-btn');
    const hideBtn = document.getElementById('hide-btn');
    const showBtn = document.getElementById('show-btn');
    const videoSource = 'https://dl.dropboxusercontent.com/scl/fi/ahxew70yan0zfatx39osc/background-video-muted-1080p-30fps-editbyitsmarian.mp4?rlkey=vkrhn2u1v9own6wjc78k0dppk';
    const wallpaperSource = '/assets/img/wallpaper_placeholder.png';

    let currentVideo = null;
    let wallpaperImage = null;
    let isPaused = false;
    let isMuted = true;
    let isVideoHidden = localStorage.getItem('videoHidden') === 'true';

    function createWallpaperImage() {
        wallpaperImage = document.createElement('img');
        wallpaperImage.id = 'background-wallpaper';
        wallpaperImage.src = wallpaperSource;
        wallpaperImage.alt = 'Background Wallpaper';
        wallpaperImage.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.5s ease;
            z-index: -2;
            display: none;
        `;
        videoContainer.appendChild(wallpaperImage);
    }

    function initializeVideo() {
        createWallpaperImage();
        
        if (isVideoHidden) {
            videoLoading.style.display = 'none';
            hideBtn.style.display = 'none';
            showBtn.style.display = 'flex';
            pauseBtn.classList.add('disabled');
            muteBtn.classList.add('disabled');
            
            if (wallpaperImage) {
                wallpaperImage.style.display = 'block';
                setTimeout(() => {
                    wallpaperImage.style.opacity = '0.4';
                }, 100);
            }
            console.log('[info@dev] Initialized successfully\n[info@dev] Type: Video Hidden (Wallpaper Visible)')
        } else {
            videoLoading.style.display = 'flex';
            videoLoading.style.opacity = '1';
            createAndLoadVideo();
            console.log('[info@dev] Initialized successfully\n[info@dev] Type: Video Visible')
        }
    }
    
    function createAndLoadVideo() {
        if (currentVideo) {
            currentVideo.remove();
            currentVideo = null;
        }
        
        currentVideo = document.createElement('video');
        currentVideo.id = 'background-video';
        currentVideo.autoplay = true;
        currentVideo.loop = true;
        currentVideo.muted = isMuted;
        currentVideo.playsInline = true;
        currentVideo.playsinline = true;
        currentVideo.style.cssText = `
            height: 100%;
            left: 0;
            object-fit: cover;
            opacity: 0;
            position: absolute;
            top: 0;
            transition: opacity 1s ease;
            width: 100%;
            z-index: -2;
            display: block;
        `;
        
        videoContainer.appendChild(currentVideo);
        
        currentVideo.src = videoSource;
        currentVideo.load();
        
        if (wallpaperImage) {
            wallpaperImage.style.opacity = '0';
            setTimeout(() => {
                wallpaperImage.style.display = 'none';
            }, 500);
        }
        
        currentVideo.addEventListener('canplaythrough', function() {
            showVideoContent();
        });
        
        currentVideo.addEventListener('error', function(e) {
            videoLoading.innerHTML = '<p>Could not load video. Try again or switch to wallpaper!</p>';
            console.log(`[info@dev] Video playback failed\n[info@dev] Error: ${e}`)
            setTimeout(function() {
                videoLoading.style.opacity = '0';
                setTimeout(function() {
                    videoLoading.style.display = 'none';
                    showWallpaperAsFallback();
                }, 500);
            }, 3000);
        });
        
        setTimeout(function() {
            if (currentVideo && currentVideo.readyState < 3) {
                videoLoading.innerHTML = '<p>Video is loading lazy!</p>';
                console.log('[info@dev] Could not load video\n[info@dev] Showing wallpaper image!')
                showWallpaperAsFallback()
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
    
    function showWallpaperAsFallback() {
        if (wallpaperImage) {
            hdieBtn.style.display = "none";
            showBtn.style.display = "block";
            wallpaperImage.style.display = 'block';
            wallpaperImage.style.opacity = '0.4';
        }
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
            currentVideo.style.opacity = '0';
            setTimeout(() => {
                currentVideo.style.display = 'none';
            }, 500);
        }
        
        // Wallpaper anzeigen
        if (wallpaperImage) {
            wallpaperImage.style.display = 'block';
            setTimeout(() => {
                wallpaperImage.style.opacity = '0.4';
            }, 100);
        }
        
        hideBtn.style.display = 'none';
        showBtn.style.display = 'flex';
        pauseBtn.classList.add('disabled');
        muteBtn.classList.add('disabled');
        
        isVideoHidden = true;
        localStorage.setItem('videoHidden', 'true');
    }
    
    function showVideo() {
        // Wallpaper ausblenden
        if (wallpaperImage) {
            wallpaperImage.style.opacity = '0';
            setTimeout(() => {
                wallpaperImage.style.display = 'none';
            }, 500);
        }
        
        // Video wieder anzeigen
        if (currentVideo) {
            currentVideo.style.display = 'block';
            setTimeout(() => {
                currentVideo.style.opacity = '0.4';
            }, 100);
            if (!isPaused) {
                currentVideo.play().catch(function(error) {
                    console.log('Play failed:', error);
                });
            }
        } else {
            createAndLoadVideo();
        }
        
        document.querySelector('.video-overlay').style.background = 
            'linear-gradient(to bottom, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.3) 50%, rgba(10,10,10,0.7) 100%)';
        showBtn.style.display = 'none';
        hideBtn.style.display = 'flex';
        pauseBtn.classList.remove('disabled');
        muteBtn.classList.remove('disabled');
        
        isVideoHidden = false;
        localStorage.setItem('videoHidden', 'false');
    }
    
    const savedMute = localStorage.getItem('videoMuted');
    if (savedMute !== null) {
        isMuted = savedMute === 'true';
    }
    
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
        el.style.transition = 'all 0.3s ease';
        observer.observe(el);
    });

    initializeVideo();
});