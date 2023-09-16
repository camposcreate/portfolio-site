package visualizer;

import java.util.List;

public class GridResponse {
    private char[][] grid;

    public GridResponse(char[][] grid) {
        this.grid = grid;
    }

    public char[][] getGrid() {
        return grid;
    }

    public void setGrid (char[][] grid) {
        this.grid = grid;
    }
}
