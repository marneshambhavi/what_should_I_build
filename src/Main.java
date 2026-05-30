import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        UserDAO userDAO = new UserDAO();

        System.out.println("=== Test Registration ===");
        System.out.print("Enter a username (10-15 chars): ");
        String username = scanner.nextLine();

        System.out.print("Enter an email: ");
        String email = scanner.nextLine();

        System.out.print("Enter a password (1 upper, 1 lower, 1 number, min 8 chars): ");
        String password = scanner.nextLine();

        // Attempt Registration
        boolean isRegistered = userDAO.registerUser(username, email, password);

        if (isRegistered) {
            System.out.println("\nSUCCESS! User was registered and saved to the database.");
        } else {
            System.out.println("\nFAILED! The user was not registered. Check the validation rules or database connection.");
        }
        
        scanner.close();
    }
}
