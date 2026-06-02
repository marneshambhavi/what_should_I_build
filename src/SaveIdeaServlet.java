import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/SaveIdeaServlet")
public class SaveIdeaServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private IdeaDAO ideaDAO;

    public void init() {
        ideaDAO = new IdeaDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Check if user is securely logged in
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Error: You must be logged in to save ideas.");
            return;
        }

        String username = (String) session.getAttribute("user");

        // 2. Get idea details from the request
        String title = request.getParameter("title");
        String description = request.getParameter("description");

        if (title == null || description == null || title.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Error: Missing title or description.");
            return;
        }

        // 3. Save chosen idea to database
        boolean success = ideaDAO.saveChosenIdea(username, title, description);

        // 4. Return success or failure response
        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Success");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error: Failed to save idea to database.");
        }
    }
}
