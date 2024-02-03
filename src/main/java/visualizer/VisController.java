package visualizer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/Algorithms")
public class VisController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public VisController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/visualize")
    public ResponseEntity<String> visualize(@RequestBody GridData data) {
        try {
            // Retrieve the grid data from the 'data' object
            char[][] grid = data.getGrid();
            SpritePosition spritePosition = data.getSpritePosition();
            EndSpritePosition endSpritePosition = data.getEndSpritePosition();

            // Call BFS algorithm
            Algorithms.bfs(grid, spritePosition.getRow(), spritePosition.getCol(), messagingTemplate);

            // Convert the updated grid data back to JSON
            String jsonData = new ObjectMapper().writeValueAsString(grid);

            // Set the 'Content-Type' header to indicate JSON content
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            return ResponseEntity.ok().headers(headers).body(jsonData);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}