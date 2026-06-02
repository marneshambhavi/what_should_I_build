import java.util.regex.Pattern;

public class Validator {
    
    // Username: Exactly 8 to 15 characters long
    private static final String USERNAME_PATTERN = "^.{8,15}$"; 
    
    // Email: Standard email format validation
    private static final String EMAIL_PATTERN = "^[A-Za-z0-9+_.-]+@(.+)$";
    
    // Password: At least 1 uppercase, 1 lowercase, and 1 number. 
    private static final String PASSWORD_PATTERN = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$";

    public static boolean isValidUsername(String username) {
        return username != null && Pattern.matches(USERNAME_PATTERN, username);
    }

    public static boolean isValidEmail(String email) {
        return email != null && Pattern.matches(EMAIL_PATTERN, email);
    }

    public static boolean isValidPassword(String password) {
        return password != null && Pattern.matches(PASSWORD_PATTERN, password);
    }
}
