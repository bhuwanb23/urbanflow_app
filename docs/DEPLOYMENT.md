# Deployment Guide

This document describes how to wire up real deployment jobs for the UrbanFlow
CI/CD pipeline. The workflow in `.github/workflows/ci-cd.yml` ships with
intentional placeholders in the `deploy-staging` and `deploy-production`
jobs. Pick a platform and follow the matching section.

## Table of contents

- [Prerequisites](#prerequisites)
- [GitHub Environments](#github-environments)
- [Option A: VPS via SSH](#option-a-vps-via-ssh)
- [Option B: Railway](#option-b-railway)
- [Option C: Fly.io](#option-c-flyio)
- [Option D: Self-hosted Kubernetes](#option-d-self-hosted-kubernetes)
- [Verifying a deploy](#verifying-a-deploy)

## Prerequisites

1. GH repo Settings → Environments → create `staging` and `production`
   - `staging`: no required reviewers
   - `production`: required reviewers (≥1)
2. Add the platform's secrets as environment-scoped secrets
   (Settings → Environments → _env_ → Secrets), not repo-level
3. Container images must be pushed to a registry first. Add a `docker-push`
   job before deploy, or have the platform pull from GHCR.

## GitHub Environments

```
Settings → Environments → New environment

Name: staging
  - No required reviewers (auto-deploy on develop)
  - Secrets:
      STAGING_DEPLOY_TOKEN
      STAGING_API_URL
      STAGING_DB_URL (if external DB)

Name: production
  - Required reviewers: 1+
  - Wait timer: 5 minutes
  - Secrets:
      PROD_DEPLOY_TOKEN
      PROD_API_URL
      PROD_DB_URL
      PROD_DELHI_API_KEY
      PROD_TOMTOM_API_KEY
```

## Option A: VPS via SSH

Use when you have a single VPS (or small fleet) and want full control.

1. Provision a Linux VPS (Ubuntu 22.04+, Docker installed)
2. Add the SSH key as a repo secret: `STAGING_SSH_KEY`
3. Add `STAGING_HOST` and `STAGING_USER` as env secrets
4. Replace the placeholder body in `deploy-staging`:

   ```yaml
   - name: Deploy to staging
     uses: appleboy/ssh-action@v1.0.3
     with:
       host: ${{ secrets.STAGING_HOST }}
       username: ${{ secrets.STAGING_USER }}
       key: ${{ secrets.STAGING_SSH_KEY }}
       script: |
         cd /opt/urbanflow
         git pull origin develop
         docker compose pull
         docker compose up -d
         docker compose exec -T backend node -e "require('http').get('http://localhost:3000/health')"
   ```

## Option B: Railway

Easiest path; free tier covers small staging workloads.

1. Sign in at <https://railway.app> with GitHub
2. New Project → Deploy from GitHub repo
3. Create two services: `urbanflow-backend` and `urbanflow-frontend`
4. Add the Railway API token as repo secret `RAILWAY_TOKEN`
5. Replace the deploy body:

   ```yaml
   - name: Install Railway CLI
     run: npm install -g @railway/cli

   - name: Deploy backend to Railway staging
     run: railway up --service urbanflow-backend --environment staging
     env:
       RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
   ```

## Option C: Fly.io

Mid-weight, more config than Railway, lower cost at scale.

1. `fly auth signup`
2. `fly launch` in both `backend/` and `urbanflow_app/` (separate apps)
3. Add `FLY_API_TOKEN` as repo secret
4. Replace the deploy body:

   ```yaml
   - name: Install Fly CLI
     run: curl -L https://fly.io/install.sh | sh

   - name: Deploy backend
     run: flyctl deploy --config backend/fly.toml --dockerfile backend/Dockerfile
     env:
       FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
   ```

## Option D: Self-hosted Kubernetes

Use for high-availability production.

1. `kubectl apply -f infra/k8s/` (not yet provided — see `todo.md` Phase 9)
2. Set up `KUBECONFIG` as a repo secret
3. Use `azure/k8s-set-context@v4` + `azure/k8s-deploy@v5` actions

## Verifying a deploy

After wiring up a platform, the deploy job should:

1. Push or pull the latest image tagged with `${{ github.sha }}`
2. Restart the affected service
3. Probe `GET /health` (backend) until it returns 200
4. Update the deployment URL in the job output

The `docker-build` job in CI already validates `docker compose config` and
probes `/health` locally — the production deploy should mirror that probe.

## Rollback

Pin to a previous image tag if the new release misbehaves:

```bash
# SSH to VPS example
docker compose pull urbanflow-backend
docker compose up -d urbanflow-backend  # uses previous tag from registry
```

For Railway/Fly.io, use the platform's dashboard to roll back to a prior
deployment in one click.

## Database migrations

The backend uses Sequelize with `sync({ alter: true })` on startup. For
production, switch to explicit migrations:

1. Add `sequelize-cli` and a `migrations/` directory
2. Run `npx sequelize-cli db:migrate` in the deploy step BEFORE
   `docker compose up -d`
3. Never use `sync({ alter: true })` in production

(Tracked under `todo.md` Phase 7 / 8 — not yet implemented.)

## Secrets reference

| Secret | Used by | Notes |
|---|---|---|
| `DELHI_API_KEY` | backend | GTFS-RT for Delhi (Phase 4) |
| `TOMTOM_API_KEY` | backend | Traffic data (Phase 7) |
| `CPCB_API_KEY` | backend | Air quality (Phase 7) |
| `JWT_SECRET` | backend | Sign auth tokens |
| `RAILWAY_TOKEN` / `FLY_API_TOKEN` / `STAGING_SSH_KEY` | deploy job | Platform auth |
| `STAGING_API_URL` / `PROD_API_URL` | workflow env | Echoed in client config |

## Cost expectations

- **Staging (VPS):** $5-10/mo for a 1 vCPU, 1GB box
- **Staging (Railway):** free tier covers it; $5/mo for always-on
- **Staging (Fly.io):** free tier includes 3 shared VMs
- **Production:** $20-50/mo on Fly.io or DO; scales with traffic

Choose what you can leave running 24/7 without watching a billing dashboard.
