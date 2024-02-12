package visualizer;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Queue;

public class Algorithms {

    public static void bfs(char[][] grid, int startRow, int startCol, int endRow, int endCol, SimpMessagingTemplate messagingTemplate) {
        System.out.println("Starting BFS algorithm...");
        int rows = grid.length; // get row length
        int cols = grid[0].length; // get col length
        boolean[][] visited = new boolean[rows][cols];

        Queue<int[]> queue = new LinkedList<>();
        queue.add(new int[]{startRow, startCol}); // add starting node
        visited[startRow][startCol] = true; // mark as visited
        //grid[startRow][startCol] = 'S'; // mark starting position
        //grid[endRow][endCol] = 'E'; // mark ending position

        // Offsets for neighboring cells
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        while (!queue.isEmpty()) {
            int[] current = queue.poll(); // current node
            int r = current[0]; // node row
            int c = current[1]; // node col

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
                    // Mark current cell as visited
                    grid[newRow][newCol] = 'V';
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