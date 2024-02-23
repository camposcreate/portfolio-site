package projectGames;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/games")
public class GameController {
    @GetMapping
    public ResponseEntity<String> getAllGames() {
        return new ResponseEntity<String>("All Games!", HttpStatus.OK);
    }
}
