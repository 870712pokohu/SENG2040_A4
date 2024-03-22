console.log('hello world')

const helloWorldBox = document.getElementById('hello-world')
const postsBox = document.getElementById('posts-box')

$.ajax({
  type: 'GET',
  url: '/hello-world/',
  success: (response) => {
    console.log('success', response.text)
    helloWorldBox.textContent = response.text;
  },
  error: (error) => console.log('error', error)
})

$.ajax({
  type: 'GET',
  url: '/data/',
  success: (response) => {
    console.log(response)
    const data = response.data
    console.log(data)
    data.forEach((item)=>{
      postsBox.innerHTML += `
        ${item.title} - <b>${item.body}</b><br>
      `
    })
  },
  error: (error) => console.log('error', error)

})
