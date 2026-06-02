document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch logged-in user name dynamically
    fetch('GetSessionServlet')
        .then(response => response.text())
        .then(username => {
            if (username && username.trim() !== "" && username !== "Guest") {
                const usernameSpan = document.querySelector('.username');
                if (usernameSpan) usernameSpan.innerText = username;
            }
        })
        .catch(err => console.error("Error fetching session:", err));

    // Mood Tracker Logic
    const moodBtns = document.querySelectorAll('.mood-btn');
    if (moodBtns.length > 0) {
        moodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                moodBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    const projectsGrid = document.getElementById('projects-grid');
    const savedCountSpan = document.getElementById('saved-count');

    // Fetch Saved Ideas from Servlet
    function loadSavedProjects() {
        fetch('FetchSavedIdeasServlet')
            .then(response => {
                if (response.status === 401) {
                    projectsGrid.innerHTML = `
                        <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                            <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: #f87171; margin-bottom: 15px;"></i>
                            <h3>Access Denied</h3>
                            <p style="margin-bottom: 20px;">Please login to see your saved projects.</p>
                            <a href="login.html" class="btn-primary" style="display: inline-block; width: auto; padding: 10px 30px;">Login Page</a>
                        </div>
                    `;
                    return null;
                }
                return response.json();
            })
            .then(projects => {
                if (!projects) return;

                // Update count
                if (savedCountSpan) savedCountSpan.innerText = projects.length;

                if (projects.length === 0) {
                    projectsGrid.innerHTML = `
                        <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                            <i class="fa-solid fa-lightbulb" style="font-size: 3rem; color: #ffd700; margin-bottom: 20px;"></i>
                            <h3>No Saved Projects Yet!</h3>
                            <p style="margin-bottom: 25px; color: var(--text-muted);">Go back to the dashboard and generate some awesome ideas to start building.</p>
                            <a href="index.html" class="btn-primary" style="display: inline-block; width: auto; padding: 12px 30px;">Go to Dashboard</a>
                        </div>
                    `;
                    return;
                }

                // Render projects
                projectsGrid.innerHTML = '';
                projects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'glass-panel';
                    card.style.display = 'flex';
                    card.style.flexDirection = 'column';
                    card.style.justifyContent = 'space-between';
                    card.style.background = 'rgba(0, 0, 0, 0.4)';
                    card.style.border = '1px solid rgba(255, 255, 255, 0.15)';
                    card.style.transition = 'transform 0.3s, box-shadow 0.3s, opacity 0.3s';
                    card.style.padding = '25px';

                    card.innerHTML = `
                        <div>
                            <h4 style="color: #ffd700; font-family: 'Audiowide', sans-serif; font-size: 1.25rem; margin-top: 0; margin-bottom: 12px;">${project.title}</h4>
                            <p style="font-size: 1.05rem; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">${project.description}</p>
                        </div>
                        <div style="display: flex; gap: 15px; margin-top: auto;">
                            <button class="btn-primary complete-btn" style="padding: 10px; font-size: 0.95rem; flex: 1; background-color: #3b82f6;">
                                <i class="fa-solid fa-check"></i> Mark Complete
                            </button>
                            <button class="btn-primary delete-btn" style="padding: 10px; font-size: 0.95rem; flex: 1; background-color: #ef4444;">
                                <i class="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </div>
                    `;

                    // Handle completion
                    card.querySelector('.complete-btn').addEventListener('click', (e) => {
                        const btn = e.currentTarget;
                        btn.innerHTML = '<i class="fa-solid fa-square-check"></i> Completed!';
                        btn.style.backgroundColor = '#10b981';
                        btn.disabled = true;
                        card.style.borderColor = '#10b981';
                    });

                    // Handle deletion
                    card.querySelector('.delete-btn').addEventListener('click', () => {
                        if (confirm(`Are you sure you want to remove "${project.title}" from your saved ideas?`)) {
                            deleteProject(project.title, card);
                        }
                    });

                    projectsGrid.appendChild(card);
                });
            })
            .catch(err => {
                console.error("Error loading projects:", err);
                projectsGrid.innerHTML = `
                    <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 40px; color: #ef4444;">
                        <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>Failed to load projects</h3>
                        <p>Database connection failure. Please reload the page.</p>
                    </div>
                `;
            });
    }

    // Delete saved idea via AJAX
    function deleteProject(title, cardElement) {
        const params = new URLSearchParams();
        params.append('title', title);

        fetch('DeleteSavedIdeaServlet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        })
        .then(response => {
            if (response.ok) {
                // Animate and remove from DOM
                cardElement.style.opacity = '0';
                cardElement.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    cardElement.remove();
                    // Update stats
                    const currentCount = parseInt(savedCountSpan.innerText) - 1;
                    savedCountSpan.innerText = currentCount;

                    // If zero left, show empty state
                    if (currentCount === 0) {
                        projectsGrid.innerHTML = `
                            <div class="glass-panel" style="grid-column: 1/-1; text-align: center; padding: 50px;">
                                <i class="fa-solid fa-lightbulb" style="font-size: 3rem; color: #ffd700; margin-bottom: 20px;"></i>
                                <h3>No Saved Projects Yet!</h3>
                                <p style="margin-bottom: 25px; color: var(--text-muted);">Go back to the dashboard and generate some awesome ideas to start building.</p>
                                <a href="index.html" class="btn-primary" style="display: inline-block; width: auto; padding: 12px 30px;">Go to Dashboard</a>
                            </div>
                        `;
                    }
                }, 300);
            } else {
                alert("Failed to delete project. Please try again.");
            }
        })
        .catch(err => {
            console.error("Error deleting project:", err);
            alert("Connection error occurred while deleting.");
        });
    }

    // Run on load
    loadSavedProjects();
});
