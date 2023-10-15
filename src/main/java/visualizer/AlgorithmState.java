package visualizer;

import java.util.List;
public class AlgorithmState {
    private List<int[]> visitedCells;
    private List<String> updatedGridList;

    public AlgorithmState(List<int[]> visitedCells, List<String> updatedGridList) {
        this.visitedCells = visitedCells;
        this.updatedGridList = updatedGridList;
    }

    public List<int[]> getVisitedCells() {
        return visitedCells;
    }

    public List<String> getUpdatedGridList() {
        return updatedGridList;
    }
}
