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
const openEditorContainer = document.querySelector("#editor_closed");
const openEditorButton = document.querySelector("#reader_openEditor");
openEditorButton.addEventListener("click", () => {
    toggleEditor();
});
const closeEditorContainer = document.querySelector("#editor_open");
const closeEditorButton = document.querySelector("#reader_closeEditor");
closeEditorButton.addEventListener("click", () => {
    toggleEditor();
});
const createNewButton = document.querySelector("#reader_createchapter");
createNewButton.addEventListener("click", () => {
    toggleNewWindow();
})

function toggleEditor() {
    pageContent.classList.toggle("hidden"); 
    pageMarkdown.classList.toggle("hidden"); 
    openEditorContainer.classList.toggle("hidden");
    closeEditorContainer.classList.toggle("hidden");
    closeEditorContainer.classList.toggle("d-flex");
    editorArea.value = activeChapter.markdown;
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
    .then(data => {
        toggleEditor();
        activeChapter.markdown = data.markdown;
        editorArea.value = data.markdown;
        pageContent.innerHTML = data.htmlOutput;
    })
    .catch(err => console.log(err));
}

function createNewChapter() {
    // fetch POST to create a new chapter on parent book ID


}
