"use strict";
define([
		"helpers"
	], 
	function (helpers) {
		return {
			/*
			 * @desc set the options for the notification
			*/
			optionsExercise: function(){
				return {
					type: "basic",
					title: "Exercise!",
					message: "Exercise! Time to get up and move a bit.",
					iconUrl: "../../images/icon128.PNG",
					buttons: [
					  {
						  title : "Will do. I want to stay healthy.",
						  iconUrl: "../../images/yes.png"
					  },
					  {
						  title : "No! I don't care about my back.",
						  iconUrl: "../../images/no.png"
					  }
					]
				}
			},
			/*
			 * @desc set the options for the notification
			*/
			optionsSleep: function(){
				return {
					type: "basic",
					title: "Go to bed!",
					message: "Time to prepare for bed. Close your things now!!!",
					iconUrl: "../../images/icon128.PNG",
					buttons: [
					  {
						  title : "Will do. I want to stay healthy.",
						  iconUrl: "../../images/yes.png"
					  },
					  {
						  title : "No! I don't care about my head.",
						  iconUrl: "../../images/no.png"
					  }
					]
				}
			},
			/*
			 * @desc creates and schedules 2 exercise notifications, 1 at lunch, 1 in the afternoon, and one sleep notification that will remind me to exercise more at a particular time of the day and to got to sleep.
			*/
			scheduleNotifications: function(){
				var _this = this;
				/*
				 * @desc ads event to the buttons in the notification
				 * @param function
				*/
				chrome.notifications.onButtonClicked.addListener(this.replyBtnClick);
				
				var now = new Date();
				var millisTill1030 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 30, 0, 0) - now;
				var millisTill1515 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 15, 15, 0, 0) - now;
				var millisTill2340 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 40, 0, 0) - now;
				if (millisTill1030 < 0) {
				     millisTill1030 += 86400000; // it's after 10:30am, try 10:30am tomorrow.
				}
				if (millisTill1515 < 0) {
				     millisTill1515 += 86400000; // it's after 15:15am, try 15:15am tomorrow.
				}
				if (millisTill2340 < 0) {
				     millisTill2340 += 86400000; // it's after 15:15am, try 15:15am tomorrow.
				}
				setTimeout(
					function(){
						console.log(_this.optionsExercise)
						// @params string,object,function
						chrome.notifications.create('lunch', _this.optionsExercise(), _this.notificationCallback())
					}, 
					millisTill1030
				);
				setTimeout(
					function(){
						// @params string,object,function
						chrome.notifications.create('afternoon', _this.optionsExercise(), _this.notificationCallback())
					}, 
					millisTill1515
				);
				setTimeout(
					function(){
						// @params string,object,function
						chrome.notifications.create('sleep', _this.optionsSleep(), _this.notificationCallback())
					}, 
					millisTill2340
				);
			},		
			notificationCallback: function(){
				// not needed for now	
			},
			/*
			 * @desc function called on button clicked, handles which button is clicked and then clears it
			 * @param string,int
			*/
			replyBtnClick: function(notificationId, btnIdx){
				if(btnIdx == 0){
					this.manageNotificationPersistence(notificationId,1)			
				} else {
					this.manageNotificationPersistence(notificationId,0)			
				}
				this.clearNotification(notificationId)
			},
			/*
			 * @desc clears the notifications
			 * @param string
			*/
			clearNotification: function(notificationId){
				chrome.notifications.clear(notificationId)
			},
			/*
			 * @desc saves the activity in notification_info object
			 * @param string, int
			*/
			manageNotificationPersistence: function(type,action){
				var today = helpers.getToday();
				if(!window.notification_info[today]){
					window.notification_info[today] = {}
				}
				window.notification_info[today][type] = action;
				/*
				 * @desc saves the object notification_info, organized in this format
				 * 15/2/2016: Object
				 * 	 lunch: 1
				 *	 afternoon: 0
				 * @return void 
				*/
				helpers.saveChromeLocalStorage('notification_info',window.notification_info);
			}
		}
	}
);