package budget_monitor.dto.output;

import budget_monitor.model.Category;

import java.util.ArrayList;
import java.util.List;

public class CategoryDTO {

    private Long idCategory;
    private Long idSuperCategory;
    private String name;
    private Integer color;
    private List<CategoryDTO> subCategories;


    public CategoryDTO() {
    }

    public CategoryDTO(Category category) {
        this.idCategory = category.getIdCategory();
        this.idSuperCategory = category.getIdSuperCategory();
        this.name = category.getName();
        this.color = category.getColor();
        this.subCategories = new ArrayList<>();
    }

    public Long getIdCategory() {
        return idCategory;
    }

    public void setIdCategory(Long idCategory) {
        this.idCategory = idCategory;
    }

    public Long getIdSuperCategory() {
        return idSuperCategory;
    }

    public void setIdSuperCategory(Long idSuperCategory) {
        this.idSuperCategory = idSuperCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getColor() {
        return color;
    }

    public void setColor(Integer color) {
        this.color = color;
    }

    public List<CategoryDTO> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(List<CategoryDTO> subCategories) {
        this.subCategories = subCategories;
    }

}
