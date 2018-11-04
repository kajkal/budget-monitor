package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import budget_monitor.spockmvc.RequestParams
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class TagControllerTest extends AbstractMvcSpec {

    @Shared
    String token

    @Shared
    String token2

    def "user logs in to add new advert"() {
        given:
        def credentials = [username: 'user', password: 'qwer']

        when:
        def response = post('/app/session', credentials)
        token = response.json.token

        then:
        response.status == HttpStatus.OK
        response.json.username == 'user'
        token != null
    }

    def "another user logs in to add new advert"() {
        given:
        def credentials = [username: 'user1', password: 'qwer']

        when:
        def response = post('/app/session', credentials)
        token2 = response.json.token

        then:
        response.status == HttpStatus.OK
        response.json.username == 'user1'
        token2 != null
    }

    def "user gets his tags"() {
        println(token)

        when:
        def result = get('/app/tags', new RequestParams(authToken: token))

        then:
        result.status == HttpStatus.OK
        println(result.content)
        println(result.json.size)
    }
}
