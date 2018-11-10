package budget_monitor.service;

import budget_monitor.dto.input.EntryFormDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.model.Entry;
import budget_monitor.repository.EntryRepository;
import budget_monitor.service.data_extractor.EntriesWithSubEntriesExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("entryService")
public class EntryService {

    private JdbcTemplate jdbcTemplate;
    private EntryRepository entryRepository;

    @Autowired
    public EntryService(JdbcTemplate jdbcTemplate,
                        @Qualifier("entryRepository") EntryRepository entryRepository) {

        this.jdbcTemplate = jdbcTemplate;
        this.entryRepository = entryRepository;
    }


    public List<EntryDTO> findAllByUsername(String username) {
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        final String sql = "SELECT * FROM entriesWithSubEntriesView WHERE owner = :username";

        return namedParameterJdbcTemplate.query(sql, parameters, new EntriesWithSubEntriesExtractor());
    }

    public Optional<Entry> findByIdEntry(Long idEntry) {
        return entryRepository.findById(idEntry);
    }

    public EntryDTO createEntry(EntryFormDTO entryFormDTO, String username) {
        Entry entryToSave = new Entry();
        entryToSave.setOwner(username);
        entryToSave.setIdCategory(entryFormDTO.getIdCategory());
        entryToSave.setDescription(entryFormDTO.getDescription());
        entryToSave.setValue(entryFormDTO.getValue());
        entryToSave.setDate(entryFormDTO.getDate());
//        entry.setPhoto(entryFormDTO.getPhoto());

        Entry savedEntry = entryRepository.save(entryToSave);
        return new EntryDTO(savedEntry);
    }

    public EntryDTO updateEntry(Entry entryToUpdate, EntryFormDTO entryFormDTO) {
        entryToUpdate.setIdCategory(entryFormDTO.getIdCategory());
        entryToUpdate.setDescription(entryFormDTO.getDescription());
        entryToUpdate.setValue(entryFormDTO.getValue());
        entryToUpdate.setDate(entryFormDTO.getDate());
//        entryToUpdate.setPhoto(entryFormDTO.getPhoto());

        Entry updatedEntry = entryRepository.save(entryToUpdate);
        return new EntryDTO(updatedEntry);
    }

    public void deleteEntry(Entry entryToDelete) {
        entryRepository.deleteById(entryToDelete.getIdEntry());
    }

}
