package budget_monitor.rest.app

import budget_monitor.AbstractMvcSpec
import budget_monitor.spockmvc.RequestParams
import org.springframework.http.HttpStatus
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class CategoryControllerTest extends AbstractMvcSpec {

    @Shared
    String testUserToken

    @Shared
    Long travelCategoryId

    @Shared
    Long souvenirCategoryId


    def 'user \'user\' log in to application'() {
        given:
        def credentials = [
                username: 'user',
                password: 'Qwer1234'
        ]

        when:
        def response = post('/app/session', credentials)
        testUserToken = response.json.token

        then:
        response.status == HttpStatus.OK
        response.json.username == 'user'
        response.json.authenticated == true
        testUserToken != null
    }

    def 'user gets his categories'() {
        when:
        def response = get('/app/categories', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json.size == 6
    }

    def 'user adds new category'() {
        given:
        def newCategory = [
                idSuperCategory: null,
                name           : 'travels',
                color          : 1
        ]

        when:
        def response = post('/app/category', newCategory, new RequestParams(authToken: testUserToken))
        travelCategoryId = response.json.idCategory

        then:
        response.status == HttpStatus.OK
        response.json.idCategory > 0
        response.json.idSuperCategory == null
        response.json.name == 'travels'
        response.json.color == 1
        response.json.subCategories.size == 0
    }

    def 'user adds new category with no specific color'() {
        given:
        def newCategory = [
                idSuperCategory: travelCategoryId,
                name           : 'souvenirs'
        ]

        when:
        def response = post('/app/category', newCategory, new RequestParams(authToken: testUserToken))
        souvenirCategoryId = response.json.idCategory

        then:
        response.status == HttpStatus.OK
        response.json.idCategory > 0
        response.json.idSuperCategory == travelCategoryId
        response.json.name == 'souvenirs'
        response.json.color == 0
        response.json.subCategories.size == 0
    }

    def 'user adds new category with invalid data'() {
        given:
        def newCategory = [
                idSuperCategory: souvenirCategoryId,
                name           : '   ',
                color          : 1
        ]

        when:
        def response = post('/app/category', newCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey.contains('categoryData.error.notValid')
    }

    def 'user update category'() {
        given:
        def updatedCategory = [
                name : 'travels',
                color: 9
        ]

        when:
        def response = put('/app/category/' + travelCategoryId, updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json.idCategory == travelCategoryId
        response.json.idSuperCategory == null
        response.json.name == 'travels'
        response.json.color == 9
        response.json.subCategories.size == 0
    }

    def 'user update category with no specific color'() {
        given:
        def updatedCategory = [
                name: 'travels'
        ]

        when:
        def response = put('/app/category/' + travelCategoryId, updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json.idCategory == travelCategoryId
        response.json.idSuperCategory == null
        response.json.name == 'travels'
        response.json.color == 0
        response.json.subCategories.size == 0
    }

    def 'user update category with invalid data'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name           : '   ',
                color          : 1
        ]

        when:
        def response = put('/app/category/' + souvenirCategoryId, updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey.contains('categoryData.error.notValid')
    }

    def 'user update non-existing category'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name           : 'Food',
                color          : '1'
        ]

        when:
        def response = put('/app/category/100', updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateCategory.error.categoryNotFound'
    }

    def 'user update not owned category'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name           : 'Food',
                color          : '1'
        ]

        when:
        def response = put('/app/category/20', updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'updateCategory.error.unauthorised'
    }

    def 'user removes category'() {
        when:
        def response = delete('/app/category/' + souvenirCategoryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
    }

    def 'user removes non-existing category'() {
        when:
        def response = delete('/app/category/' + souvenirCategoryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteCategory.error.categoryNotFound'
    }

    def 'user removes not owned category'() {
        when:
        def response = delete('/app/category/20', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.messageKey == 'deleteCategory.error.unauthorised'
    }

}
