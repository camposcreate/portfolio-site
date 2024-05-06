package projectGames;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @GetMapping("/auth/callback")
    public String handleAuthCallback() {
        // placeholder to handle OAuth callback (not in use)
        return "authentication callback received";
    }
}
