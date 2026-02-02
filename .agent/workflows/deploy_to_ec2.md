---
description: Guide to deploy the application to AWS EC2 using Docker Compose
---

# Deploying to AWS EC2

This guide will walk you through deploying your Next.js application + PostgreSQL database to an AWS EC2 instance.

## Prerequisites

1.  **AWS Account**: You need an active AWS account.
2.  **SSH Client**: Terminal on Mac/Linux or PowerShell/PuTTY on Windows.
3.  **Git Repository**: Your code should be pushed to a remote repository (GitHub, GitLab, etc.).

## Step 1: Launch an EC2 Instance

1.  Login to AWS Console and go to **EC2**.
2.  Click **Launch Instances**.
3.  **Name**: `refrigerai-server` (or anything you like).
4.  **OS Image**: Choose **Ubuntu Server 24.04 LTS** (recommended) or 22.04 LTS.
5.  **Instance Type**: `t3.small` or `t3.medium` is recommended. `t2.micro` might run out of memory during build.
6.  **Key Pair**: Create a new key pair (e.g., `refrigerai-key`), download the `.pem` file, and **keep it safe**.
7.  **Network Settings**:
    - Check **Allow SSH traffic from**.
    - Check **Allow HTTP traffic from the internet**.
    - Check **Allow HTTPS traffic from the internet**.
    - **IMPORTANT**: You also need to open port **3000**.
      - Click "Edit" in Network Settings.
      - Add a Security Group rule: Type: `Custom TCP`, Port range: `3000`, Source: `0.0.0.0/0` (Anywhere).

## Step 2: Connect to your Instance

Open your terminal where your `.pem` key file is located.

```bash
# Set permissions for your key file (only needs to be done once)
chmod 400 refrigerai-key.pem

# Connect to the instance (replace generic-ip with your EC2 Public IPv4 address)
ssh -i "refrigerai-key.pem" ubuntu@<your-ec2-public-ip>
```

## Step 3: Install Docker & Git

Run the following commands on your EC2 instance:

```bash
# Update package list
sudo apt update

# Install Docker and Docker Compose
sudo apt install -y docker.io docker-compose-v2 git

# Start and enable Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to the docker group (avoids using sudo for docker commands)
sudo usermod -aG docker $USER
```

_Note: You may need to logout and log back in for the group change to take effect. Type `exit` and reconnect via SSH._

## Step 4: Clone and Setup

1.  **Clone your repository**:

    ```bash
    git clone <your-repository-url>
    cd refrigerai
    ```

2.  **Set up Environment Variables**:
    You need to create the `.env.local` file on the server.

    ```bash
    nano .env.local
    ```

    - Paste the contents of your local `.env.local` file here.
    - **Important**: Update `AUTH_URL` (and `NEXTAUTH_URL` if used) to `http://<your-ec2-public-ip>:3000` (or your domain/https URL).
    - **Tip**: In the terminal, right-click usually creates a paste action.
    - Press `Ctrl+O`, `Enter` to save, and `Ctrl+X` to exit.

## Step 5: Run the Application

Run the application using Docker Compose.

```bash
docker compose up -d --build
```

- `up`: Starts the containers.
- `-d`: Detached mode (runs in the background).
- `--build`: Forces a rebuild of the images.

## Step 6: Verify

Open your browser and visit:
`http://<your-ec2-public-ip>:3000`

You should see your application running!

---

## Maintenance

### Updating the App

When you push new code to your repository:

1.  SSH into the server.
2.  Navigate to the folder: `cd refrigerai`
3.  Pull changes: `git pull`
4.  Rebuild and restart: `docker compose up -d --build`

### Viewing Logs

To see logs if something goes wrong:

```bash
docker compose logs -f app
```
