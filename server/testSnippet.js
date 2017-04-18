    $.ajax({
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'POST',
      data:  {
        username: 'Jono',
        message: 'Do my bidding!'},
      contentType: 'application/json',
      success: function(data) {
        console.log('chatterbox: Success at fetching messages');
        //if (!data.results || !data.results.length) { return; }

      },
      error: function(error) {
        console.error('chatterbox: Failed to fetch messages', error);
      }
    });