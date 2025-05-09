package es.upm.dit.isst.splitit;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class SplititApplication {

	public static void main(String[] args) {
		// Cargar variables del archivo .env
        Dotenv dotenv = Dotenv.load();

        // Establecerlas como propiedades del sistema
        System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
        System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));
		
		SpringApplication.run(SplititApplication.class, args);
	}

}
