package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.dto.output.CategoryDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.model.User;
import budget_monitor.service.CategoryService;
import budget_monitor.service.EntryService;
import budget_monitor.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class TestController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private UserService userService;
    private EntryService entryService;
    private CategoryService categoryService;


    @Autowired
    public TestController(@Qualifier("userService") UserService userService,
                          @Qualifier("entryService") EntryService entryService,
                          @Qualifier("categoryService") CategoryService categoryService) {
//    @Autowired
//    public TestController(@Qualifier("userService") UserService userService,
//                          @Qualifier("entryService") EntryService entryService,
//                          @Qualifier("tagService") TagService tagService) {

        this.userService = userService;
        this.entryService = entryService;
        this.categoryService = categoryService;
    }





    @RequestMapping(method = GET, path = "/t/users")
    @ResponseBody
    public List<User> getUsers() {
        return userService.findAll();
    }

    @RequestMapping(method = GET, path = "/app/users")
    @ResponseBody
    public List<User> getUsersTest() {
        return userService.findAll();
    }

    @LogExecutionTime
    @RequestMapping(method = GET, path = "/t/entries/{username}")
    @ResponseBody
    public List<EntryDTO> getAllEntries(@PathVariable("username") String username) {
        long start = System.nanoTime();

        List<EntryDTO> entries = entryService.findAllByUsername(username);

        log.info(String.format("%s: %.10f [s]", "getAllEntriesByUsername", ((System.nanoTime() - start)/Math.pow(10,9))));
        return entries;
    }

    @LogExecutionTime
    @RequestMapping(method = GET, path = "/t/tags/{username}")
    @ResponseBody
    public List<CategoryDTO> getAllCategories(@PathVariable("username") String username) {
        return categoryService.findAllByUsername(username);
    }
//
//    @RequestMapping(method = GET, path = "/t/et")
//    @ResponseBody
//    public List<EntryTag> getAllEntryTags() {
//        return entryService.findAllEntryTags();
//    }
//
//    @RequestMapping(method = GET, path = "/t/et/{id}")
//    @ResponseBody
//    public List<EntryTag> getAllEntryTagsById(@PathVariable("id") Long id) {
//        return entryService.findAllEntryTagsByIdEntry(id);
//    }
}
