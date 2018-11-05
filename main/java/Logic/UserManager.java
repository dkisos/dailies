package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.HashMap;

import java.util.Map;

/**
 * Created by Ron on 19-May-17.
 */
public class UserManager {
    private Map<String, String> SessionsUsersMap;

    public UserManager() {
        SessionsUsersMap = new HashMap<>();
    }

    public void addNewUserSession(String userNameFromSession, String sessionId) {
        if (SessionsUsersMap.containsKey(sessionId) == false) {
            SessionsUsersMap.put(sessionId, userNameFromSession);
        }
    }

    public Integer isUserLogedIn(String email)
    {
        if (SessionsUsersMap.containsValue(email) == true) {
            return 1;
        }
        return 0;
    }

    public String getUserEmailFromSession(String sessionId)  {
        String email = SessionsUsersMap.get(sessionId);
        return email;
    }
    public Boolean isSessionExist(String sessionId){
        return SessionsUsersMap.containsKey(sessionId);
    }
    public void removeNewUserSession(String sessionID){
        SessionsUsersMap.remove(sessionID);
    }
}
