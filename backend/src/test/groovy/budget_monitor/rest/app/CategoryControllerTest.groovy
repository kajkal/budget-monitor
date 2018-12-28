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
        def response = post('/api/login', credentials)
        testUserToken = response.json.token

        then:
        response.status == HttpStatus.OK
        testUserToken != null
        testUserToken.length() > 7
    }

    def 'user gets his categories'() {
        when:
        def response = get('/api/categories', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json == [
                idCategory: 1,
                path: [],
                name: 'ROOT_CATEGORY',
                subCategories: [
                        [idCategory: 2, path: [1], name: 'INCOME_CATEGORY', subCategories: [
                                [idCategory: 13, path: [1, 2], name: 'Salary', subCategories: []],
                                [idCategory: 14, path: [1, 2], name: 'Presents', subCategories: []]
                        ]],
                        [idCategory: 3, path: [1], name: 'EXPENSE_CATEGORY', subCategories: [
                                [idCategory: 15, path: [1, 3], name: 'Communication', subCategories: [
                                        [idCategory: 18, path: [1, 3, 15], name: 'Food', subCategories: [
                                                [idCategory: 20, path: [1, 3, 15, 18], name: 'Rent', subCategories: []],
                                                [idCategory: 21, path: [1, 3, 15, 18], name: 'Cleaning', subCategories: []]
                                        ]],
                                        [idCategory: 19, path: [1, 3, 15], name: 'Home', subCategories: []],
                                        [idCategory: 101, path: [1, 3, 15], name: 'Car maintenance', subCategories: []],
                                        [idCategory: 102, path: [1, 3, 15], name: 'Public transport', subCategories: []]
                                ]],
                                [idCategory: 16, path: [1, 3], name: 'Entertainment', subCategories: [
                                        [idCategory: 103, path: [1, 3, 16], name: 'Alcohol', subCategories: []],
                                        [idCategory: 104, path: [1, 3, 16], name: 'Cinema', subCategories: []]]],
                                [idCategory: 17, path: [1, 3], name: 'Maintenance', subCategories: [
                                        [idCategory: 100, path: [1, 3, 17], name: 'Insurance', subCategories: []]
                                ]],
                                [idCategory: 105, path: [1, 3], name: 'Sport', subCategories: []],
                                [idCategory: 106, path: [1, 3], name: 'Equipment', subCategories: [
                                        [idCategory: 107, path: [1, 3, 106], name: 'Clothes', subCategories: []],
                                        [idCategory: 108, path: [1, 3, 106], name: 'Footwear', subCategories: []],
                                        [idCategory: 109, path: [1, 3, 106], name: 'Accessories', subCategories: []]
                                ]]
                        ]]
                ]
        ]
    }

    def 'user adds new category'() {
        given:
        def newCategory = [
                idSuperCategory: null,
                name: 'travels'
        ]

        when:
        def response = post('/api/categories', newCategory, new RequestParams(authToken: testUserToken))
        travelCategoryId = response.json.idCategory

        then:
        response.status == HttpStatus.OK
        response.json == [
                idCategory: travelCategoryId,
                path: [],
                name: 'travels',
                subCategories: []
        ]
    }

    def 'user adds new category as subcategory'() {
        given:
        def newCategory = [
                idSuperCategory: travelCategoryId,
                name: 'souvenirs'
        ]

        when:
        def response = post('/api/categories', newCategory, new RequestParams(authToken: testUserToken))
        souvenirCategoryId = response.json.idCategory

        then:
        response.status == HttpStatus.OK
        response.json == [
                idCategory: souvenirCategoryId,
                path: [],
                name: 'souvenirs',
                subCategories: []
        ]
    }

    def 'user adds new category with invalid data'() {
        given:
        def newCategory = [
                idSuperCategory: souvenirCategoryId,
                name: '   '
        ]

        when:
        def response = post('/api/categories', newCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message.contains('categoryData.error.notValid')
    }

    def 'user update category'() {
        given:
        def updatedCategory = [
                name: 'Travels'
        ]

        when:
        def response = put('/api/categories/' + travelCategoryId, updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
        response.json == [
                idCategory: 110,
                path: [],
                name: 'Travels',
                subCategories: []
        ]
    }

    def 'user update category with invalid data'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name: '   '
        ]

        when:
        def response = put('/api/categories/' + souvenirCategoryId, updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message.contains('categoryData.error.notValid')
    }

    def 'user update non-existing category'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name: 'Food'
        ]

        when:
        def response = put('/api/categories/1000', updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'categoryData.error.categoryNotFound'
    }

    def 'user update not owned category'() {
        given:
        def updatedCategory = [
                idSuperCategory: travelCategoryId,
                name: 'Food'
        ]

        when:
        def response = put('/api/categories/30', updatedCategory, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'categoryData.error.unauthorised'
    }

    def 'user removes category'() {
        when:
        def response = delete('/api/categories/' + souvenirCategoryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.OK
    }

    def 'user removes non-existing category'() {
        when:
        def response = delete('/api/categories/' + souvenirCategoryId, new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'categoryData.error.categoryNotFound'
    }

    def 'user removes not owned category'() {
        when:
        def response = delete('/api/categories/30', new RequestParams(authToken: testUserToken))

        then:
        response.status == HttpStatus.BAD_REQUEST
        response.json.message == 'categoryData.error.unauthorised'
    }

}
