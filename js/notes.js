let titleInput = document.getElementsByClassName("title-input")[0];
let descriptionInput = document.getElementsByClassName("description")[0];
let imageContainer = document.querySelector(".note-image2");
function addNote() {
  let title = titleInput.value.trim(); // since it's a <div contenteditable="true">

  let description = descriptionInput.value.trim();

  if (title || description) {
    let noteCard = document.createElement("div");

    noteCard.classList.add("note-card");
    noteCard.innerHTML = `
      <div class="note-header">
       <div class="actualNote-title" contenteditable="true">${title}</div>

        <i class="fa-solid fa-xmark delete-note"></i>
      </div>
      <div>
      </div>
      <div class="note-image" >${imageContainer.innerHTML}</div>
      <div class="actualNote-content" contenteditable="true" >${description}</div>
      <div class="foter-container">
        <button class="bold-text"><i class="fa-solid fa-bold"></i></button>
        <button class="bg-color"><i class="fa-solid fa-palette"></i></button>
        <button class="image"><i class="fa-solid fa-image"></i></button>
        <button class="pin"><i class="fa-solid fa-thumbtack" style="transform: rotate(45deg)"></i></button>
        
      </div>
    `;

    document.querySelector(".notes-container").appendChild(noteCard);

    // Clear inputs
    titleInput.value = "";
    descriptionInput.value = "";
    imageContainer.innerHTML = "";
  }
}

let isCancelling = false;
let isUploadingImage = false; //flag

// Enter to save (only in description)
descriptionInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    addNote();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const cancelBtn = document.querySelector(".foter-container .cancel-btn");

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      isCancelling = true;
      titleInput.value = "";
      descriptionInput.value = "";
      imageContainer.innerHTML = "";
    });
  }
});
//  Remove note (event delegation)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("delete-note")) {
    e.target.closest(".note-card").remove();
  }
});

function togglePinnedTitle() {
  const pinnedContainer = document.querySelector(".pinned-container");
  const pinnedTitle = document.querySelector(".pinned-title");

  if (pinnedContainer.children.length > 0) {
    pinnedTitle.style.display = "block";
  } else {
    pinnedTitle.style.display = "none";
  }
}

//function for making text bold
function applyBold(noteCard) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);

  // All editable areas we allow bold in
  const editableAreas = noteCard.querySelectorAll(
    ".title-input, .description, .actualNote-title, .actualNote-content"
  );

  // Check if the selection is inside any of them
  let insideEditable = false;
  editableAreas.forEach((area) => {
    if (area.contains(range.commonAncestorContainer)) {
      insideEditable = true;
    }
  });

  if (!insideEditable) return;

  // Toggle bold logic
  if (selection.anchorNode.parentElement.tagName === "STRONG") {
    const strong = selection.anchorNode.parentElement;
    const text = document.createTextNode(strong.textContent);
    strong.replaceWith(text);
  } else {
    const strong = document.createElement("strong");
    strong.appendChild(range.extractContents());
    range.insertNode(strong);
  }
}

// function to add image
function addImage(noteCard) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.click();
  isUploadingImage = true;

  input.onchange = () => {
    const file = input.files[0];
    if (!file) {
      isUploadingImage = false;
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      const img = document.createElement("img");
      img.src = event.target.result;
      img.style.maxWidth = "100%";
      img.style.borderRadius = "6px";

      // ✅ pick the right container inside THIS note
      let container =
        noteCard.querySelector(".note-image") ||
        noteCard.querySelector(".note-image2");

      if (container) {
        container.appendChild(img);
        noteCard.classList.add("has-image");
      }
    };

    reader.readAsDataURL(file);
    isUploadingImage = false;
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
  if (!noteCard) return;

  // bold text btn
  if (e.target.closest(".bold-text")) {
    e.preventDefault(); // stop button from stealing focus
    applyBold(noteCard);
  }

  // image button
  if (e.target.closest(".image")) {
    e.preventDefault();
    addImage(noteCard);
  }

  // Theme button
  if (e.target.closest(".bg-color")) {
    e.preventDefault();
    cycleNoteColor(noteCard);
  }
  if (e.target.closest(".pin")) {
    e.preventDefault();

    const pinnedContainer = document.querySelector(".pinned-container");
    const notesContainer = document.querySelector(".notes-container");

    if (noteCard.classList.contains("is-pinned")) {
      // unpin -> move back to notes
      noteCard.classList.remove("is-pinned");
      notesContainer.appendChild(noteCard);
    } else {
      // pin -> move to pinned container
      noteCard.classList.add("is-pinned");
      pinnedContainer.appendChild(noteCard);
    }
    togglePinnedTitle();
  }
});
