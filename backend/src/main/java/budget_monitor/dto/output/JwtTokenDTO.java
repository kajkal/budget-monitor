package budget_monitor.dto.output;

public class JwtTokenDTO {

    private String type;
    private String token;


    public JwtTokenDTO(String jwt) {
        type = "Bearer";
        this.token = jwt;
    }

    public String getType() {
        return type;
    }

    public String getToken() {
        return token;
    }

}
