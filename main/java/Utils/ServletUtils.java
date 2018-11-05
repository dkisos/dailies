package Utils;

import Logic.UserManager;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.google.gson.Gson;
import org.apache.commons.io.IOUtils;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.*;
import java.net.URISyntaxException;
import java.sql.*;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Ron on 19-May-17.
 */
public class ServletUtils {
    private static final String USER_MANAGER_ATTRIBUTE_NAME = "userManager";
    private static final String USER_MANAGER = "usermanager";
    private static String DbPath = "";

    public enum NotificationType {
        jobRegistration(0);

        private final int value;
        private NotificationType(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    public static UserManager getUserManager(ServletContext servletContext) {
        if (servletContext.getAttribute(USER_MANAGER) == null) {
            servletContext.setAttribute(USER_MANAGER, new UserManager());
        }
        return (UserManager) servletContext.getAttribute(USER_MANAGER);
    }

    public static void setDbPath()
    {
        String path = null;
        try {
            path = ServletUtils.class.getProtectionDomain().getCodeSource().getLocation().toURI().getPath();
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        StringBuilder sb = new StringBuilder(path);
        sb.delete(0, 1);
        for (int i = 0; i <= 2; i++) {
            int start = sb.lastIndexOf("/");
            int end = sb.length();
            sb = sb.delete(start, end);
        }

        path = sb.toString();
        path += "/Resources/users.db";
        DbPath = "jdbc:sqlite:" + path;
    }

    public static String getDbPath() {
        return DbPath;
    }

    public static Connection getConnection()
    {
        String url = "jdbc:mysql://us-cdbr-iron-east-05.cleardb.net:3306/heroku_59a97387cdeff44";
        String user = "b69801b3aa126a";
        String password = "c3a33c70";
        Connection con = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            //?useUnicode=true&useJDBCCompliantTimezoneShift=true&useLegacyDatetimeCode=false&serverTimezone=Jerusalem
            con = DriverManager.getConnection("jdbc:mysql://localhost/Dailies", "root", "aA12345");
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return con;
    }
    public static Connection getConnection2()
    {
        String url = "jdbc:mysql://us-cdbr-iron-east-05.cleardb.net:3306/heroku_59a97387cdeff44";
        String user = "b69801b3aa126a";
        String password = "c3a33c70";
        Connection con = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            con = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            System.out.println("couldent connect db");
            System.out.println(e.getErrorCode());
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return con;
    }

    public static String getSessionId(HttpServletRequest request) {
        //do not delete
        String sessionId = request.getSession().getId();
        if (sessionId == null) {
            //if some one enters not from login page
        }
        return sessionId;
    }

    static public void returnJson(HttpServletRequest request, HttpServletResponse response, Object obj) {
        try (PrintWriter out = response.getWriter()) {
            response.setContentType("application/json");

            Gson gson = new Gson();
            String json = gson.toJson(obj);
            out.println(json);
            out.flush();
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    static public Map<String, String> uploadUserFiles(Collection<Part> parts) {
        Map<String, String> urls = null;
        urls = new HashMap<String, String>();
        for (Part part : parts) {
            String content = part.getContentType();
            if (content != null && content != "") {
                File file = saveFile(part);
                urls.put(part.getName(), uploadFileToCloudinary(file, isPicture(content)));
            }
        }

        return urls;
    }

    static public File saveFile(Part part) {
        try {
            final Part filePart = part;
            String fileName = filePart.getName();
            final File tempFile = new File(fileName);
            tempFile.deleteOnExit();
            InputStream in = filePart.getInputStream();
            try (FileOutputStream out = new FileOutputStream(tempFile)) {
                IOUtils.copy(in, out);
            }
            return tempFile;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    static private Boolean isPicture(String type) {
        //String mimetype = new MimetypesFileTypeMap().getContentType(file);
        //String type = mimetype.split("/")[0];
        if (type.contains("image")) {
            return true;
        }
        return false;
    }

    public static String uploadFileToCloudinary(File file, boolean picOrDoc) {
        String url = null;
        try {
            String Type;
            if (picOrDoc == true) Type = "image";
            else Type = "raw";
            Map map = ObjectUtils.asMap(
                    "cloud_name", "dailies",
                    "api_key", "385538641818241",
                    "api_secret", "_vtuycYvadSdGkpHAa3hSIgWoOg");
            Cloudinary cloudinary = new Cloudinary(map);
            Map uploadResult = cloudinary.uploader().upload(file, ObjectUtils.asMap(
                    "resource_type", Type));
            url = uploadResult.get("url").toString();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return url;
    }

    public static void addNotification(Integer userId, Integer busId ,Integer typeOfNot, String messege)
    {
        Connection con = null;
        PreparedStatement pstmt = null;
        ResultSet rs = null;
        try {
            // create a connection to the database
            con = ServletUtils.getConnection();
            String sql = "INSERT INTO notifications(user_Id,type,is_read, msg , business_id) " +
                    "VALUES('" + userId + "','" + typeOfNot + "' , '" + 0 + "' ,'" + messege + "' ,'" + busId + "')";
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
    }

    static public String GetCurentDate() {
        java.util.Date date = Calendar.getInstance().getTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(date);
    }

    static public String GetCurrentTime() {
        Date postDate = new Date(Calendar.getInstance().getTimeInMillis());
        DateFormat dateFormat = new SimpleDateFormat("HH:mm");
        String postTime = dateFormat.format(postDate);
        return postTime;
    }

    /* Ofer: 05-Sep-17 */
    static public Boolean deleteFromDb(String dBname, String byParamName, String byParamVal, Statement stmt) {
        int flag = 0;
        try {
            String DELETE = " DELETE "
                    + " FROM " + dBname
                    +" WHERE " + byParamName + "='" + byParamVal + "' ";
            flag = stmt.executeUpdate(DELETE);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return flag == 0 ? false : true;
    }
}
