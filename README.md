# 🐳 Dockerized Node.js Service

**Project URL:** https://roadmap.sh/projects/dockerized-service-deployment

A simple **Node.js** service containerized with **Docker** and prepared for deployment to a remote Linux server using **Ansible** and **GitHub Actions**.

This project was developed as an implementation of the [Dockerized Service](https://roadmap.sh/projects/docker-nodejs-service) project from [roadmap.sh](https://roadmap.sh/).

The project focuses on building a Node.js service, protecting a route with Basic Authentication, containerizing the application, configuring a remote Linux server with Ansible, and automating deployment with GitHub Actions.

---

## 🚀 Features

### Node.js Service

* `GET /` route returning a simple response
* `GET /secret` route protected by Basic Authentication
* Environment-based configuration using `dotenv`
* Validation of required environment variables

### Docker

* Dockerized Node.js application
* Lightweight Alpine-based Node.js image
* Runtime environment variable injection
* `.env` excluded from the Docker image
* `.dockerignore` configuration

### Ansible

* Remote server configuration using Ansible
* Reusable `base` role for common server configuration
* `app` role for Docker installation and application deployment
* Docker service configuration on the remote server

### CI/CD

* Docker image build through GitHub Actions
* Docker image publishing to a container registry
* Automated deployment to a remote Linux server
* ARM64 Docker image support for the target Oracle Cloud server

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* Docker
* Ansible
* GitHub Actions
* GitHub Container Registry
* dotenv
* Linux
* SSH

---

## 🏗️ Architecture

The application and infrastructure are organized into separate areas:

```text
                        ┌──────────────────────┐
                        │       GitHub         │
                        │     Repository       │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │   GitHub Actions     │
                        │                      │
                        │  Build Docker Image  │
                        │   Push to Registry   │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │  Container Registry  │
                        │        GHCR          │
                        └──────────┬───────────┘
                                   │
                                   │ Docker Pull
                                   ▼
                        ┌──────────────────────┐
                        │   Remote Linux      │
                        │      Server         │
                        └──────────┬───────────┘
                                   │
                                   ▼
                        ┌──────────────────────┐
                        │ Docker Container     │
                        │                      │
                        │    Node.js + Express │
                        └──────────────────────┘
```

---

## 📂 Project Structure

```text
docker-nodejs-service/
├── app/
│   ├── .env
│   ├── config/
│   │   └── index.js
│   ├── sample/
│   │   └── .env.sample
│   ├── src/
│   │   └── index.js
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
│
├── ansible/
│   ├── group_vars/
│   │   └── servers
│   │   │       └── vault.yml
│   ├── inventory/
│   │   └── hosts.ini
│   ├── roles/
│   │   ├── app/
│   │   │   └── tasks/
│   │   │       └── main.yml
│   │   └── base/
│   │       └── tasks/
│   │           └── main.yml
│   └── playbook.yml
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
└── README.md
```

---

## ⚙️ Requirements

Make sure the following tools are installed locally:

* [Node.js](https://nodejs.org/)
* npm
* [Docker](https://www.docker.com/)
* [Ansible](https://docs.ansible.com/)

For remote deployment, you also need:

* A Linux server
* SSH access to the server
* A private SSH key
* Ansible access to the remote server

---

## 🔐 Environment Variables

The application requires the following environment variables:

```env
PORT=3000
SECRET_MESSAGE=here the secret message
USERNAME=here the username
PASSWORD=here the password
```

A sample configuration is provided in:

```text
app/sample/.env.sample
```

Create the actual environment file at:

```text
app/.env
```

Example:

```env
PORT=3000
SECRET_MESSAGE=here the secret message
USERNAME=tcontreras
PASSWORD=Hola#1234
```

The real `.env` file must never be committed to the repository.

---

## ▶️ Running Locally

Navigate to the application directory:

```bash
cd app
```

Install dependencies:

```bash
npm install
```

Start the application:

```bash
npm run dev
```

The server will be available at:

```text
http://localhost:3000
```

---

## 🔌 API Endpoints

### `GET /`

Returns a basic response to verify that the service is running.

#### Example

```http
GET /
```

#### Response

```text
Hello, World!
```

---

### `GET /secret`

Returns the configured secret message after successful Basic Authentication.

```http
GET /secret
```

When accessed from a browser without credentials, the server responds with:

```http
401 Unauthorized
WWW-Authenticate: Basic realm="Restricted"
```

The browser then displays its built-in username and password dialog.

After successful authentication, the configured secret message is returned.

#### Example

```text
here the secret message
```

---

## 🔐 Basic Authentication

The `/secret` endpoint uses HTTP Basic Authentication.

The authentication flow is:

```text
Browser
   ↓
GET /secret
   ↓
401 Unauthorized
WWW-Authenticate: Basic
   ↓
Browser displays login dialog
   ↓
User enters username and password
   ↓
Authorization: Basic <encoded credentials>
   ↓
Server decodes credentials
   ↓
Credentials compared with environment variables
   ↓
200 OK + secret message
```

Basic Authentication encodes the credentials using Base64. Base64 is not encryption, so Basic Authentication should be used over HTTPS in production environments.

---

## 🐳 Docker

The application is containerized using Docker.

The Dockerfile is located at:

```text
app/Dockerfile
```

### Build the Image

From the repository root:

```bash
docker build -t docker-nodejs-service ./app
```

### Run the Container

The `.env` file is provided at runtime and is not included in the image:

```bash
docker run --rm \
  --env-file ./app/.env \
  -p 3000:3000 \
  docker-nodejs-service
```

The application will be available at:

```text
http://localhost:3000
```

### Verify the Container

Test the public route:

```bash
curl http://localhost:3000
```

Expected response:

```text
Hello, World!
```

Test the protected route:

```bash
curl -i http://localhost:3000/secret
```

The response should contain:

```http
401 Unauthorized
```

Test with credentials:

```bash
curl -i -u 'tcontreras:Hola#1234' http://localhost:3000/secret
```

The configured secret message should be returned.

---

## 🛡️ Docker Security

The `.env` file is intentionally excluded from the Docker image.

The project uses:

```text
app/.dockerignore
```

to prevent sensitive files and unnecessary files from being copied into the image.

Environment variables are provided when the container starts:

```bash
docker run --env-file ./app/.env ...
```

This keeps credentials outside the Docker image.

---

## 🤖 Ansible

Ansible is used to configure the remote Linux server and prepare it to run the Dockerized application.

The Ansible configuration is located in:

```text
ansible/
```

### Inventory

The remote server is defined in:

```text
ansible/inventory/hosts.ini
```

Example:

```ini
[servers]
ansible-server ansible_host=YOUR_SERVER_IP ansible_user=ubuntu
```

The SSH private key is provided externally when running Ansible:

```bash
--private-key ~/.ssh/your-private-key
```

The private key is never stored in the repository.

---

## 🧩 Ansible Roles

The project uses two roles.

### `base`

The `base` role is responsible for generic server configuration, including:

* Updating the APT package cache
* Installing basic utilities
* Installing and configuring Fail2ban
* Configuring firewall rules
* Saving firewall configuration

### `app`

The `app` role is responsible for application infrastructure, including:

* Installing Docker
* Configuring Docker
* Starting and enabling the Docker service
* Preparing the server to run the application container

Docker is installed on the remote server through Ansible rather than manually.

---

## ▶️ Running Ansible

Test the connection to the remote server:

```bash
ansible servers \
  -i ansible/inventory/hosts.ini \
  --private-key ~/.ssh/your-private-key \
  -m ping
```

A successful connection should return:

```text
ansible-server | SUCCESS => {
    "changed": false,
    "ping": "pong"
}
```

Run the complete playbook:

```bash
ansible-playbook \
  -i ansible/inventory/hosts.ini \
  --private-key ~/.ssh/your-private-key \
  ansible/playbook.yml
```

The playbook applies the `base` and `app` roles to the remote server.

---

## ☁️ Remote Server

The project is designed to run on a remote Linux server.

The target server architecture is:

```text
ARM64 / aarch64
```

The Docker image is built for:

```text
linux/arm64
```

This ensures compatibility between the Docker image and the target Oracle Cloud server.

---

## 🔄 CI/CD

GitHub Actions is used to automate the Docker image build and deployment process.

The intended deployment flow is:

```text
Developer pushes code
        ↓
GitHub Actions
        ↓
Build Docker image
        ↓
Build image for linux/arm64
        ↓
Push image to GHCR
        ↓
Connect to remote server
        ↓
Pull new Docker image
        ↓
Restart application container
```

The workflow is located at:

```text
.github/workflows/deploy.yml
```

---

## 📦 Container Registry

The project uses **GitHub Container Registry (GHCR)** to store Docker images.

The image follows the format:

```text
ghcr.io/<github-user>/<repository>:latest
```

GitHub Actions uses the automatically provided `GITHUB_TOKEN` to authenticate when publishing the image.

---

## 🔒 Secrets Management

Sensitive information is kept outside the Docker image and source repository.

Examples of sensitive values include:

* Basic Auth username
* Basic Auth password
* Secret message
* SSH private key

These values should be stored using environment variables, GitHub Actions Secrets, or files that exist only on the remote server.

The following files should never contain production credentials:

```text
Dockerfile
README.md
Source code
Git history
```

---

## 🧪 Testing

The service can be tested locally with Docker:

```bash
docker build -t docker-nodejs-service ./app
```

Run the container:

```bash
docker run --rm \
  --env-file ./app/.env \
  -p 3000:3000 \
  docker-nodejs-service
```

Test the public endpoint:

```bash
curl http://localhost:3000
```

Test Basic Authentication:

```bash
curl -i -u 'tcontreras:Hola#1234' \
  http://localhost:3000/secret
```

---

## 🗺️ Project Requirements

This project covers the four main parts of the roadmap.sh challenge:

### Part 1 — Creating a Node.js Service

* Create a Node.js service
* Implement `/`
* Implement protected `/secret`
* Use environment variables
* Implement Basic Authentication

### Part 2 — Dockerizing the Node.js Service

* Create a Dockerfile
* Build the Docker image
* Run the image locally
* Keep `.env` outside the image

### Part 3 — Setting Up a Remote Linux Server

* Provision and configure a remote Linux server
* Install Docker using Ansible
* Configure the server using reusable Ansible roles

### Part 4 — Deploying the Dockerized Service

* Build the Docker image through GitHub Actions
* Push the image to a container registry
* Deploy the image to the remote Linux server
* Run the service inside Docker

---

## 🚧 Future Improvements

* Add automated tests
* Add Docker health checks
* Add container restart and deployment verification
* Use immutable image tags based on Git commit SHA
* Add rollback support
* Add HTTPS with a reverse proxy
* Add monitoring and logging
* Improve deployment zero-downtime strategy

---

## 🧑‍💻 Author

**Tommy Contreras**

---

## 📄 License

This project was created for educational purposes as part of a [roadmap.sh](https://roadmap.sh/) project.
````
