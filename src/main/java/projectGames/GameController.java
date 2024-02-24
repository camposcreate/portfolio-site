package projectGames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
    /*
    @GetMapping("/games/search")
    public String getGames(@RequestParam String name) {
        return gameService.searchGameByName(name);
    }
    */

    @GetMapping("/games/search")
    public String getGames() {
        return gameService.searchGameByName("halo");
    }
}
