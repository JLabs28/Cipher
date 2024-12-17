document.getElementById("encrypt-button").addEventListener("click", () => {
  const word = document.getElementById("word").value.trim();
  const shift = parseInt(document.getElementById("shift").value);
  const riddle = document.getElementById("riddle").value.trim();

  if (shift < 0 || shift > 9) {
    alert("Shift value must be between 0 and 9!");
    document.getElementById("output").textContent = "Please enter a valid shift value between 0 and 9.";
    return;
  }

  if (!word || !riddle) {
    document.getElementById("output").textContent = "Please fill in all fields.";
    return;
  }

  const encryptedWord = word.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });

  let encryptedMessages = JSON.parse(localStorage.getItem("encryptedMessages")) || [];
  encryptedMessages.push({ encryptedWord, riddle, shift });
  localStorage.setItem("encryptedMessages", JSON.stringify(encryptedMessages));

  document.getElementById("output").textContent = `Encrypted Word: ${encryptedWord}. Encrypted successfully!`;
});

document.getElementById("shift").addEventListener("input", () => {
  const shiftValue = parseInt(document.getElementById("shift").value);
  const encryptButton = document.getElementById("encrypt-button");

  if (shiftValue < 0 || shiftValue > 9 || isNaN(shiftValue)) {
    encryptButton.disabled = true;
    if (shiftValue < 0 || shiftValue > 9) {
      alert("Shift value must be between 0 and 9!");
    }
  } else {
    encryptButton.disabled = false;
  }
});