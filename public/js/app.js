const pageContainer = document.querySelector("#reader_page");
const pageContent = document.querySelector("#reader_page_content");
const pageMarkdown = document.querySelector("#reader_page_markdown");
const editorArea = document.querySelector("#reader_editor_textarea");
editorArea.value = activeChapter.markdown;
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
    let newMarkdown = editorArea.value.toString();
    fetch(`/chapter/${activeChapter._id}`, {
        method: "POST",
        body: JSON.stringify({
            markdown: newMarkdown
        }),
        encoding: "utf-8",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
}
