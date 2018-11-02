package budget_monitor.model;

import java.io.Serializable;
import java.util.Objects;

public class EntryTagPK implements Serializable {
    private static final long serialVersionUID = 1263217540278030266L;

    private Long idEntry;

    private Long idTag;

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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EntryTagPK that = (EntryTagPK) o;
        return Objects.equals(idEntry, that.idEntry) &&
                Objects.equals(idTag, that.idTag);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idEntry, idTag);
    }
}
