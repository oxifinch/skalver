const createNewLibraryForm = document.querySelector("#form_create_new_library");
const createNewLibraryButton = document.querySelector("#button_create_new_library");
createNewLibraryButton.addEventListener("click", () => {
    //toggleLibraryCreator();
});

function toggleLibraryCreator() {
    createNewLibraryForm.classList.toggle("hidden");
}
