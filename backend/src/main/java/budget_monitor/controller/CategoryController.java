package budget_monitor.controller;

import budget_monitor.aop.LogExecutionTime;
import budget_monitor.controller.util.SessionUtility;
import budget_monitor.dto.input.CategoryFormDTO;
import budget_monitor.dto.output.CategoryDTO;
import budget_monitor.exception.type.CategoryException;
import budget_monitor.model.Category;
import budget_monitor.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpSession;
import javax.validation.Valid;
import java.util.List;

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
    @RequestMapping(method = GET, path = "/app/categories")
    @ResponseBody
    public List<CategoryDTO> getCategories(HttpSession session) {
        return categoryService.findAllByUsername(SessionUtility.getLoggedUser(session));
    }

    @LogExecutionTime
    @RequestMapping(method = POST, path = "/app/category")
    @ResponseBody
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryFormDTO categoryFormDTO,
                                                      HttpSession session) {

        String loggedUser = SessionUtility.getLoggedUser(session);
        CategoryDTO createdCategory = categoryService.createCategory(categoryFormDTO, loggedUser);
        return ResponseEntity.ok(createdCategory);
    }

    @LogExecutionTime
    @RequestMapping(method = PUT, path = "/app/category/{idCategory}")
    @ResponseBody
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable("idCategory") Long idCategory,
                                                      @Valid @RequestBody CategoryFormDTO categoryFormDTO,
                                                      HttpSession session) throws CategoryException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Category categoryToUpdate = categoryService.findById(idCategory).orElseThrow(
                () -> new CategoryException("updateCategory.error.categoryNotFound"));
        if (!categoryToUpdate.getOwner().equals(loggedUser))
            throw new CategoryException("updateCategory.error.unauthorised");

        CategoryDTO updatedCategory = categoryService.updateCategory(categoryToUpdate, categoryFormDTO);
        return ResponseEntity.ok(updatedCategory);
    }

    @LogExecutionTime
    @RequestMapping(method = DELETE, path = "/app/category/{idCategory}")
    @ResponseBody
    public ResponseEntity<HttpStatus> deleteCategory(@PathVariable("idCategory") Long idCategory,
                                                     HttpSession session) throws CategoryException {

        String loggedUser = SessionUtility.getLoggedUser(session);
        Category categoryToDelete = categoryService.findById(idCategory).orElseThrow(
                () -> new CategoryException("deleteCategory.error.categoryNotFound"));
        if (!categoryToDelete.getOwner().equals(loggedUser))
            throw new CategoryException("deleteCategory.error.unauthorised");

        categoryService.deleteCategory(categoryToDelete);
        return ResponseEntity.ok(HttpStatus.OK);
    }

}
