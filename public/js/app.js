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

	function decodeCoord(str) {
		return 0;
	}



	const el = $('#app');
	const homeTemplate = Handlebars.compile($('#home-template').html());
	const errorTemplate = Handlebars.compile($('#error-template').html());
	const reqDeliveryTemplate = Handlebars.compile($('#reqest-delivery-template').html());
	const reqDeliveryDetailsTemplate = Handlebars.compile($('#reqest-delivery-details-template').html());

	const abiDefinitionStr = '[{"constant":false,"inputs":[{"name":"assignee","type":"address"}],"name":"assign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"assignee","type":"address"}],"name":"AssignedTo","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bidder","type":"address"}],"name":"Bid","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"claimant","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"deadline","type":"uint256"},{"indexed":false,"name":"src","type":"int256"},{"indexed":false,"name":"destination","type":"int256"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"message","type":"bytes32"}],"name":"Init","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"}],"name":"MarkedComplete","type":"event"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"},{"name":"src","type":"int256"},{"name":"dst","type":"int256"},{"name":"mssg","type":"bytes32"}],"name":"init","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"mark_complete","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"deadln","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assigned_to","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bid_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"code","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"completed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destination","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"id","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"request_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"source","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"}]';
	const abiDefinition = JSON.parse(abiDefinitionStr);

	const byteCode = '60806040526000600560006101000a81548160ff021916908315150217905550669536c708910000600c556618de76816d8000600d5534801561004157600080fd5b506040516020806110e183398101806040528101908080519060200190929190505050804210151561007257600080fd5b33600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806007819055506000600560006101000a81548160ff02191690831515021790555050610ffc806100e56000396000f300608060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631998aeef1461010c57806324c12bf6146101165780632775940e1461014157806329dcb0cf146101835780634ba57092146101ae5780634e71d92d1461020557806362ea82db1461021c57806367e828bf1461027357806385aba2751461029e5780638da5cb5b146102e15780639309c8a5146103385780639d9a7fe914610363578063aa8c217c14610392578063af640d0f146103bd578063b269681d146103e8578063cd29265a14610413578063cff29dfd1461043e578063d95d2b28146104ab578063e21f37ce146104c2575b600080fd5b6101146104f5565b005b34801561012257600080fd5b5061012b610767565b6040518082815260200191505060405180910390f35b610181600480360381019080803590602001909291908035906020019092919080359060200190929190803560001916906020019092919050505061076d565b005b34801561018f57600080fd5b5061019861080d565b6040518082815260200191505060405180910390f35b3480156101ba57600080fd5b506101c3610813565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561021157600080fd5b5061021a610839565b005b34801561022857600080fd5b5061025d600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b71565b6040518082815260200191505060405180910390f35b34801561027f57600080fd5b50610288610b89565b6040518082815260200191505060405180910390f35b3480156102aa57600080fd5b506102df600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610b8f565b005b3480156102ed57600080fd5b506102f6610d39565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561034457600080fd5b5061034d610d5f565b6040518082815260200191505060405180910390f35b34801561036f57600080fd5b50610378610d65565b604051808215151515815260200191505060405180910390f35b34801561039e57600080fd5b506103a7610d78565b6040518082815260200191505060405180910390f35b3480156103c957600080fd5b506103d2610d7e565b6040518082815260200191505060405180910390f35b3480156103f457600080fd5b506103fd610d84565b6040518082815260200191505060405180910390f35b34801561041f57600080fd5b50610428610d8a565b6040518082815260200191505060405180910390f35b34801561044a57600080fd5b5061046960048036038101908080359060200190929190505050610d90565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104b757600080fd5b506104c0610dce565b005b3480156104ce57600080fd5b506104d7610fca565b60405180826000191660001916815260200191505060405180910390f35b6007544210151561050557600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff16311015151561053157600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561058e57600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156105d557600080fd5b600560009054906101000a900460ff161515156105f157600080fd5b600d543414151561060157600080fd5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151561064f57600080fd5b34600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600b3390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550507f417bd604b82c3fa277680a27ba0a50c43772789bdafa274544181c0a2b1e8ab533604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a1565b60015481565b600c548401341015151561078057600080fd5b82600381905550816004819055508360068190555080600881600019169055507fa30315bc1772d27cfcd74e608024be9bd92a78f772595cbbe55891eee18a2acd600754600354600454600654856040518086815260200185815260200184815260200183815260200182600019166000191681526020019550505050505060405180910390a150505050565b60075481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600754421115610978573373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f193505050501580156108c8573d6000803e3d6000fd5b507fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a33600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a1610b6f565b600560009054906101000a900460ff16151561099057fe5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054141515156109dc57fe5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020543073ffffffffffffffffffffffffffffffffffffffff163110151515610a3e57fe5b3373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f19350505050158015610ac3573d6000803e3d6000fd5b507fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a33600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15b565b600a6020528060005260406000206000915090505481565b60035481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610beb57600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff163110151515610c1757600080fd5b60075442101515610c2757600080fd5b600560009054906101000a900460ff16151515610c4357600080fd5b6000600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151515610c9257600080fd5b80600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055507fced4246491e290361a75f88f24b5042ad8820786518e10e60f2b9e5a905d4bfd81604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a150565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d5481565b600560009054906101000a900460ff1681565b60065481565b60005481565b60045481565b600c5481565b600b81815481101515610d9f57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610e2a57600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff163110151515610e5657600080fd5b600560009054906101000a900460ff16151515610e7257600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610eba57600080fd5b6001600560006101000a81548160ff021916908315150217905550600654600a6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc600d549081150290604051600060405180830381858888f19350505050158015610f8e573d6000803e3d6000fd5b507f41b93880312cc43498009f83b7f64c5c743394efc5bb301e115e9f7fff0bd7f46006546040518082815260200191505060405180910390a1565b600854815600a165627a7a72305820206e4ed68358bfb1967e2bb7265bc2ba6e1477cfd0245da2db58aa174b806dd60029';

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

			var endDateUnixTime = '30000000000';
			var deliveryrequestContract = web3.eth.contract(abiDefinition);
			var deliveryrequest = await deliveryrequestContract.new(
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
					let reqTxHash = await deliveryrequestContract.at(contract.address);
					let reqAmt = web3.toWei(amount, 'ether');
					let sendAmt = web3.toWei(parseFloat(amount) + 0.047, 'ether');
					reqTxHash.init(reqAmt, srcCoordInt, dstCoordInt, message, {from: web3.eth.accounts[0], gas: 3000000, gasPrice: 8000000000, value: sendAmt}, async (err, startTxHash) => {
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

		let addr = '0xae24b6cbe0ed7dafed99721f184b2c416316a99c';
		console.log(`Address: ${addr}`);


		let DeliverContract = web3.eth.contract(abiDefinition);
		var contract = DeliverContract.at(addr);
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
			if(parseInt(deadln) == 1) {
				return;
			}
		});

		
			
		contract.source.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-src-address').text(NA);
				return;
			}
			let encodedLoc = res.toString();
			let g = decodeCoord(encodedLoc);
			console.log(g);
			$('#reqdeldet-src-address').text(`London`);
		});

		
			
		contract.destination.call(async (err, res) => {
			if (err) {
				console.log(err);
				$('#reqdeldet-dst-address').text(NA);
				return;
			}
			let encodedLoc = res.toString();
			let g = decodeCoord(encodedLoc);
			console.log(g);
			$('#reqdeldet-dst-address').text(`New York`);
		});




		let $amountBox = $('#reqdeldet-amount');
	    let $currBox = $('#reqdeldet-currency');
	    let $rideSizeBox = $('#reqdeldet-ride-size');
	    let $messageBox = $('#reqdeldet-message');
	    let $biddersBox = $('#reqdeldet-bidders');
	    let $requestSecurityBox = $('#reqdeldet-request-security');
	    let $bidSecurityBox = $('#reqdeldet-bid-security');



	    $amountBox.text('30');
	    $currBox.text('GWEI');
	    $rideSizeBox.text('CAR');
	    $messageBox.text('9892000000');
	    $biddersBox.text('7');
	    $requestSecurityBox.text('20');
	    $bidSecurityBox.text('30');



	    $('#reqdeldet-bid-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Bidding for ${addr}`);
	    })

	    $('#reqdeldet-assign-button').on('click', async (e) => {
	    	e.preventDefault();
	    	let assignee = $('#reqdeldet-assignto-address').val();
	    	console.log(`Assigning ${addr} to ${assignee}`);
	    })

	    $('#reqdeldet-mark-complete-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Marking ${addr} complete`);
	    })

	    $('#reqdeldet-claim-button').on('click', async (e) => {
	    	e.preventDefault();
	    	console.log(`Claiming from ${addr}`);
	    })


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

	router.add('/request', () => {
		let html = reqDeliveryTemplate();
		el.html(html);
		reqDeliveryTemplate.init();
	});

	router.add('/request-details/{addr}', (addr) => {
		el.html('Coming soon');
		// console.log(addr);
		// el.html("Details for");
		// let html = reqDeliveryDetailsTemplate();
		// el.html(html);
	});

	router.add('/', () => {
		// let html = homeTemplate();
		// el.html(html);
		let html = reqDeliveryDetailsTemplate();
		el.html(html);
		reqDeliveryDetailsTemplate.init();
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