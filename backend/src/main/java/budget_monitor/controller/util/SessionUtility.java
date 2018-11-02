package budget_monitor.controller.util;

import budget_monitor.dto.input.UserSessionDTO;

import javax.servlet.http.HttpSession;

public class SessionUtility {

    public static String getLoggedUser(HttpSession session) {
        UserSessionDTO userSession = (UserSessionDTO) session.getAttribute("user");
        return userSession.getUsername();
    }

}
