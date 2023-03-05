const mostBlogs = require('../../utils/list_helper').mostBlogs
const sampleBlogList = require('../data')

describe('most blogs', () =>{
   
    test('of a big list is correctly displayed', () =>{  
        const expectedResult = {
            'author': "Robert C. Martin",
            'blogs': 3
          }      
        expect(mostBlogs(sampleBlogList)).toEqual(expectedResult)
    })
})

