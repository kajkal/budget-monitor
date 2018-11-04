package budget_monitor.controller;

import budget_monitor.dto.output.EntryDTO;
import budget_monitor.dto.output.TagDTO;
import budget_monitor.model.EntryTag;
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

import static java.lang.String.format;
import static org.springframework.web.bind.annotation.RequestMethod.GET;

@RestController
public class TestController {

    private final Logger log = LoggerFactory.getLogger(getClass());

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

    @RequestMapping(method = GET, path = "/t/entries/{username}")
    @ResponseBody
    public List<EntryDTO> getAllEntries(@PathVariable("username") String username) {
        long start = System.nanoTime();

        List<EntryDTO> entries = entryService.findAllByUsername(username);

        log.info(format("%s: %.10f [s]", "getAllEntriesByUsername", ((System.nanoTime() - start)/Math.pow(10,9))));
        return entries;
    }

    @RequestMapping(method = GET, path = "/t/tags/{username}")
    @ResponseBody
    public List<TagDTO> getAllTags(@PathVariable("username") String username) {
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
