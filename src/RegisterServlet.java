import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/RegisterServlet")
public class RegisterServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Get parameters from the form
        String username = request.getParameter("username");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String description = request.getParameter("describe"); // matches 'name="describe"' in HTML

        // 2. Call the UserDAO to attempt registration
        boolean success = userDAO.registerUser(username, email, password, description);

        // 3. Redirect user based on success or failure
        if (success) {
            // Registration succeeded, redirect to login page
            response.sendRedirect("login.html");
        } else {
            // Registration failed, redirect back to register page with an error parameter
            response.sendRedirect("register.html?error=validation_or_db_failed");
        }
    }
}
