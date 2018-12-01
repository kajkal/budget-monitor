package budget_monitor.service;

import budget_monitor.dto.input.RegisterFormDTO;
import budget_monitor.dto.input.UserFormDTO;
import budget_monitor.model.User;
import budget_monitor.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service("userService")
public class UserService implements UserDetailsService {

    private EntityManager entityManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(EntityManager entityManager,
                       @Qualifier("userRepository") UserRepository userRepository,
                       @Lazy @Qualifier("passwordEncoder") PasswordEncoder passwordEncoder) {

        this.entityManager = entityManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = this.userRepository.findById(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found"));

        // TODO change string to list of strings
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(user.getRole()));

//        Set<GrantedAuthority> grantedAuthorities = user.getRoles()
//                .stream()
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toSet());

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .authorities(grantedAuthorities)
                .build();
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findById(username);
    }

    public int checkIfUserWithUsernameOrEmailExists(String username, String email) {
        // return: 1 when usernema is taken, 2 when email is taken, 0 when username and email are available
        return (int) entityManager
                .createNativeQuery("SELECT checkIfUserWithUsernameOrEmailExists(:username, :email)")
                .setParameter("username", username)
                .setParameter("email", email)
                .getSingleResult();
    }

    public void createUser(RegisterFormDTO registerFormDTO) {
        User userToSave = new User();
        userToSave.setUsername(registerFormDTO.getUsername());
        userToSave.setPassword(passwordEncoder.encode(registerFormDTO.getPassword()));
        userToSave.setEmail(registerFormDTO.getEmail());
        userToSave.setCurrency(registerFormDTO.getCurrency());
        userToSave.setRole("USER");

        userRepository.save(userToSave);
    }

    public void updateUser(User userToUpdate, UserFormDTO userFormDTO) {
        userToUpdate.setPassword(passwordEncoder.encode(userFormDTO.getPassword()));
        userToUpdate.setCurrency(userFormDTO.getCurrency());

        userRepository.save(userToUpdate);
    }

}
