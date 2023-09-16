package visualizer;

public class GridData {
    private char[][] grid;
    private SpritePosition spritePosition;

    public GridData() {}

    public GridData(char[][] grid) {
        this.grid = grid;
    }

    public char[][] getGrid() {
        return grid;
    }

    public void setGrid(char[][] grid) {
        this.grid = grid;
    }

    public SpritePosition getSpritePosition() {
        return spritePosition;
    }

    public void setSpritePosition(SpritePosition spritePosition) {
        this.spritePosition = spritePosition;
    }
}
