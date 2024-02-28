package projectGames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import taskmanager.tasks;

import java.util.ArrayList;
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
        return gameService.searchGameByName(name);
    }

    @PostMapping("/create")
    public List<Games> createGame(@RequestBody List<Games> incomingGames) {
        // add game objects to arraylist
        for (Games game : incomingGames) {
            gamesList.add(game);
        }
        ResponseEntity.ok("{\"message\": \"Games added successfully\"}");
        // return updated list
        return gamesList;
    }

}
