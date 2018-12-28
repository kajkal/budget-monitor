package budget_monitor.controller;

import budget_monitor.aop.CurrentUser;
import budget_monitor.aop.LogExecutionTime;
import budget_monitor.dto.input.CategoryFormDTO;
import budget_monitor.dto.output.CategoryDTO;
import budget_monitor.exception.type.CategoryException;
import budget_monitor.model.Category;
import budget_monitor.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static org.springframework.web.bind.annotation.RequestMethod.DELETE;
import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;
import static org.springframework.web.bind.annotation.RequestMethod.PUT;

@RestController
public class CategoryController {

    private CategoryService categoryService;

    @Autowired
    public CategoryController(@Qualifier("categoryService") CategoryService categoryService) {

        this.categoryService = categoryService;
    }


    @LogExecutionTime
    @RequestMapping(method = GET, path = "/api/categories")
    @ResponseBody
    public ResponseEntity<CategoryDTO> getRootCategory(@CurrentUser UserDetails user) {

        CategoryDTO rootCategory = categoryService.getRootCategoryByUsername(user.getUsername());
        return ResponseEntity.ok(rootCategory);
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/api/categories")
    @ResponseBody
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryFormDTO categoryFormDTO,
                                                      @CurrentUser UserDetails user) {

        CategoryDTO createdCategory = categoryService.createCategory(categoryFormDTO, user.getUsername());
        return ResponseEntity.ok(createdCategory);
    }

    @LogExecutionTime
    @RequestMapping(method = PUT, path = "/api/categories/{idCategory}")
    @ResponseBody
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable("idCategory") Long idCategory,
                                                      @Valid @RequestBody CategoryFormDTO categoryFormDTO,
                                                      @CurrentUser UserDetails user) throws CategoryException {

        Category categoryToUpdate = categoryService.findById(idCategory).orElseThrow(
                () -> new CategoryException("categoryData.error.categoryNotFound"));
        if (!categoryToUpdate.getOwner().equals(user.getUsername()))
            throw new CategoryException("categoryData.error.unauthorised");

        CategoryDTO updatedCategory = categoryService.updateCategory(categoryToUpdate, categoryFormDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/api/categories/{idCategory}")
    @ResponseBody
    public ResponseEntity<HttpStatus> deleteCategory(@PathVariable("idCategory") Long idCategory,
                                                     @CurrentUser UserDetails user) throws CategoryException {

        Category categoryToDelete = categoryService.findById(idCategory).orElseThrow(
                () -> new CategoryException("categoryData.error.categoryNotFound"));
        if (!categoryToDelete.getOwner().equals(user.getUsername()))
            throw new CategoryException("categoryData.error.unauthorised");

        categoryService.deleteCategory(categoryToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
