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

function updateGamesDisplay(cleanGames) {
    const gameDisplay = document.getElementById('game-display');

    // clear the existing content in the task display container
    gameDisplay.innerHTML = '';

    // iterate games and create HTML elements for display
    if (cleanGames != null) {
        cleanGames.forEach(game => {
            const gameItem = document.createElement('div');
            gameItem.classList.add('game-item');
            gameItem.innerHTML = `
                <div class="game-container">
                    <div class="game-content">
                        <p class="game-title">${game.title}</p>
                    </div>
                </div>
            `;
            gameDisplay.appendChild(gameItem);
        });
    } // end if
    return;
}

function addGameData(games) {
    // array of response
    const gameArray = [];

    // iterate and retrieve name
    games.forEach(gameData => {
        const { name } = gameData;
        // create game object
        const game = {
            title: name
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

function searchGame(){
    const inputName = document.getElementById('game-input').value.trim();

    // validate input field is not empty
    if (!inputName) {
        // alert user
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
            addGameData(data);
            console.log(data);
        })
        .catch(error => {
            // handle error
            console.log('Problem with fetch:', error);
        });
}
