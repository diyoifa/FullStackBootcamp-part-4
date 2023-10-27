const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {

  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)

}

const favoriteBlog = (blog) => {
  //toma el valor de likes de cada blog y obtiene el mayor
  const maxLikes = Math.max(...blog.map(blog => blog.likes))
  const favoriteBlog = blog.find(blog => blog.likes === maxLikes)
  return blog.length === 0 ? {} : {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes
  }
}

const mostBlogs = (blogs)=>{

  if(blogs.length === 0){
    return {}
  }

  let authors = {

  }

  for(blog of blogs){
    const author = blog.author
    if(authors[author]){
      authors[author].blogs += blog.blogs
  }else{
    authors[author] = {
      blogs: blog.blogs
    }
  }
}

  console.log(authors)

  let maxBlogs = 0
  let maxAuthor = ''
  for(author in authors){
    if(authors[author].blogs > maxBlogs){
      maxBlogs = authors[author].blogs
      maxAuthor = author
    }
  }

  return{
      author: maxAuthor,
      blogs: maxBlogs
  }

}

const mostLikes = (blogs)=>{
  if(blogs.length === 0){
    return {}
  }
  let authors = {
  }
  for(blog of blogs){
    const author = blog.author
    if(authors[author]){
      authors[author].likes += blog.likes
    }else{
      authors[author] = {
        likes: blog.likes
      }
    }
  }

   let maxLikes = 0
   let maxAuthor = '' 
  for(author in authors){
    if(authors[author].likes > maxLikes){
      maxLikes = authors[author].likes
      maxAuthor = author
    }
  }

  return{
   author: maxAuthor,
   likes: maxLikes
  }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}