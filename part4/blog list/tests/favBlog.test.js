const favouriteBlog = require('../utils/list_helper').favouriteBlog
const sampleBlogList = require('./data')

describe('favourite blog', () =>{
   
    test('of a big list is correctly displayed', () =>{  
        const expectedResult = {            
            'title': "Canonical string reduction",
            'author': "Edsger W. Dijkstra",           
            'likes': 12,            
          }      
        expect(favouriteBlog(sampleBlogList)).toEqual(expectedResult)
    })
})
