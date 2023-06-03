document.addEventListener("DOMContentLoaded", function() {
    load_posts();
})


var posts_inserted = 0;
const posts_to_insert = 10;

function load_posts(){
    fetch("../json/posts.json")
    .then(response => response.json())
    .then(data => {
        var posts = data.posts;
        // get the div where we will insert the posts
        let posts_inserted_before = posts_inserted;
        for (var i = posts_inserted; i < posts_inserted_before + posts_to_insert; i++){
            if (posts_inserted >= posts.length) {
                // hide the button
                document.querySelector(".load_posts").style.display = "none";
                return;
            }
            console.log(i,"-",posts_inserted,"-",posts.length,"-",posts_to_insert)
            var posts_preview = document.querySelector(".posts");
            posts_preview.insertAdjacentHTML("beforeend", `
                    <article class="post post_${posts[i].preview}" id="1" onclick="window.location.href='post.html?id=${posts[i].id}'">
                      <img src="${posts[i].image}" alt="image du post">
                      <section class="post_text">
                        <span class="post_date">${posts[i].date}</span>
                        <h2 class="post_title">${posts[i].title}</h2>
                        <p class="post_preview">${posts[i].content}</p>
                        <p class="post_more">Cliquez pour voir plus</p>
                      </section>
                    </article>
                `);
            posts_inserted++;
        }
    })
    .catch(error => console.log(error));

}