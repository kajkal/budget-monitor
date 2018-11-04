package budget_monitor.dto.input;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.PastOrPresent;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

public class EntryFormDTO {

    @PastOrPresent
    private Timestamp date;

    @Digits(integer = 7, fraction = 0)
    private Integer value;

    @NotBlank
    @Size(min = 3, max = 3)
    private String currency;

    @NotBlank
    private String description;


    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
