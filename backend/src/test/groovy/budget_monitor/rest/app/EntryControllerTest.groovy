package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import budget_monitor.spockmvc.RequestParams
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class EntryControllerTest extends AbstractMvcSpec {

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

    def 'user gets his entries'() {
        when:
        def response = get('/app/entries', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.size == 4
    }

    def 'user adds new entry'() {
        given:
        def newEntry = [
                'date'       : '1541247841137',
                'value'      : '-250',
                'currency'   : 'PLN',
                'description': 'Doughnut'
        ]

        when:
        def response = post('/app/entry', newEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idEntry > 0
        response.json.date != null
        response.json.added != null
        response.json.value == -250
        response.json.currency == 'PLN'
        response.json.description == 'Doughnut'
        response.json.photo == null
        response.json.tags != null // array (could be empty)
    }

    def 'user adds new entry with invalid date'() {
        given:
        def newEntry = [
                'date'       : '2018-11-01 15:00:00',
                'value'      : '-250',
                'currency'   : 'PLN',
                'description': ''
        ]

        when:
        def response = post('/app/entry', newEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.INTERNAL_SERVER_ERROR
        response.json.messageKey == 'entryData.error.unknownError'
    }

    def 'user adds new entry with invalid data'() {
        given:
        def newEntry = [
                'date'       : '1541247841137',
                'value'      : '-250',
                'currency'   : 'PLN',
                'description': ''
        ]

        when:
        def response = post('/app/entry', newEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'entryData.error.badRequest'
    }

    def 'user update entry'() {
        given:
        def updatedEntry = [
                'date'       : '1541247841137',
                'value'      : '-200',
                'currency'   : 'PLN',
                'description': 'doughnut'
        ]

        when:
        def response = post('/app/entry/6', updatedEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
        response.json.idEntry > 0
        response.json.date != null
        response.json.added != null
        response.json.value == -200
        response.json.currency == 'PLN'
        response.json.description == 'doughnut'
        response.json.photo == null
        response.json.tags != null // array (could be empty)
    }

    def 'user update entry with invalid data'() {
        given:
        def updatedEntry = [
                'date'       : '1541247841137',
                'value'      : '-200',
                'currency'   : 'PLN',
                'description': ''
        ]

        when:
        def response = post('/app/entry/6', updatedEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'entryData.error.badRequest'
    }

    def 'user update non-existing entry'() {
        given:
        def updatedEntry = [
                'date'       : '1541247841137',
                'value'      : '-200',
                'currency'   : 'PLN',
                'description': 'doughnut'
        ]

        when:
        def response = post('/app/entry/100', updatedEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateEntry.error.entryNotFound'
    }

    def 'user update not owned entry'() {
        given:
        def updatedEntry = [
                'date'       : '1541247841137',
                'value'      : '-200',
                'currency'   : 'PLN',
                'description': 'doughnut'
        ]

        when:
        def response = post('/app/entry/5', updatedEntry, new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateEntry.error.unauthorised'
    }

    def 'user removes entry'() {
        when:
        def response = delete('/app/entry/6', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.OK
    }

    def 'user removes non-existing entry'() {
        when:
        def response = delete('/app/entry/6', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteEntry.error.entryNotFound'
    }

    def 'user removes not owned entry'() {
        when:
        def response = delete('/app/entry/5', new RequestParams(authToken: userToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteEntry.error.unauthorised'
    }

}
