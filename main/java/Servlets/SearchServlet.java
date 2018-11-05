package Servlets;

import Logic.Bussiness;
import Logic.UserData;
import Utils.ServletUtils;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.Connection;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Ron on 31-Aug-17.
 */

@WebServlet(name = "searchServlet", urlPatterns = {"/searchServlet"})
public class SearchServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String requestType = request.getParameter("request_type");
        switch (requestType) {
            case "searchUsersAndBusinesses":
                searchUsersAndBusinesses(request, response);
                break;
        }
    }

    private void searchUsersAndBusinesses(HttpServletRequest request, HttpServletResponse response) {
        Connection con = null;
        Statement stmt = null;
        List<Object> usersAndBusnisses = new ArrayList<Object>();
        String searchText = request.getParameter("searchText");
        List<Bussiness> bussinesses = Bussiness.getBusinessesByName(searchText);
        List<UserData> users = UserData.getUsersByName(searchText);
        if (bussinesses != null) {
            for (Bussiness bus: bussinesses) {
                usersAndBusnisses.add(bus);
            }
        }
        if (users != null) {
            for (UserData user: users) {
                usersAndBusnisses.add(user);
            }
        }
        ServletUtils.returnJson(request,response, usersAndBusnisses);
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
