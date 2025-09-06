let titleInput = document.getElementsByClassName("title-input")[0];
let descriptionInput = document.getElementsByClassName("description")[0];

function addNote() {
  let title = titleInput.value.trim();
  let description = descriptionInput.value.trim();

  if (title || description) {
    let noteCard = document.createElement("div");

    noteCard.classList.add("note-card");
    noteCard.innerHTML = `
      <div class="note-header">
        <div class="title-input actualNote-title" contenteditable="true" placeholder="Title">${title}</div>

        <i class="fa-solid fa-xmark delete-note"></i>
      </div>
      <div>
        <div class="title-input actualNote-title" contenteditable="true" placeholder="Title">${description}</div>

      </div>
      <div class="note-image"></div>
      <div class="foter-container">
        <button class="bold-text"><i class="fa-solid fa-bold"></i></button>
        <button class="bg-color"><i class="fa-solid fa-palette"></i></button>
        <button class="image"><i class="fa-solid fa-image"></i></button>
        <button class="pin"><i class="fa-solid fa-thumbtack" style="transform: rotate(45deg)"></i></button>
        <button class="more"><i class="fa-solid fa-ellipsis"></i></button>
      </div>
    `;

    document.querySelector(".notes-container").appendChild(noteCard);

    // Clear inputs
    titleInput.value = "";
    descriptionInput.value = "";
  }
}

// Blur handling
let blurTimeout;
[titleInput, descriptionInput].forEach((input) => {
  input.addEventListener("blur", () => {
    blurTimeout = setTimeout(() => {
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();

      if (
        (title || description) &&
        !titleInput.matches(":focus") &&
        !descriptionInput.matches(":focus")
      ) {
        addNote();
      }
    }, 150);
  });
  input.addEventListener("focus", () => clearTimeout(blurTimeout));
});

// Enter to save (only in description)
descriptionInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addNote();
  }
});

//  Remove note (event delegation)
document
  .querySelector(".notes-container")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-note")) {
      e.target.closest(".note-card").remove();
    }
  });

//  Cancel clears input
document.querySelector(".cancel-btn").addEventListener("click", () => {
  titleInput.value = "";
  descriptionInput.value = "";
});

//function for making text bold
function applyBold(noteCard) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  if (!noteCard.contains(range.commonAncestorContainer)) return;

  const strong = document.createElement("strong");
  strong.appendChild(range.extractContents());
  range.insertNode(strong);
}

// function to add image
function addImage(noteCard) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();
  input.onchange = () => {
    const file = input.files[0];
    if (!file) return;

    reader.onload = function (event) {
      const img = document.createElement("img");
      img.src = event.target.result;
      noteCard.querySelector(".note-image").appendChild(img);
      noteCard.classList.add("has-image"); // make visible
    };
    reader.readAsDataURL(file);
  };
}

// function for changing background color
function cycleNoteColor(noteCard) {
  const classes = ["yellow-note", "green-note", "blue-note", "orange-note"];
  let current = noteCard.getAttribute("data-color-index") || 0;
  noteCard.classList.remove(classes[current]);
  current = (parseInt(current) + 1) % classes.length;
  noteCard.classList.add(classes[current]);
  noteCard.setAttribute("data-color-index", current);
}
document.addEventListener("click", function (e) {
  let noteCard = e.target.closest(".note-card");
  if (!noteCard) return; // return if click is not inside the note

  //bold text btn
  if (e.target.closest(".bold-text")) {
    applyBold(noteCard);
  }
  // image button
  if (e.target.closest(".image")) {
    addImage(noteCard);
  }
  // Theme button
  if (e.target.closest(".bg-color")) {
    cycleNoteColor(noteCard);
  }
});
