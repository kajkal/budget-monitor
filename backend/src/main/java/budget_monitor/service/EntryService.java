package budget_monitor.service;

import budget_monitor.dto.output.EntryDTO;
import budget_monitor.dto.output.TagDTO;
import budget_monitor.model.EntryTag;
import budget_monitor.repository.EntryRepository;
import budget_monitor.repository.EntryTagRepository;
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
import java.util.stream.Collectors;

@Service("entryService")
public class EntryService {

    private JdbcTemplate jdbcTemplate;
    private EntryRepository entryRepository;
    private EntryTagRepository entryTagRepository;

    @Autowired
    public EntryService(JdbcTemplate jdbcTemplate,
                        @Qualifier("entryRepository") EntryRepository entryRepository,
                        @Qualifier("entryTagRepository") EntryTagRepository entryTagRepository) {

        this.jdbcTemplate = jdbcTemplate;
        this.entryRepository = entryRepository;
        this.entryTagRepository = entryTagRepository;
    }

    public List<EntryDTO> findAll() {
        final String sql = "SELECT * FROM entries e NATURAL JOIN entrytags et JOIN tags t USING (idTag)";
        return jdbcTemplate.query(sql, new EntryWithTagsExtractor());
    }

    public List<EntryDTO> findAll2() {
        return entryRepository.findAll().stream().map(EntryDTO::new).collect(Collectors.toList());
    }

    public List<EntryDTO> findAllByUsername(String username) {
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        final String sql = "SELECT * FROM entries e NATURAL JOIN entrytags et JOIN tags t USING (idTag) WHERE e.username=:username";

        return namedParameterJdbcTemplate.query(sql, parameters, new EntryWithTagsExtractor());
    }

    public List<EntryDTO> findAllByUsername2(String username) {
        return entryRepository.findAllByUsername(username).stream().map(EntryDTO::new).collect(Collectors.toList());
    }

    public List<EntryTag> findAllEntryTags() {
        return entryTagRepository.findAll();
    }

    public List<EntryTag> findAllEntryTagsByIdEntry(Long idEntry) {
        return entryTagRepository.findAllByIdEntry(idEntry);
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
                    entry.setUsername(rs.getString("username"));
                    entry.setDate(rs.getTimestamp("date"));
                    entry.setAdded(rs.getTimestamp("added"));
                    entry.setValue(rs.getInt("value"));
                    entry.setCurrency(rs.getString("currency"));
                    entry.setDescription(rs.getString("description"));
                    entry.setPhoto(rs.getBytes("photo"));
                    entry.setTags(new HashSet<>());

                    entries.put(entryId, entry);
                }

                TagDTO tag = new TagDTO();
                tag.setIdTag(rs.getLong("idTag"));
                tag.setName(rs.getString("name"));
                tag.setColor(rs.getInt("color"));

                entry.getTags().add(tag);
            }
            return new ArrayList<>(entries.values());
        }
    }
}
