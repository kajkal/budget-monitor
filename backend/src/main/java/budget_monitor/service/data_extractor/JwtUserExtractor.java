package budget_monitor.service.data_extractor;

import budget_monitor.config.jwt.JwtUser;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class JwtUserExtractor implements ResultSetExtractor<Optional<JwtUser>> {

    @Override
    public Optional<JwtUser> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Optional<JwtUser> userDetails = Optional.empty();
        Set<GrantedAuthority> authorities = new HashSet<>();

        while (rs.next()) {

            if (!userDetails.isPresent()) {
                JwtUser user = new JwtUser();
                user.setUsername(rs.getString("username"));
                user.setPassword(rs.getString("password"));
                user.setEmail(rs.getString("email"));
                user.setCurrency(rs.getString("currency"));
                userDetails = Optional.of(user);
            }

            authorities.add(new SimpleGrantedAuthority(rs.getString("rolename")));
        }

        userDetails.ifPresent(user -> user.setAuthorities(authorities));
        return userDetails;
    }

}
