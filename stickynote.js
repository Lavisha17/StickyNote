let notes = JSON.parse(localStorage.getItem('notes')) || [];
let pinnedNotes = JSON.parse(localStorage.getItem('pinned-notes')) || [];
let createbtn = document.getElementById("create");
let notesContainer = document.getElementById("note");
let pinnedNotesContainer = document.getElementById("pinned-note");
let editingIndex = null;

createbtn.addEventListener("click", function() {
    createNote();
});

function createNote() {
    notesContainer.innerHTML = ''; // Clear the container
    let noteDiv = document.createElement("div");
    noteDiv.className = "note";

    let titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "inptitle";
    titleInput.placeholder = "Title";
    titleInput.style.width = "200px";
    titleInput.style.textAlign = "center";
    titleInput.autofocus = true;

    let descriptionTextarea = document.createElement("textarea");
    descriptionTextarea.id = "inpdesc";
    descriptionTextarea.placeholder = "Description";
    descriptionTextarea.style.width = "200px";
    descriptionTextarea.style.height = "100px";
    descriptionTextarea.style.textAlign = "center";

    let addBtn = document.createElement("button");
    addBtn.id = "add";
    addBtn.textContent = editingIndex !== null ? "Update Note" : "Add Note";
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(titleInput);
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(descriptionTextarea);
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(document.createElement("br"));
    noteDiv.appendChild(addBtn);

    notesContainer.appendChild(noteDiv);

    if (editingIndex !== null) {
        titleInput.value = notes[editingIndex].title;
        descriptionTextarea.value = notes[editingIndex].content;
    }

    addBtn.addEventListener("click", function() {
        addOrUpdateNote(titleInput.value, descriptionTextarea.value);
    });
}

function addOrUpdateNote(title, content) {
    if (title && content) {
        if (editingIndex !== null) {
            notes[editingIndex] = { title, content };
            editingIndex = null;
        } else {
            notes.push({ title, content });
        }
        localStorage.setItem('notes', JSON.stringify(notes));
        readData();
    } else {
        alert("Please enter both title and description.");
    }
}

function readData() {
    notesContainer.innerHTML = '';
    pinnedNotesContainer.innerHTML = '';

    notes.forEach((note, index) => {
        let noteDiv = `
        <div class="note-container">
            <h3>Note</h3><br>
            <input type="text" id="title_${index}" value="${note.title}" placeholder="Title" style="width: 200px;" disabled><br><br>
            <textarea id="description_${index}" placeholder="Description" style="width: 200px;height: 100px;" disabled>${note.content}</textarea><br><br>
            <button id="save-btn_${index}" onclick="saveEdit(${index})" style="display: none;">Save</button>
            <button id="edit-btn_${index}" onclick="editNote(${index})" style="	background-color: #CCEDEE;border-color: transparent;" >Edit</button>
            <button id="delete-btn_${index}" onclick="deleteNote(${index})" style="	background-color: #F0A2A3;border-color: transparent;" >Delete</button>
            <button id="pin-btn_${index}" onclick="pinNote(${index})" style="background-color: #F8CE8E;border-color: transparent;" >Pin</button>
        </div>
        `;
        notesContainer.innerHTML += noteDiv;
    });

    pinnedNotes.forEach((note, index) => {
        let pinnedNoteDiv = `
        <div class="note-container">
            <h3>Pinned Note</h3><br>
            <input type="text" id="pinned_title_${index}" value="${note.title}" placeholder="Title" style="width: 200px;" disabled><br><br>
            <textarea id="pinned_description_${index}" placeholder="Description" style="width: 200px;height: 100px;" disabled>${note.content}</textarea><br><br>
            <button id="save-pinned-btn_${index}" onclick="savePinnedEdit(${index})" style="display: none;">Save</button>
            <button id="edit-pinned-btn_${index}" onclick="editPinnedNote(${index})" style="background-color: #CCEDEE;border-color: transparent;" >Edit</button>
            <button id="delete-pinned-btn_${index}" onclick="deletePinnedNote(${index})" style="background-color: #F0A2A3;border-color: transparent;" >Delete</button>
        </div>
        `;
        pinnedNotesContainer.innerHTML += pinnedNoteDiv;
    });
}

function deleteNote(index) {
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    readData();
}

function deletePinnedNote(index) {
    pinnedNotes.splice(index, 1);
    localStorage.setItem('pinned-notes', JSON.stringify(pinnedNotes));
    readData();
}

function editNote(index) {
    editingIndex = index;
    createNote();
}

function saveEdit(index) {
    let title = document.getElementById(`title_${index}`).value;
    let content = document.getElementById(`description_${index}`).value;

    notes[index].title = title;
    notes[index].content = content;
    localStorage.setItem('notes', JSON.stringify(notes));
    readData();
}

function editPinnedNote(index) {
    document.getElementById(`pinned_title_${index}`).disabled = false;
    document.getElementById(`pinned_description_${index}`).disabled = false;
    document.getElementById(`save-pinned-btn_${index}`).style.display = 'inline-block';
    document.getElementById(`edit-pinned-btn_${index}`).style.display = 'none';
}

function savePinnedEdit(index) {
    let title = document.getElementById(`pinned_title_${index}`).value;
    let content = document.getElementById(`pinned_description_${index}`).value;

    pinnedNotes[index].title = title;
    pinnedNotes[index].content = content;
    localStorage.setItem('pinned-notes', JSON.stringify(pinnedNotes));
    readData();
}

function pinNote(index) {
    let note = notes[index];
    pinnedNotes.push(note);
    localStorage.setItem('pinned-notes', JSON.stringify(pinnedNotes));
    deleteNote(index);
}

// Initial render
readData();