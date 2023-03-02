const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) =>{
    return blogs.reduce( (sum, blog) =>{
        return sum + blog.likes
    }, 0)
}

const favouriteBlog = (blogs)=>{
    const maxLike = (maxLike, blog) =>{
        return maxLike.likes > blog.likes ? maxLike : blog
    }

    const expBlog = blogs.reduce(maxLike)

    return {
        'title' : expBlog.title,
        'author': expBlog.author,
        'likes' : expBlog.likes
    }
}

const mostBlogs =(blogs) => {

    const authorBlogs = _.reduce(blogs, (authorBlogs, blog)=>{
        const authorBlog = _.find(authorBlogs, a => {
            return a.author === blog.author
        })
        if(authorBlog)
        {
            authorBlog.blogs = authorBlog.blogs + 1
            return _.map(authorBlogs, x =>{
                return x.author === blog.author ? authorBlog : x
            })
        }
        else {
            const authorBlog = {
                "author" : blog.author,
                "blogs" : 1
            }
            return _.concat(authorBlogs,authorBlog)
            }        
            
    }, 
    [])

    const maxBlogs = _.maxBy(authorBlogs, (b) => b.blogs)
    console.log(maxBlogs);
    return maxBlogs
}

const mostLikes =(blogs) => {

    const authorBlogs = _.reduce(blogs, (authorBlogs, blog)=>{
        const authorBlog = _.find(authorBlogs, a => {
            return a.author === blog.author
        })
        if(authorBlog)
        {
            authorBlog.likes = authorBlog.likes + blog.likes
            return _.map(authorBlogs, x =>{
                return x.author === blog.author ? authorBlog : x
            })
        }
        else {
            const authorBlog = {
                "author" : blog.author,
                "likes" : blog.likes
            }
            return _.concat(authorBlogs,authorBlog)
            }        
            
    }, 
    [])

    const maxBlogs = _.maxBy(authorBlogs, (b) => b.likes)
    console.log(maxBlogs);
    return maxBlogs
}

module.exports ={ dummy, totalLikes,favouriteBlog, mostBlogs, mostLikes}