package Logic;

import Utils.ServletUtils;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


public class JobOffer {
    public Integer jobId;
    public Integer business_id;
    public String name;
    public String details;
    public Date startDate;
    public Date endDate;
    public String jobLocation;
    public String startTime;
    public String endTime;
    public String requirements;
    public Date postDate;
    public String postTime;
    public Integer salary;
    public Integer workers_num;
    public Integer max_workers_num;

    public JobOffer(int _jobId, int _businessId, String _name, String _details, Date _startDate, String _startTime, Date _endDate,
                    String _endTime, String _jobLocation, String _requirements, Date _postDate, String _postTime, Integer _salary,
                    Integer _workers_num, Integer _max_workers_num) {
        jobId = _jobId;
        business_id = _businessId;
        name = _name;
        details = _details;
        startDate = _startDate;
        endDate = _endDate;
        jobLocation = _jobLocation;
        startTime = _startTime;
        endTime = _endTime;
        requirements = _requirements;
        postDate = _postDate;
        postTime = _postTime;
        salary = _salary;
        workers_num = _workers_num;
        max_workers_num = _max_workers_num;
    }

    public JobOffer(List<Object> row) {

        business_id = (Integer) row.get(0);
        details = (String) row.get(1);
        startDate = new Date((Long)row.get(2));
        endDate = new Date((Long)row.get(3));
        jobLocation = (String) row.get(4);
        startTime = (String) row.get(5);
        endTime = (String) row.get(6);
        requirements = (String) row.get(7);
        name = (String) row.get(8);
        postDate = new Date((Long)row.get(9));
        postTime = (String) row.get(10);
        jobId = (Integer) row.get(11);

    }

    public Integer getBusinessId() {
        return business_id;
    }

    static public ArrayList<JobOffer> getJobOffersFromDB(Integer id) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String businessId = id.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM job_offers"
                    + " WHERE business_id='" + businessId + "'" +
                    " ORDER By post_date DESC , post_time DESC ";
            rs = stmt.executeQuery(SELECT);

            ArrayList<JobOffer> jobOffers = new ArrayList<JobOffer>();
            int index = 0;
            while (rs.next()) {
                jobOffers.add(
                        new JobOffer(
                                rs.getInt("id"),
                                rs.getInt("business_id"),
                                rs.getString("name"),
                                rs.getString("details"),
                                rs.getDate("start_date"),
                                rs.getString("start_time"),
                                rs.getDate("end_date"),
                                rs.getString("end_time"),
                                rs.getString("location"),
                                rs.getString("requirements"),
                                rs.getDate("post_date"),
                                rs.getString("post_time"),
                                rs.getInt("salary"),
                                rs.getInt("workers_num"),
                                rs.getInt("max_workers_num")));
            }
            return jobOffers;
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

    static public JobOffer getJobOfferByIdFromDB(Integer _jobId) {
        Connection con = null;
        Statement stmt = null;
        ResultSet rs = null;
        JobOffer jobOffer = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String jobId = _jobId.toString();

            stmt = con.createStatement();
            String SELECT = " SELECT *"
                    + " FROM job_offers"
                    + " WHERE id='" + jobId + "'" +
                    " ORDER BY post_date DESC, post_time DESC";
            rs = stmt.executeQuery(SELECT);
            int index = 0;
            while (rs.next()) {
                jobOffer = new JobOffer(
                        rs.getInt("id"),
                        rs.getInt("business_id"),
                        rs.getString("name"),
                        rs.getString("details"),
                        rs.getDate("start_date"),
                        rs.getString("start_time"),
                        rs.getDate("end_date"),
                        rs.getString("end_time"),
                        rs.getString("location"),
                        rs.getString("requirements"),
                        rs.getDate("post_date"),
                        rs.getString("post_time"),
                        rs.getInt("salary"),
                        rs.getInt("workers_num"),
                        rs.getInt("max_workers_num"));
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
        return jobOffer;
    }

    public static void updateJobOffer(JobOffer job) {
        Connection con = null;
        Statement stmt = null;

        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String UPDATE = " UPDATE job_offers" +
                    " SET " +
                    "id='" + job.jobId.toString() + "', " +
                    "business_id='" + job.business_id.toString() + "', " +
                    "details='" + job.details + "', " +
                    "start_date='" + job.startDate    + "', " +
                    "end_date='" + job.endDate       + "', " +
                    "location='" + job.jobLocation + "', " +
                    "start_time='" + job.startTime + "', " +
                    "end_time='" + job.endTime + "', " +
                    "requirements='" + job.requirements + "', " +
                    "name='" + job.name + "', " +
                    "post_date='" + job.postDate      + "', " +
                    "post_time='" + job.postTime + "', " +
                    "salary='" + job.salary + "', " +
                    "max_workers_num='" + job.max_workers_num + "' " +
                    "WHERE id='" + job.jobId.toString() + "' ";


            int res = stmt.executeUpdate(UPDATE);

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

    public static void updateNumberOfWorkersInJob(String jobId) {
        Connection con = null;
        Statement stmt = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            stmt = con.createStatement();
            String UPDATE = " UPDATE job_offers " +
                    "SET workers_num = workers_num + 1 " +
                    "WHERE id='" + jobId + "'";

            int res = stmt.executeUpdate(UPDATE);

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
}
