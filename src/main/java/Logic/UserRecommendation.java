package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Ron on 22-Aug-17.
 */
public class UserRecommendation {
    Integer userId;
    String recommendation;
    String userInputedName;
    Integer userInputedId;

    public UserRecommendation(Integer _id, String _recommendation, String _userInputedName, Integer _userInputedId){
        userId = _id;
        recommendation = _recommendation;
        userInputedName = _userInputedName;
        userInputedId = _userInputedId;
    }

    public static List<UserRecommendation> getAllUserRecommendationById(String userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<UserRecommendation> userRecList = null;
        try {
            userRecList = new ArrayList<UserRecommendation>();
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserRecommendations"
                    + " WHERE userId='" + userId + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                userRecList.add(new UserRecommendation(rs.getInt("userId"), rs.getString("recommendation"), rs.getString("userInputedName"), rs.getInt("userInputedId")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return userRecList;
    }

    public static List<UserRecommendation> addRecommendationToDbAndReturnList(String userId, String recommendation, String userInputedName, String userInputedId)
    {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<UserRecommendation> userRecList = null;
        try {
            userRecList = new ArrayList<UserRecommendation>();
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserRecommendations"
                    + " WHERE userId='" + userId + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                userRecList.add(new UserRecommendation(rs.getInt("userId"), rs.getString("recommendation"), rs.getString("userInputedName"), rs.getInt("userInputedId")));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return userRecList;

    }
}
