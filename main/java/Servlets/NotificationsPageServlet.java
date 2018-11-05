package Servlets;

import Logic.*;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;

/**
 * Created by Ron on 27-Aug-17.
 */

@WebServlet(name = "notificationsPageServlet", urlPatterns = {"/notificationsPageServlet"})
public class NotificationsPageServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        String requestType = request.getParameter("request_type");
        switch (requestType) {
            case "getUserNotifications":
                getUserNotifications(request, response);
                break;
            /*case "handleHireRequest":
                handleHireRequest(request, response);
                break;
            case "handleRejectRequest":
                handleRejectRequest(request, response);
                break;*/
            case "handleHireRejectRequest":
                handleHireRejectRequest(request, response);
                break;
            case "getUnreadNotifications":
                getUnreadNotifications(request, response);
                break;
            case "handleAcceptdOrRejectFriendRequest":
                handleAcceptdOrRejectFriendRequest(request,response);
                break;
            case "sendEmploymentRequests":
                sendEmploymentRequests(request, response);
                break;
        }
    }

    private void sendEmploymentRequests(HttpServletRequest request, HttpServletResponse response) {
        String[] friends = request.getParameterValues("friends[]");
        Integer businessId=Integer.parseInt(request.getParameter("business_id"));
        Integer jobId=Integer.parseInt(request.getParameter("job_id"));
        Integer senderId=Integer.parseInt(request.getParameter("sender_id"));

        Connection con = null;
        Statement stmt = null;
        ResultSet rs=null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            for (String f : friends) {
                String appDate=ServletUtils.GetCurentDate();
                String appTime=ServletUtils.GetCurrentTime();
                String sql = "INSERT INTO apply (applicant_id, job_id, app_date, app_time, is_hired, business_id, isPending, is_finished) " +
                        "VALUES('" + Integer.parseInt(f) + "','" + jobId + "' , '" + appDate + "' ,'" + appTime + "' ,'" + 0 + "' ,'" + businessId + "' ,'" + 1 + "' ,'"  + 0 + "')";


                stmt.executeUpdate(sql);
                //-------getting the apply id of the apply you just insert
                //-------to send to UpdateNotifications
                sql = "SELECT id " +
                        " FROM apply" +
                        " WHERE applicant_id=" + Integer.parseInt(f) +
                        " AND job_id=" + jobId +
                        " AND app_date='" + appDate +"'"+
                        " AND app_time='" + appTime +"'"+
                        " AND business_id=" + businessId;

                /*Statement s = con.createStatement();*/
                rs = stmt.executeQuery(sql);
                String applyId=null;
                if(rs.next()){
                    applyId = rs.getString(1);
                }


                String INSERT = "INSERT INTO notifications (type, business_id,is_read, is_approved, job_id, apply_id, is_pending, reciver_id, sender_id, not_date, not_time) " +
                        "VALUES('" + Constants.NOTIFICATION_TYPE_SUGGEST_JOB + "','" + businessId + "' , '" + 0 + "' ,'" + 0 + "' ,'" + jobId + "' ,'" + applyId + "' ,'" + 1 + "' ,'" + Integer.parseInt(f) + "' ,'" +senderId + "' ,'" + ServletUtils.GetCurentDate() + "' ,'" + ServletUtils.GetCurrentTime() + "')";
                stmt.executeUpdate(INSERT);

            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally {
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
    }

    private void handleAcceptdOrRejectFriendRequest(HttpServletRequest request, HttpServletResponse response) {
        String notId = request.getParameter("not_id");
        String reciverId = request.getParameter("reciver_id");
        String senderId = request.getParameter("sender_id");
        String isAccepted = request.getParameter("is_accepted").equals("true") ? "1" : "0";

        Connection con = null;
        Statement stmt = null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            if(isAccepted.equals("1")) {

                String INSERT = " INSERT  INTO friends (firstUserId,secondUserId)" +
                        "VALUES('" + senderId + "' , '" + reciverId + "');";

                stmt.executeUpdate(INSERT);

                INSERT = " INSERT  INTO friends (firstUserId,secondUserId)" +
                        "VALUES('" + reciverId + "' , '" + senderId + "');";

                stmt.executeUpdate(INSERT);
            }

            String UPDATE = "UPDATE notifications SET" +
                    " is_approved= " + isAccepted + ", is_pending=0" +
                    " WHERE id = " + Integer.parseInt(notId) + ";";
            stmt.executeUpdate(UPDATE);

            sendNotificationBackToSender(stmt, notId,Constants.PANDING_FRIEND_REQUEST);
            ServletUtils.returnJson(request, response, true);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
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
    }

    private void getUnreadNotifications(HttpServletRequest request, HttpServletResponse response) {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData reciver = UserData.getUserDataByEmail(userEmail);

        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = "SELECT COUNT(id) " +
                    " FROM notifications " +
                    " WHERE reciver_id=" + reciver.id +
                    " And is_read=0 " +
                    " GROUP BY reciver_id";

            rs = stmt.executeQuery(SELECT);
            Integer res = null;
            if (rs.next()) {
                res = rs.getInt(1);
            }

            ServletUtils.returnJson(request, response, res);
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
    }

    private void handleHireRejectRequest(HttpServletRequest request, HttpServletResponse response) {

        String notId = request.getParameter("not_id");
        String applyId = request.getParameter("apply_id");
        String isHire = request.getParameter("is_hire").equals("true") ? "1" : "0";
        String jobId = request.getParameter("job_id");
        Integer type= Integer.parseInt(request.getParameter("type"));

        Connection con = null;
        Statement stmt = null;
        try {
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String UPDATE = "UPDATE apply SET" +
                    " is_hired =" + isHire + ", isPending=0" +
                    " WHERE id = " + Integer.parseInt(applyId) + ";";
            stmt.executeUpdate(UPDATE);

            UPDATE = "UPDATE notifications SET" +
                    " is_approved= " + isHire + ", is_pending=0" +
                    " WHERE id = " + Integer.parseInt(notId) + ";";
            stmt.executeUpdate(UPDATE);

            sendNotificationBackToSender(stmt, notId,type);
            ServletUtils.returnJson(request, response, true);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
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
        if (isHire == "1")
        {
            JobOffer.updateNumberOfWorkersInJob(jobId);
        }
    }

    private void sendNotificationBackToSender(Statement stmt, String notId, Integer type ) {
        ResultSet rs = null;

        try {
            String SELECT = "SELECT * " +
                    " FROM notifications " +
                    " WHERE id=" + notId;

            rs = stmt.executeQuery(SELECT);
            NotificationBusiness n;
            if (rs.next()) {
                n = new NotificationBusiness(rs);
                int isApproved = (n.isApproved) ? 1 : 0;
                rs.close();
                type++;
                String INSERT = "INSERT INTO notifications (type, business_id,is_read, is_approved, job_id, apply_id, is_pending, reciver_id, sender_id, not_date, not_time) " +
                        "VALUES('" + type + "','" + n.business_id + "' , '" + 0 + "' ,'" + isApproved + "' ,'" + n.job_id + "' ,'" + n.apply_id + "' ,'" + 1 +"' ,'" + n.sender_id + "' ,'"  +n.reciver_id + "' ,'" +ServletUtils.GetCurentDate() + "' ,'" + ServletUtils.GetCurrentTime() +  "')";
                stmt.executeUpdate(INSERT);
                /* Ofer: 05-Sep-17 */
                //delete the trigger notification
                ServletUtils.deleteFromDb("notifications","id",notId,stmt);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                rs.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }


    private void getUserNotifications(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        ServletUtils.returnJson(request, response, NotificationBusiness.getUserNotificationsByUserIdFromDb(user.id));
    }


    @Override
    protected void doPost(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */
    @Override
    protected void doGet(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        processRequest(request, response);
    }
}
