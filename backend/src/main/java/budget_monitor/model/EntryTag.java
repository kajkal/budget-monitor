package budget_monitor.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

@Entity
@Table(name = "entrytags")
@IdClass(value = EntryTagPK.class)
public class EntryTag {

    @Id
    @Column(name = "idEntry")
    private Long idEntry;

    @Id
    @Column(name = "idTag")
    private Long idTag;

//    @ManyToOne
//    @JoinColumn(name = "idEntry", referencedColumnName = "idEntry", insertable=false, updatable=false)
//    private Entry entry;
//
//    @ManyToOne
//    @JoinColumn(name = "idTag", referencedColumnName = "idTag", insertable=false, updatable=false)
//    private Tag tag;

    public Long getIdEntry() {
        return idEntry;
    }

    public void setIdEntry(Long idEntry) {
        this.idEntry = idEntry;
    }

    public Long getIdTag() {
        return idTag;
    }

    public void setIdTag(Long idTag) {
        this.idTag = idTag;
    }

//    public Entry getEntry() {
//        return entry;
//    }
//
//    public void setEntry(Entry entry) {
//        this.entry = entry;
//    }
//
//    public Tag getTag() {
//        return tag;
//    }
//
//    public void setTag(Tag tag) {
//        this.tag = tag;
//    }


}
