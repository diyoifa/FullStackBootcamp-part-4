const mostBlogs = require('../utils/list_helper').mostBlogs

describe('most blogs', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = mostBlogs(blogs)
        expect(result).toEqual({})
    })
    test('when list has only one blog equals the likes of that', () => {
            const blog = [
                {
                    _id: '5a422a851b54a676234d17f7',
                    title: 'React patterns',
                    author: 'Michael Chan',
                    url: 'https://reactpatterns.com/',
                    likes: 7,
                    blogs:7,
                    __v: 0
                },
            ]
            const respuesta = mostBlogs(blog)

            expect(respuesta).toEqual({author: 'Michael Chan', blogs:7})
    })

    test('most blogs of a bigger list grater than 1', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                blogs:7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                blogs:5,
                __v: 0
            },
             {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                blogs:5,
                __v: 0
            }
        ]
        const result = mostBlogs(blogs)
        expect(result).toEqual({
            author: "Edsger W. Dijkstra",
            blogs: 10
        })
        
    })
    test('blogs with same number of blogs return the first', () => {
        const blogs = [
            {
                _id: '5a422a851b54a676234d17f7',
                title: 'React patterns',
                author: 'Michael Chan',
                url: 'https://reactpatterns.com/',
                likes: 7,
                blogs:7,
                __v: 0
            },
            {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                blogs:5,
                __v: 0
            },
             {
                _id: '5a422aa71b54a676234d17f8',
                title: 'Go To Statement Considered Harmful',
                author: 'Edsger W. Dijkstra',
                url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
                likes: 5,
                blogs:2,
                __v: 0
            }
        ]
        const result = mostBlogs(blogs)
        expect(result).toEqual({ author: 'Michael Chan', blogs: 7 })
    })
})