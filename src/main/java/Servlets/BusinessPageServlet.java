package Servlets;

import Logic.*;
import Utils.ServletUtils;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.*;
import java.sql.Date;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import static Logic.FeedBack.getFeedbacksFromDb;
import static Logic.JobOffer.getJobOffersFromDB;
import static Utils.ServletUtils.returnJson;

/**
 * Created by Ron on 25-Nov-16.
 */

@WebServlet(name = "BusinessPageServlet", urlPatterns = {"/businessPage"})
public class BusinessPageServlet extends javax.servlet.http.HttpServlet {
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {

        Map<String, String[]> map = request.getParameterMap();
        String requestType = request.getParameter("request_type");

        switch (requestType) {
            case "loadBusinessPageWithAjax":
                loadBusinessPageWithAjax(request, response);
                break;
            case "loadBusinessPage":
                response.setContentType("text/html;charset=UTF-8");
                String businessId2 = request.getParameter("business_id");
                response.sendRedirect("/businessProfilePage.html?business_id=" + businessId2);
                break;
            case "getBusinessInfo":
                returnJson(request, response, Bussiness.getBusinessInfo(request, response));
                break;
            case "getBusinessFeedbacks":
                getBusinessFeedbacks(request, response);
                break;
            case "getBusinessJobOffers":
                getBusinessJobOffers(request, response);
                break;
            case "getOwnerBusinessesList":
                getSessionUserBusinessesList(request, response);
                break;
            case "getCurrentUserBusinesssesList":
                getUserBusinessesListFromId(request, response);
                break;
            case "addFeedback":
                addFeedback(request, response);
                break;
            case "getAllJobApplicantsByJobID":
                getAllJobApplicantsByJobID(request, response);
                break;
                /* Ofer: 05-Sep-17 */
            case "doesUserOwnBusiness":
                doesUserOwnBusiness(request,response);
                break;
        }

    }
/* Ofer: 05-Sep-17 */
    private void doesUserOwnBusiness(HttpServletRequest request, HttpServletResponse response) {
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        String bId=request.getParameter("business_id");
        returnJson(request,response, Bussiness.doesUserOwnBusiness(user.id.toString(),bId));
    }

    private void getAllJobApplicantsByJobID(HttpServletRequest request, HttpServletResponse response) {
            Integer jobId = Integer.parseInt(request.getParameter("job_id"));
            ArrayList<Apply> applies = Apply.getAppliesFromDbByJobId(jobId);
            returnJson(request,response,Apply.getApplicantsListFromAppliesList(applies));
    }

    private void addFeedback(HttpServletRequest request, HttpServletResponse response) {
        response.setContentType("text/html;charset=UTF-8");
        UserManager userManager = ServletUtils.getUserManager(getServletContext());
        String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
        UserData user = UserData.getUserDataByEmail(userEmail);
        String businessId = request.getParameter("business_id");
        String feedback = request.getParameter("feedback");
        String title = request.getParameter("title");
        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        String postTime = dateFormat.format(postDate);

        Connection con = null;
        Statement stmt = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String sql = "INSERT INTO businesse_feedbacks (business_id ,feedback, uploader_id, upload_date, upload_time, title) " +
                    "VALUES('" + businessId + "' , '" + feedback + "' , '" + user.getId() + "' , '" + postDate + "' ,'" + postTime + "','" +
                    title + "')";

            stmt.executeUpdate(sql);
            response.sendRedirect("/businessProfilePage.html?business_id=" + businessId);

        } catch (SQLException e) {
            e.printStackTrace();
        } catch (IOException e) {
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

    private void loadBusinessPageWithAjax(HttpServletRequest request, HttpServletResponse response) {

        String businessId = request.getParameter("business_id");
        String businessLink = "";
        if (businessId != null && !businessId.isEmpty())
            businessLink = "businessProfilePage.html?business_id=" + businessId;
        returnJson(request, response, businessLink);
    }

    private void getBusinessJobOffers(HttpServletRequest request, HttpServletResponse response) {
        Integer businessId = Integer.parseInt(request.getParameter("business_id"));
        ArrayList<JobOffer> jobOffers = getJobOffersFromDB(businessId);
        ServletUtils.returnJson(request, response, jobOffers);
    }

    private void getBusinessFeedbacks(HttpServletRequest request, HttpServletResponse response) {
        Integer businessId = Integer.parseInt(request.getParameter("business_id"));
        ArrayList<FeedBack> feedBacks = getFeedbacksFromDb(businessId);
        ServletUtils.returnJson(request, response, feedBacks);
    }

    private void getSessionUserBusinessesList(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            UserManager userManager = ServletUtils.getUserManager(getServletContext());
            String userEmail = userManager.getUserEmailFromSession(ServletUtils.getSessionId(request));
            UserData user = UserData.getUserDataByEmail(userEmail);
            stmt = con.createStatement();

            String SELECT = " SELECT id, name"
                    + " FROM businesses"
                    + " WHERE owner_id='" + user.getId() + "' ";

            rs = stmt.executeQuery(SELECT);
            Map<Integer, String> userBusinesses = new HashMap<Integer, String>();
            while (rs.next()) {
                userBusinesses.put(rs.getInt("id"), rs.getString("name"));
            }
            returnJson(request, response, userBusinesses);
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

    private void getUserBusinessesListFromId(HttpServletRequest request, HttpServletResponse response) {
        String currentUserShownId = request.getParameter("currentUserShownId");
        List<Bussiness> busList = Bussiness.getUserBusinessesListById(currentUserShownId);
        ServletUtils.returnJson(request, response, busList);
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
