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

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public List<SubEntryFormDTO> getSubEntries() {
        return subEntries;
    }

    public void setSubEntries(List<SubEntryFormDTO> subEntries) {
        this.subEntries = subEntries;
    }

}
