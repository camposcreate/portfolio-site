package projectGames;
import java.util.List;
public class ModalGameData {
    private String summary;
    private List<String> videos;
    private List<String> similarGames;

    public String getSummary(){ return summary; }
    public void setSummary(String summary) { this.summary = summary; }
    public List<String> getVideos() { return videos; }
    public void setVideos(List<String> videos) { this.videos = videos; }
    public List<String> getSimilarGames() { return similarGames; }
    public void setSimilarGames(List<String> similarGames) { this.similarGames = similarGames; }

}
