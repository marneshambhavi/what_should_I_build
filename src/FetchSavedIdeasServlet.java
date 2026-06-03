import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/FetchSavedIdeasServlet")
public class FetchSavedIdeasServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private IdeaDAO ideaDAO;

    public void init() {
        ideaDAO = new IdeaDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Check session
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("[]");
            return;
        }

        String username = (String) session.getAttribute("user");

        // 2. Fetch saved ideas
        List<String[]> savedIdeas = ideaDAO.getSavedIdeas(username);

        // 3. Convert to JSON Array manually
        StringBuilder json = new StringBuilder();
        json.append("[");
        for (int i = 0; i < savedIdeas.size(); i++) {
            String[] idea = savedIdeas.get(i);
            json.append(String.format(
                "{\"title\":\"%s\", \"description\":\"%s\", \"tech_stack\":\"%s\", \"completed\":%s, \"deadline\":\"%s\", \"completed_at\":\"%s\", \"saved_at\":\"%s\"}",
                escapeJson(idea[0]),
                escapeJson(idea[1]),
                escapeJson(idea[2]),
                idea[3],
                escapeJson(idea[4]),
                escapeJson(idea[5]),
                escapeJson(idea[6])
            ));
            if (i < savedIdeas.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json.toString());
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
