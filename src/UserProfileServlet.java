import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/UserProfileServlet")
public class UserProfileServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private UserDAO userDAO;

    public void init() {
        userDAO = new UserDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
            return;
        }

        String username = (String) session.getAttribute("user");
        String email = userDAO.getEmailByUsername(username);

        if (email == null) {
            email = "";
        }

        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(email);
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not logged in");
            return;
        }

        String username = (String) session.getAttribute("user");
        String newEmail = request.getParameter("email");

        if (newEmail == null || newEmail.trim().isEmpty()) {
            response.setContentType("text/plain");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("error:Email cannot be empty");
            return;
        }

        boolean success = userDAO.updateEmail(username, newEmail.trim());

        response.setContentType("text/plain");
        response.setCharacterEncoding("UTF-8");
        if (success) {
            response.getWriter().write("success");
        } else {
            response.getWriter().write("error:Invalid email format or failed to update database");
        }
    }
}
