document.getElementById('theme-select').addEventListener('change', function() {
    document.body.className = this.value;
});

let playlists = JSON.parse(localStorage.getItem('playlists')) || [];
let songs = JSON.parse(localStorage.getItem('songs')) || [];

function createPlaylist() {
    const name = document.getElementById('new-playlist-name').value;
    const imageFile = document.getElementById('new-playlist-image').files[0];

    if (name && imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const newPlaylist = {
                name: name,
                image: e.target.result,
                songs: []
            };
            playlists.push(newPlaylist);
            localStorage.setItem('playlists', JSON.stringify(playlists));
            displayPlaylists();
        };
        reader.readAsDataURL(imageFile);
    }
}

function displayPlaylists() {
    const container = document.getElementById('playlist-container');
    container.innerHTML = '';
    playlists.forEach((playlist, index) => {
        const playlistDiv = document.createElement('div');
        playlistDiv.className = 'playlist';
        playlistDiv.draggable = true;
        playlistDiv.innerHTML = `
            <img src="${playlist.image}" alt="${playlist.name}">
            <div class="playlist-name">${playlist.name}</div>
            <button onclick="playPlaylist(${index})">Play</button>
        `;
        playlistDiv.ondragover = event => event.preventDefault();
        playlistDiv.ondrop = event => dropSong(event, index);
        container.appendChild(playlistDiv);
    });
}

function playPlaylist(index) {
    const playlist = playlists[index];
    if (playlist.songs.length > 0) {
        const song = playlist.songs[0];
        playSong(song);
    } else {
        alert('No songs in this playlist.');
    }
}

function addSong() {
    const name = document.getElementById('new-song-name').value;
    const audioFile = document.getElementById('new-song-file').files[0];
    const imageFile = document.getElementById('new-song-image').files[0];

    if (name && audioFile && imageFile) {
        const audioReader = new FileReader();
        const imageReader = new FileReader();

        audioReader.onload = function(e) {
            const audioUrl = e.target.result;

            imageReader.onload = function(e) {
                const imageUrl = e.target.result;

                const newSong = {
                    name: name,
                    url: audioUrl,
                    image: imageUrl
                };

                songs.push(newSong);
                localStorage.setItem('songs', JSON.stringify(songs));
                displaySongs();
            };
            imageReader.readAsDataURL(imageFile);
        };
        audioReader.readAsDataURL(audioFile);
    }
}

function displaySongs() {
    const container = document.getElementById('song-container');
    container.innerHTML = '';
    songs.forEach((song, index) => {
        const songDiv = document.createElement('div');
        songDiv.className = 'song';
        songDiv.draggable = true;
        songDiv.ondragstart = event => event.dataTransfer.setData('songIndex', index);
        songDiv.innerHTML = `
            <img src="${song.image}" alt="${song.name}">
            <div class="song-name">${song.name}</div>
        `;
        container.appendChild(songDiv);
    });
}

function dropSong(event, playlistIndex) {
    const songIndex = event.dataTransfer.getData('songIndex');
    const song = songs[songIndex];
    playlists[playlistIndex].songs.push(song);
    localStorage.setItem('playlists', JSON.stringify(playlists));
}

function playSong(song) {
    document.getElementById('audio-source').src = song.url;
    document.getElementById('album-art').src = song.image;
    document.getElementById('song-title').textContent = song.name;
    document.getElementById('audio').load();
    document.getElementById('audio').play();
}

document.getElementById('prev-btn').addEventListener('click', () => {
    // Implement previous song functionality
});

document.getElementById('play-pause-btn').addEventListener('click', () => {
    const audio = document.getElementById('audio');
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    // Implement next song functionality
});

window.onload = () => {
    displayPlaylists();
    displaySongs();
};
