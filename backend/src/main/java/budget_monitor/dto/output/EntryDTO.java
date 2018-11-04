package budget_monitor.dto.output;

import budget_monitor.model.Entry;

import java.sql.Timestamp;
import java.util.HashSet;
import java.util.Set;

public class EntryDTO {

    private Long idEntry;
    private Timestamp date;
    private Timestamp added;
    private Integer value;
    private String currency;
    private String description;
    private byte[] photo;
    private Set<TagDTO> tags;


    public EntryDTO() {
    }

    public EntryDTO(Entry entry) {
        this.idEntry = entry.getIdEntry();
        this.date = entry.getDate();
        this.added = entry.getAdded();
        this.value = entry.getValue();
        this.currency = entry.getCurrency();
        this.description = entry.getDescription();
        this.photo = entry.getPhoto();
        this.tags = new HashSet<>();
    }

    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
    }

    public Timestamp getDate() {
        return date;
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public Timestamp getAdded() {
        return added;
    }

    public void setAdded(Timestamp added) {
        this.added = added;
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

    public byte[] getPhoto() {
        return photo;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

}
