function generateKey() {
	Keypairs.generate({
		kty: 'RSA',
		modulusLength: 2048
	}).then(function (pair) {
		Keypairs.export({
			jwk: pair.private, 
			private: true 
		}).then(function (pem) {
  			console.log("private key:\n" + pem);
			Cookies.set('private_key', pem);
		});

		Keypairs.export({
			jwk: pair.public, 
			public: true
		}).then(function (pem) {
  			console.log("public key:\n" + pem);
			Cookies.set('public_key', pem);
		});
	});
}

function sign(message) {
	var rsa = new RSAKey();
	rsa.readPrivateKeyFromPEMString(Cookies.get('private_key'));

	return rsa.sign(message, 'sha256');
}

$("#sign-up-form").submit(function(e) {
	$("<input />").attr("type", "hidden")
          		  .attr("name", "public_key")
          		  .attr("value", Cookies.get("public_key"))
          		  .appendTo("#sign-up-form");

	return true;
});

$("#vote-form").submit(function(e) {
	var email = $('#vote-form>input[name="email"]').val();
	var vote_id = $('#select-vote').val();
	var msg = email + vote_id;
	var signature = sign(msg);
	console.log(Cookies.get('private_key'));
	$("<input />").attr("type", "hidden")
                  .attr("name", "sign")
                  .attr("value", signature)
                  .appendTo("#vote-form");

	$("<input />").attr("type", "hidden")
                  .attr("name", "message")
                  .attr("value", msg)
                  .appendTo("#vote-form");

    return true;
});
