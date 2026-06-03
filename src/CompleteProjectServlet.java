import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/CompleteProjectServlet")
public class CompleteProjectServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private IdeaDAO ideaDAO;

    public void init() {
        ideaDAO = new IdeaDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Error: Unauthorized");
            return;
        }

        String username = (String) session.getAttribute("user");
        String title = request.getParameter("title");

        if (title == null || title.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Error: Missing title");
            return;
        }

        boolean success = ideaDAO.completeProject(username, title.trim());

        if (success) {
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Success");
        } else {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error: Failed to mark complete");
        }
    }
}
