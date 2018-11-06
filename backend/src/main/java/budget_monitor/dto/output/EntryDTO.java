package budget_monitor.dto.output;

import budget_monitor.model.SubEntry;

import java.sql.Timestamp;
import java.util.List;

public class EntryDTO {

    private Long idEntry;
    private String owner;
    private Long idCategory;
    private String description;
    private Integer value;
    private Timestamp date;
    private Timestamp dateOfAddition;
    private Timestamp dateOfLastModification;
    private byte[] photo;
    private List<SubEntry> subEntries;


    public EntryDTO() {
    }

//    public EntryDTO(Entry entry) {
//        this.idEntry = entry.getIdEntry();
//        this.date = entry.getDate();
//        this.added = entry.getAdded();
//        this.value = entry.getValue();
//        this.currency = entry.getCurrency();
//        this.description = entry.getDescription();
//        this.photo = entry.getPhoto();
//        this.tags = new HashSet<>();
//    }

    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
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

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Timestamp getDateOfAddition() {
        return dateOfAddition;
    }

    public void setDateOfAddition(Timestamp dateOfAddition) {
        this.dateOfAddition = dateOfAddition;
    }

    public Timestamp getDateOfLastModification() {
        return dateOfLastModification;
    }

    public void setDateOfLastModification(Timestamp dateOfLastModification) {
        this.dateOfLastModification = dateOfLastModification;
    }

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public List<SubEntry> getSubEntries() {
        return subEntries;
    }

    public void setSubEntries(List<SubEntry> subEntries) {
        this.subEntries = subEntries;
    }

}
