package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.dto.input.RegisterFormDTO;
import budget_monitor.dto.output.JwtTokenDTO;
import budget_monitor.exception.type.UserException;
import budget_monitor.model.User;
import budget_monitor.service.AuthenticationService;
import budget_monitor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class UserController {

    private AuthenticationService authenticationService;
    private UserService userService;

    @Autowired
    public UserController(@Qualifier("authenticationService") AuthenticationService authenticationService,
                          @Qualifier("userService") UserService userService) {

        this.authenticationService = authenticationService;
        this.userService = userService;
    }


    @LogExecutionTime
    @RequestMapping(method = POST, path = "/api/users")
    @ResponseBody
    public ResponseEntity<JwtTokenDTO> createUser(@Valid @RequestBody RegisterFormDTO registerFormDTO) throws UserException {

        List<User> users = userService.findByUsernameOrEmail(registerFormDTO.getUsername(), registerFormDTO.getEmail());
        users.stream().filter(user -> user.getUsername().equals(registerFormDTO.getUsername())).findAny().ifPresent(
                user -> { throw new UserException("register.error.usernameExists"); }
        );
        users.stream().filter(user -> user.getEmail().equals(registerFormDTO.getEmail())).findAny().ifPresent(
                user -> { throw new UserException("register.error.emailExists"); }
        );

        userService.createUser(registerFormDTO);

        JwtTokenDTO jwt = authenticationService.login(registerFormDTO.getUsername(), registerFormDTO.getPassword());

        return ResponseEntity.ok(jwt);
    }

//    @LogExecutionTime
//    @RequestMapping(method = PUT, path = "/api/users")
//    @ResponseBody
//    public ResponseEntity<HttpStatus> updateUser(@RequestBody UserFormDTO userFormDTO,
//                                                 HttpSession session) throws UserException {
//
//        String loggedUser = SessionUtility.getLoggedUser(session);
//        User userToUpdate = userService.findByUsername(loggedUser).orElseThrow(
//                () -> new UserException("updateUser.error.userNotFound"));
//
//        userService.updateUser(userToUpdate, userFormDTO);
//        return ResponseEntity.ok(HttpStatus.OK);
//    }

}
