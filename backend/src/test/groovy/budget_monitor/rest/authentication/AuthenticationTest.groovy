package budget_monitor.rest.authentication

import budget_monitor.AbstractMvcSpec
import org.springframework.http.HttpStatus
import org.springframework.security.test.context.support.WithMockUser

class AuthenticationTest extends AbstractMvcSpec {

    def 'unauthenticated users cannot get resource'() {
        when:
        def res = get('/api/users')

        then:
        res.status == HttpStatus.FORBIDDEN
    }

    @WithMockUser
    def 'authenticated users can get resource'() {
        when:
        def res = get('/api/users')

        then:
        res.status == HttpStatus.OK
    }

}
