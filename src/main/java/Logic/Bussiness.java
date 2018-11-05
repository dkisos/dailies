package Logic;

import Utils.ServletUtils;
import org.apache.commons.lang3.text.WordUtils;
import org.sqlite.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.*;
import java.lang.String;
import java.util.ArrayList;
import java.util.List;

public class Bussiness {
    public Integer id;
    public String name;
    public String city;
    public String street;
    public Integer number;
    public String email;
    public String phone;
    public String about;
    public Integer owner_id;
    public UserData owner;
    public String profilePicUrl;

    public Bussiness(int _id, String _name, String _city, String _street, Integer _number, String _email, String _phone,String _about, Integer _owner_id,String _profilePicUrl) {

        id = _id;
        name = WordUtils.capitalizeFully(_name);
        city = _city;
        street = _street;
        number = _number;
        email=_email;
        phone = _phone;
        about=WordUtils.capitalize(_about);
        owner_id = _owner_id;
        profilePicUrl=_profilePicUrl;
        owner = UserData.getUserInfoFromDbById(_owner_id.toString());
    }
    public Bussiness(List<Object> row) {

        name= (String) row.get(0);
        city= (String)      row.get(1);
        street= (String)    row.get(2);
        phone= (String)     row.get(3);
        owner_id= (Integer) row.get(4);
        about= (String)     row.get(5);
        number= (Integer)   row.get(6);
        email= (String)     row.get(7);
        id= (Integer)       row.get(8);
        profilePicUrl= (String) row.get(9);
        owner = UserData.getUserInfoFromDbById(owner_id.toString());
    }

    public static Bussiness getBusinessInfoById(String businessId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM businesses"
                    + " WHERE id='" + businessId + "'";
            rs = stmt.executeQuery(SELECT);

            Bussiness bussiness = null;
            while (rs.next()) {
                bussiness = new Bussiness(rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("city"),
                        rs.getString("street"),
                        rs.getInt("number"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("aout"),
                        rs.getInt("owner_id"),
                        rs.getString("profilePic"));
            }

            return bussiness;
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return null;
    }

    public static List<Bussiness> getBusinessesByName(String businessName) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bussiness> Busnisses = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM businesses"
                    + " WHERE name LIKE '%" + businessName + "%'";
            rs = stmt.executeQuery(SELECT);

            Busnisses = new ArrayList<Bussiness>();
            while (rs.next()) {
                Busnisses.add(new Bussiness(rs.getInt("id"),
                        rs.getString("name"),
                        rs.getString("city"),
                        rs.getString("street"),
                        rs.getInt("number"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        rs.getString("aout"),
                        rs.getInt("owner_id"),
                        rs.getString("profilePic")));
            }

            return Busnisses;
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        return null;
    }

    public static Bussiness getBusinessInfo(HttpServletRequest request, HttpServletResponse response) {

        String businessId = request.getParameter("business_id");
        Bussiness bussiness = getBusinessInfoById(businessId);
        return bussiness;
    }

    static public Boolean doesUserOwnBusiness(String userId, String businessId) {
        Bussiness bussiness = getBusinessInfoById(businessId);
        return userId.equals(bussiness.owner_id.toString());
    }

    static public List<Bussiness> getUserBusinessesListById(String userId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        List<Bussiness> userBusinesses = null;
        List<Integer> businessesId = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();

            String SELECT = " SELECT id, name"
                    + " FROM businesses"
                    + " WHERE owner_id='" + userId + "' ";

            rs = stmt.executeQuery(SELECT);
            businessesId = new ArrayList<Integer>();
            while(rs.next()){
                businessesId.add(rs.getInt("id"));
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        finally {
            try { rs.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { stmt.close(); } catch (Exception e) {  e.printStackTrace(); }
            try { con.close(); } catch (Exception e) {  e.printStackTrace(); }
        }
        if (businessesId.size() != 0) {
            userBusinesses = new ArrayList<Bussiness>();
            for (int index : businessesId) {
                userBusinesses.add(Bussiness.getBusinessInfoById(Integer.toString(index)));
            }
        }
        return userBusinesses;
    }
}
