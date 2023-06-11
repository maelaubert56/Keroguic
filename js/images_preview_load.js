document.addEventListener("DOMContentLoaded", function() {
    load_image();
})

function load_image(){
    fetch("../json/images.json")
        .then(response => response.json())
        .then(data => {
            var posts = data.images;
            for (var i = 0; i < posts.length; i++){
                var posts_preview = document.querySelector(".images");
                posts_preview.insertAdjacentHTML("beforeend", `
                  <img src="../img/images_posted/${posts[i].id}.jpg" alt="image du post" onclick="show_image(${posts[i].id})">
                `);
            }
        })
        .catch(error => console.log(error));

}

function show_image(id){
    document.querySelector(".image_preview").style.display = "flex";
    //load the image
    document.querySelector(".image_preview_image img").src = `../img/images_posted/${id}.jpg`;
    //load the title
    fetch("../json/images.json")
        .then(response => response.json())
        .then(data => {
            var posts = data.images;
            for (var i = 0; i < posts.length; i++){
                if (posts[i].id == id){
                    document.querySelector(".image_content h1").innerHTML = posts[i].title;
                    document.querySelector(".image_content .author").innerHTML = `par ${posts[i].author}`;
                    document.querySelector(".image_content .date").innerHTML = posts[i].date;
                }
            }
        }
        )
}

function close_image(){
    document.querySelector(".image_preview").style.display = "none";
}
/*
<article class="image" id="${posts[i].id}" onclick="window.location.href='post.html?id=${posts[i].id}'">
    <img src="../img/images_posted/${posts[i].id}.jpg" alt="image du post">
    <section class="image_text">
        <span class="post_date">${posts[i].date}</span>
        <h2 class="post_title">${posts[i].title}</h2>
        <p class="author">par ${posts[i].author}</p>
    </section>
</article>
 */