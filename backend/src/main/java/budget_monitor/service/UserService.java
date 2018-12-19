package budget_monitor.service;

import budget_monitor.config.jwt.JwtUser;
import budget_monitor.dto.input.RegisterFormDTO;
import budget_monitor.dto.input.UserFormDTO;
import budget_monitor.model.User;
import budget_monitor.repository.UserRepository;
import budget_monitor.service.data_extractor.JwtUserExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service("userService")
public class UserService implements UserDetailsService {

    private JdbcTemplate jdbcTemplate;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(JdbcTemplate jdbcTemplate,
                       @Qualifier("userRepository") UserRepository userRepository,
                       @Lazy @Qualifier("passwordEncoder") PasswordEncoder passwordEncoder) {

        this.jdbcTemplate = jdbcTemplate;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    @Transactional(readOnly = true)
    public JwtUser loadUserByUsername(String username) throws UsernameNotFoundException {

        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        final String sql = "SELECT * FROM usersWithRoles WHERE username = :username";

        Optional<JwtUser> optionalUser = namedParameterJdbcTemplate.query(sql, parameters, new JwtUserExtractor());
        return optionalUser.orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public List<User> findByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username, email);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findById(username);
    }

    public void createUser(RegisterFormDTO registerFormDTO) {
        User userToSave = new User();
        userToSave.setUsername(registerFormDTO.getUsername());
        userToSave.setPassword(passwordEncoder.encode(registerFormDTO.getPassword()));
        userToSave.setEmail(registerFormDTO.getEmail());
        userToSave.setCurrency(registerFormDTO.getCurrency());

        userRepository.save(userToSave);
    }

    public void updateUser(User userToUpdate, UserFormDTO userFormDTO) {
        userToUpdate.setPassword(passwordEncoder.encode(userFormDTO.getPassword()));
        userToUpdate.setCurrency(userFormDTO.getCurrency());

        userRepository.save(userToUpdate);
    }

}
