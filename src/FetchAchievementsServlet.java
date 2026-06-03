import java.io.IOException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/FetchAchievementsServlet")
public class FetchAchievementsServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private IdeaDAO ideaDAO;

    public void init() {
        ideaDAO = new IdeaDAO();
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("user") == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Unauthorized\"}");
            return;
        }

        String username = (String) session.getAttribute("user");
        List<String[]> savedIdeas = ideaDAO.getSavedIdeas(username);

        int totalSaved = savedIdeas.size();
        int totalCompleted = 0;
        int completedInTime = 0;
        Set<String> distinctStacks = new HashSet<>();

        for (String[] idea : savedIdeas) {
            boolean completed = "1".equals(idea[3]);
            String techStack = idea[2];
            String deadlineStr = idea[4];
            String completedAtStr = idea[5];

            if (completed) {
                totalCompleted++;
                
                // Track distinct stack choices
                if (techStack != null && !techStack.trim().isEmpty()) {
                    distinctStacks.add(techStack.trim().toLowerCase());
                }

                // Check consistency: completed in time
                if (deadlineStr == null || deadlineStr.isEmpty()) {
                    completedInTime++; // No deadline means it's always in time
                } else {
                    try {
                        long deadlineVal = Long.parseLong(deadlineStr);
                        long completedAtVal = completedAtStr.isEmpty() ? 0 : Long.parseLong(completedAtStr);
                        if (completedAtVal > 0 && completedAtVal <= deadlineVal) {
                            completedInTime++;
                        }
                    } catch (NumberFormatException e) {
                        completedInTime++;
                    }
                }
            }
        }

        int distinctStacksCompletedCount = distinctStacks.size();
        int userLevel = 1 + totalCompleted;

        // Achievements Logic
        boolean firstStepsUnlocked = totalSaved >= 1;
        boolean consistencyUnlocked = completedInTime >= 1;
        boolean multiSkilledUnlocked = distinctStacksCompletedCount >= 3;
        boolean championUnlocked = totalCompleted >= 5;

        int unlockedCount = 0;
        if (firstStepsUnlocked) unlockedCount++;
        if (consistencyUnlocked) unlockedCount++;
        if (multiSkilledUnlocked) unlockedCount++;
        if (championUnlocked) unlockedCount++;

        // Serialize manually to JSON
        StringBuilder json = new StringBuilder();
        json.append("{");
        
        // stats
        json.append("\"stats\":{");
        json.append(String.format("\"totalSaved\":%d,", totalSaved));
        json.append(String.format("\"totalCompleted\":%d,", totalCompleted));
        json.append(String.format("\"completedInTime\":%d,", completedInTime));
        json.append(String.format("\"distinctStacksCompleted\":%d,", distinctStacksCompletedCount));
        json.append(String.format("\"unlockedCount\":%d,", unlockedCount));
        json.append(String.format("\"totalCount\":4,"));
        json.append(String.format("\"userLevel\":%d", userLevel));
        json.append("},");

        // achievements array
        json.append("\"achievements\":[");
        
        // 1. First Steps
        json.append("{");
        json.append("\"id\":\"first_steps\",");
        json.append("\"title\":\"First Steps\",");
        json.append("\"description\":\"Save your first project idea.\",");
        json.append("\"icon\":\"fa-lightbulb\",");
        json.append("\"color\":\"#ffd700\",");
        json.append(String.format("\"unlocked\":%b,", firstStepsUnlocked));
        json.append(String.format("\"statusText\":\"%s\"", firstStepsUnlocked ? "Unlocked" : "Locked (0/1 Saved)"));
        json.append("},");

        // 2. Consistency
        json.append("{");
        json.append("\"id\":\"consistency\",");
        json.append("\"title\":\"Consistency\",");
        json.append("\"description\":\"Complete a project within its deadline.\",");
        json.append("\"icon\":\"fa-fire\",");
        json.append("\"color\":\"#a8f0ef\",");
        json.append(String.format("\"unlocked\":%b,", consistencyUnlocked));
        json.append(String.format("\"statusText\":\"%s\"", consistencyUnlocked ? "Unlocked" : "Locked (0/1 Completed In Time)"));
        json.append("},");

        // 3. Multi-Skilled
        json.append("{");
        json.append("\"id\":\"multi_skilled\",");
        json.append("\"title\":\"Multi-Skilled\",");
        json.append("\"description\":\"Complete projects in 3 different tech stacks.\",");
        json.append("\"icon\":\"fa-code\",");
        json.append("\"color\":\"#818cf8\",");
        json.append(String.format("\"unlocked\":%b,", multiSkilledUnlocked));
        json.append(String.format("\"statusText\":\"%s\"", multiSkilledUnlocked ? "Unlocked" : "Locked (In Progress " + distinctStacksCompletedCount + "/3)"));
        json.append("},");

        // 4. Champion
        json.append("{");
        json.append("\"id\":\"champion\",");
        json.append("\"title\":\"Champion\",");
        json.append("\"description\":\"Complete a total of 5 projects.\",");
        json.append("\"icon\":\"fa-trophy\",");
        json.append("\"color\":\"#fbbf24\",");
        json.append(String.format("\"unlocked\":%b,", championUnlocked));
        json.append(String.format("\"statusText\":\"%s\"", championUnlocked ? "Unlocked" : "Locked (In Progress " + totalCompleted + "/5)"));
        json.append("}");

        json.append("]");
        json.append("}");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json.toString());
    }
}
