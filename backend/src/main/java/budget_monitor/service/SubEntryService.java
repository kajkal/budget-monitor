package budget_monitor.service;

import budget_monitor.dto.input.SubEntryFormDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.dto.output.SubEntryDTO;
import budget_monitor.model.SubEntry;
import budget_monitor.repository.SubEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("subEntryService")
public class SubEntryService {

    private SubEntryRepository subEntryRepository;

    @Autowired
    public SubEntryService(@Qualifier("subEntryRepository") SubEntryRepository subEntryRepository) {

        this.subEntryRepository = subEntryRepository;
    }


    public List<SubEntryDTO> createSubEntries(List<SubEntryFormDTO> subEntries, EntryDTO superEntry) {
        List<SubEntry> subEntriesToSave = subEntries.stream().map(se -> {
            SubEntry subEntry = new SubEntry();
            subEntry.setIdEntry(superEntry.getIdEntry());
            subEntry.setIdCategory(se.getIdCategory() == null ? superEntry.getIdCategory() : se.getIdCategory());
            subEntry.setDescription(se.getDescription());
            subEntry.setValue(se.getValue());
            return subEntry;
        }).collect(Collectors.toList());

        return subEntryRepository.saveAll(subEntriesToSave).stream().map(SubEntryDTO::new).collect(Collectors.toList());
    }

}
