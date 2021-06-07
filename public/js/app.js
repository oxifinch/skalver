//const newChapterWindow = document.querySelector("#new_chapter_window");
const pageContainer = document.querySelector("#reader_page");
const pageContent = document.querySelector("#reader_page_content");
const pageMarkdown = document.querySelector("#reader_page_markdown");
const editorArea = document.querySelector("#reader_editor_textarea");
editorArea.value = activeChapter.markdown;
const saveButton = document.querySelector("#editor_save");
saveButton.addEventListener("click", () => {
    saveMarkdown();
});
const sidePanel = document.querySelector("#reader_sidepanel");
sidePanel.addEventListener("click", () => {
    sidePanel.classList.toggle("closed");
})
const toggleEditorButtonIcon = document.querySelector("#editor_toggle_icon");
const toggleEditorButton = document.querySelector("#editor_toggle");
toggleEditorButton.addEventListener("click", () => {
    toggleEditor();
});

function toggleEditor() {
    pageContent.classList.toggle("hidden"); 
    pageMarkdown.classList.toggle("hidden"); 
    toggleEditorButtonIcon.classList.toggle("bi-pencil-square");
    toggleEditorButtonIcon.classList.toggle("bi-x-square");
    saveButton.classList.toggle("hidden");
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
