package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;

public class NotificationBusiness {
    public enum Type {
        USER_NOTIFICATION,
        BUSINESS_NOTIFICATION
    }

    public Integer id;
    public Integer sender_id;
    public String sender_name;
    /* Ofer: 05-Sep-17 */
    public String sender_profile_pic;
    public Integer reciver_id;
    public String reciver_name;
    public Integer type;
    public Integer business_id;
    public String business_name;
    public String business_profile_pic;
    public Boolean isRead;
    public Boolean isApproved;
    public Integer job_id;
    public String job_name;
    public Integer apply_id;
    public Integer isPending;
    public Date notDate;
    public String notTime;

    public NotificationBusiness(ResultSet rs) {
        try {
            id = rs.getInt("id");
            sender_id = rs.getInt("sender_id");
            reciver_id = rs.getInt("reciver_id");
            type = rs.getInt("type");
            business_id = rs.getInt("business_id");
            isRead = rs.getInt("is_read") == 1;
            isApproved = rs.getInt("is_approved") == 1;
            job_id = rs.getInt("job_id");
            apply_id = rs.getInt("apply_id");
            isPending=rs.getInt("is_pending");
            notDate = rs.getDate("not_date");
            notTime = rs.getString("not_time");

        } catch (SQLException e) {
            e.printStackTrace();
        }
        UserData user = UserData.getUserInfoFromDbById(sender_id.toString());
        sender_name = user.fname + " " + user.lname;
        /* Ofer: 05-Sep-17 */
        sender_profile_pic =user.profilePic;
        user = UserData.getUserInfoFromDbById(reciver_id.toString());
        reciver_name = user.fname + " " + user.lname;
        Bussiness business = Bussiness.getBusinessInfoById(business_id.toString());

        business_name = (business != null) ? business.name : "";

        business_profile_pic = (business!=null) ? business.profilePicUrl : "";

        if(job_id !=-1) {
            JobOffer job = JobOffer.getJobOfferByIdFromDB(job_id);
            job_name = job.name;
        }
        else{
            job_name = "";
        }

    }

    public static ArrayList<NotificationBusiness> getUserNotificationsByUserIdFromDb(Integer userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT *" +
                    " FROM notifications" +
                    " WHERE reciver_id='" + userId + "' "+
                    " ORDER BY not_date DESC, not_time DESC";

            rs = stmt.executeQuery(SELECT);
            ArrayList<NotificationBusiness> notificationsList = new ArrayList<>();
            ArrayList<Integer> notificationsToMakeRead = new ArrayList<>();
            while (rs.next()) {
                NotificationBusiness n = new NotificationBusiness(rs);
                notificationsList.add(n);

                notificationsToMakeRead.add(n.id);
            }
            for (Integer x : notificationsToMakeRead) {
                String UPDATE = "UPDATE notifications SET" +
                        " is_read = 1" +
                        " WHERE id = " + x + ";";
                stmt.addBatch(UPDATE);
            }
            stmt.executeBatch();
            return notificationsList;
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
}

