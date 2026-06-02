import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/idea_generator";
    private static final String USER = "root";
    private static final String PASSWORD = "shambhavi";

    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        // Load the MySQL JDBC Driver
        Class.forName("com.mysql.cj.jdbc.Driver");
        
        // Establish and return the connection
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
