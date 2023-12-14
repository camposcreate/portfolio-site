FROM gradle:jdk17 AS build
COPY . .
RUN gradle clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim
COPY --from=build /target/portfolio-site-0.0.1-SNAPSHOT.jar portfolio-site.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "portfolio-site.jar"]