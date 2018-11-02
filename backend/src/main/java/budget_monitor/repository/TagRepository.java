package budget_monitor.repository;

import budget_monitor.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("tagRepository")
public interface TagRepository extends JpaRepository<Tag, Long> {

    List<Tag> findAllByOwner(String owner);

}
