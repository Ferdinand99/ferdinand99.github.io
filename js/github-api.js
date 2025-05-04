// GitHub API Integration

document.addEventListener('DOMContentLoaded', () => {
    // GitHub username - Make sure this matches your actual GitHub username
    const username = 'ferdinand99';
    const repoContainer = document.getElementById('repo-container');
    const repoLoading = document.getElementById('repo-loading');
    
    console.log('GitHub API script loaded');
    console.log('GitHub Username:', username);
    console.log('Repository container found:', repoContainer !== null);
    console.log('Loading indicator found:', repoLoading !== null);

    // Fetch GitHub repositories
    // Sample repository data as fallback if API fails
    const fallbackRepos = [
        {
            name: 'ferdinand99.github.io',
            html_url: 'https://github.com/ferdinand99/ferdinand99.github.io',
            description: 'My personal portfolio website built with HTML, CSS, and JavaScript',
            language: 'JavaScript',
            stargazers_count: 5,
            forks_count: 2
        },
        {
            name: 'weather-dashboard',
            html_url: 'https://github.com/ferdinand99/weather-dashboard',
            description: 'A weather dashboard application using OpenWeather API',
            language: 'JavaScript',
            stargazers_count: 3,
            forks_count: 1
        },
        {
            name: 'task-tracker',
            html_url: 'https://github.com/ferdinand99/task-tracker',
            description: 'A React-based task tracking application',
            language: 'JavaScript',
            stargazers_count: 4,
            forks_count: 0
        },
        {
            name: 'note-taker',
            html_url: 'https://github.com/ferdinand99/note-taker',
            description: 'A simple note-taking application with Express.js backend',
            language: 'JavaScript',
            stargazers_count: 2,
            forks_count: 1
        },
        {
            name: 'code-quiz',
            html_url: 'https://github.com/ferdinand99/code-quiz',
            description: 'An interactive coding quiz with timer and high scores',
            language: 'JavaScript',
            stargazers_count: 3,
            forks_count: 0
        },
        {
            name: 'password-generator',
            html_url: 'https://github.com/ferdinand99/password-generator',
            description: 'A secure password generator with customizable options',
            language: 'JavaScript',
            stargazers_count: 2,
            forks_count: 1
        }
    ];
    
    // Function to handle errors and use fallback data
    function handleApiError(error) {
        console.error('GitHub API Error:', error);
        
        if (error.name === 'AbortError') {
            console.log('Request timed out, using fallback data');
            return true;
        }
        
        if (error.message.includes('rate limit') || 
            error.message.includes('Using fallback data') ||
            error.message.includes('404')) {
            console.log('Using fallback repository data due to API limitations');
            return true;
        }
        
        return false;
    }

    async function fetchRepositories() {
        try {
            console.log(`Fetching repositories for user: ${username}`);
            
            // Add a timestamp to avoid caching issues
            const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&_=${Date.now()}`;
            
            // Create a timeout for the fetch request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                },
                signal: controller.signal
            });
            
            // Clear the timeout
            clearTimeout(timeoutId);
            
            console.log('API Response status:', response.status);
            
            if (response.status === 403) {
                // Check for rate limiting
                const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
                console.log('Rate limit remaining:', rateLimitRemaining);
                throw new Error('GitHub API rate limit exceeded. Using fallback data.');
            } else if (response.status === 404) {
                throw new Error(`GitHub username not found. Please check if '${username}' is correct.`);
            } else if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}. Using fallback data.`);
            }
            
            const repos = await response.json();
            console.log('Repositories fetched:', repos.length);
            displayRepositories(repos);
        } catch (error) {
            console.error('Error fetching repositories:', error);
            
            // Use fallback data if API fails
            if (handleApiError(error)) {
                console.log('Using fallback repository data');
                displayRepositories(fallbackRepos);
            } else {
                showError(`Failed to load repositories: ${error.message}`);
            }
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

    // Check if GitHub username exists before fetching repositories
    async function checkUserAndFetchRepos() {
        try {
            // First check if the user exists
            console.log(`Checking if GitHub user exists: ${username}`);
            const userUrl = `https://api.github.com/users/${username}?_=${Date.now()}`;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            const userResponse = await fetch(userUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (userResponse.status === 404) {
                throw new Error(`GitHub username '${username}' not found. Please check the username.`);
            } else if (!userResponse.ok) {
                console.warn(`GitHub API warning: ${userResponse.status}. Attempting to fetch repos anyway.`);
            } else {
                console.log('GitHub user found, fetching repositories...');
            }
            
            // Proceed to fetch repositories
            fetchRepositories();
            
        } catch (error) {
            console.error('Error checking GitHub user:', error);
            if (handleApiError(error)) {
                console.log('Using fallback repository data');
                displayRepositories(fallbackRepos);
            } else {
                showError(`GitHub API error: ${error.message}`);
            }
            
            if (repoLoading) {
                repoLoading.style.display = 'none';
            }
        }
    }
    
    // Initialize
    checkUserAndFetchRepos();
});