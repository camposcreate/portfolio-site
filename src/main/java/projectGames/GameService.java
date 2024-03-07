package projectGames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

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
                .queryParam("fields", "id,name,first_release_date,cover.url,genres.name,rating")
                .queryParam("limit", 100)
                .queryParam("filter[category][eq]", 0)
                .queryParam("filter[rating][gte]", 1);

        System.out.println(builder.toUriString());

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

