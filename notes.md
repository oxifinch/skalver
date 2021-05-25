# Basic loading/saving 
(Do I create separate models/controllers for documents? They are stored in their
respective libraries, so they still need to get THAT information somewhere)

# Editing documents
1. Add Edit button and swap out the view when pressed
2. Make markdown editable with content-editable or something?
3. Add Confirm button and POST new markdown 
4. Render page again with new changes

## What needs to happen when loading/saving documents?

### Loading:
1. Get info about the library and look through its list of documents. For the
   server, documents are identified by an ID.
   * FOUND => Get the following info:
     - Title
     - Subtitle
     - Author(s)
     - Tags
     - Cover art link
     - Series
     - Type
   * NOT FOUND => 
     - If the user is just opening the dashboard, the documents that are found
       will be displayed. Those that are not will simply..not be displayed.
     - If the user was requesting a specific document via URL, display a
       "document not found" page.

2. Documents are not fetched in their entirety. If the user wishes to read a
   document, they request the document by id via URL, or by selecting it via the
   browse/section menu. Then the INDEX of a document is fetched by default. When
   the user wants to read the next chapter, it will be loaded on demand.

### Editing document chapters
Information that the user must transmit(besides authentication) to update a
document chapter on the server:
* Parent document
* Chapter number(0 is index)
* New markdown

Then, after validating the request:
1. Set the server-side document's markdown with the new markdown
2. Update the document's timestamp
3. Use mdparser to re-compile the HTML and send the document back to the user
