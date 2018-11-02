package budget_monitor.dto.input;

public class UserSessionDTO {

    private String username;

    private String token;

    private boolean authenticated;

    public UserSessionDTO(String username, String token, boolean authenticated) {
        this.username = username;
        this.token = token;
        this.authenticated = authenticated;
    }

    public String getUsername() { return username; }

    public String getToken() { return token; }

    public boolean isAuthenticated() { return authenticated; }
}
