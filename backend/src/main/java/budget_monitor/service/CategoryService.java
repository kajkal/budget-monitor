package budget_monitor.service;

import budget_monitor.dto.input.CategoryFormDTO;
import budget_monitor.dto.output.CategoryDTO;
import budget_monitor.model.Category;
import budget_monitor.repository.CategoryRepository;
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
import java.util.Optional;

@Service("categoryService")
public class CategoryService {

    private JdbcTemplate jdbcTemplate;
    private CategoryRepository categoryRepository;

    @Autowired
    public CategoryService(JdbcTemplate jdbcTemplate,
                           @Qualifier("categoryRepository") CategoryRepository categoryRepository) {

        this.jdbcTemplate = jdbcTemplate;
        this.categoryRepository = categoryRepository;
    }


    public List<CategoryDTO> findAllByUsername(String username) {
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(jdbcTemplate);
        MapSqlParameterSource parameters = new MapSqlParameterSource();
        parameters.addValue("username", username);
        final String sql = "SELECT * FROM categories c WHERE c.owner = :username";

        return namedParameterJdbcTemplate.query(sql, parameters, new CategoryStructureExtractor());
    }

    public Optional<Category> findById(Long idCategory) {
        return categoryRepository.findById(idCategory);
    }

    public CategoryDTO createCategory(CategoryFormDTO categoryFormDTO, String username) {
        Category categoryToSave = new Category();
        categoryToSave.setIdSuperCategory(categoryFormDTO.getIdSuperCategory());
        categoryToSave.setOwner(username);
        categoryToSave.setName(categoryFormDTO.getName());
        categoryToSave.setColor(categoryFormDTO.getColor());

        Category savedCategory = categoryRepository.save(categoryToSave);
        return new CategoryDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Category categoryToUpdate, CategoryFormDTO categoryFormDTO) {
        categoryToUpdate.setIdSuperCategory(categoryFormDTO.getIdSuperCategory());
        categoryToUpdate.setName(categoryFormDTO.getName());
        categoryToUpdate.setColor(categoryFormDTO.getColor());

        Category updatedCategory = categoryRepository.save(categoryToUpdate);
        return new CategoryDTO(updatedCategory);
    }

    public void deleteCategory(Category categoryToDelete) {
        categoryRepository.deleteById(categoryToDelete.getIdCategory());
    }

    private class CategoryStructureExtractor implements ResultSetExtractor<List<CategoryDTO>> {

        private void addSubCategories(CategoryDTO category, Map<Long, List<CategoryDTO>> listOfSubCategories) {
            Optional.ofNullable(listOfSubCategories.remove(category.getIdCategory()))
                    .ifPresent(subCategories -> category.getSubCategories().addAll(subCategories));
            category.getSubCategories().forEach(s -> addSubCategories(s, listOfSubCategories));
        }

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

    }

}
