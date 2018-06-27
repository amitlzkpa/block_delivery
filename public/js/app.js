window.addEventListener('load', () => {
	const el = $('#app');
	const errorTemplate = Handlebars.compile($('#error-template').html());


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


	var platform = new H.service.Platform({
	  'app_id': 'JV3aky6KwOlRaB9UDq49',
	  'app_code': 'V0lXUTYhyEqnV5A_t6fCxg'
	});

	var map;
	var myLat = 40.730610;
	var myLong = -73.935242;
	var zoomLvl = 6;

	var defaultLayers = platform.createDefaultLayers();
	var $mapContainer = $('#mapContainer');

	function loadMap() {
		$mapContainer.empty();
		// Instantiate (and display) a map object:
		map = new H.Map(
			$mapContainer[0],
			defaultLayers.normal.map,
			{
				zoom: zoomLvl,
				center: { lat: myLat, lng: myLong }
			});
		$('#latitude').val(myLat);
		$('#longitude').val(myLong);
	}

	navigator.geolocation.getCurrentPosition(
		(p) => { 
			[myLat, myLong] = [p.coords.latitude, p.coords.longitude];
			loadMap();
		},
		(err) => {
			loadMap();
		});

	$('#mapButton').on('click', (event) => {
		// Block browser page load
		event.preventDefault();
		myLat = $('#latitude').val();
		myLong = $('#longitude').val();

		loadMap();
	});




	// router.navigateTo('');
	// el.html("Hi there!");
});