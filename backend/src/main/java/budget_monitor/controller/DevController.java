package budget_monitor.controller;

import budget_monitor.model.User;
import budget_monitor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class DevController {

    private UserService userService;

    @Autowired
    public DevController(@Qualifier("userService") UserService userService) {

        this.userService = userService;
    }


    @RequestMapping(method = GET, path = "/api/users")
    @ResponseBody
    public List<User> getUsers() {
        System.out.println("get users called");
        return userService.findAll();
    }

}
