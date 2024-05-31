## Using GitHub for Beehive Poster Viewer

This article provides a step-by-step guide on how to use GitHub for managing and deploying the Beehive Poster Viewer project. The repository for this project is publicly available and open-source, hosted on GitHub at [https://github.com/micahchoo/beehive_poster_viewer](https://github.com/micahchoo/beehive_poster_viewer). The repository includes HTML, JavaScript, CSS, and scene definitions in XML, a low-quality sample image with dzi tiles is also provided.

### 1. Forking the Repository

Forking a repository allows you to create your own copy of the repository under your GitHub account. This is useful for making changes without affecting the original project.

#### Steps to Fork a Repository:
1. **Navigate to the Repository**: Go to [https://github.com/micahchoo/beehive_poster_viewer](https://github.com/micahchoo/beehive_poster_viewer).
2. **Fork the Repository**: Click on the "Fork" button at the top-right corner of the page. This will create a copy of the repository under your GitHub account.
3. **Clone the Forked Repository**: Clone the repository to your local machine using the following command:
   ```bash
   git clone https://github.com/YOUR_USERNAME/beehive_poster_viewer.git
   ```
   Replace `YOUR_USERNAME` with your GitHub username.

### 2. Using GitHub Desktop to Send Commits

GitHub Desktop is a user-friendly application that simplifies the process of managing Git repositories. It allows you to commit changes, create branches, and push updates to GitHub.

#### Steps to Use GitHub Desktop:
1. **Download and Install GitHub Desktop**: Download GitHub Desktop from [desktop.github.com](https://desktop.github.com/) and install it.
2. **Clone the Repository**: Open GitHub Desktop and clone your forked repository by selecting "File" > "Clone Repository" and choosing your forked repository.
3. **Make Changes**: Open the repository in your preferred code editor and make the necessary changes.
4. **Commit Changes**: In GitHub Desktop, you will see the changes listed. Add a summary of the changes and click "Commit to main".
5. **Push Changes**: Click "Push origin" to push your commits to GitHub.

### 3. Using GitHub Pages to Deploy

GitHub Pages allows you to host static websites directly from a GitHub repository. The Beehive Poster Viewer repository includes a `static.yml` file under `.github/actions` that can be used to deploy the project as a webpage.

#### Steps to Deploy Using GitHub Pages:
1. **Enable GitHub Pages**: Go to the settings of your forked repository on GitHub. Under the "Pages" section, select the branch you want to deploy from (usually `main`) and click "Save".
2. **Configure GitHub Actions**: Ensure that the `static.yml` file is correctly configured to build and deploy your site. This file is located at `.github/actions/static.yml`.
3. **Add Query Parameters**: Remember to add the necessary query parameters to the URL as specified in the original instructions.
4. **Deploy**: Once the configuration is complete, GitHub Actions will automatically build and deploy your site. You can access your site at `https://YOUR_USERNAME.github.io/beehive_poster_viewer`.
