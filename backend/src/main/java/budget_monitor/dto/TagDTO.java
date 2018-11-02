package budget_monitor.dto;

import budget_monitor.model.Tag;

public class TagDTO {

    private Integer idTag;
    private String owner;
    private String name;

    public TagDTO(Tag tag) {
        this.idTag = tag.getIdTag();
        this.owner = tag.getOwner();
        this.name = tag.getName();
    }

    public Integer getIdTag() {
        return idTag;
    }

    public void setIdTag(Integer idTag) {
        this.idTag = idTag;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
