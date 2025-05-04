# Portfolio Website

A clean and beautiful portfolio website that showcases GitHub repositories, personal information, and contact details. This website is designed to be hosted on GitHub Pages.

## Features

- Responsive design that works on all devices
- GitHub API integration to display your repositories
- About Me section to showcase your skills and experience
- Contact section with social media links
- Modern and clean UI with smooth animations

## Getting Started

### Prerequisites

- A GitHub account
- Basic knowledge of HTML, CSS, and JavaScript (for customization)

### Customization

1. **Personal Information**
   - Open `index.html` and update the following sections:
     - Your name in the header and hero section
     - Your professional title in the hero section
     - About Me content
     - Skills list
     - Contact information and social media links

2. **GitHub Username**
   - Open `js/github-api.js` and update the `username` variable with your GitHub username

3. **Styling**
   - Customize colors in `css/style.css` by modifying the CSS variables in the `:root` selector

### Deployment on GitHub Pages

1. Create a new repository named `yourusername.github.io` (replace "yourusername" with your actual GitHub username)
2. Push the code to this repository
3. Go to the repository settings on GitHub
4. Scroll down to the "GitHub Pages" section
5. Select the main branch as the source
6. Click Save
7. Your site will be published at `https://yourusername.github.io`

## Project Structure

```
├── index.html              # Main HTML file
├── css/
│   ├── normalize.css       # CSS reset
│   └── style.css           # Main stylesheet
├── js/
│   ├── main.js             # Main JavaScript file
│   └── github-api.js       # GitHub API integration
└── assets/
    └── images/             # Images for the website
```

## Customization Tips

- **Adding Projects Manually**: If you want to showcase specific projects that aren't on GitHub, you can add them directly to the HTML in the projects section.
- **Changing Colors**: The website uses CSS variables for colors. You can easily change the color scheme by modifying the variables in the `:root` selector in `style.css`.
- **Adding More Sections**: You can add more sections by following the same structure as the existing sections.

## License

This project is open source and available under the [MIT License](LICENSE).