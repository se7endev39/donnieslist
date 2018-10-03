import axios from 'axios';
import { browserHistory } from 'react-router';
import cookie from 'react-cookie';

import io from 'socket.io-client';

import { AUTH_USER, AUTH_ERROR, UNAUTH_USER, FORGOT_PASSWORD_REQUEST, RESET_PASSWORD_REQUEST, PROTECTED_TEST } from './types';

import { API_URL, CLIENT_ROOT_URL, SOCKET_CONNECTION, errorHandler } from './index';

// sockets for admin
export const socket = SOCKET_CONNECTION;
socket.on('disconnect', function () {
  socket.emit('disconnect');
});



function handleResponse(response){

	if(response.ok){
		console.log("OK RESPONSE IN Teacher ACTION")
		return response.json();
	}
	else{
		console.log("RESPONSE NOT OK in TEACHER ACTIOn")
		// console.log(response)
		let error = new Error(response.statusText);
		error.response = response;
		throw error
	}

}
// getting users list for admin
export function getUsersList(){
	return dispatch =>{
		return fetch(`${API_URL}/getUsersList` ,{
			method: 'get',
			headers:{
				"Content-Type": "application/json",
// 				 "headers": { Authorization: cookie.load('token') },
			}
		}).then(function(res){
			var x = res.json()
			return x

		}).then(function(res){/*console.log(res);*/ return res})
	}
}
// to ban a user
export function BanMe(data){
	return dispatch =>{
		return fetch(`${API_URL}/BanHim`, {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
    body: 'id='+data
}).then(function(res){
			var x = res.json()
			return x
		}).then(function(res){/*console.log(res);*/ return res})
	}

}

export function deleteMe(data){
	return dispatch =>{
		return fetch(`${API_URL}/deleteHim`, {
    method: 'POST',
    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
    body: 'id='+data
}).then(function(res){
			var x = res.json()
			return x
		}).then(function(res){/*console.log(res);*/ return res})
	}

}
// to unban any banned user
export function UnBanMe(data){
	console.log("HIIIII" +data)
	return dispatch =>{
		return fetch(`${API_URL}/UnBanHim`, {//
	    method: 'POST',
	    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
	    body: 'id='+data
		}).then(function(res){
				var x = res.json()
				return x
			}).then(function(res){console.log(res); return res})
	}

}
// to get the experts information
export function getTheUserInformation(data){
	return dispatch =>{
		return fetch(`${API_URL}/getuserInfo/`+data.id, {
	    method: 'POST',
	    headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
	    body: 'id='+data.id
		}).then(function(res){
				var x = res.json()
				return x
			}).then(function(res){console.log(res); return res})
	}
}
// for admin to update the experts
export function AdminUpdateExpert(data){
	return dispatch =>{
		return fetch(`${API_URL}/UpdateUserInfo`, {
	    method: 'POST',
	    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
	    // body: 'id='+data.id
	    body:JSON.stringify(data)
		}).then(function(res){
				var x = res.json()
				return x
			}).then(function(res){console.log(res); return res})
	}
}
// GetActiveSessions
export function GetActiveSessions(data){
	return dispatch =>{
		return fetch(`${API_URL}/GetActiveSessions`, {
	    method: 'POST',
	    headers: {'Content-Type':'application/json'}, // this line is important, if this content-type is not set it wont work
		}).then(function(res){
				var x = res.json()
				return x

			}).then(function(res){/*console.log("@@@");console.log(res); */return res})
	}
}
