package budget_monitor.rest.api

import budget_monitor.AbstractMvcSpec
import budget_monitor.spockmvc.RequestParams
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class EntryControllerTest extends AbstractMvcSpec {

    Long foodCategoryIdForUser = 18

    @Shared
    String testUserToken

    @Shared
    Long bakeryEntryId

    @Shared
    Long groceryEntryId


    def 'user \'user\' log in to application'() {
        given:
        def credentials = [
                username: 'user',
                password: 'Qwer1234'
        ]

        when:
        def response = post('/api/login', credentials)
        testUserToken = response.json.token

        then:
        response.status == HttpStatus.OK
        testUserToken != null
        testUserToken.length() > 7
    }

    def 'user gets his entries'() {
        when:
        def response = get('/api/entries', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json.size == 4
    }

    def 'user adds new entry'() {
        given:
        def newEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': 'Bakery',
                'value'      : -450,
                'date'       : 1541247841137,
                'subEntries' : [
                        [
                                'idCategory' : 6,
                                'description': 'Doughnut',
                                'value'      : -200
                        ],
                        [
                                'idCategory' : 6,
                                'description': 'Gingerbread',
                                'value'      : -250
                        ]
                ]
        ]

        when:
        def response = post('/api/entries', newEntry, new RequestParams(authToken: testUserToken))
        bakeryEntryId = response.json.idEntry

        then:
        response.status == HttpStatus.OK
        response.json.idEntry > 0
        response.json.idCategory == foodCategoryIdForUser
        response.json.description == 'Bakery'
        response.json.value == -450
        response.json.date == 1541247841137
        response.json.dateOfAddition != null
        response.json.dateOfLastModification != null
        response.json.photo == null
        response.json.subEntries.get(0).idSubEntry > 0
        response.json.subEntries.get(0).idCategory == 6
        response.json.subEntries.get(0).description == 'Doughnut'
        response.json.subEntries.get(0).value == -200
        response.json.subEntries.get(1).idSubEntry > 0
        response.json.subEntries.get(1).idCategory == 6
        response.json.subEntries.get(1).description == 'Gingerbread'
        response.json.subEntries.get(1).value == -250
    }

    def 'user adds new entry with no specific category'() {
        given:
        def newEntry = [
                'description': 'Grocery',
                'value'      : -850,
                'date'       : 1541247841137,
                'subEntries' : []
        ]

        when:
        def response = post('/api/entries', newEntry, new RequestParams(authToken: testUserToken))
        groceryEntryId = response.json.idEntry

        then:
        response.status == HttpStatus.OK
        response.json.idEntry > 0
        response.json.idCategory == null
        response.json.description == 'Grocery'
        response.json.value == -850
        response.json.date == 1541247841137
        response.json.dateOfAddition != null
        response.json.dateOfLastModification != null
        response.json.photo == null
        response.json.subEntries.size == 0
    }

    def 'user adds new entry with invalid date'() {
        given:
        def newEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': 'Grocery',
                'value'      : -850,
                'date'       : '2018-11-01 15:00:00',
                'subEntries' : []
        ]

        when:
        def response = post('/api/entries', newEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'entryData.error.badRequest'
    }

    def 'user adds new entry with invalid data'() {
        given:
        def newEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': '    ',
                'value'      : -850,
                'date'       : 1541247841137,
                'subEntries' : []
        ]

        when:
        def response = post('/api/entries', newEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message.contains('entryData.error.notValid')
    }

    def 'user update entry'() {
        given:
        def updatedEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': 'Updated Bakery',
                'value'      : -650,
                'date'       : 1541247841137,
                'subEntries' : [
                        [
                                'idCategory' : 6,
                                'description': 'Bread',
                                'value'      : -200
                        ],
                        [
                                'idCategory' : 6,
                                'description': 'Doughnut',
                                'value'      : -200
                        ],
                        [
                                'idCategory' : 6,
                                'description': 'Gingerbread',
                                'value'      : -250
                        ]
                ]
        ]

        when:
        def response = put('/api/entries/' + bakeryEntryId, updatedEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json.idEntry > 0
        response.json.idCategory == foodCategoryIdForUser
        response.json.description == 'Updated Bakery'
        response.json.value == -650
        response.json.date == 1541247841137
        response.json.dateOfAddition != null
        response.json.dateOfLastModification != null
        response.json.photo == null
        response.json.subEntries.get(0).idSubEntry > 0
        response.json.subEntries.get(0).idCategory == 6
        response.json.subEntries.get(0).description == 'Bread'
        response.json.subEntries.get(0).value == -200
        response.json.subEntries.get(1).idSubEntry > 0
        response.json.subEntries.get(1).idCategory == 6
        response.json.subEntries.get(1).description == 'Doughnut'
        response.json.subEntries.get(1).value == -200
        response.json.subEntries.get(2).idSubEntry > 0
        response.json.subEntries.get(2).idCategory == 6
        response.json.subEntries.get(2).description == 'Gingerbread'
        response.json.subEntries.get(2).value == -250
    }

    def 'user update entry with invalid data'() {
        given:
        def updatedEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': '  ',
                'value'      : -650,
                'date'       : 1541247841137,
                'subEntries' : []
        ]

        when:
        def response = put('/api/entries/' + bakeryEntryId, updatedEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message.contains('entryData.error.notValid')
    }

    def 'user update non-existing entry'() {
        given:
        def updatedEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': 'Desc',
                'value'      : -650,
                'date'       : 1541247841137,
                'subEntries' : []
        ]

        when:
        def response = put('/api/entries/100', updatedEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'entryData.error.entryNotFound'
    }

    def 'user update not owned entry'() {
        given:
        def updatedEntry = [
                'idCategory' : foodCategoryIdForUser,
                'description': 'Desc',
                'value'      : -650,
                'date'       : 1541247841137,
                'subEntries' : []
        ]

        when:
        def response = put('/api/entries/5', updatedEntry, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'entryData.error.unauthorised'
    }

    def 'user removes entry'() {
        when:
        def response = delete('/api/entries/' + groceryEntryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
    }

    def 'user removes non-existing entry'() {
        when:
        def response = delete('/api/entries/' + groceryEntryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'entryData.error.entryNotFound'
    }

    def 'user removes not owned entry'() {
        when:
        def response = delete('/api/entries/5', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'entryData.error.unauthorised'
    }

}
