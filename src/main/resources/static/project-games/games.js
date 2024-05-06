const modal = document.querySelector('#game-window');
let initialGameData;
var similarGameData;
const similarGamesContainer = document.querySelector('.modal-similar-games');

// embed videos to modal
function addVideosToModal(videos) {
    const videoContainer = document.querySelector('.modal-videos');
    videoContainer.innerHTML = '';
    // iterate video IDs and create iframes for each
    videos.forEach(videoId => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('width', '545');
        iframe.setAttribute('height', '300');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}`);
        iframe.setAttribute('title', 'YouTube video player');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
        videoContainer.appendChild(iframe);
    });
}
// if user uses 'esc' key
const EscapePressed = ()  => {
    // clear previous data
    deleteModalGame();
    deleteSimilarGames();
    similarGamesContainer.innerHTML = '';
    similarGameData = [];
    resetSliderPosition();
    document.body.classList.remove('modal-open');
};
const onEscapePress = (event) => event.key === 'Escape' && EscapePressed();
document.addEventListener('keydown', onEscapePress);
// close modal --> clear data
function closeModalClick() {
    modal.close();
    // clear previous data
    deleteModalGame();
    deleteSimilarGames();
    similarGamesContainer.innerHTML = '';
    similarGameData = [];
    resetSliderPosition();
    // re-enable body scroll
    document.body.classList.remove('modal-open');
}

// game click behavior --> open modal w/ data
// modalGameData = array of objects
function openModal(modalGameData) {
    // disable body scroll
    document.body.classList.add('modal-open');

    // set cover/title/genre/release/developer/rating/summary data
    const image = document.querySelector('.modal-image');
    if (initialGameData.cover != null) {
        image.setAttribute('src', initialGameData.cover);
    } else {
        image.setAttribute('src', '../images/spaceman-compressed.jpeg')
    }

    const title = document.querySelector('.modal-title');
    title.textContent = initialGameData.title;

    const genre = document.querySelector('.modal-genre');
    genre.textContent = initialGameData.genres;

    const release = document.querySelector('.modal-release');
    release.textContent = initialGameData.releaseDate;

    const developer = document.querySelector('.modal-developer');
    developer.textContent = initialGameData.developer;

    const rating = document.querySelector('.modal-rating');
    rating.textContent = initialGameData.ratings + '%';

    const platform = document.querySelector('.modal-platform');
    platform.textContent = initialGameData.platform;

    const summary = document.querySelector('.modal-summary');
    summary.textContent = modalGameData[0].summary;

    const parentSlider = document.querySelector('.parent-slider');
    // check video availability
    if (modalGameData[0].videos && modalGameData[0].videos.length > 1) {
        // display and show videos
        addVideosToModal(modalGameData[0].videos);
        parentSlider.style.display = 'block';
        initializeSlider();
    } else {
        parentSlider.style.display = 'none';
    }

    // check similarGameData is an array before using forEach
    if (Array.isArray(similarGameData)) {
        // iterate similar games
        similarGameData.forEach(game => {
            // create elements for each game
            const gameDiv = document.createElement('div');
            gameDiv.classList.add('similar-game');

            const image = document.createElement('img');
            image.classList.add('similar-image');
            image.src = game.coverImage;
            gameDiv.appendChild(image);

            const title = document.createElement('p');
            title.classList.add('similar-title');
            title.textContent = game.coverTitle;
            gameDiv.appendChild(title);

            const release = document.createElement('p');
            release.classList.add('similar-release');
            release.textContent = game.releaseDate;
            gameDiv.appendChild(release);

            // append game div to the container
            similarGamesContainer.appendChild(gameDiv);

        });
    } else {
        // clear previous data
        similarGamesContainer.innerHTML = '';
        console.error('similarGameData is not an array:', similarGameData);
    }
    modal.showModal();
}

// delete existing game modal data
function deleteModalGame() {
    fetch('/games/deleteModal', {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error clearing moodal data: ' + response.status);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// delete existing similar game data
function deleteSimilarGames() {
    fetch('/games/deleteSimilarGames', {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error clearing similar games: ' + response.status);
        }
    })
    .catch(error => {
        console.error(error);
    });
}

// create list of similar game objects
async function createSimilarGameObjects(similar) {
    try {
        // send the POST request to the backend
        await fetch('/games/createSimilarGame', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(similar)
        })
        .then(response => {
            // console.log('Response:', response);
            if (!response.ok) {
                throw new Error('Error adding game: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            // similar games added successfully --> update modal
            similarGameData = data;
        })
        .catch(error => {
            // handle errors if any
            console.error(error);
        });
    } catch (error) {
      console.error('Error handling delete function:', error);
  }
}

// add game objects to list
async function addModalData(modalGameDataArray) {
    try {
        // array of response
        const gameModalArray = [];
        const similarGameArray = [];

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
            // create similarGames each as an object --> process data
            const similarGamesObject = similar_games.map(similarGame => {
                return {
                    id: similarGame.id,
                    coverImage: editCoverImageURL(similarGame.cover.url),
                    coverTitle: similarGame.name,
                    releaseDate: similarGame.first_release_date
                };
            });
            // push object
            gameModalArray.push(gameData);
            similarGameArray.push(similarGamesObject);
        });
        await createSimilarGameObjects(similarGameArray.flat());

        // send the POST request to the backend
        await fetch('/games/createModal', {
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
            // games added successfully --> update modal
            openModal(data);
        })
        .catch(error => {
            // handle errors if any
            console.error(error);
        });
    } catch (error) {
        console.error('Error handling similar games:', error);
    }
}

// search similar games list w/ id
async function searchModalData(gameID) {
    try {
        // GET request to backend endpoint
        await fetch(`/games/searchModalData?id=${encodeURIComponent(gameID)}`)
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
                addModalData(data);
            })
            .catch(error => {
                // handle error
                console.log('Problem with fetch:', error);
            });
    } catch (error) {
      console.error('Error handling searching games:', error);
  }
}

// upon game click --> fetch (by id) additional modal data -->
function fetchModalData(game) {
    return function () {
        initialGameData = game;
        searchModalData(game.id);
    }
}
// modify cover image url for resizing t_logo_med
function editCoverImageURL(url) {
    if (url) {
        const baseURL = "//images.igdb.com/igdb/image/upload/t_cover_big/";
        const parts = url.split('/');
        const extension = parts[parts.length - 1];
        return baseURL + extension;
    } else {
        return url ? url : '../images/spaceman-compressed.jpeg';
    }
}
// delete list
function deleteGames() {
    fetch('/games/delete', {
        method: 'DELETE'
    })
    .then(response => {
        //console.log('Response status:', response.status);
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
                        <img class="game-cover" src="${game.cover}" alt="${game.title}" onerror="this.onerror=null; this.src='../images/spaceman-compressed.jpeg';">
                        <div class="game-details">
                            <p class="game-title">${game.title}</p>
                            <p class="game-developer">${game.developer}</p>
                            <p class="game-genre">${game.genres}</p>
                            <p class="game-release">${game.releaseDate}</p>
                            <p class="game-platform">${game.platform}</p>
                            <p class="game-rating">${game.ratings}%</p>
                        </div>
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
    const gameArray = [];
    // iterate and retrieve name
    games.forEach(gameData => {
        const { id, name, first_release_date, cover, platforms, genres, artworks, rating, involved_companies } = gameData;
        // if parameters are not found --> assign empty values
        const ids = id ? id : "";
        const names = name ? name : "";
        const release = first_release_date ? first_release_date : "";
        const coverURL = cover ? cover.url : "";
        const platformName = platforms ? platforms.map(platform => platform.name) : ["Platform Unavailable"];
        const genreName = genres ? genres.map(genre => genre.name) : ["Genre Unavailable"];
        /*const artworkURL = artworks ? artworks.map(art => art.url) : [];*/
        const ratings = rating ? rating : "";
        const devName = involved_companies && involved_companies.length > 0
            ? involved_companies.map(dev => dev.company.name) : ["Information Unavailable"];

        /* retrieve last artwork image element
        let artworkSelect = 0;
        if (artworkURL > 0) {
            artworkSelect = artworkURL.length - 1;
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
        //console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Error adding game: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        // games added successfully --> update frontend
        updateGamesDisplay(data);
    })
    .catch(error => {
        // handle errors if any
        console.error(error);
    });
}

// skeleton animation --> four empty containers
function skeletonAnimate() {
    const gameDisplay = document.getElementById('game-display');
    gameDisplay.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const gameItem = document.createElement('div');
        gameItem.classList.add('game-item');
        gameItem.innerHTML = `
            <div class="game-container">
                <div class="game-content">
                    <img class="game-cover skeleton">
                    <div class="game-details">
                        <p class="skeleton skeleton-text"></p>
                        <p class="skeleton skeleton-text"></p>
                        <p class="skeleton skeleton-text"></p>
                        <p class="skeleton skeleton-text"></p>
                        <p class="skeleton skeleton-text"></p>
                        <p class="skeleton skeleton-text"></p>
                    </div>
                </div>
            </div>
        `;
        gameDisplay.appendChild(gameItem);
    }
}

// call function initially --> initial splash screen
function recentlyReleasedGames() {
    skeletonAnimate();
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
            addGameData(data);
        })
        .catch(error => {
            console.log('Problem with fetch:', error);
        });
}

function searchTopGames() {
    skeletonAnimate();
    // delete any pre-existing data
    deleteGames();
    deleteModalGame();
    // GET request to backend endpoint
    fetch('/games/searchTopGames')
        .then(response => {
            // check response
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            // parse JSON response
            return response.json();
        })
        .then(data => {
            addGameData(data);
        })
        .catch(error => {
            console.log('Problem with fetch:', error);
        });
}

// send user input to backend
function searchGame() {
    skeletonAnimate();
    const inputName = document.getElementById('game-input').value.trim();
    // validate input field is not empty
    if (!inputName) {
        alert('Invalid input! Please enter a video game title.');
        return;
    }
    // delete any pre-existing data
    deleteGames();
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
            document.getElementById('game-input').value = "";
            addGameData(data);
        })
        .catch(error => {
            // handle error
            console.log('Problem with fetch:', error);
        });
}
recentlyReleasedGames();