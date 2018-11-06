package budget_monitor.model;

import java.io.Serializable;
import java.util.Objects;

public class SubEntryPK implements Serializable {
    private static final long serialVersionUID = 8377293733082559967L;

    private Long idEntry;
    private Long idSubEntry;


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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        SubEntryPK that = (SubEntryPK) o;
        return Objects.equals(idEntry, that.idEntry) &&
                Objects.equals(idSubEntry, that.idSubEntry);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEntry, idSubEntry);
    }

}
