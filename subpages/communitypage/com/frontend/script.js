const API_URL = "http://localhost:5000/api/comments";

window.onload = () => {
    fetchComments();
};



// Fetch and render comments
async function fetchComments() {
    const res = await fetch(API_URL);
    const comments = await res.json();

    const rootComments = comments.filter(c => !c.parentId);
    const replies = comments.filter(c => c.parentId);

    const container = document.getElementById("comments-container");
    container.innerHTML = "";

    rootComments.forEach(comment => {
        const commentElement = createCommentElement(comment, replies);
        container.appendChild(commentElement);
    });
}

// Create comment + replies
function createCommentElement(comment, replies) {
    const div = document.createElement("div");
    div.className = "comment";

    div.innerHTML = `
        <p>${comment.text}</p>
        <div class="comment-actions">
            <button class="reply-btn" onclick="showReplyBox('${comment._id}')">
                <span style="margin-right: 6px;">💬</span>Reply
            </button>
            <button class="reply-btn delete-icon-btn" title="Delete" onclick="deleteComment('${comment._id}')">
                <img src="../icons/delete.svg" alt="Delete" width="18" height="18" />
            </button>
        </div>
        <div class="reply-box" id="replies-${comment._id}"></div>
    `;

    const childReplies = replies.filter(r => r.parentId === comment._id);
    childReplies.forEach(reply => {
        const replyDiv = document.createElement("div");
        replyDiv.className = "comment";
        replyDiv.style.marginLeft = "clamp(15px, 3vw, 25px)";
        replyDiv.innerHTML = `<p>${reply.text}</p>`;
        div.querySelector(`#replies-${comment._id}`).appendChild(replyDiv);
    });

    return div;
}

// Add comment or reply
async function postComment(parentId = null) {
    const inputId = parentId ? `reply-${parentId}` : "main-comment";
    const text = document.getElementById(inputId).value.trim();

    if (!text) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, parentId })
    });

    document.getElementById(inputId).value = "";
    fetchComments();
}

// Show reply input
function showReplyBox(parentId) {
    const replyContainer = document.getElementById(`replies-${parentId}`);
    if (document.getElementById(`reply-${parentId}`)) return;

    const replyInput = document.createElement("div");
    replyInput.innerHTML = `
        <textarea id="reply-${parentId}" placeholder="Reply..."></textarea>
        <button onclick="postComment('${parentId}')">Reply</button>
    `;
    replyContainer.appendChild(replyInput);
}

// Delete comment
async function deleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
        const res = await fetch(`${API_URL}/${commentId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            fetchComments();
        } else {
            alert("Failed to delete comment");
        }
    } catch (err) {
        alert("Network error while deleting comment");
        console.error(err);
    }
}


function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const container = document.querySelector('.container');
    
    hamburger.classList.toggle('active');
    container.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    if (container.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});