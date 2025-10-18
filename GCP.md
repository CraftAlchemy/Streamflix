# Obtaining Google Cloud Project Configuration Values

This guide explains how to find the essential configuration values for your Google Cloud Platform (GCP) project. These values are commonly used in deployment scripts, CI/CD pipelines (like `cloudbuild.yaml`), and for connecting application services.

### Prerequisites

- You have an active Google Cloud Platform account.
- You have the [`gcloud` CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated (`gcloud auth login`).

---

### 1. `PROJECT_ID`

The Project ID is the unique, user-assigned ID for your GCP project.

#### Method 1: Using the GCP Console

1.  Navigate to the [GCP Console dashboard](https://console.cloud.google.com/home/dashboard).
2.  Ensure the correct project is selected in the project selector dropdown at the top of the page.
3.  On the dashboard, locate the **Project info** card. Your **Project ID** will be listed there.

#### Method 2: Using the `gcloud` CLI

Run the following command to get the ID of your currently configured project:

```bash
gcloud config get-value project
```

---

### 2. `REGION`

A region is a specific geographical location where you can host your resources (e.g., `us-central1`, `europe-west2`). You choose this value when creating resources like Cloud Run services or Artifact Registry repositories.

#### How to Choose/Find a Region

-   **Choosing**: For new resources, select a region that is geographically close to your users to minimize latency.
-   **Finding**: If you have existing resources, you can find their region in the GCP Console on the resource's details page.

To list all available regions for a service (like Compute Engine, which is a good proxy for most services), use the `gcloud` CLI:

```bash
gcloud compute regions list
```

For the purposes of the `CloudDeploy.md` guide, the `REGION` is the one you selected when creating the Artifact Registry and deploying the Cloud Run service (e.g., `us-central1`).

---

### 3. `ARTIFACT_REPO`

This is the name of the repository within Artifact Registry where your Docker images are stored.

#### How to Find the Repository Name

1.  In the GCP Console, navigate to **Artifact Registry**.
2.  Your repository name (e.g., `streamflix-repo`) will be listed. The full path used in commands will be `[REGION]-docker.pkg.dev/[PROJECT_ID]/[REPO_NAME]`.

To list your repositories using the `gcloud` CLI:

```bash
gcloud artifacts repositories list --location=[YOUR_REGION]
```

Replace `[YOUR_REGION]` with the region where you created the repository.

---

### 4. `DOMAIN`

This is the custom domain name (e.g., `www.your-app.com`) you want to use to serve your application. This is an optional but highly recommended step for production.

#### How to Get/Set a Custom Domain

You don't "get" this from GCP initially; you bring your own domain and map it.

1.  **Purchase a Domain**: Buy a domain from a registrar like Google Domains, GoDaddy, etc.
2.  **Verify Ownership**: In the GCP Console, you may need to verify that you own the domain. This is often done by adding a specific TXT record to your domain's DNS settings.
3.  **Map to Cloud Run**:
    -   Navigate to your **Cloud Run** service in the GCP Console.
    -   Go to the **Custom Domains** tab.
    -   Click **Add Mapping**.
    -   Follow the on-screen instructions to map your service to your domain. GCP will provide you with the DNS records (A, AAAA, or CNAME) that you need to add to your domain registrar's settings.

The `DOMAIN` value is simply the domain name you purchased and configured (e.g., `streamflix.mydomain.com`).

---

### 5. `DB_CONNECTION_NAME` (for Cloud SQL)

This value is only relevant if your application needs to connect to a Cloud SQL database. The current Streamflix application is a frontend-only static site and does **not** use a database.

However, if you were to add a backend that used Cloud SQL, here is how you would find the connection name.

#### Method 1: Using the GCP Console

1.  Navigate to **SQL** in the GCP Console.
2.  Click on the name of your database instance to go to its details page.
3.  On the **Overview** tab, find the **Connect to this instance** section. The **Connection name** will be listed there (it typically follows the format `[PROJECT_ID]:[REGION]:[INSTANCE_NAME]`).

#### Method 2: Using the `gcloud` CLI

```bash
gcloud sql instances describe [YOUR_INSTANCE_NAME] --format='value(connectionName)'
```

Replace `[YOUR_INSTANCE_NAME]` with the name of your Cloud SQL instance.
