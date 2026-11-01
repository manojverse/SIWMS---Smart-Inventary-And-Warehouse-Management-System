package com.siwms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SiwmsApplication {
    public static void main(String[] args) {
        SpringApplication.run(SiwmsApplication.class, args);
    }
}
