package projectGames;

public class Rating {
    private String id;
    private int score;

    public Rating(String id, int score) {
        this.id = id;
        this.score = score;
    }
    private String getId(){
        return id;
    }
    private void setId(String id) {
        this.id = id;
    }
    private int getScore() {
        return score;
    }
    private void setScore(int score) {
        this.score = score;
    }
}
