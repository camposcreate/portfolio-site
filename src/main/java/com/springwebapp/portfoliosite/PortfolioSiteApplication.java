package com.springwebapp.portfoliosite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.springwebapp.portfoliosite", "taskmanager", "visualizer"})
public class PortfolioSiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioSiteApplication.class, args);
	}

}
