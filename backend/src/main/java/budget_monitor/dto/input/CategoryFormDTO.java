package budget_monitor.dto.input;

import org.springframework.lang.Nullable;

import javax.validation.constraints.NotBlank;

public class CategoryFormDTO {

    @Nullable
    private Long idSuperCategory = null;

    @NotBlank
    private String name;


    public Long getIdSuperCategory() {
        return idSuperCategory;
    }

    public String getName() {
        return name;
    }

}
