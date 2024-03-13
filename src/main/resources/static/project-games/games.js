const modal = document.querySelector('#game-window');
let initialGameData;

function addVideosToModal(videos) {
    const videoContainer = document.querySelector('.modal-videos');

    // clear previous videos
    videoContainer.innerHTML = '';

    // iterate video IDs and create iframes for each
    videos.forEach(videoId => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '560');
        iframe.setAttribute('height', '315');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');

        videoContainer.appendChild(iframe);
    });
}

// close modal
function closeModalClick() {
    modal.close();
}

// game click behavior --> open modal w/ data
// modalGameData = array of objects
function openModal(modalGameData) {
    // set cover data
    const image = document.querySelector('.modal-image');
    image.setAttribute('src', initialGameData.cover);

    // set title data
    const title = document.querySelector('.modal-title');
    title.textContent = initialGameData.title;

    // set genre modal
    const genre = document.querySelector('.modal-genre');
    genre.textContent = initialGameData.genres;

    // set release data
    const release = document.querySelector('.modal-release');
    release.textContent = initialGameData.releaseDate;

    // set developer data
    const developer = document.querySelector('.modal-developer');
    developer.textContent = 'Developer:' + initialGameData.developer;

    // set rating data
    const rating = document.querySelector('.modal-rating');
    rating.textContent = initialGameData.ratings;

    console.log('Open Modal data:', modalGameData);

    // set summary data
    const summary = document.querySelector('.modal-summary');
    summary.textContent = 'Summary:' + modalGameData[0].summary;

    // set similarGames data
    const similar = document.querySelector('.modal-similar-games');
    similar.textContent = modalGameData[0].similarGames;

    // display videos
    addVideosToModal(modalGameData[0].videos);

    // open modal
    modal.showModal();
}

