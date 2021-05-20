# Skalver
Skalver is a web app for worldbuilders and writers aiming to strike a balance between more free-form note taking and highly organized wiki-like structuring by writing texts in markdown and rendering it into visually appealing documents with custom styling.

When writing fiction, specifically fantasy and sci-fi where the setting plays a big role, I often found it difficult to find a good workflow that was easy and allowed me to focus on the writing, but also allowed me to easily find the information I needed when I had to reference a certain event in the story or the setting's history without implementing a full-blown wiki or manually searching through my loosely organized articles. This app is intended for writers who don't want to fiddle with the technicalities or the time investment of setting up a properly structured wiki, but still want to have a format that allows them to share texts or collections of articles in a visually appealing way. 

Skalver uses Markdown files to define headers, block quotes, text emphasis, dividers and lists, which are then rendered on the page with user-defined styling such as page and text colors, backgrounds, font, cover art etc. to get the user in the right mood for their story in a distraction-free environment.

---

## Project Overview
This is my final project for my first year studying as a web developer, and so, I may have a lot to learn before I can get this app to the level of quality and feature-richness that I want. This app is part of my learning process! For this project, I will primarily be using:
- Nodejs with Express
- MongoDB for the database
- Bootstrap for styling
- A bit of Rust for converting Markdown to HTML

### Key Features
To be what I consider "ready" for use, Skalver needs to be able to:
- Register users and allow them to access their documents and collections in the browser.
- Use the GUI to create, edit, and delete documents and collections. 
- Set custom styling for each collection by selecting font, text color, page color, and background image.
- Follow links from one document to another within the same collection.

### "Nice to have" Features
While I will not have a lot of time to work on the app for the alotted project time, I would like to continue to develop it if it turns out nice. The following is a list of features I would want to have and consider integral to the experience, but will have to save for after the actual school project.

- Upload collections as folders with markdown documents from their computer using a command-line tool.
- An easily accessible "quick note" function that can be used to quickly jot down a thought and access it later.
- Support for adding images in documents via links.
- Better UI design, because I'm quite sure I will not nail it on the first try.
- A timeline editor of some kind, for story planning and historical overview.
- Vim emulation in the GUI editor.
- A way to publish collections and documents, or print them.

---
