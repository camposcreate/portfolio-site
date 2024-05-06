package projectGames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class GameService {
    // fetch url
    @Value("${igdb.api.url}")
    private String igdbApiUrl;
    // fetch client id
    @Value("${igdb.client.id}")
    private String igdbClientId;
    // fetch access token
    @Value("${igdb.access.token}")
    private String igdbAccessToken;

    private final RestTemplate restTemplate;

    public GameService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String searchGameByName(String gameName) {
        String endpoint = igdbApiUrl + "/games";
        String authorizationHeader = "Bearer " + igdbAccessToken;

        // headers set up
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", authorizationHeader);

        // query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(endpoint)
                .queryParam("search", gameName.trim())
                .queryParam("fields", "id,name,first_release_date,cover.url,platforms.name,genres.name,artworks.url,rating,involved_companies.company.name")
                .queryParam("limit", 50)
                .queryParam("filter[category][eq]", 0)
                .queryParam("filter[rating][gte]", 1);

        // System.out.println(builder.toUriString());

        // API request
        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        // return response
        return response.getBody();
    }

    public String searchRecentGames() {
        String endpoint = igdbApiUrl + "/games";
        String authorizationHeader = "Bearer " + igdbAccessToken;

        // headers set up
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", authorizationHeader);

        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        long timestamp = startOfMonth.atStartOfDay().toEpochSecond(ZoneOffset.UTC);
        long timeStampMillis = timestamp * 1000; // seconds to milliseconds

        // query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(endpoint)
                .queryParam("fields", "id,name,first_release_date,cover.url,platforms.name,genres.name,artworks.url,rating,involved_companies.company.name")
                .queryParam("limit", 50)
                .queryParam("order", "first_release_date:desc") // sort by release date: descending
                .queryParam("filter[category][eq]", 0) // exclude expansions and dlc
                .queryParam("filter[rating][gte]", 1) // rating >= 1
                .queryParam("filter[first_release_date][gt]", timeStampMillis);

        //System.out.println(builder.toUriString());
        // API request
        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        // return response
        return response.getBody();
    }

    public String searchTopGames() {
        String endpoint = igdbApiUrl + "/games";
        String authorizationHeader = "Bearer " + igdbAccessToken;

        // headers set up
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", authorizationHeader);

        int currentYear = LocalDate.now().getYear();
        LocalDateTime startOfYear = LocalDate.of(currentYear, 1, 1).atStartOfDay();
        long timestamp = startOfYear.toEpochSecond(ZoneOffset.UTC);
        long endTimestamp = LocalDateTime.now().toEpochSecond(ZoneOffset.UTC);

        // query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(endpoint)
                .queryParam("fields", "id,name,first_release_date,cover.url,platforms.name,genres.name,artworks.url,rating,involved_companies.company.name")
                .queryParam("limit", 50)
                .queryParam("order", "rating:desc") // sort by release date: descending
                .queryParam("filter[category][eq]", 0) // exclude expansions and dlc
                .queryParam("filter[rating][gte]", 1) // rating >= 1
                .queryParam("filter[first_release_date][gte]", timestamp)
                .queryParam("filter[first_release_date][lte]", endTimestamp);
        // System.out.println(builder.toUriString());
        // API request
        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);
        // return response
        return response.getBody();
    }

    // search data for modal (by name)
    public String searchModalData(String id) {
        String endpoint = igdbApiUrl + "/games/";
        String authorizationHeader = "Bearer " + igdbAccessToken;

        // headers set up
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", authorizationHeader);

        // query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(endpoint + id + "?")
                .queryParam("fields", "summary,videos.video_id,similar_games.name,similar_games.first_release_date,similar_games.cover.url");

        // System.out.println(builder.toUriString());

        // API request
        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        // return response
        return response.getBody();
    }
}

