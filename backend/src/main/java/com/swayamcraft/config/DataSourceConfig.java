package com.swayamcraft.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
@Profile("prod")
public class DataSourceConfig {

    private static final Logger log = LoggerFactory.getLogger(DataSourceConfig.class);

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${spring.datasource.username:}")
    private String rawUsername;

    @Value("${spring.datasource.password:}")
    private String rawPassword;

    @Value("${spring.datasource.driver-class-name:org.postgresql.Driver}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String finalUrl = rawUrl != null ? rawUrl.trim() : "";
        String finalUser = rawUsername != null ? rawUsername.trim() : "";
        String finalPass = rawPassword != null ? rawPassword.trim() : "";

        // If Railway / PaaS provided postgres:// or postgresql:// with userInfo (user:pass@host:port/db)
        if (finalUrl.startsWith("postgres://") || finalUrl.startsWith("postgresql://")) {
            try {
                String cleanForUri = finalUrl.replaceFirst("^jdbc:", "");
                // Replace postgresql:// with postgres:// so java.net.URI can parse it cleanly
                if (cleanForUri.startsWith("postgresql://")) {
                    cleanForUri = "postgres://" + cleanForUri.substring("postgresql://".length());
                }
                URI uri = new URI(cleanForUri);
                if (uri.getUserInfo() != null && uri.getUserInfo().contains(":")) {
                    String[] userParts = uri.getUserInfo().split(":", 2);
                    finalUser = userParts[0];
                    finalPass = userParts[1];
                }
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 5432 : uri.getPort();
                String path = uri.getPath(); // e.g. /railway
                finalUrl = "jdbc:postgresql://" + host + ":" + port + path;
                log.info("Parsed Railway DATABASE_URL into JDBC target: jdbc:postgresql://{}:{}{}", host, port, path);
            } catch (Exception e) {
                log.warn("Could not parse URI structure, prepending jdbc: prefix: {}", e.getMessage());
                if (!finalUrl.startsWith("jdbc:")) {
                    finalUrl = "jdbc:" + finalUrl;
                }
            }
        } else if (!finalUrl.startsWith("jdbc:") && !finalUrl.isEmpty()) {
            finalUrl = "jdbc:" + finalUrl;
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(finalUrl);
        if (!finalUser.isEmpty()) {
            config.setUsername(finalUser);
        }
        if (!finalPass.isEmpty()) {
            config.setPassword(finalPass);
        }
        config.setDriverClassName(driverClassName);
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(2);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);

        log.info("Initializing HikariDataSource for production PostgreSQL: {}", finalUrl);
        return new HikariDataSource(config);
    }
}
