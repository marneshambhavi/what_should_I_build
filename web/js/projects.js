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
    const completedCountSpan = document.getElementById('completed-count');
    const userLevelSpan = document.getElementById('user-level');

    // Fetch Stats from achievements servlet to update sidebar
    function fetchStats() {
        fetch('FetchAchievementsServlet')
            .then(res => {
                if (!res.ok) throw new Error("Stats fetch failed");
                return res.json();
            })
            .then(data => {
                if (savedCountSpan) savedCountSpan.innerText = data.stats.totalSaved;
                if (completedCountSpan) completedCountSpan.innerText = data.stats.totalCompleted;
                if (userLevelSpan) userLevelSpan.innerText = `Level ${data.stats.userLevel}`;
            })
            .catch(err => console.error("Error fetching stats:", err));
    }

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

                // Initial stats refresh
                fetchStats();

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
                    card.style.border = project.completed === 1 ? '1px solid #10b981' : '1px solid rgba(255, 255, 255, 0.15)';
                    card.style.transition = 'transform 0.3s, box-shadow 0.3s, opacity 0.3s';
                    card.style.padding = '25px';

                    // Compute deadline HTML
                    let deadlineHtml = '';
                    if (project.completed === 1) {
                        deadlineHtml = `<span style="font-size: 0.9rem; color: #10b981; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Completed!</span>`;
                    } else if (project.deadline && project.deadline.trim() !== "") {
                        const deadlineMs = parseInt(project.deadline);
                        const diff = deadlineMs - Date.now();
                        if (diff > 0) {
                            if (diff > 24 * 60 * 60 * 1000) {
                                const days = Math.ceil(diff / (24 * 60 * 60 * 1000));
                                deadlineHtml = `<span style="font-size: 0.9rem; color: #fbbf24; font-weight: bold;"><i class="fa-solid fa-clock"></i> ${days} days left</span>`;
                            } else {
                                const hours = Math.ceil(diff / (60 * 60 * 1000));
                                deadlineHtml = `<span style="font-size: 0.9rem; color: #fbbf24; font-weight: bold;"><i class="fa-solid fa-clock"></i> ${hours} hours left</span>`;
                            }
                        } else {
                            deadlineHtml = `<span style="font-size: 0.9rem; color: #ef4444; font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Overdue!</span>`;
                        }
                    } else {
                        deadlineHtml = `<span style="font-size: 0.9rem; color: var(--text-muted);"><i class="fa-solid fa-calendar"></i> No Deadline</span>`;
                    }

                    // Tech stack tag HTML
                    const techStackHtml = project.tech_stack ? `<span style="display: inline-block; padding: 4px 10px; font-size: 0.8rem; background: rgba(255,215,0,0.15); color: #ffd700; border-radius: 20px; font-weight: bold; margin-bottom: 12px; font-family: 'Audiowide', sans-serif;">${project.tech_stack}</span>` : '';

                    card.innerHTML = `
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                ${techStackHtml}
                                ${deadlineHtml}
                            </div>
                            <h4 style="color: #ffd700; font-family: 'Audiowide', sans-serif; font-size: 1.25rem; margin-top: 0; margin-bottom: 12px;">${project.title}</h4>
                            <p style="font-size: 1.05rem; line-height: 1.6; color: #e2e8f0; margin-bottom: 20px;">${project.description}</p>
                        </div>
                        <div style="display: flex; gap: 15px; margin-top: auto;">
                            <button class="btn-primary complete-btn" style="padding: 10px; font-size: 0.95rem; flex: 1; background-color: ${project.completed === 1 ? '#10b981' : '#3b82f6'};" ${project.completed === 1 ? 'disabled' : ''}>
                                <i class="fa-solid ${project.completed === 1 ? 'fa-square-check' : 'fa-check'}"></i> ${project.completed === 1 ? 'Completed!' : 'Mark Complete'}
                            </button>
                            <button class="btn-primary delete-btn" style="padding: 10px; font-size: 0.95rem; flex: 1; background-color: #ef4444;">
                                <i class="fa-solid fa-trash-can"></i> Delete
                            </button>
                        </div>
                    `;

                    // Handle completion
                    card.querySelector('.complete-btn').addEventListener('click', (e) => {
                        const btn = e.currentTarget;
                        btn.disabled = true;
                        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';

                        const params = new URLSearchParams();
                        params.append('title', project.title);

                        fetch('CompleteProjectServlet', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded'
                            },
                            body: params
                        })
                        .then(res => {
                            if (res.ok) {
                                btn.innerHTML = '<i class="fa-solid fa-square-check"></i> Completed!';
                                btn.style.backgroundColor = '#10b981';
                                card.style.border = '1px solid #10b981';
                                
                                // Refresh status text
                                const statusSpan = card.querySelector('div > div > span:last-child');
                                if (statusSpan) {
                                    statusSpan.innerHTML = `<i class="fa-solid fa-circle-check"></i> Completed!`;
                                    statusSpan.style.color = '#10b981';
                                }
                                
                                fetchStats();
                            } else {
                                btn.disabled = false;
                                btn.innerHTML = '<i class="fa-solid fa-check"></i> Mark Complete';
                                alert("Failed to mark project complete.");
                            }
                        })
                        .catch(err => {
                            btn.disabled = false;
                            btn.innerHTML = '<i class="fa-solid fa-check"></i> Mark Complete';
                            console.error(err);
                            alert("Connection error occurred.");
                        });
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
                    
                    fetchStats();

                    // If zero left, show empty state
                    const currentCount = parseInt(savedCountSpan.innerText) - 1;
                    if (currentCount <= 0) {
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
