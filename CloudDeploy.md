# Production Deployment to Google Cloud Run

This document provides a comprehensive guide for deploying the Streamflix web application to Google Cloud Run, a fully managed serverless platform. This approach ensures a scalable, secure, and cost-effective production environment.

We will containerize the application using Docker, push the container image to Google Artifact Registry, and then deploy it as a service on Cloud Run.

## Prerequisites

Before you begin, ensure you have the following:

1.  **Google Cloud Platform (GCP) Account**: An active GCP account with billing enabled.
2.  **`gcloud` CLI**: The [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) installed and authenticated on your local machine.
3.  **Docker**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running locally.
4.  **Node.js**: The latest LTS version of [Node.js](https://nodejs.org/) and `npm`.
5.  **Project Source Code**: The complete Streamflix application code.

---

## Step 1: Prepare the Project for Production Build

The current development setup is not optimized for production. Before containerizing, you **must** convert the project into a standard Vite project, which bundles and optimizes all assets.

**Follow all the instructions in the `DeployInstruction.md` file** to restructure the project, install dependencies from `npm`, and create the necessary configuration files (`vite.config.ts`, `tailwind.config.js`, etc.).

After completing this step, you should have a project that can be built for production using the `npm run build` command.

---

## Step 2: Containerize the Application

We will use a multi-stage `Dockerfile` to create a small, efficient, and secure production image. This process first builds the static assets and then serves them using a lightweight Nginx web server.

**1. Create the `Dockerfile`**

Create a new file named `Dockerfile` in the root of your project with the following content:

```dockerfile
# ---- Stage 1: Build ----
# Use a Node.js image to build the Vite/React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application for production
RUN npm run build


# ---- Stage 2: Serve ----
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Copy the built static files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file
# This is crucial for a Single Page Application (SPA) to handle routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# The command to start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
```

**2. Create the Nginx Configuration File**

For a Single Page Application (SPA) like this one, we need to configure Nginx to redirect all routing requests to `index.html`.

Create a new file named `nginx.conf` in the root of your project:

```nginx
server {
  listen       80;
  server_name  localhost;

  # Serve static files from this directory
  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    # If a file or directory is not found, fall back to /index.html
    try_files $uri $uri/ /index.html;
  }

  # Add security headers for best practice
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-Content-Type-Options "nosniff";
  add_header X-XSS-Protection "1; mode=block";
}
```

**3. Create a `.dockerignore` file**

To keep our Docker image small and build times fast, we should prevent unnecessary files from being copied into the container. Create a `.dockerignore` file in the project root:

```
# Git
.git
.gitignore

# Node dependencies
node_modules

# Vite build output
dist

# Environment files
.env*

# IDE/Editor folders
.vscode/
.idea/
```

---

## Step 3: Configure Google Cloud Services

**1. Set Project Configuration**
   Set your active GCP project in the `gcloud` CLI.
   ```bash
   gcloud config set project [YOUR_PROJECT_ID]
   ```
   Replace `[YOUR_PROJECT_ID]` with your actual Google Cloud Project ID.

**2. Enable APIs**
   Enable the Artifact Registry and Cloud Run APIs for your project.
   ```bash
   gcloud services enable artifactregistry.googleapis.com run.googleapis.com
   ```

**3. Create an Artifact Registry Repository**
   This repository will store your Docker images.
   ```bash
   gcloud artifacts repositories create streamflix-repo \
     --repository-format=docker \
     --location=[YOUR_REGION] \
     --description="Docker repository for Streamflix application"
   ```
   Replace `[YOUR_REGION]` with a region like `us-central1`.

**4. Configure Docker Authentication**
   Configure the Docker CLI to authenticate with your new Artifact Registry repository.
   ```bash
   gcloud auth configure-docker [YOUR_REGION]-docker.pkg.dev
   ```

---

## Step 4: Build and Push the Docker Image

Now we will build the Docker image and push it to Artifact Registry.

**1. Build the Docker Image**
   Run the following command from your project root. This tags the image with the correct path for Artifact Registry.
   ```bash
   docker build -t [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/streamflix-repo/streamflix-frontend:latest .
   ```
   Remember to replace `[YOUR_REGION]` and `[YOUR_PROJECT_ID]`.

**2. Push the Docker Image**
   Push the locally built image to your repository.
   ```bash
   docker push [YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/streamflix-repo/streamflix-frontend:latest
   ```

---

## Step 5: Deploy to Cloud Run

With the image in Artifact Registry, you can now deploy it as a Cloud Run service.

```bash
gcloud run deploy streamflix-frontend \
  --image=[YOUR_REGION]-docker.pkg.dev/[YOUR_PROJECT_ID]/streamflix-repo/streamflix-frontend:latest \
  --platform=managed \
  --region=[YOUR_REGION] \
  --port=80 \
  --allow-unauthenticated
```

- `--port=80`: Matches the port exposed by Nginx in the `Dockerfile`.
- `--allow-unauthenticated`: Makes the website publicly accessible.

After the command completes, it will output the **Service URL**. You can visit this URL in your browser to see your deployed application!

---

## Step 6: Continuous Deployment (CI/CD) with Cloud Build (Recommended)

For a real-world production setup, you should automate the build and deploy process using a CI/CD pipeline. Google Cloud Build is an excellent tool for this.

**1. Create a `cloudbuild.yaml` file**

Create this file in your project root. It tells Cloud Build how to build, push, and deploy your application.

```yaml
steps:
# 1. Build the Docker image
- name: 'gcr.io/cloud-builders/docker'
  args:
  - 'build'
  - '-t'
  - '${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPO_NAME}/${_SERVICE_NAME}:latest'
  - '.'

# 2. Push the Docker image to Artifact Registry
- name: 'gcr.io/cloud-builders/docker'
  args:
  - 'push'
  - '${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPO_NAME}/${_SERVICE_NAME}:latest'

# 3. Deploy the image to Cloud Run
- name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
  entrypoint: gcloud
  args:
  - 'run'
  - 'deploy'
  - '${_SERVICE_NAME}'
  - '--image=${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPO_NAME}/${_SERVICE_NAME}:latest'
  - '--region'
  - '${_LOCATION}'
  - '--platform'
  - 'managed'
  - '--allow-unauthenticated'

substitutions:
  _SERVICE_NAME: 'streamflix-frontend'
  _REPO_NAME: 'streamflix-repo'
  _LOCATION: '[YOUR_REGION]' # e.g., us-central1

images:
- '${_LOCATION}-docker.pkg.dev/$PROJECT_ID/${_REPO_NAME}/${_SERVICE_NAME}:latest'
```
Update `_LOCATION` with your region.

**2. Create a Cloud Build Trigger**

1.  Push your project code (including `cloudbuild.yaml`) to a Git repository (e.g., GitHub, GitLab, or Cloud Source Repositories).
2.  In the GCP Console, navigate to **Cloud Build** -> **Triggers**.
3.  Click **Create Trigger**.
4.  Give the trigger a name, connect it to your Git repository, and configure it to run when changes are pushed to a specific branch (e.g., `main` or `production`).
5.  Under **Configuration**, select **Cloud Build configuration file (yaml or json)** and leave the location as `cloudbuild.yaml`.

Now, every time you push code to your specified branch, Cloud Build will automatically build and deploy the new version of your application to Cloud Run.
