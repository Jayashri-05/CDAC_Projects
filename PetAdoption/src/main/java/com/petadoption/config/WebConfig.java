package com.petadoption.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.io.File;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        System.out.println("[DEBUG] WebConfig: Adding resource handler for /uploads/**");
        
        // Get the absolute path to the uploads directory
        String uploadsPath = new File("uploads").getAbsolutePath();
        System.out.println("[DEBUG] WebConfig: Uploads absolute path: " + uploadsPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadsPath + "/")
                .setCachePeriod(3600); // Cache for 1 hour
        
        System.out.println("[DEBUG] WebConfig: Resource handler configured successfully");
        System.out.println("[DEBUG] WebConfig: /uploads/** -> file:" + uploadsPath + "/");
    }
} 