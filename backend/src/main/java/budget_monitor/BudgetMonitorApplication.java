package budget_monitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.session.SessionAutoConfiguration;

@SpringBootApplication(exclude = SessionAutoConfiguration.class)
public class BudgetMonitorApplication {

    public static void main(String[] args) {
        SpringApplication.run(BudgetMonitorApplication.class, args);
    }

}
