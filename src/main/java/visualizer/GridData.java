package visualizer;

import java.util.List;

public class GridData {
    private List<String> grid;
    private SpritePosition spritePosition;

    public GridData() {

    }

    public GridData(List<String> grid) {
        this.grid = grid;
    }

    public List<String> getGrid() {
        return grid;
    }

    public void setGrid(List<String> grid) {
        this.grid = grid;
    }

    public SpritePosition getSpritePosition() {
        return spritePosition;
    }

    public void setSpritePosition(SpritePosition spritePosition) {
        this.spritePosition = spritePosition;
    }
}
