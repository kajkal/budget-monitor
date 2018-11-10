package budget_monitor.repository;

import budget_monitor.model.SubEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository("subEntryRepository")
public interface SubEntryRepository extends JpaRepository<SubEntry, Long> {

}
