package visualizer;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Algorithms {

    public static void bfs(char[][] grid, int startRow, int startCol, SimpMessagingTemplate messagingTemplate) {
        int rows = grid.length;
        int cols = grid[0].length;
        boolean[][] visited = new boolean[rows][cols];

        Queue<int[]> queue = new LinkedList<>();
        queue.add(new int[]{startRow, startCol});
        visited[startRow][startCol] = true;

        int[] dr = {-1, 1, 0, 0}; // Offsets for neighboring cells
        int[] dc = {0, 0, -1, 1};

        while (!queue.isEmpty()) {
            int[] current = queue.poll();
            int r = current[0];
            int c = current[1];

            // Implement your BFS algorithm logic here
            // You can modify the grid and send updates to the frontend using messagingTemplate

            // Mark the current cell as visited
            grid[r][c] = 'V';

            // Send updated grid data to frontend
            messagingTemplate.convertAndSend("/topic/updatedGrid", convertGridToStringList(grid));

            // Enqueue unvisited neighboring cells
            for (int i = 0; i < 4; i++) {
                int newRow = r + dr[i];
                int newCol = c + dc[i];

                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols
                        && grid[newRow][newCol] == 'O' && !visited[newRow][newCol]) {
                    queue.add(new int[]{newRow, newCol});
                    visited[newRow][newCol] = true;
                }
            }
        }
    }

    // Helper method to convert the grid to List<String>
    public static List<String> convertGridToStringList(char[][] grid) {
        List<String> gridList = new ArrayList<>();
        for (char[] row : grid) {
            gridList.add(new String(row));
        }
        return gridList;
    }

}
