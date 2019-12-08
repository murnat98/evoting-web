function generateKey() {
	var crypt = new JSEncrypt({default_key_size: 2048});
	crypt.getKey();
	Cookies.set('private_key', crypt.getPrivateKey());
	Cookies.set('public_key', crypt.getPublicKey());
}

function sign(message) {
	/*
	var rsa = new RSAKey();
	rsa.readPrivateKeyFromPEMString(Cookies.get('private_key'));

	return rsa.sign(message, 'sha256');
	*/
	var sig = new KJUR.crypto.Signature({"alg": "SHA256withRSA"});
	sig.init(Cookies.get('private_key'));
	sig.updateString(message);
	var hSigVal = sig.sign();
	return hSigVal;
}

$("#sign-up-form").submit(function(e) {
	generateKey();
	$("<input />").attr("type", "hidden")
          		  .attr("name", "public_key")
          		  .attr("value", Cookies.get("public_key"))
          		  .appendTo("#sign-up-form");

	return true;
});

$("#vote-form").submit(function(e) {
	var vote_id = $('#select-vote').val();
	var signature = sign(vote_id);
	console.log(Cookies.get('public_key'));
	$("<input />").attr("type", "hidden")
                  .attr("name", "sign")
                  .attr("value", signature)
                  .appendTo("#vote-form");

	$("<input />").attr("type", "hidden")
                  .attr("name", "message")
                  .attr("value", vote_id)
                  .appendTo("#vote-form");

    return true;
});
