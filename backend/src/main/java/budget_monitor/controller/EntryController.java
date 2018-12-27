package budget_monitor.controller;

import budget_monitor.aop.CurrentUser;
import budget_monitor.aop.LogExecutionTime;
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
import org.springframework.security.core.parameters.P;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
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
    @RequestMapping(method = GET, path = "/api/entries")
    @ResponseBody
    public List<EntryDTO> getEntries(@CurrentUser UserDetails user) {
        return entryService.findAllByUsername(user.getUsername());
    }

    @LogExecutionTime
    @RequestMapping(method = GET, path = "/api/entries/recent")
    @ResponseBody
    public List<EntryDTO> getRecentEntries(@CurrentUser UserDetails user) {
        return entryService.findAllRecentByUsername(user.getUsername());
    }

    @LogExecutionTime
    @RequestMapping(method = GET, path = "/api/entries/{from}/{to}")
    @ResponseBody
    public List<EntryDTO> getEntriesBetweenDates(@PathVariable("from") String fromInString,
                                                 @PathVariable("to") String toInString,
                                                 @CurrentUser UserDetails user) throws EntryException {

        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        try {
            Timestamp from = new Timestamp(df.parse(fromInString).getTime());
            Timestamp to = new Timestamp(df.parse(toInString).getTime());
            return entryService.findAllByUsernameBetweenDates(user.getUsername(), from, to);
        } catch (ParseException e) {
            throw new EntryException("getEntries.error.badFormat");
        }
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/api/entries")
    @ResponseBody
    public ResponseEntity<EntryDTO> createEntry(@Valid @RequestBody EntryFormDTO entryFormDTO,
                                                @CurrentUser UserDetails user) {

        EntryDTO createdEntry = entryService.createEntry(entryFormDTO, user.getUsername());
        createdEntry.setSubEntries(subEntryService.createSubEntries(entryFormDTO.getSubEntries(), createdEntry));
        return ResponseEntity.ok(createdEntry);
    }

    @LogExecutionTime
    @RequestMapping(method = PUT, path = "/api/entries/{idEntry}")
    @ResponseBody
    public ResponseEntity<EntryDTO> updateEntry(@PathVariable("idEntry") Long idEntry,
                                                @Valid @RequestBody EntryFormDTO entryFormDTO,
                                                @CurrentUser UserDetails user) throws EntryException {

        Entry entryToUpdate = entryService.findByIdEntry(idEntry).orElseThrow(
                () -> new EntryException("updateEntry.error.entryNotFound"));
        if (!entryToUpdate.getOwner().equals(user.getUsername()))
            throw new EntryException("updateEntry.error.unauthorised");

        EntryDTO updatedEntry = entryService.updateEntry(entryToUpdate, entryFormDTO);
        updatedEntry.setSubEntries(subEntryService.createSubEntries(entryFormDTO.getSubEntries(), updatedEntry));
        return ResponseEntity.ok(updatedEntry);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/api/entries/{idEntry}")
    @ResponseBody
    public ResponseEntity<HttpStatus> deleteEntry(@PathVariable("idEntry") Long idEntry,
                                                  @CurrentUser UserDetails user) throws EntryException {

        Entry entryToDelete = entryService.findByIdEntry(idEntry).orElseThrow(
                () -> new EntryException("deleteEntry.error.entryNotFound"));
        if (!entryToDelete.getOwner().equals(user.getUsername()))
            throw new EntryException("deleteEntry.error.unauthorised");

        entryService.deleteEntry(entryToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
