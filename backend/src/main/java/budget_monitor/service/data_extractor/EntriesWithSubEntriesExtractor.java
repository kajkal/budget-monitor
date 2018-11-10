package budget_monitor.service.data_extractor;

import budget_monitor.dto.output.EntryDTO;
import budget_monitor.dto.output.SubEntryDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class EntriesWithSubEntriesExtractor implements ResultSetExtractor<List<EntryDTO>> {

    @Override
    public List<EntryDTO> extractData(ResultSet rs) throws SQLException, DataAccessException {
        Map<Long, EntryDTO> entries = new HashMap<>();

        while (rs.next()) {
            Long idEntry = rs.getLong("idEntry");
            EntryDTO entry = entries.get(idEntry);

            if (entry == null) {
                entry = new EntryDTO();
                entry.setIdEntry(idEntry);
                entry.setIdCategory(rs.getLong("idCategory"));
                entry.setDescription(rs.getString("description"));
                entry.setValue(rs.getInt("value"));
                entry.setDate(rs.getTimestamp("date"));
                entry.setDateOfAddition(rs.getTimestamp("dateOfAddition"));
                entry.setDateOfLastModification(rs.getTimestamp("dateOfLastModification"));
                entry.setPhoto(rs.getBytes("photo"));
                entry.setSubEntries(new ArrayList<>());

                entries.put(idEntry, entry);
            }

            long idSubEntry = rs.getLong("idSubEntry");
            if (idSubEntry != 0) {
                SubEntryDTO subEntry = new SubEntryDTO();
                subEntry.setIdSubEntry(idSubEntry);
                subEntry.setIdCategory(rs.getLong("subEntryIdCategory"));
                subEntry.setDescription(rs.getString("subEntryDescription"));
                subEntry.setValue(rs.getInt("subEntryValue"));
                entry.getSubEntries().add(subEntry);
            }
        }
        return new ArrayList<>(entries.values());
    }

}
