const favoriteBlog = require('../utils/list_helper').favoriteBlog

describe('favorite blog', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = favoriteBlog(blogs)
        expect(result).toEqual({})
    })
    test('when list has only one blog equals the likes of that', () => {
        const blogs = [{
            _id: '5a422aa71b54a676234d17f8',
            title: 'Go To Statement Considered Harmful',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
            likes: 5,
            __v: 0
        }]

        const result = favoriteBlog(blogs)
        console.log("🚀 ~ file: list_helper_favoriteBlog.test.js:20 ~ test ~ result:", result)
        expect(result).toEqual(result)
    })
    test('favorite blog of a bigger list grater than 1', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                __v: 0
            }
        ]
        const respuesta = favoriteBlog(blogs)
        expect(respuesta).toEqual(
            {
                title: 'React patterns',
                author: 'Michael Chan',
                likes: 7,
            })
    })
})