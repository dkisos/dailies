package Servlets;

import Utils.ServletUtils;
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
 * Created by OferMe on 12-Apr-17.
 */
@WebServlet(name = "SignInServlet", urlPatterns = {"/signIn"})
public class SignInServlet extends javax.servlet.http.HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String fname = request.getParameter("fname");
            String lname = request.getParameter("lname");
            String email = request.getParameter("email");
            String password = request.getParameter("password");

            stmt = con.createStatement();
            String SELECT = "SELECT *"
                    + " FROM UserData"
                    + " WHERE email='" + email + "'";
            rs = stmt.executeQuery(SELECT);
            while (rs.next()) {
                //user exists
                ServletUtils.returnJson(request, response, null);
                return;
            }

            String sql = "INSERT INTO UserData(fname,lname,email, password ) " +
                    "VALUES('" + fname + "','" + lname + "' , '" + email + "' ,'" + password + "')";
            stmt.executeUpdate(sql);

            sql=" SELECT id" +
                    " From UserData " +
                    "WHERE fname='"+fname+"' AND lname='"+lname+"' AND email='"+email+"' AND password='"+password+"'";

            rs=stmt.executeQuery(sql);
            if(rs.next()){
                ServletUtils.returnJson(request, response, rs.getInt(1));
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
