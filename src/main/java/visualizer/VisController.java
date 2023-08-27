package visualizer;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
@RequestMapping("/Algorithms")
public class VisController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/visualize")
    public char[][] visualize(@RequestBody String gridData) {
        System.out.println("Received Grid Data: " + gridData); // Add this line for debugging
        try {
            GridData data = objectMapper.readValue(gridData, GridData.class);

            List<String> gridList = data.getGrid();
            SpritePosition spritePosition = data.getSpritePosition();

            // Convert List<String> to 2D char array for processing
            char[][] grid = new char[gridList.size()][gridList.get(0).length()];
            for (int i = 0; i < gridList.size(); i++) {
                String row = gridList.get(i);
                for (int j = 0; j < row.length(); j++) {
                    grid[i][j] = row.charAt(j);
                }
            }

            // Default value if spritePosition not present
            int startRow = -1;
            int startCol = -1;
            if (spritePosition != null) {
                startRow = spritePosition.getRow();
                startCol = spritePosition.getCol();
            }

            // Call BFS algorithm or other visualization logic here
            Algorithms.bfs(grid, startRow, startCol);

            // Return the updated grid data
            return grid;
        } catch (Exception e) {
            e.printStackTrace();
            return null; // Return null in case of an error
        }
    }
}
