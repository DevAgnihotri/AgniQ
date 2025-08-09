var messageArray = ["<div class='message'><p>This is just a test.</p></div>", "<div class='message'><p>Don't be afraid.</p></div>", "<div class='message'><p>That comes later.</p></div>", "<div class='message'><p>Let's get started..</p></div>"];

var index = 0;
var numMessages = messageArray.length;

function messages() {
  $('.chat').append(messageArray[index]);
  index = (index + 1) % numMessages;
}

/*setInterval(messages, 1000);