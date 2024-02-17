package visualizer;

import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.*;

public class Algorithms {

    public static void bfs(char[][] grid, int startRow, int startCol, int endRow, int endCol, SimpMessagingTemplate messagingTemplate) {
        int rows = grid.length; // get row length
        int cols = grid[0].length; // get col length
        boolean[][] visited = new boolean[rows][cols];

        Queue<int[]> queue = new LinkedList<>();
        HashMap<String, int[]> path = new HashMap<>();

        queue.add(new int[]{startRow, startCol}); // add starting node
        visited[startRow][startCol] = true; // mark as visited

        // offsets for neighboring cells
        int[] dr = {-1, 1, 0, 0};
        int[] dc = {0, 0, -1, 1};

        while (!queue.isEmpty()) {
            int[] current = queue.poll(); // current node
            int r = current[0]; // node row
            int c = current[1]; // node col

            // send updated grid data to frontend
            messagingTemplate.convertAndSend("/topic/updatedGrid", convertGridToStringList(grid));

            // exit when end position is reached
            if (r == endRow && c == endCol) {
                break;
            }

            // enqueue unvisited neighboring cells
            for (int i = 0; i < 4; i++) {
                int newRow = r + dr[i];
                int newCol = c + dc[i];

                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols
                        && grid[newRow][newCol] != 'X' && !visited[newRow][newCol]) {
                    queue.add(new int[]{newRow, newCol});
                    path.put(newRow + "," + newCol, current);
                    visited[newRow][newCol] = true;
                    // mark current cell as visited
                    if (grid[newRow][newCol] != 'E') {
                        grid[newRow][newCol] = 'V';
                    }
                }
            }
        } // end while()

        // backtrack shortest path
        ArrayList<int[]> shortestPath = new ArrayList<>();
        int[] currentNode = new int[]{endRow, endCol};
        while (!Arrays.equals(currentNode, new int[]{startRow, startCol})) {
            shortestPath.add(currentNode);
            String key = currentNode[0] + "," + currentNode[1];
            currentNode = path.get(key);
        } // end while ()
        shortestPath.add(new int[]{startRow, startCol});
        Collections.reverse(shortestPath);
        for (int[] node : shortestPath) {
            int nRow = node[0];
            int nCol = node[1];
            if (grid[nRow][nCol] == 'V') {
                grid[nRow][nCol] = 'W';
            }
        }
    } // end bfs()

    // Helper method to convert the grid to List<String>
    public static List<String> convertGridToStringList(char[][] grid) {
        List<String> gridList = new ArrayList<>();
        for (char[] row : grid) {
            gridList.add(new String(row));
        }
        return gridList;
    }

}