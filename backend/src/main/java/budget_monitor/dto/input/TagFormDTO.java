package budget_monitor.dto.input;

import org.springframework.lang.Nullable;

import javax.validation.constraints.NotBlank;

public class TagFormDTO {

    @NotBlank
    private String name;

    @Nullable
    private Integer color = 0;


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getColor() {
        return color;
    }

    public void setColor(Integer color) {
        this.color = color;
    }

}
