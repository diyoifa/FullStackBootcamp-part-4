const totalLikes = require('../utils/list_helper').totalLikes

describe('total likes', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = totalLikes(blogs)
        expect(result).toBe(0)
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
        const result = totalLikes(blogs)
        expect(result).toBe(5)
    })
})