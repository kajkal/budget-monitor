package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.controller.util.SessionUtility;
import budget_monitor.dto.input.TagFormDTO;
import budget_monitor.dto.output.TagDTO;
import budget_monitor.exception.type.TagException;
import budget_monitor.model.Tag;
import budget_monitor.service.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

@RestController
public class TagController {

    private final Logger log = LoggerFactory.getLogger(getClass());

    private TagService tagService;

    @Autowired
    public TagController(@Qualifier("tagService") TagService tagService) {

        this.tagService = tagService;
    }


    @LogExecutionTime
    @RequestMapping(method = GET, path = "/app/tags")
    @ResponseBody
    public List<TagDTO> getTags(HttpSession session) {
        return tagService.findAllByUsername(SessionUtility.getLoggedUser(session));
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/tag")
    @ResponseBody
    public ResponseEntity<TagDTO> createTag(@Valid @RequestBody TagFormDTO tagFormDTO,
                                            HttpSession session) {

        String loggedUser = SessionUtility.getLoggedUser(session);
        TagDTO createdTag = tagService.createTag(tagFormDTO, loggedUser);
        return ResponseEntity.ok(createdTag);
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/tag/{idTag}")
    @ResponseBody
    public ResponseEntity<TagDTO> updateTag(@PathVariable("idTag") Long idTag,
                                            @Valid @RequestBody TagFormDTO tagFormDTO,
                                            HttpSession session) throws TagException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Tag tagToUpdate = tagService.findByIdTag(idTag).orElseThrow(
                () -> new TagException("updateTag.error.tagNotFound"));
        if (!tagToUpdate.getOwner().equals(loggedUser))
            throw new TagException("updateTag.error.unauthorised");

        tagToUpdate.setName(tagFormDTO.getName());
        tagToUpdate.setColor(tagFormDTO.getColor());
        TagDTO updatedTag = tagService.updateTag(tagToUpdate);
        return ResponseEntity.ok(updatedTag);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/app/tag/{idTag}")
    @ResponseBody
    public ResponseEntity<HttpStatus> deleteTag(@PathVariable("idTag") Long idTag,
                                                HttpSession session) throws TagException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Tag tagToDelete = tagService.findByIdTag(idTag).orElseThrow(
                () -> new TagException("deleteTag.error.tagNotFound"));
        if (!tagToDelete.getOwner().equals(loggedUser))
            throw new TagException("deleteTag.error.unauthorised");

        tagService.deleteTag(tagToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
