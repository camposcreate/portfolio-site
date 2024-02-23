package projectGames;

import java.util.List;

public class Games {
    private String id;
    private String title;
    private String releaseDate;
    private String cover;
    private List<String> genres;
    private List<String> artwork;
    private List<Rating> ratings;

    // constructor
    public Games(String id, String title, String releaseDate, String cover,
                    List<String> genres, List<String> artwork, List<Rating> ratings) {
        this.id = id;
        this.title = title;
        this.releaseDate = releaseDate;
        this.cover = cover;
        this.genres = genres;
        this.artwork = artwork;
        this.ratings = ratings;
    }
    public String getId(){
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public String getReleaseDate() {
        return releaseDate;
    }
    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }
    public String getCover() {
        return cover;
    }
    public void setCover(String cover) {
        this.cover = cover;
    }
    public List<String> getGenres() {
        return genres;
    }
    public void setGenres(List<String> genres) {
        this.genres = genres;
    }
    public List<String> getArtwork() {
        return artwork;
    }
    public void setArtwork(List<String> artwork) {
        this.artwork = artwork;
    }
    public List<Rating> getRatings() {
        return ratings;
    }
    public void setRatings (List<Rating> ratings) {
        this.ratings = ratings;
    }
}
