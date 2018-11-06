package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import budget_monitor.spockmvc.RequestParams
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class CategoryControllerTest extends AbstractMvcSpec {

    @Shared
    String userToken

    def 'user \'user\' log in to application'() {
        given:
        def credentials = [
                username: 'user',
                password: 'qwer'
        ]

        when:
        def response = post('/app/session', credentials)
        userToken = response.json.token

        then:
        response.status == HttpStatus.OK
        response.json.username == 'user'
        response.json.authenticated == true
        userToken != null
    }

    def 'user gets his tags'() {
        when:
        def response = get('/app/tags', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.size == 6
    }

    def 'user adds new tag'() {
        given:
        def newTag = [
                name : 'shopping',
                color: '1'
        ]

        when:
        def response = post('/app/tag', newTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idTag > 0
        response.json.name == 'shopping'
        response.json.color == 1
    }

    def 'user adds new tag with no specific color'() {
        given:
        def newTag = [
                name: 'shopping'
        ]

        when:
        def response = post('/app/tag', newTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idTag > 0
        response.json.name == 'shopping'
        response.json.color == 0
    }

    def 'user adds new tag with invalid data'() {
        given:
        def newTag = [
                name: ""
        ]

        when:
        def response = post('/app/tag', newTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'tagData.error.badRequest'
    }

    def 'user update tag'() {
        given:
        def updatedTag = [
                name : 'Food',
                color: '1'
        ]

        when:
        def response = post('/app/tag/1', updatedTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idTag == 1
        response.json.name == 'Food'
        response.json.color == 1
    }

    def 'user update tag with no specific color'() {
        given:
        def updatedTag = [
                name: 'Food'
        ]

        when:
        def response = post('/app/tag/1', updatedTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idTag == 1
        response.json.name == 'Food'
        response.json.color == 0
    }

    def 'user update tag with invalid data'() {
        given:
        def updatedTag = [
                name: ""
        ]

        when:
        def response = post('/app/tag/1', updatedTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'tagData.error.badRequest'
    }

    def 'user update non-existing tag'() {
        given:
        def updatedTag = [
                name : 'Food',
                color: '1'
        ]

        when:
        def response = post('/app/tag/100', updatedTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateTag.error.tagNotFound'
    }

    def 'user update not owned tag'() {
        given:
        def updatedTag = [
                name : 'Food',
                color: '1'
        ]

        when:
        def response = post('/app/tag/7', updatedTag, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateTag.error.unauthorised'
    }

    def 'user removes tag'() {
        when:
        def response = delete('/app/tag/19', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
    }

    def 'user removes non-existing tag'() {
        when:
        def response = delete('/app/tag/19', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteTag.error.tagNotFound'
    }

    def 'user removes not owned tag'() {
        when:
        def response = delete('/app/tag/7', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteTag.error.unauthorised'
    }

}
