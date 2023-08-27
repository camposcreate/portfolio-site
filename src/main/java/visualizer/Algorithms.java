package visualizer;

import java.util.LinkedList;
import java.util.Queue;

public class Algorithms {

    public static void bfs(char[][] grid, int startRow, int startCol) {
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

            // Perform your BFS visualization logic here
            // For example, you can update the grid cell color to show traversal
            grid[r][c] = 'V'; // 'V' for visited

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
}

