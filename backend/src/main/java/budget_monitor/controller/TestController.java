package budget_monitor.controller;

import budget_monitor.dto.EntryDTO;
import budget_monitor.model.EntryTag;
import budget_monitor.model.Tag;
import budget_monitor.model.User;
import budget_monitor.service.EntryService;
import budget_monitor.service.TagService;
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

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private UserService userService;

    private EntryService entryService;

    private TagService tagService;

    @Autowired
    public TestController(@Qualifier("userService") UserService userService,
                          @Qualifier("entryService") EntryService entryService,
                          @Qualifier("tagService") TagService tagService) {

        this.userService = userService;
        this.entryService = entryService;
        this.tagService = tagService;
    }





    @RequestMapping(method = GET, path = "/t/users")
    @ResponseBody
    public List<User> getUsers() {
        return userService.findAll();
    }

    @RequestMapping(method = GET, path = "/t/entries")
    @ResponseBody
    public List<EntryDTO> getAllEntries() {
        return entryService.findAll();
    }

    @RequestMapping(method = GET, path = "/t/entries/{username}")
    @ResponseBody
    public List<EntryDTO> getAllEntries(@PathVariable("username") String username) {
        return entryService.findAllByUsername(username);
    }

    @RequestMapping(method = GET, path = "/t/tags")
    @ResponseBody
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @RequestMapping(method = GET, path = "/t/tags/{username}")
    @ResponseBody
    public List<Tag> getAllTags(@PathVariable("username") String username) {
        return tagService.findAllByUsername(username);
    }

    @RequestMapping(method = GET, path = "/t/et")
    @ResponseBody
    public List<EntryTag> getAllEntryTags() {
        return entryService.findAllEntryTags();
    }

    @RequestMapping(method = GET, path = "/t/et/{id}")
    @ResponseBody
    public List<EntryTag> getAllEntryTagsById(@PathVariable("id") Long id) {
        return entryService.findAllEntryTagsByIdEntry(id);
    }
}
