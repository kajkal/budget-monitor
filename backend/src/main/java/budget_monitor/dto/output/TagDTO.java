package budget_monitor.dto.output;

import budget_monitor.model.Tag;

public class TagDTO {

    private Long idTag;
    private String name;
    private Integer color;


    public TagDTO() {
    }

    public TagDTO(Tag tag) {
        this.idTag = tag.getIdTag();
        this.name = tag.getName();
        this.color = tag.getColor();
    }

    public Long getIdTag() {
        return idTag;
    }

    public void setIdTag(Long idTag) {
        this.idTag = idTag;
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

}
