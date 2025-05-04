// GitHub API Integration

document.addEventListener('DOMContentLoaded', () => {
    // GitHub username
    const username = 'ferdinand99';
    const repoContainer = document.getElementById('repo-container');
    const repoLoading = document.getElementById('repo-loading');
    
    console.log('GitHub API script loaded');
    console.log('Repository container found:', repoContainer !== null);
    console.log('Loading indicator found:', repoLoading !== null);

    // Fetch GitHub repositories
    async function fetchRepositories() {
        try {
            console.log(`Fetching repositories for user: ${username}`);
            
            // Add a timestamp to avoid caching issues
            const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&_=${Date.now()}`;
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            console.log('API Response status:', response.status);
            
            if (response.status === 403) {
                // Check for rate limiting
                const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
                console.log('Rate limit remaining:', rateLimitRemaining);
                throw new Error('GitHub API rate limit exceeded. Please try again later.');
            } else if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const repos = await response.json();
            console.log('Repositories fetched:', repos.length);
            displayRepositories(repos);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            showError(`Failed to load repositories: ${error.message}`);
        } finally {
            if (repoLoading) {
                repoLoading.style.display = 'none';
            }
        }
    }

    // Display repositories in the UI
    function displayRepositories(repos) {
        if (!repoContainer) {
            console.error('Repository container element not found');
            return;
        }
        
        // Clear any existing content
        repoContainer.innerHTML = '';
        
        if (repos.length === 0) {
            console.log('No repositories found');
            repoContainer.innerHTML = '<p class="no-repos">No repositories found.</p>';
            return;
        }
        
        console.log('Displaying repositories...');

        repos.forEach(repo => {
            // Create repository card
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            
            // Repository name with link
            const repoName = document.createElement('h3');
            repoName.className = 'repo-name';
            const repoLink = document.createElement('a');
            repoLink.href = repo.html_url;
            repoLink.target = '_blank';
            repoLink.textContent = repo.name;
            repoName.appendChild(repoLink);
            
            // Repository description
            const repoDesc = document.createElement('p');
            repoDesc.className = 'repo-description';
            repoDesc.textContent = repo.description || 'No description available';
            
            // Repository stats (stars, forks, language)
            const repoStats = document.createElement('div');
            repoStats.className = 'repo-stats';
            
            // Stars count
            const stars = document.createElement('div');
            stars.className = 'repo-stat';
            stars.innerHTML = `<i class="fas fa-star"></i> ${repo.stargazers_count}`;
            
            // Forks count
            const forks = document.createElement('div');
            forks.className = 'repo-stat';
            forks.innerHTML = `<i class="fas fa-code-branch"></i> ${repo.forks_count}`;
            
            // Primary language (if available)
            if (repo.language) {
                const language = document.createElement('div');
                language.className = 'repo-stat';
                language.innerHTML = `<i class="fas fa-code"></i> ${repo.language}`;
                repoStats.appendChild(language);
            }
            
            repoStats.appendChild(stars);
            repoStats.appendChild(forks);
            
            // Repository links
            const repoLinks = document.createElement('div');
            repoLinks.className = 'repo-links';
            
            // GitHub link
            const githubLink = document.createElement('a');
            githubLink.className = 'repo-link';
            githubLink.href = repo.html_url;
            githubLink.target = '_blank';
            githubLink.innerHTML = '<i class="fab fa-github"></i> View on GitHub';
            repoLinks.appendChild(githubLink);
            
            // Add all elements to the card
            repoCard.appendChild(repoName);
            repoCard.appendChild(repoDesc);
            repoCard.appendChild(repoStats);
            repoCard.appendChild(repoLinks);
            
            // Add card to container
            repoContainer.appendChild(repoCard);
        });
    }

    // Show error message
    function showError(message) {
        if (!repoContainer) return;
        
        repoContainer.innerHTML = `<div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
        </div>`;
    }

    // Initialize
    fetchRepositories();
});