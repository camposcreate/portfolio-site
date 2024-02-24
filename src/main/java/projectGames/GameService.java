package projectGames;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class GameService {
    @Value("${igdb.api.url}")
    private String igdbApiUrl;

    @Value("${igdb.client.id}")
    private String igdbClientId;

    @Value("${igdb.access.token}")
    private String igdbAccessToken;

    private final RestTemplate restTemplate;

    public GameService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String searchGameByName(String gameName) {
        String endpoint = igdbApiUrl + "/games";
        String authorizationHeader = "Bearer " + igdbAccessToken;

        // Set up the headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Client-ID", igdbClientId);
        headers.set("Authorization", authorizationHeader);

        // query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(endpoint)
                .queryParam("search", gameName).queryParam("fields", "name");

        // Make the API request
        ResponseEntity<String> response = restTemplate.exchange(
                builder.toUriString(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        // Return the response body
        return response.getBody();
    }
}

