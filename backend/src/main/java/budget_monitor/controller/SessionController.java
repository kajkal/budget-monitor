package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.dto.input.CredentialsFormDTO;
import budget_monitor.dto.input.UserSessionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
@RequestMapping("/app/session")
public class SessionController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private AuthenticationManager authenticationManager;

    @Autowired
    public SessionController(@Qualifier("authenticationManager") AuthenticationManager authenticationManager) {

        this.authenticationManager = authenticationManager;
    }


    @LogExecutionTime
    @RequestMapping(method = POST)
    public UserSessionDTO login(@RequestBody CredentialsFormDTO credentialsFormDTO, HttpSession httpSession) {
        log.info("user: '" + credentialsFormDTO.getUsername() + "' logged in");
        Authentication authentication = new UsernamePasswordAuthenticationToken(credentialsFormDTO.getUsername(), credentialsFormDTO.getPassword());
        SecurityContextHolder.getContext().setAuthentication(this.authenticationManager.authenticate(authentication));
        UserSessionDTO userSessionDTO = new UserSessionDTO(credentialsFormDTO.getUsername(), httpSession.getId(), true);
        httpSession.setAttribute("user", userSessionDTO);

        return userSessionDTO;
    }

    @RequestMapping(method = GET)
    public UserSessionDTO session(HttpSession session) {
        return (UserSessionDTO) session.getAttribute("user");
    }

    @RequestMapping(method = DELETE)
    public void logout(HttpSession session) {
        session.invalidate();
    }

}
