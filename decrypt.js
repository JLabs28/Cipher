window.addEventListener("load", () => {
  let timeRemaining = 300; // 5 minutes in seconds
  let timerInterval; // Timer reference
  let timerStarted = false; // Timer control flag

  const timerDisplay = document.getElementById("timer");
  const decryptButton = document.getElementById("decrypt-button");
  const deleteButton = document.getElementById("delete-button");
  const guessInput = document.getElementById("guess");
  const outputElement = document.getElementById("output");
  const selectElement = document.getElementById("encrypted-messages-list");

  // Load encrypted messages from localStorage
  let encryptedMessages = JSON.parse(localStorage.getItem("encryptedMessages")) || [];
  encryptedMessages = encryptedMessages.map(msg => ({ ...msg, completed: msg.completed || false }));

  const renderMessages = (autoSelectNext = false) => {
    // Clear dropdown and add default option
    selectElement.innerHTML = '<option value="">Select an encrypted message</option>';
    let nextIndex = -1;

    encryptedMessages.forEach((message, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `Message ${index + 1}`;

      if (message.completed) {
        option.textContent += " (Completed)";
        option.disabled = true;
      } else if (nextIndex === -1) {
        nextIndex = index; // Store the next uncompleted message
      }

      selectElement.appendChild(option);
    });

    // Auto-select the next uncompleted message
    if (autoSelectNext && nextIndex !== -1) {
      selectElement.value = nextIndex;
      loadMessage(nextIndex);
    }
  };

  const startTimer = () => {
    if (timerStarted) return;
    timerStarted = true;
    timerInterval = setInterval(updateTimer, 1000);
  };

  const updateTimer = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      gameOver();
    } else {
      timeRemaining--;
    }
  };

  const gameOver = () => {
    outputElement.textContent = "Game Over! Time's up.";
    outputElement.style.color = "red";
    decryptButton.disabled = true;
    guessInput.disabled = true;
    selectElement.disabled = true;
  };

  const loadMessage = (index) => {
    const selectedMessage = encryptedMessages[index];
    document.querySelector("#riddle-clue span").textContent = selectedMessage.riddle;
    document.getElementById("shift").value = selectedMessage.shift;
    document.querySelector("#encrypted-text span").textContent = selectedMessage.encryptedWord;
    guessInput.value = "";
    outputElement.textContent = "";
    decryptButton.disabled = false;
    guessInput.disabled = false;
    startTimer();
  };

  selectElement.addEventListener("change", () => {
    const selectedIndex = selectElement.value;
    if (selectedIndex !== "") {
      loadMessage(selectedIndex);
    }
  });

  decryptButton.addEventListener("click", () => {
    const selectedIndex = selectElement.value;
    if (selectedIndex === "") {
      outputElement.textContent = "Please select an encrypted message.";
      return;
    }

    const selectedMessage = encryptedMessages[selectedIndex];
    const guess = guessInput.value.trim();

    // Caesar Cipher decryption logic
    const decodedWord = selectedMessage.encryptedWord.replace(/[a-zA-Z]/g, char => {
      const base = char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base - selectedMessage.shift + 26) % 26) + base);
    });

    if (guess.toLowerCase() === decodedWord.toLowerCase()) {
      outputElement.textContent = "Correct! Decrypted successfully!";
      outputElement.style.color = "green";
      encryptedMessages[selectedIndex].completed = true;
      localStorage.setItem("encryptedMessages", JSON.stringify(encryptedMessages));

      if (encryptedMessages.every(msg => msg.completed)) {
        // All messages decrypted
        clearInterval(timerInterval);
        outputElement.textContent = "Congratulations! All messages decrypted!";
        outputElement.style.color = "blue";
        decryptButton.disabled = true;
        guessInput.disabled = true;
      } else {
        renderMessages(true); // Auto-select the next uncompleted message
      }
    } else {
      outputElement.textContent = "Incorrect! Try again.";
      outputElement.style.color = "orange";
    }
  });

  deleteButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all messages?")) {
      localStorage.removeItem("encryptedMessages");
      encryptedMessages = [];
      renderMessages();
      document.querySelector("#riddle-clue span").textContent = "";
      document.querySelector("#encrypted-text span").textContent = "";
      guessInput.value = "";
      outputElement.textContent = "";
      decryptButton.disabled = true;
      guessInput.disabled = true;
      alert("All messages have been deleted successfully!");
    }
  });

  renderMessages(); // Initial rendering
});
