
// load the comments of the post
document.addEventListener("DOMContentLoaded", function() {
    add_posts_to_table();
})


function add_posts_to_table(){
    fetch("../json/comments.json")
    .then(response => response.json())
    .then(data => {
        var comments = data.comments;
        // get the id of the post in the url
        var url = new URL(window.location.href);
        var id = parseInt(url.searchParams.get("id"));
        if (isNaN(id)){
            window.location.href = "index.html";
        }

        // get the comments with the id of the post
        comments = comments.filter(comment => comment.id_post === id);
        // insert on the table
        var table = document.querySelector("tbody");
        // if there is no comment
        if (comments.length === 0){
            table.insertAdjacentHTML("beforeend", `
                <tr>
                    <td id="no_comments" colspan="3">Il n'y a pas encore de commentaire</td>
                </tr>
            `);
        }
        for (var i = 0; i < comments.length; i++){
            var comment = comments[i];
            table.insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${comment.name}</td>
                    <td>${comment.date}</td>
                    <td>${comment.content}</td>
                </tr>
            `);

        }
    })
}

// add a comment
function add_comment(){
    // get the comment
    var name = document.querySelector("#name").value;
    var content = document.querySelector("#post_content").value;

    // check if the comment is valid
    if (name === "" || content === ""){
        alert("Veuillez remplir tous les champs");
        return;
    }

    // if there is no comment, remove the message
    var no_comments = document.querySelector("#no_comments");
    if (no_comments !== null){ no_comments.remove(); }

    // format the date jj/mm/aaaa
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hour = date.getHours();
    // if the hour is less than 10, add a 0 before
    if (hour < 10){ hour = "0" + hour; }
    var minutes = date.getMinutes();
    // if the minutes is less than 10, add a 0 before
    if (minutes < 10){ minutes = "0" + minutes; }
    date = day + "/" + month + "/" + year + " - " + hour + ":" + minutes;

    // add the info to the table
    var table = document.querySelector("tbody");
    table.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${name}</td>
            <td>${date}</td>
            <td>${content}</td>
        </tr>
    `);
    // clear the form
    document.querySelector("#name").value = "";
    document.querySelector("#post_content").value = "";
}