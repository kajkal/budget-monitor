package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.controller.util.SessionUtility;
import budget_monitor.dto.input.RegisterUserFormDTO;
import budget_monitor.dto.input.UserFormDTO;
import budget_monitor.exception.type.UserException;
import budget_monitor.model.User;
import budget_monitor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;

import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(@Qualifier("userService") UserService userService) {

        this.userService = userService;
    }


    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/register")
    @ResponseBody
    public ResponseEntity<HttpStatus> createUser(@Valid @RequestBody RegisterUserFormDTO registerUserFormDTO) throws UserException {

        int result = userService.checkIfUserWithUsernameOrEmailExists(registerUserFormDTO.getUsername(), registerUserFormDTO.getEmail());
        if (result == 1) throw new UserException("register.error.usernameExists");
        if (result == 2) throw new UserException("register.error.emailExists");

        userService.createUser(registerUserFormDTO);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @LogExecutionTime
    @RequestMapping(method = PUT, path = "/app/user")
    @ResponseBody
    public ResponseEntity<HttpStatus> updateUser(@RequestBody UserFormDTO userFormDTO,
                                                 HttpSession session) throws UserException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        User userToUpdate = userService.findByUsername(loggedUser).orElseThrow(
                () -> new UserException("updateUser.error.userNotFound"));

        userService.updateUser(userToUpdate, userFormDTO);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
