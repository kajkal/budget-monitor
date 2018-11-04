package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.controller.util.SessionUtility;
import budget_monitor.dto.input.EntryFormDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.exception.type.EntryException;
import budget_monitor.exception.type.EntryTagException;
import budget_monitor.model.Entry;
import budget_monitor.service.EntryService;
import budget_monitor.service.EntryTagService;
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
public class EntryController {

    // TODO remove me
    private final Logger log = LoggerFactory.getLogger(getClass());

    private EntryService entryService;
    private EntryTagService entryTagService;

    @Autowired
    public EntryController(@Qualifier("entryService") EntryService entryService,
                           @Qualifier("entryTagService") EntryTagService entryTagService) {

        this.entryService = entryService;
        this.entryTagService = entryTagService;
    }


    @LogExecutionTime
    @RequestMapping(method = GET, path = "/app/entries")
    @ResponseBody
    public List<EntryDTO> getEntries(HttpSession session) {
        return entryService.findAllByUsername(SessionUtility.getLoggedUser(session));
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/entry")
    @ResponseBody
    public ResponseEntity<EntryDTO> createEntry(@Valid @RequestBody EntryFormDTO entryFormDTO,
                                                HttpSession session) {

        String loggedUser = SessionUtility.getLoggedUser(session);
        EntryDTO createdEntry = entryService.createEntry(entryFormDTO, loggedUser);
        return ResponseEntity.ok(createdEntry);
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/entry/{idEntry}")
    @ResponseBody
    public ResponseEntity<EntryDTO> updateEntry(@PathVariable("idEntry") Long idEntry,
                                                @Valid @RequestBody EntryFormDTO entryFormDTO,
                                                HttpSession session) throws EntryException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Entry entryToUpdate = entryService.findByIdEntry(idEntry).orElseThrow(
                () -> new EntryException("updateEntry.error.entryNotFound"));
        if (!entryToUpdate.getUsername().equals(loggedUser))
            throw new EntryException("updateEntry.error.unauthorised");

        EntryDTO updatedEntry = entryService.updateEntry(entryToUpdate, entryFormDTO);
        return ResponseEntity.ok(updatedEntry);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/app/entry/{idEntry}")
    @ResponseBody
    public ResponseEntity<HttpStatus> deleteEntry(@PathVariable("idEntry") Long idEntry,
                                                  HttpSession session) throws EntryException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Entry entryToDelete = entryService.findByIdEntry(idEntry).orElseThrow(
                () -> new EntryException("deleteEntry.error.entryNotFound"));
        if (!entryToDelete.getUsername().equals(loggedUser))
            throw new EntryException("deleteEntry.error.unauthorised");

        entryService.deleteEntry(entryToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/entry/{idEntry}/{idTag}")
    @ResponseBody
    public ResponseEntity<HttpStatus> addTag(@PathVariable("idEntry") Long idEntry,
                                             @PathVariable("idTag") Long idTag,
                                             HttpSession session) throws EntryTagException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        int result = entryTagService.createEntryTag(idEntry, idTag, loggedUser);
        if (result == 0) throw new EntryTagException("addTag.error.tagAlreadyAdded");
        if (result < 0) throw new EntryTagException("addTag.error.unauthorised");

        return ResponseEntity.ok(HttpStatus.OK);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/app/entry/{idEntry}/{idTag}")
    @ResponseBody
    public ResponseEntity<HttpStatus> removeTag(@PathVariable("idEntry") Long idEntry,
                                                @PathVariable("idTag") Long idTag,
                                                HttpSession session) throws EntryTagException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        int result = entryTagService.deleteEntryTag(idEntry, idTag, loggedUser);
        if (result < 0) throw new EntryTagException("removeTag.error.unauthorised");

        return ResponseEntity.ok(HttpStatus.OK);
    }

}
