import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDAO {

    // --- REGISTRATION LOGIC ---
    public boolean registerUser(String username, String email, String password, String description) {
        // 1. Validate inputs before hitting the database
        if (!Validator.isValidUsername(username) || 
            !Validator.isValidEmail(email) || 
            !Validator.isValidPassword(password)) {
            System.out.println("Validation failed! Please check your username, email, or password requirements.");
            return false;
        }

        // 2. SQL Query to insert into the 'users' table
        String query = "INSERT INTO users (username, email, password, description) VALUES (?, ?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
             
            pstmt.setString(1, username);
            pstmt.setString(2, email);
            pstmt.setString(3, password); // Note: In a real app, you should hash this password!
            pstmt.setString(4, description);

            // 3. Execute the query
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0; // Returns true if insertion was successful

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- LOGIN LOGIC ---
    public boolean loginUser(String username, String password) {
        // 1. SQL Query to find a matching username and password
        String query = "SELECT * FROM users WHERE username = ? AND password = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
             
            pstmt.setString(1, username);
            pstmt.setString(2, password); // Note: In a real app, compare hashed passwords here

            // 2. Execute the query and check results
            try (ResultSet rs = pstmt.executeQuery()) {
                // If rs.next() is true, it means a record was found (Login Successful)
                return rs.next();
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- PROFILE LOGIC ---
    public String getEmailByUsername(String username) {
        String query = "SELECT email FROM users WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
             
            pstmt.setString(1, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getString("email");
                }
            }
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return null;
    }

    public boolean updateEmail(String username, String newEmail) {
        if (!Validator.isValidEmail(newEmail)) {
            return false;
        }
        String query = "UPDATE users SET email = ? WHERE username = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
             
            pstmt.setString(1, newEmail);
            pstmt.setString(2, username);
            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }
}
