package projectGames;

import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import taskmanager.tasks;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/games")
public class GameController {

    private final GameService gameService;
    private List<Games> gamesList = new ArrayList<>();
    private List<ModalGameData> gameModal = new ArrayList<>();
    private List<SimilarGames> similarGames = new ArrayList<>();

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/search")
    public String getGames(@RequestParam String name) {
        // strip whitespaces --> replace with underscores
        String cleanName = name.replaceAll(" ", "_").toLowerCase();
        return gameService.searchGameByName(cleanName);
    }

    @GetMapping("/searchRecentGames")
    public ResponseEntity<String> getRecentlyReleasedGames() {
        String data = gameService.searchRecentGames();
        return new ResponseEntity<>(data, HttpStatus.OK);
    }

    @GetMapping("/searchModalData")
    public String getModalData(@RequestParam String id) {
        return gameService.searchModalData(id);
    }

    @PostMapping("/create")
    public List<Games> createGame(@RequestBody List<Games> incomingGames) {
        // add game objects to arraylist
        for (Games game : incomingGames) {
            // convert unix timestamp to human readable format
            if (game.getReleaseDate() != "") {
                long date = Long.parseLong(game.getReleaseDate());
                SimpleDateFormat nDate = new SimpleDateFormat("MM/dd/yyyy");
                String convertedDate = nDate.format(new java.util.Date(date * 1000));
                game.setReleaseDate(convertedDate);
            }
            // remove decimal from rating
            String truncated = String.valueOf((int) game.getRatings());
            game.setRatings(Double.parseDouble(truncated));
            gamesList.add(game);
        }
        // ResponseEntity.ok("{\"message\": \"Games added successfully\"}");
        // return updated list
        return gamesList;
    }

    @PostMapping("/createModal")
    public List<ModalGameData> createModal(@RequestBody List<ModalGameData> games) {
        for (ModalGameData game : games) {
            gameModal.add(game);
        }
        return gameModal;
    }

    @PostMapping("/createSimilarGame")
    public List<SimilarGames> createSimilarGames(@RequestBody List<SimilarGames> incomingGames) {
        // add game objects to arraylist
        for (SimilarGames game : incomingGames) {
            // convert unix timestamp to human readable format
            if (game.getReleaseDate() != null) {
                long date = Long.parseLong(game.getReleaseDate());
                SimpleDateFormat nDate = new SimpleDateFormat("MM/dd/yyyy");
                String convertedDate = nDate.format(new java.util.Date(date * 1000));
                game.setReleaseDate(convertedDate);
            } else {
                game.setReleaseDate("information unavailable");
            }
            // add games
            similarGames.add(game);
        }
        // return updated list
        return similarGames;
    }

    @DeleteMapping("/delete")
    public void deleteGameContent() {
        gamesList.clear();
    }

    @DeleteMapping("/deleteModal")
    public void deleteModalContent() {
        gameModal.clear();
    }

    @DeleteMapping("/deleteSimilarGames")
    public void deleteSimilarGames() { similarGames.clear(); }

}
