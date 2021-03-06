package budget_monitor.dto.input;

import org.springframework.lang.Nullable;

import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class SubEntryFormDTO {

    @Nullable
    private Long idCategory = null;

    @NotBlank
    private String description;

    @NotNull
    @Digits(integer = 9, fraction = 0)
    private Integer value;


    public Long getIdCategory() {
        return idCategory;
    }

    public String getDescription() {
        return description;
    }

    public Integer getValue() {
        return value;
    }

}
