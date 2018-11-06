//package budget_monitor.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import javax.persistence.EntityManager;
//
//@Service("entryTagService")
//public class EntryTagService {
//
//    private EntityManager entityManager;
//
//    @Autowired
//    public EntryTagService(EntityManager entityManager) {
//
//        this.entityManager = entityManager;
//    }
//
//
//    public int createEntryTag(Long idEntry, Long idTag, String username) {
//        return (int) entityManager
//                .createNativeQuery("SELECT addTagToEntry(:idEntry, :idTag, :username)")
//                .setParameter("idEntry", idEntry)
//                .setParameter("idTag", idTag)
//                .setParameter("username", username)
//                .getSingleResult();
//    }
//
//    public int deleteEntryTag(Long idEntry, Long idTag, String username) {
//        return (int) entityManager
//                .createNativeQuery("SELECT removeTagFromEntry(:idEntry, :idTag, :username)")
//                .setParameter("idEntry", idEntry)
//                .setParameter("idTag", idTag)
//                .setParameter("username", username)
//                .getSingleResult();
//    }
//
//}
