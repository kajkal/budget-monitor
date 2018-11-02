package budget_monitor.service;

import budget_monitor.model.Tag;
import budget_monitor.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;

@Service("tagService")
public class TagService {

    private TagRepository tagRepository;

    @Autowired
    public TagService(@Qualifier("tagRepository") TagRepository tagRepository) {

        this.tagRepository = tagRepository;
    }




    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public List<Tag> findAllByUsername(String username) {
        return tagRepository.findAllByOwner(username);
    }

}
