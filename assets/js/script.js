document.addEventListener('DOMContentLoaded', function () {
  const noteList = document.querySelector('.note-list');
  const addNoteForm = document.querySelector('.note-form');
  const titleInput = document.getElementById('note-title');
  const bodyInput = document.getElementById('note-body');
  const titleError = document.getElementById('title-error');
  const bodyError = document.getElementById('body-error');
  const loadingIndicator = document.getElementById('loading-indicator');

  let notesData = [];
  let currentView = 'non-archived';

  // fetching
  function fetchNotesData() {
    loadingIndicator.style.display = 'flex';
    setTimeout(() => {
      fetch('https://notes-api.dicoding.dev/v2/notes')
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Gagal mengambil data note');
          }
          return response.json();
        })
        .then(function (data) {
          notesData = data.data;
          getNonArchivedNotes();
          getArchivedNotes();
          displayNotes();
        })
        .catch(function (error) {
          console.error('Error fetching notes:', error);
        })
        .finally(function () {
          loadingIndicator.style.display = 'none';
        });
    }, 1800);
  }

  // display
  function displayNotes() {
    noteList.innerHTML = '';
    let filteredNotes;
    if (currentView === 'non-archived') {
      filteredNotes = notesData.filter((note) => !note.archived);
    } else {
      filteredNotes = notesData.filter((note) => note.archived);
    }

    filteredNotes.forEach((note) => {
      const noteCard = document.createElement('div');
      noteCard.classList.add('note-card');
      noteCard.innerHTML = `
      <h2>${note.title}</h2>
      <p>${note.body}</p>
      <small>Created At: ${new Date(
        note.createdAt
      ).toLocaleString()}</small> </br>
      <button class="button archive-button" data-note-id="${note.id}">
        ${note.archived ? 'Unarchive' : 'Archive'}
      </button>
      <button class="button delete-button" data-note-id="${
        note.id
      }">Delete</button>
    `;
      noteList.appendChild(noteCard);
      animateCard(noteCard);
    });
  }

  function displayNotesTable(title, notes) {
    console.log(title + ':');
    const logTable = document.createElement('table');
    logTable.innerHTML = `
      <tr>
        <th>ID</th>
        <th>Judul</th>
        <th>Isi</th>
        <th>Tanggal Dibuat</th>
      </tr>
    `;
    notes.forEach((note) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${note.id}</td>
        <td>${note.title}</td>
        <td>${note.body}</td>
        <td>${new Date(note.createdAt).toLocaleString()}</td>
      `;
      logTable.appendChild(row);
    });
    console.table(notes);
  }

  function fetchAllNotesData() {
    const fetchNonArchivedNotes = fetch(
      'https://notes-api.dicoding.dev/v2/notes'
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal mengambil data note');
        }
        return response.json();
      })
      .then(function (data) {
        return data.data;
      })
      .catch(function (error) {
        console.error('Error fetching notes:', error);
      });

    const fetchArchivedNotes = fetch(
      'https://notes-api.dicoding.dev/v2/notes/archived'
    )
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal mengambil data note yang diarsipkan');
        }
        return response.json();
      })
      .then(function (data) {
        return data.data;
      })
      .catch(function (error) {
        console.error('Error fetching archived notes:', error);
      });

    Promise.all([fetchNonArchivedNotes, fetchArchivedNotes]).then(function (
      results
    ) {
      const nonArchivedNotes = results[0];
      const archivedNotes = results[1];
      notesData = nonArchivedNotes.concat(archivedNotes);
      displayAllLogs();
      displayNotes();
    });
  }

  function displayAllLogs() {
    console.log('Semua Note:');
    console.table(
      notesData.map((note) => ({
        id: note.id,
        archived: note.archived,
        title: note.title,
        body: note.body,
        createdAt: new Date(note.createdAt).toLocaleString(),
      }))
    );
  }

  // get
  function getNonArchivedNotes() {
    fetch('https://notes-api.dicoding.dev/v2/notes')
      .then(function (response) {
        if (!response.ok) {I
          throw new Error('Gagal mengambil note non-archived');
        }
        return response.json();
      })
      .then(function (data) {
        const nonArchivedNotes = data.data.filter((note) => !note.archived);
        displayNotesTable('Note Yang Tidak Terarsipkan', nonArchivedNotes);
      })
      .catch(function (error) {
        console.error('Error fetching non-archived notes:', error);
      });
  }

  function getArchivedNotes() {
    fetch('https://notes-api.dicoding.dev/v2/notes/archived')
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal mengambil note yang diarsipkan');
        }
        return response.json();
      })
      .then(function (data) {
        const archivedNotes = data.data;
        displayNotesTable('Note Yang Diarsipkan', archivedNotes);
      })
      .catch(function (error) {
        console.error('Error fetching archived notes:', error);
      });
  }

  // validasi
  function validateTitle() {
    const titleWords = titleInput.value.trim().split(/\s+/).length;
    if (titleWords < 2) {
      titleError.textContent = 'Judul harus terdiri dari minimal dua kata.';
      titleInput.setCustomValidity(
        'Judul harus terdiri dari minimal dua kata.'
      );
    } else {
      titleError.textContent = '';
      titleInput.setCustomValidity('');
    }
    console.log(titleInput.validationMessage);
  }

  function validateBody() {
    if (bodyInput.value.trim().length < 20) {
      bodyError.textContent = 'Isi note harus memiliki minimal 20 karakter.';
      bodyInput.setCustomValidity(
        'Isi note harus memiliki minimal 20 karakter.'
      );
    } else {
      bodyError.textContent = '';
      bodyInput.setCustomValidity('');
    }
  }

  // add
  function addNote() {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: title, body: body }),
    };

    fetch('https://notes-api.dicoding.dev/v2/notes', requestOptions)
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal menambahkan note');
        }
        return response.json();
      })
      .then(function (data) {
        const newNote = data.data;
        notesData.push(newNote);
        displayNotes();
        addNoteForm.reset();

        const newNoteElement = document.querySelector(
          `[data-note-id="${newNote.id}"]`
        );

        if (newNoteElement) {
          newNoteElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        console.log('note baru telah ditambahkan:');
        console.table({
          id: newNote.id,
          archived: newNote.archived,
          title: newNote.title,
          body: newNote.body,
          createdAt: newNote.createdAt,
        });
        displayAllLogs();
      })
      .catch(function (error) {
        console.error('Error adding note:', error);
        Swal.fire(
          'Error!',
          'Terjadi kesalahan saat menambahkan catatan.',
          'error'
        );
      });
  }

  // delete
  function deleteNote(noteId) {
    Swal.fire({
      title: 'Konfirmasi Hapus',
      text: 'Apakah anda yakin untuk menghapus Note ini?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6895D2',
      cancelButtonColor: '#D04848',
      confirmButtonText: 'Ya, Hapus!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}`, {
          method: 'DELETE',
        })
          .then(function (response) {
            if (!response.ok) {
              throw new Error('Gagal menghapus Note');
            }
            return response.json();
          })
          .then(function (data) {
            const deletedNoteIndex = notesData.findIndex(
              (note) => note.id === noteId
            );
            if (deletedNoteIndex !== -1) {
              const deletedNote = notesData[deletedNoteIndex];
              notesData.splice(deletedNoteIndex, 1);
              displayNotes();
              updateNote();

              const logTable = document.createElement('table');
              logTable.innerHTML = `
                <tr>
                  <th>ID</th>
                  <th>Judul</th>
                  <th>Isi</th>
                  <th>Tanggal Dibuat</th>
                </tr>
                <tr>
                  <td>${deletedNote.id}</td>
                  <td>${deletedNote.title}</td>
                  <td>${deletedNote.body}</td>
                  <td>${new Date(deletedNote.createdAt).toLocaleString()}</td>
                </tr>
              `;
              console.log('Note yang dihapus:');
              console.table({
                id: deletedNote.id,
                title: deletedNote.title,
                body: deletedNote.body,
                createdAt: new Date(deletedNote.createdAt).toLocaleString(),
              });
              console.log(`Note dengan id '${noteId}' sudah terhapus`);
              Swal.fire('Note Terhapus!', 'Note berhasil dihapus.', 'success');
            }
          })
          .catch(function (error) {
            console.error('Error deleting note:', error);
            Swal.fire(
              'Error!',
              'Terjadi kesalahan saat menghapus note.',
              'error'
            );
          });
      }
    });
  }

  // update
  function updateNote() {
    console.log('Updated notesData:', notesData);
  }

  // archive & unarchive
  function archiveNote(noteId) {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/archive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal mengarsipkan Note');
        }
        return response.json();
      })
      .then(function (data) {
        const archivedNoteIndex = notesData.findIndex(
          (note) => note.id === noteId
        );
        if (archivedNoteIndex !== -1) {
          notesData[archivedNoteIndex].archived = true;
          displayNotes();
          displayArchiveLog(notesData[archivedNoteIndex]);
          getArchivedNotes(); // Perbarui tampilan dengan data terbaru
          Swal.fire('Note Diarsipkan!', 'Note berhasil diarsipkan.', 'success');
        }
      })
      .catch(function (error) {
        console.error('Error archiving note:', error);
        Swal.fire(
          'Error!',
          'Terjadi kesalahan saat mengarsipkan note.',
          'error'
        );
      });
  }

  function unarchiveNote(noteId) {
    fetch(`https://notes-api.dicoding.dev/v2/notes/${noteId}/unarchive`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('Gagal mengembalikan Note dari arsip');
        }
        return response.json();
      })
      .then(function (data) {
        const unarchivedNoteIndex = notesData.findIndex(
          (note) => note.id === noteId
        );
        if (unarchivedNoteIndex !== -1) {
          notesData[unarchivedNoteIndex].archived = false;
          displayNotes();
          displayUnarchiveLog(notesData[unarchivedNoteIndex]);
          getArchivedNotes(); // Perbarui tampilan dengan data terbaru
          Swal.fire(
            'Note Dikembalikan!',
            'Note berhasil dikembalikan dari arsip.',
            'success'
          );
        }
      })
      .catch(function (error) {
        console.error('Error unarchiving note:', error);
        Swal.fire(
          'Error!',
          'Terjadi kesalahan saat mengembalikan note dari arsip.',
          'error'
        );
      });
  }

  function displayArchiveLog(note) {
    console.log(`Note telah diarsipkan:`);
    console.table({
      id: note.id,
      title: note.title,
      body: note.body,
      createdAt: new Date(note.createdAt).toLocaleString(),
    });
  }

  function displayUnarchiveLog(note) {
    console.log(`Note Telah Dikembalikan Dari arsip:`);
    console.table({
      id: note.id,
      title: note.title,
      body: note.body,
      createdAt: new Date(note.createdAt).toLocaleString(),
    });
  }

  titleInput.addEventListener('input', validateTitle);
  bodyInput.addEventListener('input', validateBody);

  addNoteForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (addNoteForm.checkValidity()) {
      addNote();
    } else {
      titleInput.reportValidity();
      bodyInput.reportValidity();
    }
  });

  noteList.addEventListener('click', function (event) {
    if (event.target.classList.contains('archive-button')) {
      const noteId = event.target.getAttribute('data-note-id');
      if (!notesData.find((note) => note.id === noteId).archived) {
        archiveNote(noteId);
      } else {
        unarchiveNote(noteId);
      }
    } else if (event.target.classList.contains('delete-button')) {
      const noteId = event.target.getAttribute('data-note-id');
      deleteNote(noteId);
    }
  });

  document
    .querySelector('#non-archived-notes-button')
    .addEventListener('click', function () {
      currentView = 'non-archived';
      console.log('Beralih ke Tampilan Non-Archived');
      console.log('Tampilan:', currentView);
      displayNotes();
    });

  document
    .querySelector('#archived-notes-button')
    .addEventListener('click', function () {
      currentView = 'archived';
      console.log('Beralih ke Tampilan Diarsipkan');
      console.log('Tampilan:', currentView);
      fetchAllNotesData();
    });

  fetchNotesData();
  fetchAllNotesData();
});
