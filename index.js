const displayUser = document.getElementById('user')
const displayNotes = document.getElementById('note-title')
const noteDetails = document.getElementById('note-details')
const detailTitle = document.getElementById('detail-title')
const create = document.getElementById('create-note-button')
const newTitle = document.getElementById('create-title')
const newBody = document.getElementById('create-body')
const updateButton = document.getElementById('update-button')
const deleteButton = document.getElementById('delete-button')

function displayUserName(json) {
  displayUser.innerText = `Welcome, ${json[0].name}.`
}

function displayNoteTitles(json) {
  json[0].notes.forEach(note => {
    displayNotes.innerHTML += `
      <div class="sidebar-title">${note.title}</div>
    `
  })
}

function displayNoteBody(json) {
  displayNotes.addEventListener('click', e => {
    fetch('http://localhost:3000/api/v1/users')
    .then(res => res.json())
    .then(json => {
      const note = json[0].notes.find(note => note.title === e.target.innerText)
      noteDetails.innerHTML = `
        <div id="detail-title">${note.title}</div>
        <div id="detail-body">${note.body}</div>
      `
    })
  })
}

function addNewNote(json) {
  const title = document.createElement('div')
  title.className = "sidebar-title"
  title.innerText = json.title
  displayNotes.appendChild(title)
  newTitle.value = ""
  newBody.value = ""
}

function fetchGET() {
  fetch('http://localhost:3000/api/v1/users')
  .then(res => res.json())
  .then(json => {
    displayUserName(json)
    displayNoteTitles(json)
  })
}

function fetchPOST() {
  create.addEventListener('click', (e) => {
    e.preventDefault()
    const postData = {
      title: `${newTitle.value}`,
      body: `${newBody.value}`,
      user_id: 1
    };
    fetch('http://localhost:3000/api/v1/notes', {
      method: 'POST',
      body: JSON.stringify(postData),
      headers: {'Content-Type': 'application/json; charset=utf-8'}
    })
    .then(res => res.json())
    .then(json => addNewNote(json))
  })
}

function fetchPATCH() {
  updateButton.addEventListener('click', (e) => {
    fetch('http://localhost:3000/api/v1/users')
    .then(res => res.json())
    .then(json => {
      const note = json[0].notes.find(note => note.title === [...e.target.previousElementSibling.children][0].innerText)
      noteDetails.innerHTML = '<input type="text" id="update-title" value="' + note.title + '"><br><textarea id="update-body">' + note.body + '</textarea>'
      const noteId = note.id
      updateButton.addEventListener('click', (e) => {
        const updateData = {
          title: document.getElementById('update-title').value,
          body: document.getElementById('update-body').value,
          user_id: 1
        }
        fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
          method: 'PATCH',
          body: JSON.stringify(updateData),
          headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(res => res.json())
        .then(json => {
          noteDetails.innerHTML = `
          <div id="detail-title">${json.title}</div>
          <div id="detail-body">${json.body}</div>
          `
          fetch('http://localhost:3000/api/v1/users')
          .then(res => res.json())
          .then(json => {
            displayNotes.innerHTML = ""
            json[0].notes.forEach(note => {
              displayNotes.innerHTML += `
              <div class="sidebar-title">${note.title}</div>
              `
            })
          })
        })
      })
    })
  })
}

function fetchDELETE() {
  deleteButton.addEventListener('click', (e) => {
    if (e.target.previousElementSibling.previousElementSibling.innerText === "") {
      alert("Please select a note from the sidebar to continue")
    } else {
      fetch('http://localhost:3000/api/v1/users')
      .then(res => res.json())
      .then(json => {
        const noteId = json[0].notes.find(note => note.title === [...e.target.previousElementSibling.previousElementSibling.children][0].innerText).id
        fetch(`http://localhost:3000/api/v1/notes/${noteId}`, {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json; charset=utf-8'}
        })
        .then(res => res.json())
        .then(json => {
          alert(json.message)
          noteDetails.innerHTML = ""
          fetch('http://localhost:3000/api/v1/users')
          .then(res => res.json())
          .then(json => {
            displayNotes.innerHTML = ""
            json[0].notes.forEach(note => {
              displayNotes.innerHTML += `
              <div class="sidebar-title">${note.title}</div>
              `
            })
          })
        })
      })
    }
  }
)}

document.addEventListener('DOMContentLoaded', function(e) {
  // display all user's notes on sidebar
  fetchGET()

  // display individual note
  displayNoteBody()

  // add new note
  fetchPOST()

  // update note
  fetchPATCH()

  // delete note and take it out of sidebar
  fetchDELETE()
})
