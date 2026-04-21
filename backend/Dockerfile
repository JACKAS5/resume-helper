# Development stage
FROM eclipse-temurin:21-jdk-alpine AS dev
WORKDIR /app
# Only copy the wrapper and pom first to cache dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline

# The source will be mounted via volume in docker-compose for dev
EXPOSE 8080
ENTRYPOINT ["./mvnw", "spring-boot:run"]

# Build stage (for production)
FROM dev AS build
COPY src ./src
RUN ./mvnw clean package -DskipTests
# Extract layers
RUN java -Djarmode=layertools -jar target/*.jar extract

# Production stage
FROM eclipse-temurin:21-jre-alpine AS prod
WORKDIR /app
# Copy layers for better caching
COPY --from=build /app/dependencies/ ./
COPY --from=build /app/spring-boot-loader/ ./
COPY --from=build /app/snapshot-dependencies/ ./
COPY --from=build /app/application/ ./
EXPOSE 8080
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
