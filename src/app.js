let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));


let notes = loadNotes();

function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    return storedNotes ? JSON.parse(storedNotes) : [];
  }

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function createNoteElement(id, title) {
    const li = document.createElement('li');
    li.innerHTML = `
        <a href="#" class="flex items-center p-3 rounded hover:bg-[var(--hover-color)] transition-colors duration-300">
            <span class="note-title">${title}</span>
        </a>
    `;
    li.dataset.noteId = id;
    li.addEventListener('click', () => {
        loadNoteContent(id);
    });

    return li;
}
function loadNoteContent(noteId) {
    const note = notes.find(note => note.id === noteId);
    if (note) {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <div class="toolbar mb-4 flex gap-4">
                <button onclick="document.execCommand('bold');" title="Bold">B</button>
                <button onclick="document.execCommand('italic');" title="Italic">I</button>
                <button onclick="document.execCommand('underline');" title="Underline">U</button>
                <button onclick="document.execCommand('strikeThrough');" title="Strike">S</button>
                <button onclick="document.execCommand('justifyLeft');" title="Align Left">Left</button>
                <button onclick="document.execCommand('justifyCenter');" title="Align Center">Center</button>
                <button onclick="document.execCommand('justifyRight');" title="Align Right">Right</button>
                <button onclick="document.execCommand('insertOrderedList');" title="Ordered List">OL</button>
                <button onclick="document.execCommand('insertUnorderedList');" title="Unordered List">UL</button>
                <button onclick="document.execCommand('createLink', false, prompt('Enter URL:', 'http://'));" title="Link">Link</button>
            </div>
            <div class="note-content w-full overflow-hidden text-wrap">
                <h2 contenteditable="true" class="note-title outline-none text-2xl font-bold" data-note-id="${note.id}">${note.title}</h2>
                <div contenteditable="true" class="note-content-editable mt-4 w-full h-full resize-none outline-none" data-note-id="${note.id}">${note.content}</div>
            </div>
        `;

        const titleElement = mainContent.querySelector('.note-title');
        const contentElement = mainContent.querySelector('.note-content-editable');

        titleElement.addEventListener('input', () => {
            note.title = titleElement.textContent;
            saveNotes();
            updateNoteTitleInSidebar(noteId, note.title);
        });

        contentElement.addEventListener('input', () => {
            note.content = contentElement.textContent;
            saveNotes();
        });
    }
}

function updateNoteTitleInSidebar(noteId, newTitle) {
    const noteListMain = document.getElementById('noteList');
    const noteItem = Array.from(noteListMain.children).find(li => li.dataset.noteId === noteId);
    
    if (noteItem) {
        const titleElement = noteItem.querySelector('.note-title');
        titleElement.textContent = newTitle;
    }
}

function addNewNote() {
    const newNote = {
        id: Date.now().toString(),
        title: 'New Note',
        content: 'Type here...',
        styledContent: '<p>Type here...</p>',
        email: currentUser.email
    };

    notes.push(newNote);
    saveNotes();
    renderNotes();
}

function renderNotes() {
    const noteListMain = document.getElementById('noteList')
    noteListMain.innerHTML = '';
    const newNoteListItem = document.createElement('li');
    newNoteListItem.classList.add('first-element', 'mb-4');
    newNoteListItem.innerHTML = `
        <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-[5px] text-md px-5 py-2.5 text-center flex w-full items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            New note
        </button>
    `;
    noteListMain.appendChild(newNoteListItem);
    newNoteListItem.querySelector('button').addEventListener('click', addNewNote);

    const notesForCurrentUser = notes.filter(note => note.email === currentUser.email);

    notesForCurrentUser.forEach(note => {
      const noteElement = createNoteElement(note.id, note.title);
      noteListMain.appendChild(noteElement);
    });
}

renderNotes();
