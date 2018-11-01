package budget_monitor.service;

import budget_monitor.model.User;
import budget_monitor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("userService")
public class UserService {

    private UserRepository userRepository;

    public UserService(@Qualifier("userRepository") UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }
}
