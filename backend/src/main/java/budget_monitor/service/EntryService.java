package budget_monitor.service;

import budget_monitor.dto.output.EntryDTO;
import budget_monitor.model.SubEntry;
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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service("entryService")
public class EntryService {

    // TODO remove me
    private final Logger log = LoggerFactory.getLogger(getClass());

    private JdbcTemplate jdbcTemplate;
    private EntryRepository entryRepository;
    private static String columnNames = Stream.of(
            "idEntry",
            "e.owner",
            "e.idCategory",
            "e.description",
            "e.value",
            "e.date",
            "e.dateOfAddition",
            "e.dateOfLastModification",
            "e.photo",
            "se.idSubEntry",
            "se.idCategory",
            "se.description",
            "se.value"
    ).map(name -> String.format("%s AS '%s'", name, name)).collect(Collectors.joining(", "));

    @Autowired
    public EntryService(JdbcTemplate jdbcTemplate,
                        @Qualifier("entryRepository") EntryRepository entryRepository) {

        this.jdbcTemplate = jdbcTemplate;
        this.entryRepository = entryRepository;
    }


    public List<EntryDTO> findAllByUsername(String username) {
        log.info(columnNames);
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        final String sql = "SELECT idEntry AS 'idEntry', e.owner AS 'e.owner', e.idCategory AS 'e.idCategory', e.description AS 'e.description', e.value AS 'e.value', e.date AS 'e.date', e.dateOfAddition AS 'e.dateOfAddition', e.dateOfLastModification AS 'e.dateOfLastModification', e.photo AS 'e.photo', se.idSubEntry AS 'se.idSubEntry', se.idCategory AS 'se.idCategory', se.description AS 'se.description', se.value AS 'se.value' FROM entries e LEFT JOIN subentries se USING (idEntry) WHERE e.owner = :username";

        return namedParameterJdbcTemplate.query(sql, parameters, new EntryWithSubEntriesExtractor());
    }

//    public Optional<Entry> findByIdEntry(Long idEntry) {
//        return entryRepository.findById(idEntry);
//    }
//
//    public EntryDTO createEntry(EntryFormDTO entryFormDTO, String username) {
//        Entry entryToSave = new Entry();
//        entryToSave.setOwner(username);
//        entryToSave.setDate(entryFormDTO.getDate());
//        entryToSave.setValue(entryFormDTO.getValue());
//        entryToSave.setCurrency(entryFormDTO.getCurrency());
//        entryToSave.setDescription(entryFormDTO.getDescription());
////        entry.setPhoto(entryFormDTO.getPhoto());
//
//        Entry savedEntry = entryRepository.save(entryToSave);
//        return new EntryDTO(savedEntry);
//    }
//
//    public EntryDTO updateEntry(Entry entryToUpdate, EntryFormDTO entryFormDTO) {
//        entryToUpdate.setDate(entryFormDTO.getDate());
//        entryToUpdate.setValue(entryFormDTO.getValue());
//        entryToUpdate.setCurrency(entryFormDTO.getCurrency());
//        entryToUpdate.setDescription(entryFormDTO.getDescription());
////        entryToUpdate.setPhoto(entryFormDTO.getPhoto());
//
//        Entry updatedEntry = entryRepository.save(entryToUpdate);
//        return new EntryDTO(updatedEntry);
//    }
//
//    public void deleteEntry(Entry entryToDelete) {
//        entryRepository.deleteById(entryToDelete.getIdEntry());
//    }


    private class EntryWithSubEntriesExtractor implements ResultSetExtractor<List<EntryDTO>> {
        private EntryDTO decodeEntry(ResultSet rs, Long idEntry) throws SQLException {
            EntryDTO e = new EntryDTO();
            e.setIdEntry(idEntry);
            e.setOwner(rs.getString("e.owner"));
            e.setIdCategory(rs.getLong("e.idCategory"));
            e.setDescription(rs.getString("e.description"));
            e.setValue(rs.getInt("e.value"));
            e.setDate(rs.getTimestamp("e.date"));
            e.setDateOfAddition(rs.getTimestamp("e.idCategory"));
            e.setDateOfLastModification(rs.getTimestamp("e.dateOfLastModification"));
            e.setPhoto(rs.getBytes("e.photo"));
            e.setSubEntries(new ArrayList<>());
            return e;
        }

        @Override
        public List<EntryDTO> extractData(ResultSet rs) throws SQLException, DataAccessException {
            Map<Long, EntryDTO> entries = new HashMap<>();

            while (rs.next()) {
                Long idEntry = rs.getLong("idEntry");

                EntryDTO entry = entries.putIfAbsent(idEntry, decodeEntry(rs, idEntry));

                long idSubEntry = rs.getLong("se.idSubEntry");
                if (idSubEntry != 0) {
                    SubEntry subEntry = new SubEntry();
                    subEntry.setIdEntry(rs.getLong("se.idCategory"));
                    subEntry.setIdSubEntry(rs.getLong("se.idCategory"));
                    subEntry.setDescription(rs.getString("se.description"));
                    subEntry.setValue(rs.getInt("se.value"));
                    entry.getSubEntries().add(subEntry);
                }
            }
            return new ArrayList<>(entries.values());
        }

    }

}
