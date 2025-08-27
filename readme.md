## Deployment Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure AWS credentials:**

   ```bash
   aws configure
   ```

3. **Deploy to development:**

   ```bash
   npm run deploy:dev
   ```

4. **Run tests:**

   ```bash
   npm test
   ```

5. **Deploy to production:**
   ```bash
   npm run deploy:prod
   ```

## Usage Examples

### Create Appointment

```bash
curl -X POST https://k3jcg03m39.execute-api.us-east-1.amazonaws.com/dev/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "insuredId": "12345",
    "scheduleId": 100,
    "countryISO": "PE"
  }'
```

### Get Appointments by Insured

```bash
curl https://k3jcg03m39.execute-api.us-east-1.amazonaws.com/dev/appointments/12345
```
