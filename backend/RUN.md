# Install dependencies (optional)
```bash 
./mvnw clean install
```

# Run backend locally
```bash
./mvnw spring-boot:run
```
# Run with a specific profile (test, dev, prod):
```bash
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
./mvnw spring-boot:run -Dspring-boot.run.profiles=test
```

---

# 2. Run Backend in Docker 

```bash
docker build -t backend-test .
docker run --env-file .env backend-test mvn test
```