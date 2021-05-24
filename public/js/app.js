const pageContainer = document.querySelector("#reader_page");
const pageContent = document.querySelector("#reader_page_content");
const pageMarkdown = document.querySelector("#reader_page_markdown");
const saveButton = document.querySelector("#reader_save");
saveButton.addEventListener("click", () => {
    saveMarkdown();
});
const editButton = document.querySelector("#reader_edit");
editButton.addEventListener("click", () => {
    toggleEditor();
});

function toggleEditor() {
    pageContent.classList.toggle("hidden"); 
    pageMarkdown.classList.toggle("hidden"); 
}

function saveMarkdown() {
    fetch("/document/a1?chapter=1", {
        method: "POST",
        body: JSON.stringify({ textContent: pageMarkdown.innerText }),
        encoding: "utf-8",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => console.log(data));
}
