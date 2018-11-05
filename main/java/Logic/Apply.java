package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;

public class Apply {
    public Integer id;
    public Integer app_id;
    public Integer job_id;
    public Boolean is_finished;
    public Date app_date;
    public String app_time;
    public Boolean is_hired;


    public Apply(Integer _id, Integer _app_id, Integer _job_id, Boolean _is_finished, Date _app_date, String _app_time, Boolean _is_hired) {
        id = _id;
        app_id = _app_id;
        job_id = _job_id;
        is_finished = _is_finished;
        app_date = _app_date;
        app_time = _app_time;
        is_hired = _is_hired;
    }

    static public ArrayList<Apply> getAppliesFromDbByJobId(Integer id) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String jobId = id.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM apply"
                    + " WHERE job_id='" + jobId + "'";
            rs = stmt.executeQuery(SELECT);

            ArrayList<Apply> applies = new ArrayList<Apply>();

            while (rs.next()) {
                applies.add(
                        new Apply(
                                rs.getInt("id"),
                                rs.getInt("applicant_id"),
                                rs.getInt("job_id"),
                                rs.getInt("is_finished")==1,
                                rs.getDate("app_date"),
                                rs.getString("app_time"),
                                rs.getInt("is_hired")==1));

            }
            return applies;
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
    static public ArrayList<UserData> getApplicantsListFromAppliesList(ArrayList<Apply> applies){
        ArrayList<UserData> applicants=new ArrayList<UserData>();

        for(Apply apply: applies){
            applicants.add(UserData.getUserInfoFromDbById(apply.app_id.toString()));
        }
        return applicants;
    }

}


