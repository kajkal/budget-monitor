package budget_monitor.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tags")
public class Tag {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "idTag")
    private Long idTag;

    @Column(name = "owner")
    private String owner;

    @Column(name = "name")
    private String name;

    @Column(name = "color")
    private Integer color;



    public Long getIdTag() {
        return idTag;
    }

    public void setIdTag(Long idTag) {
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

    public Integer getColor() {
        return color;
    }

    public void setColor(Integer color) {
        this.color = color;
    }

}
