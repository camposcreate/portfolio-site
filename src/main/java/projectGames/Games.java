package projectGames;

import java.util.List;

public class Games {
    private String id;
    private String title;
    private String releaseDate;
    private String cover;
    private List<String> platform;
    private List<String> genres;
    private List<String> artwork;
    private double rating;
    private int artNumber;
    private List<String> developer;

    // constructor
    public Games(String id, String title, String releaseDate, String cover,
                 List<String> platform, List<String> genres, List<String> artwork,
                 double rating, List<String> developer) {
        this.id = id;
        this.title = title;
        this.releaseDate = releaseDate;
        this.cover = cover;
        this.platform = platform;
        this.genres = genres;
        this.artwork = artwork;
        this.rating = rating;
        this.developer = developer;
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
    public void setTitle(String title) { this.title = title;}
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
    public List<String> getPlatform() { return platform; }
    public void setPlatform(List<String> platform) { this.platform = platform; }
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
    public double getRatings() { return rating; }
    public void setRatings(double rating) {
        this.rating = rating;
    }
    public int getArtNumber() { return artNumber; }
    public void setArtNumber(int artNumber) { this.artNumber = artNumber; }
    public List<String> getDeveloper() { return developer; }
    public void setDeveloper(List<String> developer) { this.developer = developer; }
}
