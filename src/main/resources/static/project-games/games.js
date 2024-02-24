import { searchGameByName } from './GameService.java';

function searchGame(){
    const inputName = document.getElementById('game-input').value;
    // call function to search game
    searchGameByName(inputName);
}
