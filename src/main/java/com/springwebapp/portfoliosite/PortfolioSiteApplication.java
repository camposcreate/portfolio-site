package com.springwebapp.portfoliosite;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.ExecutorSubscribableChannel;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@SpringBootApplication(scanBasePackages = {"com.springwebapp.portfoliosite", "taskmanager", "visualizer"})
public class PortfolioSiteApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioSiteApplication.class, args);
	}

	@Bean
	public SimpMessagingTemplate messagingTemplate(MessageChannel clientInboundChannel) {
		SimpMessagingTemplate template = new SimpMessagingTemplate(clientInboundChannel);
		template.setSendTimeout(10000); // Set your desired send timeout
		return template;
	}

	@Bean
	public MessageChannel myClientInboundChannel() {

		return new ExecutorSubscribableChannel();
	}

	/*
	@Bean
	public MessageChannel clientOutboundChannel() {
		return new ExecutorSubscribableChannel();
	}
	*/

}
