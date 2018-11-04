package budget_monitor

import budget_monitor.spockmvc.SpockMvcSpec
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers
import org.springframework.session.MapSessionRepository
import org.springframework.session.web.http.HeaderHttpSessionIdResolver
import org.springframework.session.web.http.SessionRepositoryFilter
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.setup.MockMvcBuilders
import org.springframework.web.context.WebApplicationContext
import spock.lang.Shared

import java.util.concurrent.ConcurrentHashMap

@SpringBootTest
@ContextConfiguration(classes = [BudgetMonitorApplication])
@ActiveProfiles("test")
abstract class AbstractMvcSpec extends SpockMvcSpec {

  @Shared
  private def sessionRepository = new MapSessionRepository(new ConcurrentHashMap<>())

  @Override
  MockMvc buildMockMvc(WebApplicationContext webApplicationContext) {
    def sessionFilter = new SessionRepositoryFilter(sessionRepository)
    sessionFilter.httpSessionIdResolver = new HeaderHttpSessionIdResolver("X-Auth-Token")

      MockMvcBuilders
      .webAppContextSetup(webApplicationContext)
      .apply(SecurityMockMvcConfigurers.springSecurity())
      .addFilter(sessionFilter)
      .build()
  }
}
