package budget_monitor.controller;


import budget_monitor.aop.LogExecutionTime;
import budget_monitor.dto.input.LoginFormDTO;
import budget_monitor.dto.output.JwtTokenDTO;
import budget_monitor.service.AuthenticationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

// TODO add exception hander for this controller
@RestController
public class AccessController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private AuthenticationService authenticationService;

    @Autowired
    public AccessController(@Qualifier("authenticationService") AuthenticationService authenticationService) {

        this.authenticationService = authenticationService;
    }


    @LogExecutionTime
    @RequestMapping(method = POST, path = "/api/login")
    @ResponseBody
    public ResponseEntity<JwtTokenDTO> login(@Valid @RequestBody LoginFormDTO credentialsFormDTO) {

        JwtTokenDTO jwt = authenticationService.login(credentialsFormDTO.getUsername(), credentialsFormDTO.getPassword());

        log.info("User '{}' logged in.", credentialsFormDTO.getUsername());
        return ResponseEntity.ok(jwt);
    }

}
