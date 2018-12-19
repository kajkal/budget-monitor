package budget_monitor.repository;

import budget_monitor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository("userRepository")
public interface UserRepository extends JpaRepository<User, String> {
    
    List<User> findByUsernameOrEmail(String username, String email);
    
}
