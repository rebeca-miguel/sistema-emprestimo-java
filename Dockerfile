
# Etapa 1: Compilar o frontend React
FROM node:22 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build


# Etapa 2: Compilar o backend Java 25
FROM maven:3-eclipse-temurin-25 AS backend-build

WORKDIR /app

COPY pom.xml .

COPY src ./src

# Copia os arquivos gerados pelo React
COPY --from=frontend-build /app/frontend/dist ./src/main/resources/static

RUN mvn -DskipTests package


# Etapa 3: Executar a aplicação com Java 25
FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=backend-build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-Xmx350m", "-jar", "app.jar"]
