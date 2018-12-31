package budget_monitor.dto.output;

import budget_monitor.model.Entry;

import java.util.ArrayList;
import java.util.List;

public class EntryDTO {

    private Long idEntry;
    private Long idCategory;
    private String description;
    private Integer value;
    private Long date;
    private Long dateOfAddition;
    private Long dateOfLastModification;
    private byte[] photo;
    private List<SubEntryDTO> subEntries;


    public EntryDTO() {
    }

    public EntryDTO(Entry entry) {
        idEntry = entry.getIdEntry();
        idCategory = entry.getIdCategory();
        description = entry.getDescription();
        value = entry.getValue();
        date = entry.getDate().getTime();
        dateOfAddition = entry.getDateOfAddition().getTime();
        dateOfLastModification = entry.getDateOfLastModification().getTime();
        photo = entry.getPhoto();
        subEntries = new ArrayList<>();
    }

    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
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

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) {
        this.date = date;
    }

    public Long getDateOfAddition() {
        return dateOfAddition;
    }

    public void setDateOfAddition(Long dateOfAddition) {
        this.dateOfAddition = dateOfAddition;
    }

    public Long getDateOfLastModification() {
        return dateOfLastModification;
    }

    public void setDateOfLastModification(Long dateOfLastModification) {
        this.dateOfLastModification = dateOfLastModification;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public List<SubEntryDTO> getSubEntries() {
        return subEntries;
    }

    public void setSubEntries(List<SubEntryDTO> subEntries) {
        this.subEntries = subEntries;
    }

}
