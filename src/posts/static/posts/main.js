
const postsBox = document.getElementById('posts-box')
const spinnerBox = document.getElementById('spinner-box')
const loadBtn = document.getElementById('load-btn')
const endBox = document.getElementById('end-box')
const postForm = document.getElementById('post-form')
const title = document.getElementById('id_title')
const body = document.getElementById('id_body')
const alertBox = document.getElementById('alert-box')
const csrf = document.getElementsByName('csrfmiddlewaretoken')
const url  = window.location.href

const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken');

const deleted = localStorage.getItem('title')

if(deleted){
  handleAlerts('danger', `deleted "${deleted}"`)
  localStorage.clear()
}

const likeUnlikePosts = () =>{
  const likeUnlikeForms = [...document.getElementsByClassName('like-unlike-forms')];
  likeUnlikeForms.forEach(form => form.addEventListener('submit', e=>{

    e.preventDefault()
    const clickedId = e.target.getAttribute('data-form-id')
    const clickedBtn = document.getElementById(`like-unlike-${clickedId}`)

    $.ajax({
      type: 'POST',
      url: '/like-unlike/',
      data:{
        'csrfmiddlewaretoken': csrftoken,
        'pk': clickedId,
      },
      success: response =>{
        console.log(response)
        clickedBtn.textContent = response.liked ? `Unlike (${response.count})` : `Like (${response.count})`
      },
      error: error =>{
        console.log(error)
      }
    })
  }))
}

let visible = 3

const getData = () =>{
  $.ajax({
    type: 'GET',
    url: `/data/${visible}`,
    success: (response) => {
      console.log(response)
      const data = response.data
      // show the data after 1000 milliseconds
      setTimeout(()=>{
        spinnerBox.classList.add('not-visible')
        console.log(data)
        data.forEach((item)=>{
          postsBox.innerHTML += `
            <div class="card mb-2">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.body}</p>
              </div>
              <div class='card-footer'>
                <div class='row'>
                  <div class='col-2'>
                    <a href="${url}${item.id}" class="btn btn-primary">Details</a>
                  </div>
                  <div class='col-2'>
                    <form class='like-unlike-forms' data-form-id=${item.id}>
                      <button href="#" class="btn btn-primary" id='like-unlike-${item.id}'>${item.liked ? `Unlike (${item.count})` : `Like (${item.count})`}</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          `
        })
        likeUnlikePosts()
      }, 100)
      console.log(response.size)
      if (response.size === 0){
        endBox.textContent = 'No posts added yet ....' 
      }
      else if(response.size <= visible){
        loadBtn.classList.add('not-visible')
        endBox.textContent = 'No more posts'
      } 
    },
    error: (error) => console.log('error', error)
  
  })
}


loadBtn.addEventListener('click', ()=>{
  spinnerBox.classList.remove('not-visible')
  visible += 3
  getData()
})

postForm.addEventListener('submit', e=>{
  e.preventDefault()

  $.ajax({
    type: 'POST',
    url: '',
    data:{
      'csrfmiddlewaretoken':csrf[0].value,
      'title':title.value,
      'body':body.value,
    },
    success: response => {
      console.log(response)
      postsBox.insertAdjacentHTML('afterbegin', `
        <div class="card mb-2">
            <div class="card-body">
              <h5 class="card-title">${response.title}</h5>
              <p class="card-text">${response.body}</p>
            </div>
            <div class='card-footer'>
              <div class='row'>
                <div class='col-2'>
                  <a href="#" class="btn btn-primary">Details</a>
                </div>
                <div class='col-2'>
                  <form class='like-unlike-forms' data-form-id=${response.id}>
                    <button href="#" class="btn btn-primary" id='like-unlike-${response.id}'>${response.liked ? `Unlike (${response.count})` : `Like (${response.count})`}</button>
                  </form>
                </div>
              </div>
          </div>
        </div>
      `)
      likeUnlikePosts()
      $('#addPostModal').modal('hide')
      postForm.reset()
      handleAlerts('success', 'new post added')

    },
    error: error => {
      console.log(error)
      handleAlerts('danger', 'oops .... something went wrong')
    }

  })
})


getData()