import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/GenerateIdeaServlet")
public class GenerateIdeaServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private IdeaDAO ideaDAO;

    public void init() {
        ideaDAO = new IdeaDAO();
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Get user preferences from form POST
        String techStack = request.getParameter("techStack");
        String difficulty = request.getParameter("difficulty");
        String timeline = request.getParameter("timeline");

        // 2. Fetch standard matching idea using DAO selection algorithm
        String[] idea = ideaDAO.getRandomIdea(techStack, difficulty, timeline);
        String title = idea[0];
        String description = idea[1];

        // 3. Return JSON response manually (dependency-free)
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // Simple JSON escape function for safety
        String jsonResponse = String.format(
            "{\"title\":\"%s\", \"description\":\"%s\"}",
            escapeJson(title),
            escapeJson(description)
        );

        response.getWriter().write(jsonResponse);
    }

    private String escapeJson(String input) {
        if (input == null) return "";
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}
