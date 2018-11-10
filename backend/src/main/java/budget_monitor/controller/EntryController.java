package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.controller.util.SessionUtility;
import budget_monitor.dto.input.EntryFormDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.exception.type.EntryException;
import budget_monitor.model.Entry;
import budget_monitor.service.EntryService;
import budget_monitor.service.SubEntryService;
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
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
public class EntryController {

    private EntryService entryService;
    private SubEntryService subEntryService;

    @Autowired
    public EntryController(@Qualifier("entryService") EntryService entryService,
                           @Qualifier("subEntryService") SubEntryService subEntryService) {

        this.entryService = entryService;
        this.subEntryService = subEntryService;
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
        createdEntry.setSubEntries(subEntryService.createSubEntries(entryFormDTO.getSubEntries(), createdEntry));
        return ResponseEntity.ok(createdEntry);
    }

    @LogExecutionTime
    @RequestMapping(method = PUT, path = "/app/entry/{idEntry}")
    @ResponseBody
    public ResponseEntity<EntryDTO> updateEntry(@PathVariable("idEntry") Long idEntry,
                                                @Valid @RequestBody EntryFormDTO entryFormDTO,
                                                HttpSession session) throws EntryException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Entry entryToUpdate = entryService.findByIdEntry(idEntry).orElseThrow(
                () -> new EntryException("updateEntry.error.entryNotFound"));
        if (!entryToUpdate.getOwner().equals(loggedUser))
            throw new EntryException("updateEntry.error.unauthorised");

        EntryDTO updatedEntry = entryService.updateEntry(entryToUpdate, entryFormDTO);
        updatedEntry.setSubEntries(subEntryService.createSubEntries(entryFormDTO.getSubEntries(), updatedEntry));
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
        if (!entryToDelete.getOwner().equals(loggedUser))
            throw new EntryException("deleteEntry.error.unauthorised");

        entryService.deleteEntry(entryToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
