package budget_monitor.controller;

import budget_monitor.model.User;
import budget_monitor.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class TestController {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private UserService userService;

    public TestController(@Qualifier("userService") UserService userService) {

        this.userService = userService;
    }





    @RequestMapping(method = GET, path = "/app/users")
    @ResponseBody
    public User getUsers() {
        return userService.findOneByUsername("user").get();
    }

}
