package budget_monitor.dto.input;

import org.springframework.lang.Nullable;

import javax.validation.Valid;
import javax.validation.constraints.Digits;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.sql.Timestamp;
import java.util.List;

public class EntryFormDTO {

    @Nullable
    private Long idCategory = null;

    @NotBlank
    private String description;

    @NotNull
    @Digits(integer = 9, fraction = 0)
    private Integer value;

    @NotNull
    private Timestamp date;

    @NotNull
    @Valid
    private List<SubEntryFormDTO> subEntries;


    public Long getIdCategory() {
        return idCategory;
    }

    public String getDescription() {
        return description;
    }

    public Integer getValue() {
        return value;
    }

    public Timestamp getDate() {
        return date;
    }

    public List<SubEntryFormDTO> getSubEntries() {
        return subEntries;
    }

}
