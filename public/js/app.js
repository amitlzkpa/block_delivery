$(document).ready(() => {
	
	const el = $('#app');
	const errorTemplate = Handlebars.compile($('#error-template').html());
	const reqDeliveryTemplate = Handlebars.compile($('#reqest-delivery-template').html());

	const abiDefinitionStr = '[{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"code","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assigned_to","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignee","type":"address"}],"name":"assign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"},{"name":"str","type":"int256"},{"name":"dst","type":"int256"},{"name":"mssg","type":"bytes32"}],"name":"start","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bid_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"completed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"id","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destination","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"request_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"mark_complete","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"deadln","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]';
	const abiDefinition = JSON.parse(abiDefinitionStr);

	const byteCode = '60806040526000600560006101000a81548160ff021916908315150217905550669536c708910000600c556618de76816d8000600d5534801561004157600080fd5b50604051602080610e198339810180604052810190808051906020019092919050505033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806007819055506000600560006101000a81548160ff02191690831515021790555050610d42806100d76000396000f300608060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631998aeef1461010c57806324c12bf61461011657806329dcb0cf146101415780634ba570921461016c5780634e71d92d146101c357806362ea82db146101da57806385aba2751461023157806387528f3c146102745780638da5cb5b146102b65780639309c8a51461030d5780639d9a7fe914610338578063aa8c217c14610367578063af640d0f14610392578063b269681d146103bd578063be9a6555146103e8578063cd29265a14610413578063cff29dfd1461043e578063d95d2b28146104ab578063e21f37ce146104c2575b600080fd5b6101146104f5565b005b34801561012257600080fd5b5061012b610704565b6040518082815260200191505060405180910390f35b34801561014d57600080fd5b5061015661070a565b6040518082815260200191505060405180910390f35b34801561017857600080fd5b50610181610710565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101cf57600080fd5b506101d8610736565b005b3480156101e657600080fd5b5061021b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061091a565b6040518082815260200191505060405180910390f35b34801561023d57600080fd5b50610272600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610932565b005b6102b46004803603810190808035906020019092919080359060200190929190803590602001909291908035600019169060200190929190505050610a79565b005b3480156102c257600080fd5b506102cb610ab2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561031957600080fd5b50610322610ad8565b6040518082815260200191505060405180910390f35b34801561034457600080fd5b5061034d610ade565b604051808215151515815260200191505060405180910390f35b34801561037357600080fd5b5061037c610af1565b6040518082815260200191505060405180910390f35b34801561039e57600080fd5b506103a7610af7565b6040518082815260200191505060405180910390f35b3480156103c957600080fd5b506103d2610afd565b6040518082815260200191505060405180910390f35b3480156103f457600080fd5b506103fd610b03565b6040518082815260200191505060405180910390f35b34801561041f57600080fd5b50610428610b09565b6040518082815260200191505060405180910390f35b34801561044a57600080fd5b5061046960048036038101908080359060200190929190505050610b0f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104b757600080fd5b506104c0610b4d565b005b3480156104ce57600080fd5b506104d7610d10565b60405180826000191660001916815260200191505060405180910390f35b6007544210151561050557600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff16311015151561053157600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561058e57600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156105d557600080fd5b600560009054906101000a900460ff161515156105f157600080fd5b600d543414151561060157600080fd5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151561064f57600080fd5b34600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600b3390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60015481565b60075481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6007544211156107cb573373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f193505050501580156107c5573d6000803e3d6000fd5b50610918565b600560009054906101000a900460ff1615156107e357fe5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415151561082f57fe5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020543073ffffffffffffffffffffffffffffffffffffffff16311015151561089157fe5b3373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f19350505050158015610916573d6000803e3d6000fd5b505b565b600a6020528060005260406000206000915090505481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561098e57600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff1631101515156109ba57600080fd5b600754421015156109ca57600080fd5b600560009054906101000a900460ff161515156109e657600080fd5b6000600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151515610a3557600080fd5b80600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600c5484013410151515610a8c57600080fd5b826003819055508160048190555083600681905550806008816000191690555050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d5481565b600560009054906101000a900460ff1681565b60065481565b60005481565b60045481565b60035481565b600c5481565b600b81815481101515610b1e57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ba957600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff163110151515610bd557600080fd5b600560009054906101000a900460ff16151515610bf157600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610c3957600080fd5b6001600560006101000a81548160ff021916908315150217905550600654600a6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc600d549081150290604051600060405180830381858888f19350505050158015610d0d573d6000803e3d6000fd5b50565b600854815600a165627a7a72305820036f31d398068a9edbdd6bcef3a965db91e8b80116e6b67d1df38c8ddc16df530029';

	reqDeliveryTemplate.init = () => {


	    let $dstInpBox = $('#dst-address');
		let $srcInpBox = $('#src-address');
	    let $messageBox = $('#message');
	    let $currBox = $('#currency');
		



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
	    		$('#src-address').autocomplete({
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
	    		$('#dst-address').autocomplete({
	    			data: ss,
					onAutocomplete: function(val) {
						console.log(val);
					},
				});

	    	}, delay);
	    })


	    $('#req-button').on('click', async (e) => {
	    	e.preventDefault();
	    	let srcLoc = $srcInpBox.val();
	    	let dstLoc = $dstInpBox.val();
	    	let amount = $('#amount').val();
	    	let rideSize = $('#ride-size').val();
	    	let currency = $currBox.val();
	    	let message = $messageBox.val();
	    	console.log(`Request from ${srcLoc} to ${dstLoc} for ${amount} ${currency}.`);


			var endDateUnixTime = '30000000000' ;
			var deliveryrequestContract = web3.eth.contract([{"constant":false,"inputs":[],"name":"bid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"code","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"deadline","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"assigned_to","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"claim","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"bids","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"assignee","type":"address"}],"name":"assign","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"amt","type":"uint256"},{"name":"str","type":"int256"},{"name":"dst","type":"int256"},{"name":"mssg","type":"bytes32"}],"name":"start","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bid_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"completed","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"amount","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"id","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"destination","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"start","outputs":[{"name":"","type":"int256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"request_security","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"bidders","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"mark_complete","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"message","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"deadln","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]);
			var deliveryrequest = deliveryrequestContract.new(
			   endDateUnixTime,
			   {
			     from: web3.eth.accounts[0], 
			     data: '60806040526000600560006101000a81548160ff021916908315150217905550669536c708910000600c556618de76816d8000600d5534801561004157600080fd5b50604051602080610e198339810180604052810190808051906020019092919050505033600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806007819055506000600560006101000a81548160ff02191690831515021790555050610d42806100d76000396000f300608060405260043610610107576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631998aeef1461010c57806324c12bf61461011657806329dcb0cf146101415780634ba570921461016c5780634e71d92d146101c357806362ea82db146101da57806385aba2751461023157806387528f3c146102745780638da5cb5b146102b65780639309c8a51461030d5780639d9a7fe914610338578063aa8c217c14610367578063af640d0f14610392578063b269681d146103bd578063be9a6555146103e8578063cd29265a14610413578063cff29dfd1461043e578063d95d2b28146104ab578063e21f37ce146104c2575b600080fd5b6101146104f5565b005b34801561012257600080fd5b5061012b610704565b6040518082815260200191505060405180910390f35b34801561014d57600080fd5b5061015661070a565b6040518082815260200191505060405180910390f35b34801561017857600080fd5b50610181610710565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156101cf57600080fd5b506101d8610736565b005b3480156101e657600080fd5b5061021b600480360381019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919050505061091a565b6040518082815260200191505060405180910390f35b34801561023d57600080fd5b50610272600480360381019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610932565b005b6102b46004803603810190808035906020019092919080359060200190929190803590602001909291908035600019169060200190929190505050610a79565b005b3480156102c257600080fd5b506102cb610ab2565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34801561031957600080fd5b50610322610ad8565b6040518082815260200191505060405180910390f35b34801561034457600080fd5b5061034d610ade565b604051808215151515815260200191505060405180910390f35b34801561037357600080fd5b5061037c610af1565b6040518082815260200191505060405180910390f35b34801561039e57600080fd5b506103a7610af7565b6040518082815260200191505060405180910390f35b3480156103c957600080fd5b506103d2610afd565b6040518082815260200191505060405180910390f35b3480156103f457600080fd5b506103fd610b03565b6040518082815260200191505060405180910390f35b34801561041f57600080fd5b50610428610b09565b6040518082815260200191505060405180910390f35b34801561044a57600080fd5b5061046960048036038101908080359060200190929190505050610b0f565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156104b757600080fd5b506104c0610b4d565b005b3480156104ce57600080fd5b506104d7610d10565b60405180826000191660001916815260200191505060405180910390f35b6007544210151561050557600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff16311015151561053157600080fd5b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415151561058e57600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415156105d557600080fd5b600560009054906101000a900460ff161515156105f157600080fd5b600d543414151561060157600080fd5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151561064f57600080fd5b34600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540192505081905550600b3390806001815401808255809150509060018203906000526020600020016000909192909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60015481565b60075481565b600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6007544211156107cb573373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f193505050501580156107c5573d6000803e3d6000fd5b50610918565b600560009054906101000a900460ff1615156107e357fe5b6000600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541415151561082f57fe5b600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020543073ffffffffffffffffffffffffffffffffffffffff16311015151561089157fe5b3373ffffffffffffffffffffffffffffffffffffffff166108fc600a60003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549081150290604051600060405180830381858888f19350505050158015610916573d6000803e3d6000fd5b505b565b600a6020528060005260406000206000915090505481565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561098e57600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff1631101515156109ba57600080fd5b600754421015156109ca57600080fd5b600560009054906101000a900460ff161515156109e657600080fd5b6000600a60008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414151515610a3557600080fd5b80600960006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600c5484013410151515610a8c57600080fd5b826003819055508160048190555083600681905550806008816000191690555050505050565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600d5481565b600560009054906101000a900460ff1681565b60065481565b60005481565b60045481565b60035481565b600c5481565b600b81815481101515610b1e57fe5b906000526020600020016000915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610ba957600080fd5b600c54600654013073ffffffffffffffffffffffffffffffffffffffff163110151515610bd557600080fd5b600560009054906101000a900460ff16151515610bf157600080fd5b6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151515610c3957600080fd5b6001600560006101000a81548160ff021916908315150217905550600654600a6000600960009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc600d549081150290604051600060405180830381858888f19350505050158015610d0d573d6000803e3d6000fd5b50565b600854815600a165627a7a72305820036f31d398068a9edbdd6bcef3a965db91e8b80116e6b67d1df38c8ddc16df530029', 
			     gas: 3000000,
			     gasPrice: 8000000000
			   }, async function(e, contract){
			    if(e) {
			    	console.log('ERROR');
			    	console.log(e);
			    	return;
			    }
			    console.log(contract);
		        console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
				let reqInst = deliveryrequestContract.at(contract.address);
				console.log(reqInst);
				let reqAmt = web3.toWei(amount, 'ether');
				reqInst.start(reqAmt, 100, 200, message, {from: web3.eth.accounts[0], gas: 3000000, gasPrice: 8000000000, value:reqAmt*2}, async (err, startTxHash) => {
					if(err) {
						console.log('ERROR');
						console.log(err);
						return;
					}
					console.log(`Request initated at ${startTxHash}`);
				});

				// send to server
				await $.post(`/delivery/request?addr=${contract.address}&txHash=${contract.transactionHash}`);
			 })



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

	router.add('/', () => {
		let html = reqDeliveryTemplate();
		el.html(html);
		reqDeliveryTemplate.init();
	});














	var myLat = 40.730610;
	var myLong = -73.935242;


	navigator.geolocation.getCurrentPosition(
		(p) => { 
			[myLat, myLong] = [p.coords.latitude, p.coords.longitude];
		},
		(err) => {
		});




	// let html = reqDeliveryTemplate();
	// el.html(html);
	router.navigateTo('');
	// el.html("Hi there!");


});