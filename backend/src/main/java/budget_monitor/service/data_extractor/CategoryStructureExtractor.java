package budget_monitor.service.data_extractor;

import budget_monitor.dto.output.CategoryDTO;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.ResultSetExtractor;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class CategoryStructureExtractor implements ResultSetExtractor<CategoryDTO> {

    private CategoryDTO getRootCategory() {
        CategoryDTO incomeCategory = new CategoryDTO();
        incomeCategory.setIdCategory(2L);
        incomeCategory.setIdSuperCategory(1L);
        incomeCategory.setName("INCOME_CATEGORY");
        incomeCategory.setColor(0);
        incomeCategory.setSubCategories(new ArrayList<>());
        incomeCategory.setPath(Collections.singletonList(1L));

        CategoryDTO expenseCategory = new CategoryDTO();
        expenseCategory.setIdCategory(3L);
        expenseCategory.setIdSuperCategory(1L);
        expenseCategory.setName("EXPENSE_CATEGORY");
        expenseCategory.setColor(0);
        expenseCategory.setSubCategories(new ArrayList<>());
        expenseCategory.setPath(Collections.singletonList(1L));

        CategoryDTO rootCategory = new CategoryDTO();
        rootCategory.setIdCategory(1L);
        rootCategory.setIdSuperCategory(0L);
        rootCategory.setName("ROOT_CATEGORY");
        rootCategory.setColor(0);
        rootCategory.setSubCategories(Arrays.asList(incomeCategory, expenseCategory));
        rootCategory.setPath(new ArrayList<>());

        return rootCategory;
    }

    @Override
    public CategoryDTO extractData(ResultSet rs) throws SQLException, DataAccessException {
        // key -> idSuperCategory, value: list of subCategories
        Map<Long, List<CategoryDTO>> listOfSubCategories = new HashMap<>();
        CategoryDTO rootCategory = getRootCategory();

        while (rs.next()) {
            Long idCategory = rs.getLong("idCategory");
            Long idSuperCategory = rs.getLong("idSuperCategory");

            CategoryDTO category = new CategoryDTO();
            category.setIdCategory(idCategory);
            category.setIdSuperCategory(idSuperCategory);
            category.setName(rs.getString("name"));
            category.setColor(rs.getInt("color"));
            category.setSubCategories(new ArrayList<>());

            listOfSubCategories
                    .computeIfAbsent(idSuperCategory, k -> new ArrayList<>())
                    .add(category);
        }

        rootCategory.getSubCategories().forEach(
                category -> addSubCategories(category, listOfSubCategories, Collections.singletonList(1L))
        );
        return rootCategory;
    }

    private void addSubCategories(CategoryDTO category, Map<Long, List<CategoryDTO>> listOfSubCategories, List<Long> path) {
        List<Long> newPath = new ArrayList<>(path);
        newPath.add(category.getIdCategory());

        Optional.ofNullable(listOfSubCategories.remove(category.getIdCategory()))
                .ifPresent(subCategories -> category.getSubCategories().addAll(subCategories));
        category.getSubCategories().forEach(s -> {
            s.setPath(newPath);
            addSubCategories(s, listOfSubCategories, newPath);
        });
    }

}
