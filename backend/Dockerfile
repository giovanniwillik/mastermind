FROM eclipse-temurin:17-jdk AS builder

WORKDIR /app

# Instalar Maven
RUN apt-get update && apt-get install -y maven && rm -rf /var/lib/apt/lists/*

# Copiar pom.xml e baixar dependências
COPY pom.xml .
RUN mvn dependency:resolve

# Copiar código-fonte
COPY src src

# Build da aplicação
RUN mvn clean package -DskipTests

# Stage final: rodar aplicação
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copiar JAR do stage anterior
COPY --from=builder /app/target/mastermind-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]