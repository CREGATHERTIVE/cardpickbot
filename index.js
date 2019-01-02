var rp = require('request-promise');

exports.reply = function justReply(req, res) {

    const promises = req.body.events.map(event => {

        var msg = event.message.text;
        var reply_token = event.replyToken;

        var target_albumId = "";

        if( msg.includes( '抽名片' ) ){
            target_albumId = 'eFKpbXB' ;
        }else{
            return;
        }

        var imgur_options = {
            method: 'GET',
            uri: `https://api.imgur.com/3/album/${target_albumId}/images`,
            headers: {
              "Authorization": `Client-ID ${193e2d7faeaa986}`
            },
            json: true
        };


        return rp(imgur_options)
        .then(function (imgur_response) {

            // collect image urls from the album
            var array_images = [];
            imgur_response.data.forEach(function(item){
                array_images.push(item.link);
            })

            // choose one of images randomly
            var target_imageUrl = array_images[Math.floor(Math.random()*array_images.length)];

            var lineReply_options = {
                method: 'POST',
                uri: "https://api.line.me/v2/bot/message/reply",
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                  "Authorization": ` Bearer ${fLQm+fNKJawBODZ9eL0TxcPTvyJf/v9fxFEHNQ9EH+vBb8BItOfbIyddsoc4jtbt5IHjVdumQGJlKH/CqVJ57Erx2Y4TcdJpVBb5nTCDPjGW+7zRnuyROetK38I2WpECTOiMsp7iJLMXPm0OlaJqHwdB04t89/1O/w1cDnyilFU=}`
                },
                json: true,
                body: {
                  replyToken: reply_token,
                  messages:[
                    {
                        type: 'image',
                        originalContentUrl: target_imageUrl.replace("http", "https"),
                        previewImageUrl: target_imageUrl.replace("http", "https")
                    }
                  ]
                }
            };

            return rp(lineReply_options);

        })
        .catch(function (err) {
            console.log( err );
        });

    });

    Promise
    .all(promises)
    .then(() => res.json({success: true}));


};
