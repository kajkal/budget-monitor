package budget_monitor.dto;

import budget_monitor.model.Entry;

import java.sql.Timestamp;
import java.util.Set;
import java.util.stream.Collectors;

public class EntryDTO {

    private Long idEntry;
    private String username;
    private Timestamp date;
    private Timestamp added;
    private Integer value;
    private String currency;
    private String description;
    private byte[] photo;
    private Set<TagDTO> tags;

    public EntryDTO(Entry entry) {
        this.idEntry = entry.getIdEntry();
        this.username = entry.getUsername();
        this.date = entry.getDate();
        this.added = entry.getAdded();
        this.value = entry.getValue();
        this.currency = entry.getCurrency();
        this.description = entry.getDescription();
        this.photo = entry.getPhoto();
        this.tags = entry.getTags().stream().map(TagDTO::new).collect(Collectors.toSet());
    }

    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
