# ALUMNET Platform - Complete Deployment Guide

This guide provides step-by-step instructions for deploying the ALUMNET platform to production.

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured with appropriate permissions
- Docker installed and running
- Node.js 18+ installed
- MongoDB Atlas account (for database)
- OpenAI API key
- GitHub OAuth app configured

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd alumnet-platform
```

### 2. Deploy Infrastructure
```bash
# Deploy AWS infrastructure
./deployment/scripts/deploy.sh prod us-east-1
```

### 3. Configure Secrets
```bash
# Update secrets in AWS Secrets Manager
aws secretsmanager update-secret \
    --secret-id alumnet/prod \
    --secret-string '{
        "MONGO_URI": "your-mongodb-atlas-connection-string",
        "JWT_SECRET": "your-secure-jwt-secret-key",
        "OPENAI_API_KEY": "your-openai-api-key",
        "GITHUB_CLIENT_ID": "your-github-oauth-client-id",
        "GITHUB_CLIENT_SECRET": "your-github-oauth-client-secret"
    }'
```

### 4. Test Deployment
```bash
# Run production tests
node scripts/production-test.js <frontend-url> <backend-url>
```

## 📋 Detailed Setup Instructions

### Database Setup (MongoDB Atlas)

1. **Create MongoDB Atlas Cluster**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Create a new cluster
   - Configure network access (allow AWS IP ranges)
   - Create database user with read/write permissions

2. **Get Connection String**
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/alumnet_prod
   ```

### GitHub OAuth Setup

1. **Create GitHub OAuth App**
   - Go to GitHub Settings > Developer settings > OAuth Apps
   - Create new OAuth app
   - Set Authorization callback URL: `https://your-domain.com/auth/github/callback`
   - Note down Client ID and Client Secret

### OpenAI API Setup

1. **Get OpenAI API Key**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Create API key
   - Set usage limits as needed

### AWS Infrastructure Components

The deployment creates the following AWS resources:

- **S3 Bucket**: Hosts the React frontend
- **CloudFront Distribution**: CDN for frontend assets
- **ECR Repository**: Stores Docker images
- **App Runner Service**: Runs the backend API
- **Secrets Manager**: Stores application secrets
- **IAM Roles**: Permissions for services
- **CloudWatch Logs**: Application logging

### Environment Configuration

#### Frontend Environment Variables
```bash
# .env.production
VITE_API_URL=https://your-backend-url.apprunner.amazonaws.com
VITE_APP_NAME=ALUMNET
VITE_GITHUB_CLIENT_ID=your-github-client-id
VITE_ENVIRONMENT=production
```

#### Backend Environment Variables (AWS Secrets Manager)
```json
{
  "MONGO_URI": "mongodb+srv://...",
  "JWT_SECRET": "your-jwt-secret",
  "OPENAI_API_KEY": "sk-...",
  "GITHUB_CLIENT_ID": "your-github-client-id",
  "GITHUB_CLIENT_SECRET": "your-github-client-secret",
  "NODE_ENV": "production",
  "AWS_REGION": "us-east-1"
}
```

## 🔧 Manual Deployment Steps

### Backend Deployment

1. **Build Docker Image**
   ```bash
   cd backend
   docker build -t alumnet-backend .
   ```

2. **Push to ECR**
   ```bash
   # Get ECR login
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Tag and push
   docker tag alumnet-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/prod-alumnet-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/prod-alumnet-backend:latest
   ```

3. **App Runner Auto-Deploy**
   - App Runner automatically deploys when new images are pushed to ECR

### Frontend Deployment

1. **Build React App**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://prod-alumnet-frontend-<account-id> --delete
   ```

3. **Invalidate CloudFront**
   ```bash
   aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
   ```

## 🧪 Testing

### Automated Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test

# E2E tests
cd e2e-tests
npx cypress run

# Production tests
node scripts/production-test.js <frontend-url> <backend-url>
```

### Manual Testing Checklist

- [ ] Frontend loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Student dashboard displays
- [ ] Alumni dashboard displays
- [ ] Job posting works (alumni)
- [ ] Job application works (students)
- [ ] Event creation works (alumni)
- [ ] Event registration works (students)
- [ ] Community posts work
- [ ] Chatbot responds correctly
- [ ] GitHub integration works
- [ ] Profile management works

## 📊 Monitoring and Maintenance

### CloudWatch Monitoring
- App Runner metrics (CPU, Memory, Requests)
- CloudFront metrics (Cache hit ratio, Errors)
- Custom application metrics

### Log Monitoring
```bash
# View App Runner logs
aws logs tail /aws/apprunner/prod-alumnet-backend --follow

# View specific log streams
aws logs describe-log-streams --log-group-name /aws/apprunner/prod-alumnet-backend
```

### Health Checks
- Backend health endpoint: `GET /health`
- Database connectivity check
- External API connectivity (OpenAI, GitHub)

## 🔒 Security Considerations

### Production Security Checklist
- [ ] HTTPS enabled (CloudFront)
- [ ] Secrets stored in AWS Secrets Manager
- [ ] IAM roles follow least privilege
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] JWT tokens properly secured

### Security Headers
The backend includes security headers:
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation

## 💰 Cost Optimization

### AWS Cost Optimization
- Use appropriate instance sizes
- Configure S3 lifecycle policies
- Set up CloudWatch billing alerts
- Monitor unused resources

### Estimated Monthly Costs (USD)
- App Runner: $25-50 (depending on usage)
- S3 + CloudFront: $5-15
- Secrets Manager: $1-2
- CloudWatch Logs: $1-5
- **Total: ~$30-70/month**

## 🚨 Troubleshooting

### Common Issues

1. **App Runner Deployment Failed**
   - Check CloudWatch logs
   - Verify secrets are accessible
   - Check Docker image build

2. **Frontend Not Loading**
   - Verify S3 bucket permissions
   - Check CloudFront distribution
   - Validate build output

3. **Database Connection Issues**
   - Check MongoDB Atlas network access
   - Verify connection string
   - Check VPC configuration (if using)

4. **API Errors**
   - Check App Runner service status
   - Verify environment variables
   - Check external API connectivity

### Debug Commands
```bash
# Check App Runner service status
aws apprunner describe-service --service-arn <service-arn>

# Check CloudFormation stack
aws cloudformation describe-stacks --stack-name alumnet-prod

# Test backend health
curl https://your-backend-url.apprunner.amazonaws.com/health

# Check secrets
aws secretsmanager get-secret-value --secret-id alumnet/prod
```

## 📚 Additional Resources

- [AWS App Runner Documentation](https://docs.aws.amazon.com/apprunner/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)

## 🆘 Support

For deployment issues:
1. Check the troubleshooting section
2. Review CloudWatch logs
3. Verify all prerequisites are met
4. Contact the development team

---

**Note**: Replace placeholder values (URLs, IDs, secrets) with your actual values before deployment.