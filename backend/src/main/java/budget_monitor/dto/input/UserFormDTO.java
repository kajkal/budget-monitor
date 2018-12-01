package budget_monitor.dto.input;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class UserFormDTO {

    @NotNull
    @Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\\s).{6,30}")
    private String password;

    @NotNull
    @Pattern(regexp = "^\\w{3}$")
    private String currency;


    public String getPassword() {
        return password;
    }

    public String getCurrency() {
        return currency;
    }

}
