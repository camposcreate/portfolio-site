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
            // Initialize gridList with your grid data
            List<String> gridList = initializeGrid(data.getGrid());

            SpritePosition spritePosition = data.getSpritePosition();

            // Convert List<String> to 2D char array for processing
            char[][] grid = new char[gridList.size()][gridList.get(0).length()];
            for (int i = 0; i < gridList.size(); i++) {
                String row = gridList.get(i);
                for (int j = 0; j < row.length(); j++) {
                    grid[i][j] = row.charAt(j);
                }
            }

            // Call BFS algorithm
            Algorithms.bfs(grid, spritePosition.getRow(), spritePosition.getCol(), messagingTemplate);

            // Convert the grid back to a List<String>
            List<String> updatedGridList = new ArrayList<>();
            for (char[] row : grid) {
                updatedGridList.add(new String(row));
            }

            // Send the updated grid data to the frontend using WebSocket
            messagingTemplate.convertAndSend("/topic/updatedGrid", updatedGridList);

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Initialize gridList based on input data
    private List<String> initializeGrid(List<String> inputGrid) {
        // You can add any custom logic here to initialize gridList
        return new ArrayList<>(inputGrid);
    }
}
