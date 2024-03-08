package projectGames;

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

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/search")
    public String getGames(@RequestParam String name) {
        // strip whitespaces --> replace with underscores
        String cleanName = name.replaceAll(" ", "_").toLowerCase();
        return gameService.searchGameByName(cleanName);
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

    @DeleteMapping("/delete")
    public void deleteGameContent() {
        gamesList.clear();
    }

}
