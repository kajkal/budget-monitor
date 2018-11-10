package budget_monitor.service.data_extractor;

import budget_monitor.dto.output.CategoryDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class CategoryStructureExtractor implements ResultSetExtractor<List<CategoryDTO>> {

    @Override
    public List<CategoryDTO> extractData(ResultSet rs) throws SQLException, DataAccessException {
        // key -> idSuperCategory, value: list of subCategories
        Map<Long, List<CategoryDTO>> listOfSubCategories = new HashMap<>();
        List<CategoryDTO> categoryStructure = new ArrayList<>();

        while (rs.next()) {
            Long idCategory = rs.getLong("idCategory");
            Long idSuperCategory = rs.getLong("idSuperCategory");

            CategoryDTO category = new CategoryDTO();
            category.setIdCategory(idCategory);
            category.setIdSuperCategory(idSuperCategory);
            category.setName(rs.getString("name"));
            category.setColor(rs.getInt("color"));
            category.setSubCategories(new ArrayList<>());

            if (idSuperCategory == 0) {
                categoryStructure.add(category);
            } else {
                listOfSubCategories
                        .computeIfAbsent(idSuperCategory, k -> new ArrayList<>())
                        .add(category);
            }
        }

        categoryStructure.forEach(s -> addSubCategories(s, listOfSubCategories));
        return categoryStructure;
    }

    private void addSubCategories(CategoryDTO category, Map<Long, List<CategoryDTO>> listOfSubCategories) {
        Optional.ofNullable(listOfSubCategories.remove(category.getIdCategory()))
                .ifPresent(subCategories -> category.getSubCategories().addAll(subCategories));
        category.getSubCategories().forEach(s -> addSubCategories(s, listOfSubCategories));
    }

}