// delete list
function deleteModalGame() {
    fetch('/games/deleteModal', {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Response status:', response.status); // for debugging
        if (!response.ok) {
            throw new Error('Error clearing games: ' + response.status);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// add game objects to list
function addModalData(modalGameDataArray) {
    // array of response
    const gameModalArray = [];

    // iterate and retrieve name
    modalGameDataArray.forEach(modalData => {
        const { summary, videos, similar_games } = modalData;
        // if parameters are not found --> assign empty values
        const sum = summary ? summary : "Summary Not Available";
        const video = videos ? videos.map(videos => videos.video_id) : [];
        const similar = similar_games ? similar_games.map(sim => sim.name) : [];

        // create game modal object
        const gameData = {
            summary: sum,
            videos: video,
            similarGames: similar
        };
        // push object
        gameModalArray.push(gameData);
    });

    console.log('Game modal array:', gameModalArray);

    // send the POST request to the backend
    fetch('/games/createModal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameModalArray)
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Error adding game: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data:', data);
        // games added successfully --> update modal
        console.log('Successfully added game modal data');
        openModal(data);
    })
    .catch(error => {
        // handle errors if any
        console.error(error);
    });
}

function searchModalData(gameID) {

    // GET request to backend endpoint
    fetch(`/games/searchModalData?id=${encodeURIComponent(gameID)}`)
        .then(response => {
            // check response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // parse JSON response
            return response.json();
        })
        .then(data => {
            // handle data
            console.log('Modal data:', data);
            addModalData(data);
        })
        .catch(error => {
            // handle error
            console.log('Problem with fetch:', error);
        });
}

// game click behavior --> fetch (by id) additional modal data -->
function fetchModalData(game) {
    return function () {
        console.log('modal div clicked!');
        deleteModalGame();
        initialGameData = game;
        searchModalData(game.id);
    }
}

// modify cover image url for resizing
function editCoverImageURL(url) {
    const baseURL = "//images.igdb.com/igdb/image/upload/t_cover_small/";
    const parts = url.split('/');
    const extension = parts[parts.length - 1];
    return baseURL + extension;
}

// delete list
function deleteGames() {
    fetch('/games/delete', {
        method: 'DELETE'
    })
    .then(response => {
        console.log('Response status:', response.status); // for debugging
        if (!response.ok) {
            throw new Error('Error clearing games: ' + response.status);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// update frontend results
function updateGamesDisplay(gameData) {
    const gameDisplay = document.getElementById('game-display');

    // clear the existing content in the task display container
    gameDisplay.innerHTML = '';

    // iterate games and create HTML elements for display
    if (gameData != null) {
        gameData.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.classList.add('game-item');
            gameItem.addEventListener('click', fetchModalData(game));
            gameItem.innerHTML = `
                <div class="game-container">
                    <div class="game-content">
                        <p class="game-title">${game.title}</p>
                        <p class="game-rating">Ratings: ${game.ratings} Genres: ${game.genres} Release Date: ${game.releaseDate}
                                Platform: ${game.platform} Developer: ${game.developer}</p>
                        <img class="game-cover" src="${game.cover}" alt="${game.title}">
                    </div>
                </div>
            `;
            gameDisplay.appendChild(gameItem);
        });
    } // end if
    return;
}

// add game objects to list
function addGameData(games) {
    // array of response
    const gameArray = [];

    // iterate and retrieve name
    games.forEach(gameData => {
        const { id, name, first_release_date, cover, platforms, genres, artworks, rating, involved_companies } = gameData;
        // if parameters are not found --> assign empty values
        const ids = id ? id : "";
        const names = name ? name : "";
        const release = first_release_date ? first_release_date : "";
        const coverURL = cover ? cover.url : "Image Unavailable";
        const platformName = platforms ? platforms.map(platform => platform.name) : [];
        const genreName = genres ? genres.map(genre => genre.name) : [];
        /*const artworkURL = artworks ? artworks.map(art => art.url) : [];*/
        const ratings = rating ? rating : "";
        const devName = involved_companies && involved_companies.length > 0
            ? involved_companies.map(dev => dev.company.name) : ["Information Unavailable"];

        /* retrieve last artwork image element
        let artworkSelect = 0;
        if (artworkURL > 0) {
            artworkSelect = artworkURL.length - 2;
        }*/

        // reconstruct cover image url (for results screen)
        let newCoverURL = "";
        if (coverURL != null) {
            newCoverURL = editCoverImageURL(coverURL);
        }

        // create game object
        const game = {
            id: ids,
            title: names,
            releaseDate: release,
            cover: newCoverURL,
            platform: platformName,
            genres: genreName,
            /*artwork: artworkURL,*/
            rating: ratings,
            /*artNumber: artworkSelect*/
            developer: devName
        };
        // push object
        gameArray.push(game);
    });

    // send the POST request to the backend
    fetch('/games/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameArray)
    })
    .then(response => {
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Error adding game: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data:', data);
        // games added successfully --> update frontend
        updateGamesDisplay(data);

    })
    .catch(error => {
        // handle errors if any
        console.error(error);
    });
}

// call function initially --> initial splash screen
recentlyReleasedGames();
function recentlyReleasedGames() {

    // delete any pre-existing data
    deleteGames();

    // GET request to backend endpoint
    fetch('/games/searchRecentGames')
        .then(response => {
            // check response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // parse JSON response
            return response.json();
        })
        .then(data => {
            //const games = JSON.parse(data);
            // handle data
            addGameData(data);
            console.log(data);
        })
        .catch(error => {
            // handle error
            console.log('Problem with fetch:', error);
        });
}

// send user input to backend
function searchGame() {
    const inputName = document.getElementById('game-input').value.trim();

    // validate input field is not empty
    if (!inputName) {
        // alert user
        alert('Invalid input! Please enter a video game title.');
        return;
    }

    // delete any pre-existing data
    deleteGames();
    deleteModalGame();

    // GET request to backend endpoint
    fetch(`/games/search?name=${encodeURIComponent(inputName)}`)
        .then(response => {
            // check response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // parse JSON response
            return response.json();
        })
        .then(data => {
            // handle data
            addGameData(data);
            console.log(data);
        })
        .catch(error => {
            // handle error
            console.log('Problem with fetch:', error);
        });
}
