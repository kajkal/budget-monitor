package budget_monitor.dto.output;

public class JwtTokenDTO {

    private String token;


    public JwtTokenDTO(String jwt) {
        this.token = jwt;
    }

    public String getToken() {
        return token;
    }

}
