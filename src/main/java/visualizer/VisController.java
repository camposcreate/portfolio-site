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

import java.util.List;
import java.util.ArrayList;
import java.util.Arrays;

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

            /* Convert List<String> to 2D char array for processing
            char[][] grid = new char[gridList.size()][gridList.get(0).length()];
            for (int i = 0; i < gridList.size(); i++) {
                String row = gridList.get(i);
                for (int j = 0; j < row.length(); j++) {
                    grid[i][j] = row.charAt(j);
                }
            } */
            // Call BFS algorithm
            Algorithms.bfs(grid, spritePosition.getRow(), spritePosition.getCol(), messagingTemplate);

            /* Convert the grid back to a List<String>
            List<String> updatedGridList = new ArrayList<>();
            for (char[] row : grid) {
                updatedGridList.add(new String(row));
            }*/
            // GridData gridResponse = new GridData(updatedGridList); // Create a class for this response if needed
            //gridResponse.setGrid(updatedGridList);

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