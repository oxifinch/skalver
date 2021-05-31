const newChapterWindow = document.querySelector("#new_chapter_window");
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
const createNewButton = document.querySelector("#new_chapter_button");
createNewButton.addEventListener("click", () => {
    toggleNewWindow();
})

function toggleEditor() {
    pageContent.classList.toggle("hidden"); 
    pageMarkdown.classList.toggle("hidden"); 
}

function toggleNewWindow() {
    newChapterWindow.classList.toggle("hidden");
}

function saveMarkdown() {
    let newMarkdown = editorArea.value.toString();
    fetch(`/chapter/update/${activeChapter._id}`, {
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

function createNewChapter() {
    // fetch POST to create a new chapter on parent book ID


}
