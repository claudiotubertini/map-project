/**
 * Generates a random number and returns it as a string for OAuthentication
 * @return {string}
 */
function nonce_generate() {
  return (Math.floor(Math.random() * 1e12).toString());
}

var yelp_url = YELP_BASE_URL + 'business/' + self.selected_place().Yelp.business_id;

    var parameters = {
      oauth_consumer_key: YELP_KEY,
      oauth_token: YELP_TOKEN,
      oauth_nonce: nonce_generate(),
      oauth_timestamp: Math.floor(Date.now()/1000),
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version : '1.0',
      callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
    };

    var encodedSignature = oauthSignature.generate('GET',yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
    parameters.oauth_signature = encodedSignature;

    var settings = {
      url: yelp_url,
      data: parameters,
      cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
      dataType: 'jsonp',
      success: function(results) {
        // Do stuff with results
      },
      fail: function() {
        // Do stuff on fail
      }
    };

    // Send AJAX query via jQuery library.
    $.ajax(settings);




var auth = {
    //
    // Update with your auth tokens.
    //
    consumerKey: "prDh84pXCS_02SSJsMc7vQ",
    consumerSecret: "NbnFdAmFR9YPKzXJBznc3eWthuPJ8Gl2fg1WDBgbOqV1nuqpiEjKv2ioXubZz5Jx",
    accessToken: "n6Vf3PbreU03mNXszgeYiePDuv5QotP3POEP_kfCJjsg8uCS2pVZKX6AvFJ3YmEuzUssr4KkD8Q2Oq2xKA79ATKUDtIKbkdT7LAlNL2SdeAzFb5ll4AanyARQIBJWHYx",
      // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
      // You wouldn't actually want to expose your access token secret like this in a real application.
    accessTokenSecret: "YOUR_TOKEN_SECRET",
    serviceProvider: {
        signatureMethod: "HMAC-SHA1"
      }
    };

var terms = 'food';
var near = 'San+Francisco';
var accessor = {
      consumerSecret: auth.consumerSecret,
      tokenSecret: auth.accessTokenSecret
    };
parameters = [];
parameters.push(['term', terms]);
parameters.push(['location', near]);
parameters.push(['callback', 'cb']);
parameters.push(['oauth_consumer_key', auth.consumerKey]);
parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
parameters.push(['oauth_token', auth.accessToken]);
parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
var message = {
      'action': 'http://api.yelp.com/v2/search',
      'method': 'GET',
      'parameters': parameters
    };
OAuth.setTimestampAndNonce(message);
OAuth.SignatureMethod.sign(message, accessor);
var parameterMap = OAuth.getParameterMap(message.parameters);
parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
console.log(parameterMap);

  $.ajax({
    'url': message.action,
    'data': parameterMap,
    'cache': true,
    'dataType': 'jsonp',
    'jsonpCallback': 'cb',
    'success': function(data, textStats, XMLHttpRequest) {
      console.log(data);
      var output = prettyPrint(data);
      $("body").append(output);
    }
  });

 // load nytimes
    // obviously, replace all the "X"s with your own API key
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' 
    + cityStr + '&sort=newest&api-key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    $.getJSON(nytimesUrl, function(data){

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };

    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
        });
