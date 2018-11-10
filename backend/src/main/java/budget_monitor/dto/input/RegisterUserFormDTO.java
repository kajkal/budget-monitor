package budget_monitor.dto.input;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

public class RegisterUserFormDTO {

    @NotNull
    @Pattern(regexp = "^([a-zA-Z0-9]+[-_. ]?)*[a-zA-Z0-9]+$")
    @Size(min = 3, max = 30)
    private String username;

    @NotNull
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{6,30}")
    private String password;

    @NotNull
    @Pattern(regexp = "^[\\w\\d._%+-]+@[\\w\\d.-]+\\.[\\w]{2,6}$")
    private String email;

    @NotNull
    @Pattern(regexp = "^\\w{3}$")
    private String currency;


    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

}
