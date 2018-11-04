package budget_monitor.service;

import budget_monitor.dto.input.EntryFormDTO;
import budget_monitor.dto.output.EntryDTO;
import budget_monitor.dto.output.TagDTO;
import budget_monitor.model.Entry;
import budget_monitor.repository.EntryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service("entryService")
public class EntryService {

    // TODO remove me
    private final Logger log = LoggerFactory.getLogger(getClass());

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
        final String sql = "SELECT * FROM entries e NATURAL LEFT JOIN entrytags et LEFT JOIN tags t USING (idTag) WHERE e.username=:username";

        return namedParameterJdbcTemplate.query(sql, parameters, new EntryWithTagsExtractor());
    }

    public Optional<Entry> findByIdEntry(Long idEntry) {
        return entryRepository.findById(idEntry);
    }

    public EntryDTO createEntry(EntryFormDTO entryFormDTO, String username) {
        Entry entryToSave = new Entry();
        entryToSave.setUsername(username);
        entryToSave.setDate(entryFormDTO.getDate());
        entryToSave.setValue(entryFormDTO.getValue());
        entryToSave.setCurrency(entryFormDTO.getCurrency());
        entryToSave.setDescription(entryFormDTO.getDescription());
//        entry.setPhoto(entryFormDTO.getPhoto());

        Entry savedEntry = entryRepository.save(entryToSave);
        return new EntryDTO(savedEntry);
    }

    public EntryDTO updateEntry(Entry entryToUpdate, EntryFormDTO entryFormDTO) {
        entryToUpdate.setDate(entryFormDTO.getDate());
        entryToUpdate.setValue(entryFormDTO.getValue());
        entryToUpdate.setCurrency(entryFormDTO.getCurrency());
        entryToUpdate.setDescription(entryFormDTO.getDescription());
//        entryToUpdate.setPhoto(entryFormDTO.getPhoto());

        Entry updatedEntry = entryRepository.save(entryToUpdate);
        return new EntryDTO(updatedEntry);
    }

    public void deleteEntry(Entry entryToDelete) {
        entryRepository.deleteById(entryToDelete.getIdEntry());
    }


    private class EntryWithTagsExtractor implements ResultSetExtractor<List<EntryDTO>> {
        @Override
        public List<EntryDTO> extractData(ResultSet rs) throws SQLException, DataAccessException {
            Map<Long, EntryDTO> entries = new HashMap<>();
            EntryDTO entry;

            while (rs.next()) {
                Long entryId = rs.getLong("idEntry");
                entry = entries.get(entryId);

                if (entry == null) {
                    entry = new EntryDTO();
                    entry.setIdEntry(entryId);
                    entry.setDate(rs.getTimestamp("date"));
                    entry.setAdded(rs.getTimestamp("added"));
                    entry.setValue(rs.getInt("value"));
                    entry.setCurrency(rs.getString("currency"));
                    entry.setDescription(rs.getString("description"));
                    entry.setPhoto(rs.getBytes("photo"));
                    entry.setTags(new HashSet<>());

                    entries.put(entryId, entry);
                }

                long idTag = rs.getLong("idTag");
                if (idTag != 0) {
                    TagDTO tag = new TagDTO();
                    tag.setIdTag(idTag);
                    tag.setName(rs.getString("name"));
                    tag.setColor(rs.getInt("color"));
                    entry.getTags().add(tag);
                }
            }
            return new ArrayList<>(entries.values());
        }

    }

}
