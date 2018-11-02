package budget_monitor.repository;

import budget_monitor.model.EntryTag;
import budget_monitor.model.EntryTagPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("entryTagRepository")
public interface EntryTagRepository extends JpaRepository<EntryTag, EntryTagPK> {

    List<EntryTag> findAllByIdEntry(Long idEntry);

}