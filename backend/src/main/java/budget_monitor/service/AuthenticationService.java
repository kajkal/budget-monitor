package budget_monitor.service;

import budget_monitor.config.jwt.JwtProvider;
import budget_monitor.dto.output.JwtTokenDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service("authenticationService")
public class AuthenticationService {

    private AuthenticationManager authenticationManager;
    private JwtProvider jwtProvider;

    @Autowired
    public AuthenticationService(@Qualifier("authenticationManager") AuthenticationManager authenticationManager,
                                 @Qualifier("jwtProvider") JwtProvider jwtProvider) {

        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
    }


    public JwtTokenDTO login(String username, String password) throws AuthenticationException {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );

        String jwt = jwtProvider.generateJwtToken(authentication);
        return new JwtTokenDTO(jwt);
    }

}
