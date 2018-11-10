package budget_monitor.dto.output;

import budget_monitor.model.SubEntry;

public class SubEntryDTO {

    private Long idSubEntry;
    private Long idCategory;
    private String description;
    private Integer value;


    public SubEntryDTO() {
    }

    public SubEntryDTO(SubEntry subEntry) {
        idSubEntry = subEntry.getIdSubEntry();
        idCategory = subEntry.getIdCategory();
        description = subEntry.getDescription();
        value = subEntry.getValue();
    }

    public Long getIdSubEntry() {
        return idSubEntry;
    }

    public void setIdSubEntry(Long idSubEntry) {
        this.idSubEntry = idSubEntry;
    }

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

}
