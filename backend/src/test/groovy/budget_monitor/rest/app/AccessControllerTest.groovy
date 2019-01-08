package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import org.springframework.http.HttpStatus
import spock.lang.Stepwise

@Stepwise
class AccessControllerTest extends AbstractMvcSpec {

    def 'user try to login with bad credentials'() {
        given:
        def payload = [
                username: 'user',
                password: 'Qwer12345',
        ]

        when:
        def response = post('/api/login', payload)

        then:
        response.status == HttpStatus.UNAUTHORIZED
        response.json.message == 'login.error.badCredentials'
    }

    def 'user try to login with invalid data'() {
        given:
        def payload = [
                username: 'user',
        ]

        when:
        def response = post('/api/login', payload)

        then:
        response.status == HttpStatus.UNAUTHORIZED
        response.json.message == 'login.error.badCredentials'
    }

    def 'user try to login with correct credentials'() {
        given:
        def payload = [
                username: 'user',
                password: 'Qwer1234',
        ]

        when:
        def response = post('/api/login', payload)

        then:
        response.status == HttpStatus.OK
        response.json.token.length() > 0
        response.json.token ==~ /\S+\.\S+\.\S+/
    }

}
