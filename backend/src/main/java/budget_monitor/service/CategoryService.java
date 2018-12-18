package budget_monitor.service;

import budget_monitor.dto.input.CategoryFormDTO;
import budget_monitor.dto.output.CategoryDTO;
import budget_monitor.model.Category;
import budget_monitor.repository.CategoryRepository;
import budget_monitor.service.data_extractor.CategoryStructureExtractor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
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


    public Optional<CategoryDTO> getRootCategoryByUsername(String username) {
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

}
