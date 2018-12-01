package budget_monitor

import budget_monitor.spockmvc.SpockMvcSpec
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext

@SpringBootTest
@ContextConfiguration(classes = [BudgetMonitorApplication])
@ActiveProfiles("test")
abstract class AbstractMvcSpec extends SpockMvcSpec {

    @Override
    MockMvc buildMockMvc(WebApplicationContext webApplicationContext) {

        MockMvcBuilders
                .webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build()
    }
}
