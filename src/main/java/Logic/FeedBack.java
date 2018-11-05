package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.Date;

public class FeedBack {
    Integer id;
    Integer uploaderId;
    String title;
    String feedback;
    Date uploadDate;
    String uploadTime;
    String uploaderName;

    public FeedBack(int _id, int _uploaderId, String _title, String _feedback, Date _uploadDate, String _uploadTime, String _uploaderName) {
        id = _id;
        uploaderId = _uploaderId;
        title = _title;
        feedback = _feedback;
        uploadDate = _uploadDate;
        uploadTime = _uploadTime;
        uploaderName = _uploaderName;
    }

    static public ArrayList<FeedBack> getFeedbacksFromDb(Integer id) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String businessId = id.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM business_feedbacks"
                    + " WHERE business_id='" + businessId + "'";
            rs = stmt.executeQuery(SELECT);

            ArrayList<FeedBack> feedBacks = new ArrayList<FeedBack>();

            while (rs.next()) {
                feedBacks.add(
                        new FeedBack(
                                rs.getInt("id"),
                                rs.getInt("uploader_id"),
                                rs.getString("title"),
                                rs.getString("feedback"),
                                rs.getDate("upload_date"),
                                rs.getString("upload_time"),
                                getUserNameByIdFromDB(rs.getInt("uploader_id"))
                        ));
            }
            return feedBacks;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                rs.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                stmt.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
            try {
                con.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return null;
    }

    private static String getUserNameByIdFromDB(Integer id) throws SQLException, ClassNotFoundException {
        UserData user = UserData.getUserInfoFromDbById(id.toString());
        return user.fname + " " + user.lname;
    }

}
