package visualizer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/Algorithms/websocket")
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public WebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping("/visualize")
    public ResponseEntity<Void> visualize(@RequestBody GridData data) {
        try {
            // Initialize grid with grid data
            char[][] grid = data.getGrid();

            SpritePosition spritePosition = data.getSpritePosition();

            int startRow = spritePosition.getRow();
            int startCol = spritePosition.getCol();
            System.out.println("Start Row: " + startRow);
            System.out.println("Start Col: " + startCol);

            // Call BFS algorithm
            Algorithms.bfs(grid, spritePosition.getRow(), spritePosition.getCol(), messagingTemplate);

            // Send the updated grid data to the frontend using WebSocket
            messagingTemplate.convertAndSend("/topic/updatedGrid", grid);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Initialize gridList based on input data
    private List<String[]> initializeGrid(List<String[]> inputGrid) {
        // You can add any custom logic here to initialize gridList
        return new ArrayList<>(inputGrid);
    }
}