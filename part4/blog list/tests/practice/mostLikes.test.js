const mostLikes = require('../utils/list_helper').mostLikes
const sampleBlogList = require('./data')

describe('most likes', () =>{
   
    test('of a big list is correctly displayed', () =>{  
        const expectedResult = {
            'author': "Edsger W. Dijkstra",
            'likes': 17
          }      
        expect(mostLikes(sampleBlogList)).toEqual(expectedResult)
    })
})

