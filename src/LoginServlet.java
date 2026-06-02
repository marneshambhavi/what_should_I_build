import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Get parameters from the form
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        // 2. Call the UserDAO to verify credentials
        boolean success = userDAO.loginUser(username, password);

        // 3. Redirect user based on success or failure
        if (success) {
            // Create a session for the logged-in user
            HttpSession session = request.getSession();
            session.setAttribute("user", username);
            
            // Redirect to the home page / dashboard
            response.sendRedirect("index.html");
        } else {
            // Login failed, redirect back with error message
            response.sendRedirect("login.html?error=invalid_credentials");
        }
    }
}
