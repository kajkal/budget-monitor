package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import org.springframework.http.HttpStatus
import spock.lang.Stepwise

@Stepwise
class UserControllerTest extends AbstractMvcSpec {

    def 'create new account'() {
        given:
        def payload = [
                username: 'testUser',
                password: 'Qwer1234',
                email: 'testUser@gmail.com',
                currency: 'EUR',
        ]

        when:
        def response = post('/app/register', payload)

        then:
        response.status == HttpStatus.OK
    }

    def 'create new account with username that already exists'() {
        given:
        def payload = [
                username: 'user',
                password: 'Qwer1234',
                email: 'testUser1@gmail.com',
                currency: 'EUR',
        ]

        when:
        def response = post('/app/register', payload)

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'register.error.usernameExists'
    }

    def 'create new account with email that already exists'() {
        given:
        def payload = [
                username: 'testUser1',
                password: 'Qwer1234',
                email: 'user@gmail.com',
                currency: 'EUR',
        ]

        when:
        def response = post('/app/register', payload)

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'register.error.emailExists'
    }

    def 'create account without required fields'() {
        given:
        def payload = [
                username: 'testUser1',
                password: 'Qwer1234',
                currency: 'EUR',
        ]

        when:
        def response = post('/app/register', payload)

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey.contains('userData.error.notValid')
    }

}
