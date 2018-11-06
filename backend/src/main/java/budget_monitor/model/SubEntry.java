package budget_monitor.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "subEntries")
@IdClass(value = SubEntryPK.class)
public class SubEntry {

    @Id
    @Column(name = "idEntry")
    private Long idEntry;

    @Id
    @Column(name = "idSubEntry")
    private Long idSubEntry;

    @Column(name = "idCategory")
    private Long idCategory;

    @Column(name = "description")
    private String description;

    @Column(name = "value")
    private Integer value;


    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
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
