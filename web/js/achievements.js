document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch logged-in user name dynamically
    fetch('GetSessionServlet')
        .then(response => response.text())
        .then(username => {
            if (username && username.trim() !== "" && username !== "Guest") {
                const usernameSpan = document.querySelector('.username');
                if (usernameSpan) usernameSpan.innerText = username;
                
                // Fetch and render achievements
                loadAchievements();
            } else {
                // Not logged in
                const grid = document.getElementById('achievements-grid');
                grid.innerHTML = `
                    <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                        <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: #f87171; margin-bottom: 15px;"></i>
                        <h3>Access Denied</h3>
                        <p style="margin-bottom: 20px;">Please login to see your achievements.</p>
                        <a href="login.html" class="btn-primary" style="display: inline-block; width: auto; padding: 10px 30px;">Login Page</a>
                    </div>
                `;
            }
        })
        .catch(err => console.error("Error fetching session:", err));

    const grid = document.getElementById('achievements-grid');
    const userLevelVal = document.getElementById('user-level-val');
    const badgesUnlockedText = document.getElementById('badges-unlocked-text');

    function loadAchievements() {
        fetch('FetchAchievementsServlet')
            .then(res => {
                if (!res.ok) throw new Error("Could not load achievements");
                return res.json();
            })
            .then(data => {
                // Update sidebar Level & Badges count
                if (userLevelVal) userLevelVal.innerText = `Level ${data.stats.userLevel}`;
                if (badgesUnlockedText) badgesUnlockedText.innerText = `${data.stats.unlockedCount} / ${data.stats.totalCount} Badges Unlocked`;

                grid.innerHTML = '';

                data.achievements.forEach(ach => {
                    const card = document.createElement('div');
                    card.className = 'glass-panel';
                    
                    // Style adjustments based on unlocked status
                    const opacity = ach.unlocked ? '1.0' : '0.65';
                    const iconColor = ach.unlocked ? ach.color : '#888';
                    const borderLeftColor = ach.unlocked ? ach.color : '#555';
                    const bgCircle = ach.unlocked ? `rgba(${hexToRgb(ach.color)}, 0.12)` : 'rgba(255, 255, 255, 0.05)';
                    const statusColor = ach.unlocked ? '#4ade80' : '#a0a0c0';
                    const titleColor = ach.unlocked ? ach.color : '#888';

                    card.style.background = 'rgba(0, 0, 0, 0.4)';
                    card.style.display = 'flex';
                    card.style.alignItems = 'center';
                    card.style.gap = '20px';
                    card.style.borderLeft = `5px solid ${borderLeftColor}`;
                    card.style.opacity = opacity;
                    card.style.padding = '25px';

                    card.innerHTML = `
                        <div style="font-size: 2.5rem; color: ${iconColor}; background: ${bgCircle}; padding: 15px; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; box-shadow: ${ach.unlocked ? '0 0 15px ' + bgCircle : 'none'}">
                            <i class="fa-solid ${ach.icon}"></i>
                        </div>
                        <div>
                            <h4 style="color: ${titleColor}; margin: 0 0 5px 0; font-family: 'Audiowide', sans-serif; font-size: 1.2rem;">${ach.title}</h4>
                            <p style="margin: 0; color: #e2e8f0; font-size: 0.95rem;">${ach.description}</p>
                            <span style="font-size: 0.85rem; color: ${statusColor}; font-weight: bold; display: block; margin-top: 8px; font-family: 'Audiowide', sans-serif;">
                                ${ach.unlocked ? '<i class="fa-solid fa-medal"></i> Unlocked' : ach.statusText}
                            </span>
                        </div>
                    `;

                    grid.appendChild(card);
                });
            })
            .catch(err => {
                console.error("Error loading achievements:", err);
                grid.innerHTML = `
                    <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>Failed to load achievements</h3>
                        <p>Database connection failure. Please reload the page.</p>
                    </div>
                `;
            });
    }

    // Helper to convert hex to rgb values
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
            : '255, 255, 255';
    }
});
