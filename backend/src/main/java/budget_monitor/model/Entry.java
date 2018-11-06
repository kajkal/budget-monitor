package budget_monitor.model;

import org.hibernate.annotations.CreationTimestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.sql.Timestamp;

@Entity
@Table(name = "entries")
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idEntry")
    private Long idEntry;

    @Column(name = "owner")
    private String owner;

    @Column(name = "idCategory")
    private Long idCategory;

    @Column(name = "description")
    private String description;

    @Column(name = "value")
    private Integer value;

    @Column(name = "date")
    private Timestamp date;

    @CreationTimestamp
    @Column(name = "dateOfAddition")
    private Timestamp dateOfAddition;

    @Column(name = "dateOfLastModification")
    private Timestamp dateOfLastModification;

    @Column(name = "photo")
    private byte[] photo;


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

}
