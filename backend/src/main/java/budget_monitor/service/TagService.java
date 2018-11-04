package budget_monitor.service;

import budget_monitor.dto.input.TagFormDTO;
import budget_monitor.dto.output.TagDTO;
import budget_monitor.model.Tag;
import budget_monitor.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service("tagService")
public class TagService {

    private TagRepository tagRepository;

    @Autowired
    public TagService(@Qualifier("tagRepository") TagRepository tagRepository) {

        this.tagRepository = tagRepository;
    }


    public List<TagDTO> findAllByUsername(String username) {
        return tagRepository.findAllByOwner(username).stream().map(TagDTO::new).collect(Collectors.toList());
    }

    public Optional<Tag> findByIdTag(Long idTag) {
        return tagRepository.findById(idTag);
    }

    public TagDTO createTag(TagFormDTO tagFormDTO, String username) {
        Tag tagToSave = new Tag();
        tagToSave.setOwner(username);
        tagToSave.setName(tagFormDTO.getName());
        tagToSave.setColor(tagFormDTO.getColor());

        Tag savedTag = tagRepository.save(tagToSave);
        return new TagDTO(savedTag);
    }

    public TagDTO updateTag(Tag tagToUpdate, TagFormDTO tagFormDTO) {
        tagToUpdate.setName(tagFormDTO.getName());
        tagToUpdate.setColor(tagFormDTO.getColor());

        Tag updatedTag = tagRepository.save(tagToUpdate);
        return new TagDTO(updatedTag);
    }

    public void deleteTag(Tag tagToDelete) {
        tagRepository.deleteById(tagToDelete.getIdTag());
    }

}
