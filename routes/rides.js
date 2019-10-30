var express = require('express')
var app = express()
const axios = require('axios')

app.get('/', function(req, res, next) {
	axios.get('http://127.0.0.1:8010/rides')
	.then((resp) => {
		res.render('ride/list', { title: 'Rides List', data: resp.data})
	})
	.catch((error) => {
		res.render('ride/list', { title: 'Rides List',  data: '' })
	})
})

app.get('/add', function(req, res, next){	
	res.render('ride/add', {
		title: 'Add New Rides',
		startLatitude: '-6.261493',
		startLongitude: '106.810600',
		endLatitude: '-6.226780',
		endLongitude: '106.787070',
		riderName: 'Test Rides',
		driverName: 'Adrian Hastro',
		driverVehicle: 'emp'		
	})
});

app.post('/add', function(req, res, next){	
	req.assert('startLatitude', 'startLatitude is required').notEmpty()
	req.assert('startLongitude', 'startLongitude is required').notEmpty()
	req.assert('endLatitude', 'endLatitude is required').notEmpty()
	req.assert('endLongitude', 'endLongitude is required').notEmpty()
	req.assert('riderName', 'riderName is required').notEmpty()
	req.assert('driverName', 'driverName is required').notEmpty()
	req.assert('driverVehicle', 'driverVehicle is required').notEmpty()
	var errors = req.validationErrors()
    if( !errors ) {
		axios.post('http://127.0.0.1:8010/rides', {
			start_lat: req.sanitize('startLatitude').escape().trim(),
			start_long: req.sanitize('startLongitude').escape().trim(),
			end_lat: req.sanitize('endLatitude').escape().trim(),
			end_long: req.sanitize('endLongitude').escape().trim(),
			rider_name: req.sanitize('riderName').escape().trim(),
			driver_name: req.sanitize('driverName').escape().trim(),
			driver_vehicle: req.sanitize('driverVehicle').escape().trim()
		})
		.then((resp) => {
			if(resp.data.error_code){
				req.flash('error', resp.data.message)
			}else{
				req.flash('success', 'Data added successfully!')
			}
			res.render('ride/add', {
				title: 'Add New Rides',
				startLatitude: req.body.startLatitude,
				startLongitude: req.body.startLongitude,
				endLatitude: req.body.endLatitude,
				endLongitude: req.body.endLongitude,
				riderName: req.body.riderName,
				driverName: req.body.driverName,
				driverVehicle: req.body.driverVehicle		
			})
		})
		.catch((error) => {
			req.flash('error', error)
		})
	}else{   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
        res.render('ride/add', { 
			title: 'Add New Rides',
			startLatitude: req.body.startLatitude,
			startLongitude: req.body.startLongitude,
			endLatitude: req.body.endLatitude,
			endLongitude: req.body.endLongitude,
			riderName: req.body.riderName,
			driverName: req.body.driverName,
			driverVehicle: req.body.driverVehicle
        })
    }
})

app.get('/edit/(:id)', function(req, res, next){
	axios.get('http://127.0.0.1:8010/rides/'+req.params.id)
	.then((resp) => {
		if(resp.data.error_code){
			req.flash('error', resp.data.message)
			res.redirect('/rides')
		}else{
			res.render('ride/edit', {
				title: 'Edit Rides', 
				rideID: resp.data[0].rideID,
				startLatitude: resp.data[0].startLat,
				startLongitude: resp.data[0].startLong,
				endLatitude: resp.data[0].endLat,
				endLongitude: resp.data[0].endLong,
				riderName: resp.data[0].riderName,
				driverName: resp.data[0].driverName,
				driverVehicle: resp.data[0].driverVehicle	
			})
		}
	})
	.catch((error) => {
		req.flash('error', 'Rides not found with id = ' + req.params.id)
		res.redirect('/rides')
	})
})

app.put('/edit/(:id)', function(req, res, next) {
	req.assert('startLatitude', 'startLatitude is required').notEmpty()
	req.assert('startLongitude', 'startLongitude is required').notEmpty()
	req.assert('endLatitude', 'endLatitude is required').notEmpty()
	req.assert('endLongitude', 'endLongitude is required').notEmpty()
	req.assert('riderName', 'riderName is required').notEmpty()
	req.assert('driverName', 'driverName is required').notEmpty()
	req.assert('driverVehicle', 'driverVehicle is required').notEmpty()
	var errors = req.validationErrors()
    if( !errors ) {
		axios.put('http://127.0.0.1:8010/rides/'+req.params.id, {
			start_lat: req.sanitize('startLatitude').escape().trim(),
			start_long: req.sanitize('startLongitude').escape().trim(),
			end_lat: req.sanitize('endLatitude').escape().trim(),
			end_long: req.sanitize('endLongitude').escape().trim(),
			rider_name: req.sanitize('riderName').escape().trim(),
			driver_name: req.sanitize('driverName').escape().trim(),
			driver_vehicle: req.sanitize('driverVehicle').escape().trim()
		})
		.then((resp) => {
			if(resp.data.error_code){
				req.flash('error', resp.data.message)
			}else{
				req.flash('success', 'Data edited successfully!')
			}
			res.render('ride/edit', {
				title: 'Edit Rides',
				rideID: req.params.id,
				startLatitude: req.body.startLatitude,
				startLongitude: req.body.startLongitude,
				endLatitude: req.body.endLatitude,
				endLongitude: req.body.endLongitude,
				riderName: req.body.riderName,
				driverName: req.body.driverName,
				driverVehicle: req.body.driverVehicle		
			})
		})
		.catch((error) => {
			req.flash('error', error)
		})
	}else{   
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
        res.render('ride/edit', { 
			title: 'Edit Rides',
			rideID: req.params.id,
			startLatitude: req.body.startLatitude,
			startLongitude: req.body.startLongitude,
			endLatitude: req.body.endLatitude,
			endLongitude: req.body.endLongitude,
			riderName: req.body.riderName,
			driverName: req.body.driverName,
			driverVehicle: req.body.driverVehicle
        })
    }
})

app.delete('/delete/(:id)', function(req, res, next) {
	axios.delete('http://127.0.0.1:8010/rides/'+req.params.id)
	.then((resp) => {
		if(resp.data.error_code){
			req.flash('error', resp.data.message)
		}else{
			req.flash('success', 'Data deleted successfully!')
		}
	})
	.catch((error) => {
		req.flash('error', error)
	})
	res.redirect('/rides')
})

module.exports = app