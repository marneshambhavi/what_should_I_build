import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class IdeaDAO {

    public IdeaDAO() {
        createChosenIdeasTable();
    }

    private void createChosenIdeasTable() {
        String query = "CREATE TABLE IF NOT EXISTS chosen_ideas (" +
                       "id INT AUTO_INCREMENT PRIMARY KEY, " +
                       "username VARCHAR(150) NOT NULL, " +
                       "idea_title VARCHAR(255) NOT NULL, " +
                       "idea_description TEXT NOT NULL" +
                       ")";
        try (Connection conn = DBConnection.getConnection()) {
            // Create clean table if it doesn't exist
            try (PreparedStatement pstmt = conn.prepareStatement(query)) {
                pstmt.executeUpdate();
            }
        } catch (Exception e) {
            System.err.println("Auto-creating chosen_ideas failed: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // --- ALGORITHM: GET IDEA BY PREFERENCE ---
    // Queries the database for ideas matching the tech stack, difficulty, and timeline.
    // If multiple matches are found, it shuffles them and picks a random one.
    // If no exact match is found, it relaxes constraints to ensure the user always gets a relevant idea.
    public String[] getRandomIdea(String techStack, String difficulty, String timeline) {
        String[] idea = new String[2]; // [title, description]
        List<String[]> matchingIdeas = new ArrayList<>();

        // 1. Try exact match query
        String query = "SELECT title, description FROM ideas WHERE tech_stack LIKE ? AND difficulty = ? AND timeline = ?";
        
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, "%" + techStack + "%");
            pstmt.setString(2, difficulty);
            pstmt.setString(3, timeline);

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    matchingIdeas.add(new String[]{rs.getString("title"), rs.getString("description")});
                }
            }

            // 2. Fallback: If no exact match, relax the timeline constraint (search just tech stack and difficulty)
            if (matchingIdeas.isEmpty()) {
                String fallbackQuery = "SELECT title, description FROM ideas WHERE tech_stack LIKE ? AND difficulty = ?";
                try (PreparedStatement pstmtFallback = conn.prepareStatement(fallbackQuery)) {
                    pstmtFallback.setString(1, "%" + techStack + "%");
                    pstmtFallback.setString(2, difficulty);
                    try (ResultSet rs = pstmtFallback.executeQuery()) {
                        while (rs.next()) {
                            matchingIdeas.add(new String[]{rs.getString("title"), rs.getString("description")});
                        }
                    }
                }
            }

            // 3. Absolute Fallback: If still empty, return a randomized dynamic project
            if (matchingIdeas.isEmpty()) {
                return getDynamicFallbackIdea(techStack, difficulty);
            }

            // 4. If there's only 1 idea in DB matching, add some dynamic ones to the pool to make sure shuffling works beautifully!
            if (matchingIdeas.size() == 1) {
                String[] extra = getDynamicFallbackIdea(techStack, difficulty);
                matchingIdeas.add(extra);
            }

            // 5. Random Selection: Shuffle matching ideas to pick a random one
            Collections.shuffle(matchingIdeas);
            return matchingIdeas.get(0);

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return getDynamicFallbackIdea(techStack, difficulty);
        }
    }

    // --- DYNAMIC FALLBACK SYSTEM FOR GUARANTEED SHUFFLING ---
    private String[] getDynamicFallbackIdea(String tech, String diff) {
        List<String[]> pool = new ArrayList<>();
        String stack = (tech == null || tech.trim().isEmpty()) ? "Java" : tech;

        // Custom curated high-quality project templates
        pool.add(new String[]{
            "Retro Pixel RPG Engine",
            "Build a fully functioning classic 2D retro action game using custom sprite renderings in " + stack + ". (Level: " + diff + ")"
        });
        pool.add(new String[]{
            "Real-Time Chat Server",
            "Establish multi-client secure socket channels to broadcast live communication feeds with " + stack + ". (Level: " + diff + ")"
        });
        pool.add(new String[]{
            "Automated Trading & Tracker System",
            "Construct a background scheduler in " + stack + " that tracks simulated stock metrics and executes alerts. (Level: " + diff + ")"
        });
        pool.add(new String[]{
            "Central Command Terminal",
            "Develop a personalized developer dashboard using " + stack + " to manage file systems and local scripts. (Level: " + diff + ")"
        });
        pool.add(new String[]{
            "Secure Password Crypt Vault",
            "Design an offline database vault utilizing secure cryptographic algorithms to store key hashes in " + stack + ". (Level: " + diff + ")"
        });

        // Shuffle the pool and return the first one
        Collections.shuffle(pool);
        return pool.get(0);
    }

    // --- SAVE CHOSEN IDEA ---
    public boolean saveChosenIdea(String username, String title, String description) {
        String query = "INSERT INTO chosen_ideas (username, idea_title, idea_description) VALUES (?, ?, ?)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            pstmt.setString(2, title);
            pstmt.setString(3, description);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }

    // --- GET SAVED IDEAS ---
    public List<String[]> getSavedIdeas(String username) {
        List<String[]> savedIdeas = new ArrayList<>();
        String query = "SELECT idea_title, idea_description FROM chosen_ideas WHERE username = ? ORDER BY id DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    savedIdeas.add(new String[]{rs.getString("idea_title"), rs.getString("idea_description")});
                }
            }

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        return savedIdeas;
    }

    // --- DELETE SAVED IDEA ---
    public boolean deleteSavedIdea(String username, String title) {
        String query = "DELETE FROM chosen_ideas WHERE username = ? AND idea_title = ?";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(query)) {
            
            pstmt.setString(1, username);
            pstmt.setString(2, title);

            int rowsAffected = pstmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            return false;
        }
    }
}
