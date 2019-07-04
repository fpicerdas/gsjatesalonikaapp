angular.module("gsja_tesalonika_app", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","gsja_tesalonika_app.controllers", "gsja_tesalonika_app.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "GSJA Tesalonika App" ;
		$rootScope.appLogo = "data/images/icon/icon(1).png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = true ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_menu = false ;
		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_about_us = false ;
		$rootScope.hide_menu_account = false ;
		$rootScope.hide_menu_profile = false ;
		$rootScope.hide_menu_help = false ;
		$rootScope.hide_menu_radio = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "gsja_tesalonika_app",
				storeName : "gsja_tesalonika_app",
				description : "The offline datastore for GSJA Tesalonika App app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/gsja_tesalonika_app/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("95a516ed-2cc5-44dc-a307-898e4705417c").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("gsja_tesalonika_app.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?klikhost\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("gsja_tesalonika_app",{
		url: "/gsja_tesalonika_app",
			abstract: true,
			templateUrl: "templates/gsja_tesalonika_app-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("gsja_tesalonika_app.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("gsja_tesalonika_app.englishservice", {
		url: "/englishservice",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-englishservice.html",
						controller: "englishserviceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.faqs", {
		url: "/faqs",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.form_login", {
		url: "/form_login",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-form_login.html",
						controller: "form_loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.form_user", {
		url: "/form_user",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-form_user.html",
						controller: "form_userCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.gallery", {
		url: "/gallery",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-gallery.html",
						controller: "galleryCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.kka", {
		url: "/kka",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-kka.html",
						controller: "kkaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.language", {
		url: "/language",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.menu_1", {
		url: "/menu_1",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-menu_1.html",
						controller: "menu_1Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.menu_2", {
		url: "/menu_2",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-menu_2.html",
						controller: "menu_2Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.menu_one", {
		url: "/menu_one",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.menu_two", {
		url: "/menu_two",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.profile", {
		url: "/profile",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-profile.html",
						controller: "profileCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.radio", {
		url: "/radio",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-radio.html",
						controller: "radioCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.renungan", {
		url: "/renungan",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-renungan.html",
						controller: "renunganCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.renungan_singles", {
		url: "/renungan_singles/:id",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-renungan_singles.html",
						controller: "renungan_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.sunday_school", {
		url: "/sunday_school",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-sunday_school.html",
						controller: "sunday_schoolCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.video", {
		url: "/video",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-video.html",
						controller: "videoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.video_singles", {
		url: "/video_singles/:snippetresourceIdvideoId",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-video_singles.html",
						controller: "video_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.welcome", {
		url: "/welcome",
		cache:false,
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-welcome.html",
						controller: "welcomeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.young_adults", {
		url: "/young_adults",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-young_adults.html",
						controller: "young_adultsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("gsja_tesalonika_app.youth_service", {
		url: "/youth_service",
		views: {
			"gsja_tesalonika_app-side_menus" : {
						templateUrl:"templates/gsja_tesalonika_app-youth_service.html",
						controller: "youth_serviceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/gsja_tesalonika_app/dashboard");
});
