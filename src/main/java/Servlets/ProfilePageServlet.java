package Servlets;

import Logic.*;
import Utils.ServletUtils;
import org.apache.commons.lang3.tuple.Pair;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.sql.*;
import java.util.*;


/**
 * Created by Ron on 19-May-17.
 */
@WebServlet(name = "ProfilePageServlet", urlPatterns = {"/profilePageServlet"})
@MultipartConfig
public class ProfilePageServlet extends javax.servlet.http.HttpServlet {
    public static final String PREFIX = "stream2file";
    public static final String SUFFIX = ".tmp";

    protected void processRequest(javax.servlet.http.HttpServletRequest request, javax.servlet.http.HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        Map<String, String[]> map = request.getParameterMap();
        String requestContentType = request.getContentType();
        if (requestContentType.contains("multipart/form-data")) {
            registerFileUpdates(request, response);
        } else {
            try {
                String functionName = request.getParameter(Constants.REQUESTTYPE);
                if (functionName != null) {
                    switch (functionName) {
                        case "loadUserProfile":
                            response.setContentType("text/html;charset=UTF-8");
                            String userId = request.getParameter("user_id");
                            response.sendRedirect("/profilePage.html?user_id=" + userId);
                            break;
                        case "getUserDataByEmailFromSession":
                            getUserDataByEmailFromSession(request, response);
                            break;
                        case "getUserInfo":
                            getUserInfo(request, response);
                            break;
                        case "registerTextUpdates":
                            registerTextUpdates(request, response);
                            break;
                        case "doesUserOwnBusinesses":
                            doesUserOwnBusinesses(request, response);
                            break;
                        case "getFinishedJobOffersForUser":
                            getJobOffersForUser(request, response, 1, 1);
                            break;
                        case "getFutureJobOffersForUser":
                            getJobOffersForUser(request,response, 0, 1);
                            break;
                        case "getCurrentUserRecommendation":
                            getCurrentUserRecommendation(request, response);
                            break;
                        case "registerRecommendation":
                            registerRecommendation(request,response);
                            break;
                        case "addFriend":
                            addFriend(request,response);
                            break;
                        case "getFriends":
                            getFriends(request,response);
                            break;
                        case "getCurrentUserShownFriends":
                            getCurrentUserShownFriends(request,response);
                            break;
                        case "removeFriend":
                            removeFriend(request,response);
                            break;
                        case "checkIfPendingRequest":
                            checkIfPendingRequest(request,response);
                            break;
                        case "checkIfMyProfile":
                            checkIfMyProfile(request,response);
                            break;
                        case "showSessionUserProfilePic":
                            showSessionUserProfilePic(request,response);
                            break;
                    }
                }

            } catch (SQLException e) {
                e.printStackTrace();
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }

    private void showSessionUserProfilePic(HttpServletRequest request, HttpServletResponse response) {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData userDate = UserData.getUserDataByEmail(userEmail);
        ServletUtils.returnJson(request,response, userDate.profilePic);
    }

    private void checkIfMyProfile(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        int flag=0;
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData userDate = UserData.getUserDataByEmail(userEmail);
        int profileIdToCheck = Integer.parseInt(request.getParameter("profile_id"));

        if(userDate.id == profileIdToCheck)
            flag = 1;

        ServletUtils.returnJson(request,response,flag);
    }

    private void checkIfPendingRequest(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        int flag = 0;
        try {
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            UserData userDate = UserData.getUserDataByEmail(userEmail);
            String userIdToCheck = request.getParameter("user_Tocheck");
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT *"
                    + " FROM notifications"
                    + " WHERE sender_id ='" + userDate.id + "'"
                    + " AND reciver_id ='"+ userIdToCheck + "'"
                    + " AND type=''" + Constants.PANDING_FRIEND_REQUEST + "'";

            rs = stmt.executeQuery(SELECT);

            if (rs.next()) {
                flag = rs.getInt("is_pending");
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        ServletUtils.returnJson(request,response,flag);
    }
    /*private void getUserName(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException, ClassNotFoundException {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userName = userManager.getUserNameFromSession(ServletUtils.getSessionId(request));
        try (PrintWriter out = response.getWriter()) {
            response.setContentType("application/json");
            Gson gson = new Gson();
            String json = gson.toJson(userName);
            out.println(json);
            out.flush();
        }
    }*/

    private void getUserInfo(HttpServletRequest request, HttpServletResponse response) {
        String userId = request.getParameter("user_id");
        UserData userData = UserData.getUserInfoFromDbById(userId);
        ServletUtils.returnJson(request, response, userData);
    }

    private void getUserDataByEmailFromSession(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, SQLException, ClassNotFoundException {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        response.setContentType("text/html;charset=UTF-8");
        UserData userData = UserData.getUserDataByEmail(userEmail);
        ServletUtils.returnJson(request, response, userData);
    }

    private void registerFileUpdates(HttpServletRequest request, HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        Connection con = null;
        Statement stmt = null;
        try {
            Map<String, String> urls = null;
            con = ServletUtils.getConnection();
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            Part filePart = request.getPart("cv");
            Part picPart = request.getPart("profilePic");
            urls = ServletUtils.uploadUserFiles(request.getParts());
            String pictureUrl = "";
            String cvUrl = "";
            if (urls != null && urls.size() != 0) {
                for (Map.Entry<String, String> entry : urls.entrySet()) {
                    if (entry.getValue().contains("image")) {
                        pictureUrl = entry.getValue();
                    } else cvUrl = entry.getValue();
                }
            } else return;
            stmt = con.createStatement();

            String sql = "UPDATE UserData " +
                    "SET ";
            if (pictureUrl != "") {
                sql += "profilePic='" + pictureUrl + "'";
                if (cvUrl != "")
                    sql += ", " + "CV='" + cvUrl + "'";
            }
            else if (cvUrl != "")
                sql += "CV='" + cvUrl + "'";

            sql += " WHERE email='" + userEmail + "' ";

            stmt.executeUpdate(sql);
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

    private void registerTextUpdates(HttpServletRequest request, HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        if (checkIfEmailInUserData(userEmail)) {
            updateTextUserData(request, response, userEmail);
        } else {
            //maybe isnt necceserry
            enterNewTextUserData(request, response);
        }

    }

    private void updateTextUserData(HttpServletRequest request, HttpServletResponse response, String userEmail) throws javax.servlet.ServletException, IOException {
        Connection con = null;
        Statement stmt = null;
        try {
            con = ServletUtils.getConnection();
            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String address = request.getParameter("address");
            String skills = request.getParameter("skills");
            String about = request.getParameter("about");
            //check email is not used
            if (!email.equals(userEmail) && checkIfEmailInUserData(email)) {
                ServletUtils.returnJson(request, response, "Email already Exists");
                return;
            }

            stmt = con.createStatement();

            String sql = "UPDATE UserData " +
                    "SET fname='" + fname + "', " +
                    "lname='" + lname + "', " +
                    "email='" + email + "', " +
                    "password='" + password + "', " +
                    "address='" + address + "', " +
                    "skills='" + skills + "', " +
                    "about='" + about + "' " +
                    "WHERE email='" + userEmail + "' ";

            stmt.executeUpdate(sql);
            ServletUtils.returnJson(request, response, "");
            //-----------------------------------------------------------------------------
            //return user json object to seccess in editProfilePage.js ajax for testing
            /*String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + userEmail + "'";
            ResultSet resultSet = stmt.executeQuery(SELECT);
            if (resultSet.next()) {
                String id;
                id = resultSet.getString("id");
                UserData res = UserData.getUserInfoFromDb(id);
                ServletUtils.returnJson(request, response, res);

            } else {
                ServletUtils.returnJson(request, response, "error");
            }*/
            //-----------------------------------------------------------------------------
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

    private void enterNewTextUserData(HttpServletRequest request, HttpServletResponse response) throws javax.servlet.ServletException, IOException {
        Connection con = null;
        PreparedStatement stmt = null;
        try {
            Map<String, String> urls = null;
            con = ServletUtils.getConnection();
            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String email = request.getParameter("email");
            String password = request.getParameter("password");
            String address = request.getParameter("address");
            String skills = request.getParameter("skills");
            String about = request.getParameter("about");
            String recommendations = "";
            String profileUrl = "";
            String cvUrl = "";

            String sql = "INSERT INTO UserData(fname, lname, email, password, address, skills, about, recommendations, CV, profilePic) " +
                    "VALUES('" + fname + "' , '" + lname + "' , '" + email + "' ,'" + password + "','" + address + "','" + skills + "','" + about + "','" + recommendations + "','" + profileUrl + "','" + cvUrl + "')";


            stmt = con.prepareStatement(sql);
            stmt.executeUpdate();
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

    private String getFileName(final Part part) {
        final String partHeader = part.getHeader("content-disposition");
        for (String content : part.getHeader("content-disposition").split(";")) {
            if (content.trim().startsWith("filename")) {
                return content.substring(
                        content.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return null;
    }

    private boolean checkIfEmailInUserData(String emailToCheck) throws javax.servlet.ServletException, IOException {
        boolean emailInUserData = false;
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + emailToCheck + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                emailInUserData = true;
            }
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
        return emailInUserData;
    }

    private void doesUserOwnBusinesses(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            UserData user = UserData.getUserDataByEmail(userEmail);

            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT COUNT(id)"
                    + " FROM businesses"
                    + " WHERE owner_id='" + user.getId() + "' "
                    + " GROUP BY id";
            rs = stmt.executeQuery(SELECT);
            Boolean res = false;
            String s = rs.toString();
            if (rs.next()) {
                res = rs.getInt(1) != 0;
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

    private void getJobOffersForUser(HttpServletRequest request, HttpServletResponse response, int is_finished, int is_hired) {
        List<Pair<Bussiness, JobOffer>> JobOffersWithBusiness = null;
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userId = request.getParameter("currentUserIdSearch");
        UserData user = UserData.getUserInfoFromDbById(userId);
        List<Integer> jobIdList = getListOfJobsByUserId(user.getId(), is_finished, is_hired);
        if (!jobIdList.isEmpty()) {
            JobOffersWithBusiness = new ArrayList<Pair<Bussiness, JobOffer>>();
            for (Integer jobId : jobIdList) {
                JobOffer currJob = JobOffer.getJobOfferByIdFromDB(jobId);
                Bussiness currBusiness = Bussiness.getBusinessInfoById(currJob.getBusinessId().toString());
                //JobOffersWithBusiness.add(new Pair<Bussiness, JobOffer>(currBusiness, currJob));
                JobOffersWithBusiness.add(Pair.of(currBusiness,currJob));
            }
        }
        ServletUtils.returnJson(request, response, JobOffersWithBusiness);
    }

    private List<Integer> getListOfJobsByUserId(int userId, int is_finished, int is_hired) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Integer> jobOffersIdList = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT *"
                    + " FROM apply"
                    + " WHERE applicant_id ='" + userId + "' AND is_finished='" + is_finished + "' AND is_hired='" + is_hired +"'";

            rs = stmt.executeQuery(SELECT);
            jobOffersIdList = new ArrayList<Integer>();
            while (rs.next()) {
                jobOffersIdList.add(rs.getInt("job_id"));
            }

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
        return jobOffersIdList;
    }

    private void getCurrentUserRecommendation(HttpServletRequest request, HttpServletResponse response) {
        String currentUserShownId = request.getParameter("currentUserShownId");
        List<UserRecommendation> recommendationList = UserRecommendation.getAllUserRecommendationById(currentUserShownId);
        ServletUtils.returnJson(request,response,recommendationList);
    }

    private void registerRecommendation(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        List<UserRecommendation> recommendationList = null;
        String currentUserShownId = request.getParameter("currentUserShownId");
        String recWriterId = request.getParameter("currentUserLogedInId");
        String recWriterName = request.getParameter("currentUserLogedInName");
        String rec = request.getParameter("recommendation");
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String sql = "INSERT INTO UserRecommendations(userId,recommendation,userInputedName, userInputedId ) " +
                    "VALUES('" + currentUserShownId + "','" + rec + "' , '" + recWriterName + "' ,'" + recWriterId + "')";
            pstmt = con.prepareStatement(sql);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { pstmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        recommendationList = UserRecommendation.getAllUserRecommendationById(currentUserShownId);
        ServletUtils.returnJson(request,response,recommendationList);
    }

    private void addFriend(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        int flag = 0;
        try {
            String currentUserShownId = request.getParameter("currentUserShownId");
            String currentLogedInId = request.getParameter("currentUserLogedInId");
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String FriendPandingNotification = " INSERT INTO notifications (type, business_id,is_read, is_approved, job_id, apply_id, is_pending, reciver_id, sender_id, not_date, not_time) " +
                    "VALUES('" + Constants.PANDING_FRIEND_REQUEST + "','" +-1+ "' , '" + 0 + "' ,'" + 0 + "' ,'" + -1 + "' ,'" + -1 + "' ,'" + 1 + "' ,'" + currentUserShownId+ "' ,'" + currentLogedInId  + "' ,'" +ServletUtils.GetCurentDate() + "' ,'" + ServletUtils.GetCurrentTime() +  "')";

            stmt = con.prepareStatement(FriendPandingNotification);
            stmt.executeUpdate(FriendPandingNotification);

            flag = 1;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { pstmt.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        ServletUtils.returnJson(request,response,flag);
    }

    private void getFriends(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Pair<UserData, Integer>> friendListWithLogedInData = null;
        int flag = 0;
        try {
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            UserData userDate = UserData.getUserDataByEmail(userEmail);
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM friends"
                    + " WHERE firstUserId ='" + userDate.id + "'";

            rs = stmt.executeQuery(SELECT);
            friendListWithLogedInData = new ArrayList<Pair<UserData, Integer>>();
            while (rs.next()) {
                UserData currUser = UserData.getUserInfoFromDbById(Integer.toString(rs.getInt("secondUserId")));
                Integer isLogedIn = ServletUtils.getUserManager(getServletContext()).isUserLogedIn(currUser.email);
                friendListWithLogedInData.add(Pair.of(currUser, isLogedIn));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        ServletUtils.returnJson(request,response,friendListWithLogedInData);
    }

    private void getCurrentUserShownFriends(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<UserData> friendList = null;
        try {
            String currentUserShownId = request.getParameter("currentUserShownId");
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM friends"
                    + " WHERE firstUserId ='" + currentUserShownId + "'";

            rs = stmt.executeQuery(SELECT);
            friendList = new ArrayList<UserData>();
            while (rs.next()) {
                UserData currUser = UserData.getUserInfoFromDbById(Integer.toString(rs.getInt("secondUserId")));
                friendList.add(currUser);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        ServletUtils.returnJson(request,response,friendList);
    }

    private void removeFriend(HttpServletRequest request, HttpServletResponse response) {
            Connection con = null;
            Statement stmt = null;
            PreparedStatement pstmt = null;
            ResultSet rs = null;
            int flag = 0;
            try {
                String currentUserShownId = request.getParameter("currentUserShownId");
                String currentLogedInId = request.getParameter("currentUserLogedInId");
                con = ServletUtils.getConnection();
                stmt = con.createStatement();
                String sql = " DELETE "
                        + " FROM friends"
                        + " WHERE firstUserId ='" + currentLogedInId + "' AND secondUserId='" + currentUserShownId + "'";

                stmt = con.prepareStatement(sql);
                stmt.executeUpdate(sql);

                flag = 1;

            } catch (SQLException e) {
                e.printStackTrace();
            }
            finally {
                try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
                try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
                try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
                try { pstmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            }
            ServletUtils.returnJson(request,response,flag);
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