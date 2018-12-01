package budget_monitor.dto.input;

import org.springframework.lang.Nullable;

import javax.validation.constraints.NotBlank;

public class CategoryFormDTO {

    @Nullable
    private Long idSuperCategory = null;

    @NotBlank
    private String name;

    // TODO default color = null
    @Nullable
    private Integer color = 0;


    public Long getIdSuperCategory() {
        return idSuperCategory;
    }

    public String getName() {
        return name;
    }

    public Integer getColor() {
        return color;
    }

}
