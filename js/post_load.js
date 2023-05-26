document.addEventListener("DOMContentLoaded", function() {
    load_post();
})

function load_post(){
    fetch("../json/posts.json")
        .then(response => response.json())
        .then(data => {
            var posts = data.posts;
            // get the id of the post in the url
            var url = new URL(window.location.href);
            var id = url.searchParams.get("id");
            // get the post
            for (var i = 0; i < posts.length; i++){
                if (posts[i].id === id){
                    var post = posts[i];
                    break;
                }
            }
            if(post.author_image===""){ post.author_image="../img/assets/logo.jpg"}
            // insert the post
            var main = document.querySelector("main");
            main.insertAdjacentHTML("beforeend", `
                <div class="post post_${post.preview}">
                    <img class="img_horizontal" src="${post.image}" alt="}post">
                    <div class="post_content">
                        <h1 class="post_title">${post.title}</h1>
                        <div class="post_text">
                            <img class="img_vertical" src="${post.image}" alt="post">
                            <p>${post.content}</p>
                        </div>
                      <div class="post_info">
                        <img src=${post.author_image} alt="author">
                        <div>
                          <span>${post.date}</span>
                          <span >écrit par
                            <span class="post_author_name">${post.author}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                </div>
            `);
        })
        .catch(error => console.log(error));

}