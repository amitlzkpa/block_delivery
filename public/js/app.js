$(document).ready(() => {

	
	let NA = '-';


	// convert coordinates to ints for the contract
	function pad(n, len=6) {
		n = n.toString();
		n.trim();
		let q = n.length;
		for(let i=q; i<len; i++) {
			n = "0"+n;
		}
		return n;
	}

	function parseToFxLengStr(n) {
		let isNeg = n < 0;
		let m = n.toFixed(3).toString().replace('.', '').replace('-', '');
		m = pad(m);
		if(isNeg) m = "1" + m;
		else m = "0" + m;
		return m
	}

	function encodeCoord(coord) {
		let la = parseToFxLengStr(coord.Latitude);
		let lo = parseToFxLengStr(coord.Longitude);
		let loc = la + lo;
		let i = parseInt(loc);
		return i;
	}

	// todo ------------------------------------------------------------------------------------------
	function decodeCoord(str) {
		let paddedStr = pad(str, 14);
		let laEnc = paddedStr.slice(0, 7);
		let loEnc = paddedStr.slice(7, paddedStr.length);
		let laIsNeg = (laEnc.charAt(0) == '1');
		let loIsNeg = (loEnc.charAt(0) == '1');

		// console.log(paddedStr);
		laEnc = laEnc.slice(1, laEnc.length);
		loEnc = loEnc.slice(1, loEnc.length);

		laEnc = [laEnc.slice(0, 3), '.', laEnc.slice(3)].join('');
		loEnc = [loEnc.slice(0, 3), '.', loEnc.slice(3)].join('');
		// console.log(`la is ${laEnc} and is${(laIsNeg ? '' :' not')} negative`);
		// console.log(`lo is ${loEnc} and is${(loIsNeg ? '' :' not')} negative`);

		let la = parseFloat(laEnc) * ((laIsNeg) ? -1 : 1);
		let lo = parseFloat(loEnc) * ((loIsNeg) ? -1 : 1);

		return { "latitude": la, "longitude": lo };
	}

	// ref: https://gist.github.com/joni/3760795
	// array of bytes
	function fromUTF8Array(data) {
	    var str = '',
	        i;

	    for (i = 0; i < data.length; i++) {
	        var value = data[i];

	        if (value < 0x80) {
	            str += String.fromCharCode(value);
	        } else if (value > 0xBF && value < 0xE0) {
	            str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
	            i += 1;
	        } else if (value > 0xDF && value < 0xF0) {
	            str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
	            i += 2;
	        } else {
	            // surrogate pair
	            var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

	            str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00); 
	            i += 3;
	        }
	    }

	    return str;
	}

	// ref: https://gist.github.com/joni/3760795
	function toUTF8Array(str) {
	    var utf8 = [];
	    for (var i=0; i < str.length; i++) {
	        var charcode = str.charCodeAt(i);
	        if (charcode < 0x80) utf8.push(charcode);
	        else if (charcode < 0x800) {
	            utf8.push(0xc0 | (charcode >> 6), 
	                      0x80 | (charcode & 0x3f));
	        }
	        else if (charcode < 0xd800 || charcode >= 0xe000) {
	            utf8.push(0xe0 | (charcode >> 12), 
	                      0x80 | ((charcode>>6) & 0x3f), 
	                      0x80 | (charcode & 0x3f));
	        }
	        // surrogate pair
	        else {
	            i++;
	            // UTF-16 encodes 0x10000-0x10FFFF by
	            // subtracting 0x10000 and splitting the
	            // 20 bits of 0x0-0xFFFFF into two halves
	            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
	                      | (str.charCodeAt(i) & 0x3ff))
	            utf8.push(0xf0 | (charcode >>18), 
	                      0x80 | ((charcode>>12) & 0x3f), 
	                      0x80 | ((charcode>>6) & 0x3f), 
	                      0x80 | (charcode & 0x3f));
	        }
	    }
	    return utf8;
	}

	// ref: https://stackoverflow.com/questions/3195865/converting-byte-array-to-string-in-javascript
	function bin2String(array) {
		var result = "";
		for (var i = 0; i < array.length; i++) {
			result += String.fromCharCode(parseInt(array[i], 2));
		}
		return result;
	}



	const el = $('#app');
	const homeTemplate = Handlebars.compile($('#home-template').html());
	const errorTemplate = Handlebars.compile($('#error-template').html());
	const reqDeliveryTemplate = Handlebars.compile($('#reqest-delivery-template').html());
	const reqDeliveryDetailsTemplate = Handlebars.compile($('#reqest-delivery-details-template').html());
	const liveRequestsTemplate = Handlebars.compile($('#reqests-live-template').html());

	const abiDefinitionStr = '[{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"code","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"},{"name":"src","type":"int256"},{"name":"dst","type":"int256"},{"name":"mssg","type":"bytes32"}],"name":"init","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getBidCount","outputs":[{"name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assigned_to","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"source","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignee","type":"address"}],"name":"assign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bid_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"completed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"id","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destination","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"request_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"mark_complete","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"deadln","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deadline","type":"uint256"},{"indexed":false,"name":"src","type":"int256"},{"indexed":false,"name":"destination","type":"int256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"message","type":"bytes32"}],"name":"Init","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bidder","type":"address"}],"name":"Bid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"assignee","type":"address"}],"name":"AssignedTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"MarkedComplete","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"claimant","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Claimed","type":"event"}]';
	const abiDefinition = JSON.parse(abiDefinitionStr);

	const byteCode = '60806040526005805460ff19169055669536c708910000600c556618de76816d8000600d5534801561003057600080fd5b506040516020806108f8833981016040525142811161004e57600080fd5b60028054600160a060020a031916331790556007556005805460ff1916905561087c8061007c6000396000f3006080604052600436106101115763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416631998aeef811461011657806324c12bf6146101205780632775940e1461014757806328f6a48a1461015b57806329dcb0cf146101705780634ba57092146101855780634e71d92d146101b657806362ea82db146101cb57806367e828bf146101ec57806385aba275146102015780638da5cb5b146102225780639309c8a5146102375780639d9a7fe91461024c578063aa8c217c14610275578063af640d0f1461028a578063b269681d1461029f578063cd29265a146102b4578063cff29dfd146102c9578063d95d2b28146102e1578063e21f37ce146102f6575b600080fd5b61011e61030b565b005b34801561012c57600080fd5b5061013561042b565b60408051918252519081900360200190f35b61011e600435602435604435606435610431565b34801561016757600080fd5b506101356104ac565b34801561017c57600080fd5b506101356104b2565b34801561019157600080fd5b5061019a6104b8565b60408051600160a060020a039092168252519081900360200190f35b3480156101c257600080fd5b5061011e6104c7565b3480156101d757600080fd5b50610135600160a060020a036004351661061b565b3480156101f857600080fd5b5061013561062d565b34801561020d57600080fd5b5061011e600160a060020a0360043516610633565b34801561022e57600080fd5b5061019a610701565b34801561024357600080fd5b50610135610710565b34801561025857600080fd5b50610261610716565b604080519115158252519081900360200190f35b34801561028157600080fd5b5061013561071f565b34801561029657600080fd5b50610135610725565b3480156102ab57600080fd5b5061013561072b565b3480156102c057600080fd5b50610135610731565b3480156102d557600080fd5b5061019a600435610737565b3480156102ed57600080fd5b5061011e61075f565b34801561030257600080fd5b5061013561084a565b600754421061031957600080fd5b600c54600654013031101561032d57600080fd5b600254600160a060020a031633141561034557600080fd5b600954600160a060020a03161561035b57600080fd5b60055460ff161561036b57600080fd5b600d54341461037957600080fd5b336000908152600a60205260409020541561039357600080fd5b336000818152600a60209081526040808320805434019055600b805460018101825593527f0175b7a638427703f0dbe7bb9bbf987a2551717b34e79f33b5b1008d1fa01db9909201805473ffffffffffffffffffffffffffffffffffffffff191684179055815192835290517f417bd604b82c3fa277680a27ba0a50c43772789bdafa274544181c0a2b1e8ab59281900390910190a1565b60015481565b600c54840134101561044257600080fd5b600383905560048290556006849055600881905560075460408051918252602082018590528181018490526060820186905260808201839052517fa30315bc1772d27cfcd74e608024be9bd92a78f772595cbbe55891eee18a2acd9181900360a00190a150505050565b600b5490565b60075481565b600954600160a060020a031681565b60075442111561055757336000818152600a602052604080822054905181156108fc0292818181858888f19350505050158015610508573d6000803e3d6000fd5b50336000818152600a60209081526040918290205482519384529083015280517fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a9281900390910190a1610619565b60055460ff16151561056557fe5b336000908152600a6020526040902054151561057d57fe5b336000908152600a60205260409020543031101561059757fe5b336000818152600a602052604080822054905181156108fc0292818181858888f193505050501580156105ce573d6000803e3d6000fd5b50336000818152600a60209081526040918290205482519384529083015280517fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a9281900390910190a15b565b600a6020526000908152604090205481565b60035481565b600254600160a060020a0316331461064a57600080fd5b600c54600654013031101561065e57600080fd5b600754421061066c57600080fd5b60055460ff161561067c57600080fd5b600160a060020a0381166000908152600a602052604090205415156106a057600080fd5b60098054600160a060020a03831673ffffffffffffffffffffffffffffffffffffffff19909116811790915560408051918252517fced4246491e290361a75f88f24b5042ad8820786518e10e60f2b9e5a905d4bfd9181900360200190a150565b600254600160a060020a031681565b600d5481565b60055460ff1681565b60065481565b60005481565b60045481565b600c5481565b600b80548290811061074557fe5b600091825260209091200154600160a060020a0316905081565b600254600160a060020a0316331461077657600080fd5b600c54600654013031101561078a57600080fd5b60055460ff161561079a57600080fd5b600954600160a060020a031615156107b157600080fd5b6005805460ff19166001179055600654600954600160a060020a03166000908152600a60205260408082208054909301909255600d549151339280156108fc0292909190818181858888f19350505050158015610812573d6000803e3d6000fd5b5060065460408051918252517f41b93880312cc43498009f83b7f64c5c743394efc5bb301e115e9f7fff0bd7f49181900360200190a1565b600854815600a165627a7a7230582084302bc2b2f775cf47d7bc9c1a64784370787b56ed3f384b25989d69eea396a10029';

	reqDeliveryTemplate.init = () => {


	    let $dstInpBox = $('#reqdel-dst-address');
		let $srcInpBox = $('#reqdel-src-address');
	    let $messageBox = $('#reqdel-message');
	    let $currBox = $('#reqdel-currency');
		



	    var delay = 0;
		var srcTimer;
	    $srcInpBox.bind('input', function() {
	    	let v = $(this).val();
	    	if(v.length < 3) return;
	    	window.clearTimeout(srcTimer);
	    	srcTimer = window.setTimeout(async () => {
	    		let resp = await $.get(`/api/maps/autocomplete/?query=${v}`);
	    		let suggestions = resp.suggestions;
	    		let ss = suggestions.reduce((a, b) => {
	    			// shape it for materialize dropdown
	    			a[b.label] = null;
	    			return a;
	    		}, {});
	    		$('#reqdel-src-address').autocomplete({
	    			data: ss,
					onAutocomplete: function(val) {
						console.log(val);
					},
				});

	    	}, delay);
	    })

		var dstTimer;
	    $dstInpBox.bind('input', function() {
	    	let v = $(this).val();
	    	if(v.length < 3) return;
	    	window.clearTimeout(dstTimer);
	    	dstTimer = window.setTimeout(async () => {
	    		let resp = await $.get(`/api/maps/autocomplete/?query=${v}`);
	    		let suggestions = resp.suggestions;
	    		let ss = suggestions.reduce((a, b) => {
	    			a[b.label] = null;
	    			return a;
	    		}, {});
	    		$('#reqdel-dst-address').autocomplete({
	    			data: ss,
					onAutocomplete: function(val) {
						console.log(val);
					},
				});

	    	}, delay);
	    })


	    $('#reqdel-req-button').on('click', async (e) => {

	    	e.preventDefault();
	    	let srcLoc = $srcInpBox.val();
	    	let dstLoc = $dstInpBox.val();
	    	let amount = $('#reqdel-amount').val();
	    	let rideSize = $('#reqdel-ride-size').val();
	    	let currency = $currBox.val();
	    	let message = $messageBox.val();
	    	console.log(`Request from ${srcLoc} to ${dstLoc} for ${amount} ${currency}.`);

	    	let srcResp = await $.get(`/api/maps/addrToCoords?addr=${srcLoc}`);
	    	let dstResp = await $.get(`/api/maps/addrToCoords?addr=${dstLoc}`);

	    	let srcCoord = srcResp.Response.View[0].Result[0].Location.DisplayPosition;
	    	let dstCoord = dstResp.Response.View[0].Result[0].Location.DisplayPosition;

	    	let srcCoordInt = encodeCoord(srcCoord);
	    	let dstCoordInt = encodeCoord(dstCoord);

			let endDateUnixTime = '30000000000';
			let deliveryrequestContract = web3.eth.contract(abiDefinition);
			let deliveryrequest = await deliveryrequestContract.new(
				endDateUnixTime,
				{
					from: web3.eth.accounts[0], 
					data: byteCode, 
					gas: 3000000,
					gasPrice: 8000000000
				}, async (err, contract) => {
				    if(err) {
				    	console.log(`Error encountered. Request creation failed. Details below...`);
						console.log(e);
						$('#reqdel-messageback-box').text('Error. Please try again.');
						return;
					}
					if(!contract.address) {
						console.log(`Request contract create request sent: ${contract.transactionHash}`);
						console.log('Will continue after it is mined');
						return;
					}
					console.log(`Contract mined!`);
					console.log(`Address: ${contract.address}`);
					let deployedContract = await deliveryrequestContract.at(contract.address);
					let reqAmt = web3.toWei(amount, 'ether');
					let sendAmt = web3.toWei(parseFloat(amount) + 0.047, 'ether');
					deployedContract.init(reqAmt, srcCoordInt, dstCoordInt, message, {from: web3.eth.accounts[0], gas: 3000000, gasPrice: 8000000000, value: sendAmt}, async (err, startTxHash) => {
						if(err) {
					    	console.log(`Error encountered. Starting the request failed. Details below...`);
							console.log(err);
							return;
						}
						await $.post(`/delivery/request?owner_addr=${web3.eth.accounts[0]}&contract_addr=${contract.address}`);
						router.navigateTo(`/request-details/${contract.address}`);
					}
				);

			 });



	    });

	}


	reqDeliveryDetailsTemplate.init = async () => {

		let addr = '0x3ea2bfdf188bedd5f65b1d99eb504f46d387d2f9';
		console.log(`Address: ${addr}`);


		let DeliverContract = web3.eth.contract(abiDefinition);
		let contract = DeliverContract.at(addr);
		console.log(contract);


		contract.owner.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-owner-address').text(NA);
				return;
			}
			let owner = res;
			$('#reqdeldet-owner-address').text(owner);
		});


	    $('#reqdeldet-addr-address').text(addr);


		contract.assigned_to.call(async (err, res) => {
			if (err) {
				console.log(err);
				return;
			}
			let assigned_to_addr = res;
			if(parseInt(assigned_to_addr) == 0) {
				$('#reqdeldet-status').html(`<span class="green-text">live</span>`);
				$('#reqdeldet-assignedto').text(NA);
				return;
			}
			$('#reqdeldet-assignedto').text(assigned_to_addr);
		});


			
		contract.completed.call(async (err, res) => {
			if (err) {
				console.log(err);
				return;
			}
			let completed = res;
			if(parseInt(completed) == 1) {
				$('#reqdeldet-status').html(`<span class="grey-text">delivered</span>`);
				return;
			}
		});

		
			
		contract.deadline.call(async (err, res) => {
			if (err) {
				console.log(err);
				return;
			}
			let d = new Date(0);
			d.setUTCSeconds(res);
			let deadln = d;
			$('#reqdeldet-deadln').html(`${deadln.toLocaleDateString()} | ${deadln.toLocaleTimeString()}`);
		});

		
			
		contract.source.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-src-address').text(NA);
				return;
			}
			let encodedLoc = res.toString();
			let coords = decodeCoord(encodedLoc);
			let coordStr = `${coords.latitude},${coords.longitude}`;
	    	let resp = await $.get(`/api/maps/coordsToAddr?coords=${coordStr}`);
	    	let addr = resp["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
			$('#reqdeldet-src-address').text(addr);
		});

		
			
		contract.destination.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-dst-address').text(NA);
				return;
			}
			let encodedLoc = res.toString();
			let coords = decodeCoord(encodedLoc);
			let coordStr = `${coords.latitude},${coords.longitude}`;
	    	let resp = await $.get(`/api/maps/coordsToAddr?coords=${coordStr}`);
	    	let addr = resp["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
			$('#reqdeldet-dst-address').text(addr);
		});
		
		
		
		contract.amount.call(async (err, res) => {
			let curr = 'USD';
			$('#reqdeldet-currency').text(curr);
			if (err) {
				console.log(err);
				$('#reqdeldet-amount').text(NA);
				return;
			}
			let amt = res.toString();
			let usdAmt = 450 * parseFloat(web3.fromWei(amt, 'ETHER').toString());
			$('#reqdeldet-amount').text(`${usdAmt}`);
		});

		
			
		contract.message.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-message').text(NA);
				return;
			}
			let msg = res.toString();
			$('#reqdeldet-message').text(`${bin2String(msg)}`);
		});

		
			
		contract.getBidCount.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-bidders').text(NA);
				return;
			}
			let bidCnt = res.toString();
			$('#reqdeldet-bidders').text(`${bidCnt}`);
		});




	    $('#reqdeldet-ride-size').text('CAR');;
	    $('#reqdeldet-request-security').text('$20');;
	    $('#reqdeldet-bid-security').text('$4');;




	    $('#reqdeldet-bid-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Bidding for ${addr}`);
			contract.bid(
				{
					from: web3.eth.accounts[0],
					gas: '3000000',
					gasPrice: '8000000000',
					value: '7000000000000000'
				},
				async (err, res) => {
					if (err) {
						console.log(err);
					$('#reqdeldet-messageback-box').text(`<span class="red-text">Bid failed</span>`);
					setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
						return;
					}
					console.log(`Bid successful: ${res.toString()}`);
					$('#reqdeldet-messageback-box').text(`<span class="grey-text">Bid successful</span>`);
					setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
				});
	    })



	    $('#reqdeldet-assign-button').on('click', async (e) => {
	    	e.preventDefault();
	    	let assignee = $('#reqdeldet-assignto-address').val();
	    	console.log(`Assigning ${addr} to ${assignee}`);
			contract.assign(
				assignee,
				{
					from: web3.eth.accounts[0],
					gas: '3000000',
					gasPrice: '8000000000'
				},
				async (err, res) => {
					if (err) {
						console.log(err);
						$('#reqdeldet-messageback-box').text(`<span class="grey-text">Assign failed</span>`);
						setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
						return;
					}
					console.log(`Assign successful: ${res.toString()}`);
					$('#reqdeldet-messageback-box').text(`<span class="grey-text">Assign successful</span>`);
					setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
				});
	    })



	    $('#reqdeldet-mark-complete-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Marking ${addr} complete`);
			contract.mark_complete(
				{
					from: web3.eth.accounts[0],
					gas: '3000000',
					gasPrice: '8000000000'
				},
				async (err, res) => {
					if (err) {
						console.log(err);
						$('#reqdeldet-messageback-box').text(`<span class="grey-text">Mark complete failed</span>`);
						setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
						return;
					}
					console.log(`Mark complete successful: ${res.toString()}`);
					$('#reqdeldet-messageback-box').text(`<span class="grey-text">Mark complete successful</span>`);
					setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
				});
	    })



	    $('#reqdeldet-claim-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Claiming from ${addr}`);
			contract.claim(
				{
					from: web3.eth.accounts[0],
					gas: '3000000',
					gasPrice: '8000000000'
				},
				async (err, res) => {
					if (err) {
						console.log(err);
						$('#reqdeldet-messageback-box').text(`<span class="grey-text">Claim failed</span>`);
						setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
						return;
					}
					console.log(`Claim successful: ${res.toString()}`);
					$('#reqdeldet-messageback-box').text(`<span class="grey-text">Claim successful</span>`);
					setTimeout(() => { $('#reqdeldet-messageback-box').text(''); }, 12000);
				});
	    })

	}
	


	liveRequestsTemplate.init = async () => {

		$('#update-list-btn').on('click', async (e) => {
			e.preventDefault();
			let reqList = await $.get(`/api/requests-list/`);
			let html = liveRequestsTemplate();
			el.html(html);
			let $listContainer = $('#list-container');
			$listContainer.empty();
			for(let i = 0; i<reqList["delivery-requests"].length; i++) {
				let data = reqList["delivery-requests"][i];
				let addr = data["contract_address"];
				let DeliverContract = web3.eth.contract(abiDefinition);
				let contract = DeliverContract.at(addr);

				let reqDeliveryDetailsShortTemplate = Handlebars.compile($('#reqest-delivery-details-short-template').html());
				let html2 = reqDeliveryDetailsShortTemplate(data);
				$listContainer.append(html2);
				$listContainer.append(`<hr>`);

				contract.deadline.call(async (err, res) => {
					if (err) {
						console.log(err);
						$(`#reqdeldetshort-deadln-${addr}`).text(NA);
						return;
					}
					let d = new Date(0);
					d.setUTCSeconds(res);
					let deadln = d;
					$(`#reqdeldetshort-deadln-${addr}`).html(`${deadln.toLocaleDateString()}`);
				});


			    $(`#reqdeldetshort-ride-size-${addr}`).text('CAR');


				contract.source.call(async (err, res) => {
					if (err) {
						console.log(err);
						$(`#reqdeldetshort-src-address-${addr}`).text(NA);
						return;
					}
					let encodedLoc = res.toString();
					try {
						let coords = decodeCoord(encodedLoc);
						let coordStr = `${coords.latitude},${coords.longitude}`;
				    	let resp = await $.get(`/api/maps/coordsToAddr?coords=${coordStr}`);
				    	let addr = resp["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
						$(`#reqdeldetshort-src-address-${addr}`).text(addr);
					}
					catch(e) {
						console.log(encodedLoc);
						console.log(e);
						$(`#reqdeldetshort-src-address-${addr}`).text(NA);
					}
				});

				
					
				contract.destination.call(async (err, res) => {
					if (err) {
						console.log(err);
						$(`#reqdeldetshort-dst-address-${addr}`).text(NA);
						return;
					}
					let encodedLoc = res.toString();
					try {
						let coords = decodeCoord(encodedLoc);
						let coordStr = `${coords.latitude},${coords.longitude}`;
				    	let resp = await $.get(`/api/maps/coordsToAddr?coords=${coordStr}`);
				    	let addr = resp["Response"]["View"][0]["Result"][0]["Location"]["Address"]["Label"];
						$(`#reqdeldetshort-dst-address-${addr}`).text(addr);
					}
					catch(e) {
						console.log(encodedLoc);
						console.log(e);
						$(`#reqdeldetshort-dst-address-${addr}`).text(NA);
					}
				});

				
					
				contract.amount.call(async (err, res) => {
					let curr = 'USD';
					$(`#reqdeldetshort-currency-${addr}`).text(curr);
					if (err) {
						console.log(err);
						$(`#reqdeldetshort-amount-${addr}`).text(NA);
						return;
					}
					let amt = res.toString();
					let usdAmt = 450 * parseFloat(web3.fromWei(amt, 'ETHER').toString());
					$(`#reqdeldetshort-amount-${addr}`).text(`${usdAmt}`);
				});



			}

		});

	}




	// Routing
	const router = new Router({
		mode: 'history',
		page404: (path) => {
			const html = errorTemplate({
				title: 'Error 404 - Page NOT Found!',
				message: `The path '/${path}' does not exist on this site`,
			});
			el.html(html);
		},
	});

	router.add('/request/', () => {
		let html = reqDeliveryTemplate();
		el.html(html);
		reqDeliveryTemplate.init();
	});

	router.add('/request-details/', (addr) => {
		let html = reqDeliveryDetailsTemplate();
		el.html(html);
		reqDeliveryDetailsTemplate.init();
	});

	router.add('/requests-live/', (addr) => {
		let html = liveRequestsTemplate();
		el.html(html);
		liveRequestsTemplate.init();
	});

	router.add('/', () => {
		let html = homeTemplate();
		el.html(html);
	});














	var myLat = 40.730610;
	var myLong = -73.935242;


	navigator.geolocation.getCurrentPosition(
		(p) => { 
			[myLat, myLong] = [p.coords.latitude, p.coords.longitude];
		},
		(err) => {
		});






	// router.addUriListener();
	router.navigateTo(window.location.pathname);
	// router.navigateTo('/request');

});