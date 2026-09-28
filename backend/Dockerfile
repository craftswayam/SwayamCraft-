# Multi-stage build for Spring Boot 3 (Java 17)
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and POM to pre-cache dependencies
COPY pom.xml mvnw ./
COPY .mvn .mvn
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B || true

# Copy source code and package application
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2: Minimal JRE runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create uploads directory and permissions
RUN mkdir -p /app/uploads && chown -R appuser:appgroup /app

COPY --from=builder /app/target/*.jar app.jar
USER appuser

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]
