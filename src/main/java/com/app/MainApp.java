package com.app;

import javax.annotation.Resource;

import com.app.services.StorageService;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.transaction.annotation.*;

@SpringBootApplication
@EnableJpaRepositories(basePackages ={ "com.app.repo"})
@EntityScan(basePackages ={ "com.app.model"})
@EnableTransactionManagement
public class MainApp implements CommandLineRunner {
	@Resource
	StorageService storageService;

	public static void main(String[] args) throws Exception {
		new SpringApplication(MainApp.class).run(args);
	}

	@Override
	public void run(String... arg) throws Exception {
		storageService.deleteAll();
		storageService.init();
	}
}



/*
SpringBoot Notes

@Bean      :tells Spring 'here is an instance of this class, please keep hold of it and give it back to me when I ask'.
@Autowired :says 'please give me an instance of this class, for example, one that I created with an @Bean annotation earlier'.

*/
