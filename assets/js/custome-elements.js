class NoteList extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="note-list">
      </div>
      <div class="loading-indicator" id="loading-indicator">
        <div class="loader"></div>
      </div>
    `;
  }
}
customElements.define('note-list', NoteList);

class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="header">
        <h1 class="animate-header">Notes App</h1>
      </header>
    `;
  }
}
customElements.define('app-header', AppHeader);

class AddNoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <form class="note-form">
        <label for="note-title" ></label>
        <input type="text" id="note-title" class="input-text" name="note-title"  placeholder="Notes Name" required />
        <span id="title-error" class="error"></span><br>
        <label for="note-body" ></label>
        <textarea id="note-body" class="textarea" name="note-body" rows="4" cols="50" placeholder="Note Description " required></textarea><br>
        <span id="body-error" class="error"></span><br>
        <button type="submit" class="submit-button add-note-button">Add Note</button> 
      </form>
    `;

    const formElements = this.querySelectorAll(
      '.label, .input-text, .textarea, .submit-button'
    );
    anime({
      targets: formElements,
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeInOutQuad',
    });
  }
}
customElements.define('add-note-form', AddNoteForm);

class arcvhbtn extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
    <button class="button archive-link" id="non-archived-notes-button">Non-Archived Notes</button>
    <button class="button archive-link" id="archived-notes-button">Archived Notes</button>
    `;
    const buttons = this.querySelectorAll('.archive-link');
    anime({
      targets: buttons,
      translateY: [-20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100, { start: 300 }),
      easing: 'easeInOutQuad',
    });
  }
}
customElements.define('archive-link', arcvhbtn);

class DeleteButton extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="button delete-button" data-note-id="${this.getAttribute(
        'data-note-id'
      )}">Delete</button>
    `;
  }
}
customElements.define('delete-button', DeleteButton);

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <p>&copy; 2024 Notes App</p>
      </footer>
    `;
  }
}
customElements.define('app-footer', AppFooter);
