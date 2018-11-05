package Servlets;

import Logic.UserData;
import Logic.UserManager;
import Utils.ServletUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by Ron on 25-Nov-16.
 */

@WebServlet(name = "LoginServlet", urlPatterns = {"/login"})
public class LoginServlet extends javax.servlet.http.HttpServlet {
    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request  servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException      if an I/O error occurs
     */

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestType = request.getParameter("request_type");

        switch (requestType) {
            case "setDBPath":
                ServletUtils.setDbPath();
                break;
            case "Login":
                login(request, response);
                break;
            case "loginByCookie":
                loginByCookie(request, response);
                break;
            case "logOut":
                logOut(request, response);
                break;
        }
    }

    private void logOut(HttpServletRequest request, HttpServletResponse response) {
        ServletContext servletContext = getServletContext();
        UserManager UserManager = ServletUtils.getUserManager(servletContext);
        UserManager.removeNewUserSession(ServletUtils.getSessionId(request));
        ServletUtils.returnJson(request,response,true);
    }

    private void loginByCookie(HttpServletRequest request, HttpServletResponse response) {

        String id = request.getParameter("user_id");
        String email= UserData.getUserEmailById(id);

        ServletContext servletContext = getServletContext();
        UserManager UserManager = ServletUtils.getUserManager(servletContext);
        if(!UserManager.isSessionExist(ServletUtils.getSessionId(request))) {
            UserManager.addNewUserSession(email, ServletUtils.getSessionId(request));
            ServletUtils.returnJson(request, response, true);
        }
    }

    private void login(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            response.setContentType("text/html;charset=UTF-8");
            // create a connection to the database
            con = ServletUtils.getConnection();
            String userEmailFromParameter = request.getParameter(Constants.USERNAME);
            String userPassFromParameter = request.getParameter(Constants.USERPASS);
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + userEmailFromParameter + "' AND password='" + userPassFromParameter + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                ServletContext servletContext = getServletContext();
                UserManager UserManager = ServletUtils.getUserManager(servletContext);
                UserManager.addNewUserSession(rs.getString("email"), ServletUtils.getSessionId(request));
                ServletUtils.returnJson(request, response, rs.getInt("id"));
            }
            ServletUtils.returnJson(request, response, 0);
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
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

    private void setMessageBack(HttpServletRequest request, HttpServletResponse response, String errorMessage,
                                String typeMessage, String webPage) throws ServletException, IOException {
        request.setAttribute(typeMessage, errorMessage);
        getServletContext().getRequestDispatcher(webPage).forward(request, response);
    }

}

