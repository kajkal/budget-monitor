package budget_monitor.repository;

import budget_monitor.model.Entry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("entryRepository")
public interface EntryRepository extends JpaRepository<Entry, Long> {

    List<Entry> findAllByUsername(String username);

}
