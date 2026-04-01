const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const title = document.getElementById('songTitle');
const artist = document.getElementById('songArtist');
const cover = document.getElementById('coverImage');
const progressContainer = document.getElementById('progressContainer');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');
const albumArtContainer = document.querySelector('.album-art');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const playingStatus = document.getElementById('playingStatus');
const description = document.getElementById('songDescription');

// Playlist Data - Placeholders with Working Royalty-free Audio & Unsplash Images
const songs = [
    {
        title: 'Chale_Uthe', // Change to your song's name
        artist: 'Creative Commons',
        description: 'Motivation & Focus',
        src: 'chale-uthe.mp3', // This will load your uploaded song.mp3 file
        cover: 'cover.jpg' // This will load your uploaded cover.jpg file
    },
    {
        title: 'Electronic Future',
        artist: 'Creative Commons',
        description: 'High Energy Workout',
        src: 'https://cdn.pixabay.com/download/audio/2021/11/25/audio_91b3cbce25.mp3?filename=future-bass-112349.mp3',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        title: 'Lofi Chill Vibes',
        artist: 'Creative Commons',
        description: 'Relaxation & Study',
        src: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_b281f6ebdb.mp3?filename=good-night-160166.mp3',
        cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        title: 'Inspiring Ambient',
        artist: 'Creative Commons',
        description: 'Deep Work Session',
        src: 'https://cdn.pixabay.com/download/audio/2021/10/01/audio_eb36eac1d2.mp3?filename=ambient-piano-amp-strings-10711.mp3',
        cover: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
        title: 'Cyberpunk Synthwave',
        artist: 'Creative Commons',
        description: 'Gaming Vibes',
        src: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_99370df3bc.mp3?filename=synthwave-80s-121510.mp3',
        cover: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    }
];

// Keep track of song
let songIndex = 0;

// Initialize the app
function init() {
    loadSong(songs[songIndex]);
    renderPlaylist();
}

// Update song details
function loadSong(song) {
    title.innerText = song.title;
    artist.innerText = song.artist;
    description.innerText = song.description;
    audio.src = song.src;
    cover.src = song.cover;
    updatePlaylistUI();

    // Reset progress
    progress.style.width = '0%';
    currentTimeEl.innerText = '0:00';
    
    // When audio metadata is loaded, update duration
    audio.addEventListener('loadedmetadata', function() {
        if (!isNaN(audio.duration) && audio.duration !== Infinity) {
            let durationMinutes = Math.floor(audio.duration / 60);
            let durationSeconds = Math.floor(audio.duration % 60);
            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`;
            }
            durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
        } else {
            durationEl.innerText = '0:00';
        }
    });

    // Fallback if metadata isn't accurate initially
    if (audio.readyState >= 1) {
        if (!isNaN(audio.duration)) {
             let durationMinutes = Math.floor(audio.duration / 60);
             let durationSeconds = Math.floor(audio.duration % 60);
             if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;
             durationEl.innerText = `${durationMinutes}:${durationSeconds}`;
        }
    }
}

// Render Playlist dynamically
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === songIndex) {
            li.classList.add('active');
        }
        
        li.innerHTML = `
            <span class="playlist-number">${index + 1}</span>
            <img src="${song.cover}" alt="${song.title}" class="playlist-thumb">
            <div class="playlist-info">
                <div class="playlist-title">${song.title}</div>
                <div class="playlist-artist">${song.artist}</div>
                <div class="playlist-desc-mini">${song.description}</div>
            </div>
        `;

        // Click handler to play specific song
        li.addEventListener('click', () => {
            if (songIndex === index) {
                // If clicking current song, toggle play/pause
                if(audio.paused) {
                    playSong();
                } else {
                    pauseSong();
                }
            } else {
                songIndex = index;
                loadSong(songs[songIndex]);
                playSong();
            }
        });

        playlistEl.appendChild(li);
    });
}

// Update UI to highlight active song
function updatePlaylistUI() {
    const items = playlistEl.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Play song
function playSong() {
    albumArtContainer.classList.add('playing');
    playingStatus.classList.add('active');
    // Change icon to pause
    const icon = playBtn.querySelector('i');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-pause');
    
    audio.play().catch(e => console.log('Playback prevented by browser: ', e));
}

// Pause song
function pauseSong() {
    albumArtContainer.classList.remove('playing');
    playingStatus.classList.remove('active');
    // Change icon to play
    const icon = playBtn.querySelector('i');
    icon.classList.add('fa-play');
    icon.classList.remove('fa-pause');
    
    audio.pause();
}

// Previous song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Next song
function nextSong() {
    songIndex++;
    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

// Update progress bar & time
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;
    
    if (duration && !isNaN(duration)) {
        // Update width
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        // Calculate and update display for current time
        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        currentTimeEl.innerText = `${currentMinutes}:${currentSeconds}`;
    }
}

// Set progress by clicking on progress bar
function setProgress(e) {
    const rect = progressContainer.getBoundingClientRect();
    const width = rect.width;
    const clickX = e.clientX - rect.left;
    const duration = audio.duration;
    
    if(duration && !isNaN(duration)) {
        audio.currentTime = (clickX / width) * duration;
    }
}

// Volume control
let currentVolume = 1;

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    currentVolume = audio.volume;
    updateVolumeIcon();
});

volumeIcon.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = currentVolume > 0 ? currentVolume : 1;
        volumeSlider.value = audio.volume;
    }
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Event listeners
playBtn.addEventListener('click', () => {
    const isPlaying = albumArtContainer.classList.contains('playing');
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

// Autoplay next song when current ends
audio.addEventListener('ended', nextSong);

// Setup on load
init();

// Set initial volume
audio.volume = volumeSlider.value;
