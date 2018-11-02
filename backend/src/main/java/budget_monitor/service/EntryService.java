package budget_monitor.service;

import budget_monitor.dto.EntryDTO;
import budget_monitor.model.EntryTag;
import budget_monitor.repository.EntryRepository;
import budget_monitor.repository.EntryTagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service("entryService")
public class EntryService {

    private EntryRepository entryRepository;
    private EntryTagRepository entryTagRepository;

    @Autowired
    public EntryService(@Qualifier("entryRepository") EntryRepository entryRepository,
                        @Qualifier("entryTagRepository") EntryTagRepository entryTagRepository) {

        this.entryRepository = entryRepository;
        this.entryTagRepository = entryTagRepository;
    }




    public List<EntryDTO> findAll() {
        return entryRepository.findAll().stream().map(EntryDTO::new).collect(Collectors.toList());
    }

    public List<EntryDTO> findAllByUsername(String username) {
        return entryRepository.findAllByUsername(username).stream().map(EntryDTO::new).collect(Collectors.toList());
    }

    public List<EntryTag> findAllEntryTags() {
        return entryTagRepository.findAll();
    }

    public List<EntryTag> findAllEntryTagsByIdEntry(Long idEntry) {
        return entryTagRepository.findAllByIdEntry(idEntry);
    }
}
