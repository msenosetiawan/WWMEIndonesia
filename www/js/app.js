angular.module("wwme_indonesia", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","wwme_indonesia.controllers", "wwme_indonesia.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "WWME Indonesia" ;
		$rootScope.appLogo = "data/images/images/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

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


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_beranda = false ;
		$rootScope.hide_menu_categories = false ;
		$rootScope.hide_menu_posts = false ;
		$rootScope.hide_menu_event_me = false ;
		$rootScope.hide_menu_post_bookmark = false ;
		$rootScope.hide_menu_majalah_relasi = false ;
		$rootScope.hide_menu_e_relasi = false ;
		$rootScope.hide_menu_pengurus_relasi = false ;
		$rootScope.hide_menu_download_pdf = false ;
		$rootScope.hide_menu_help = false ;
		$rootScope.hide_menu_about_us = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "wwme_indonesia",
				storeName : "wwme_indonesia",
				description : "The offline datastore for WWME Indonesia app"
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

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/wwme_indonesia/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("b2b8ca5f-f377-4aee-a843-8260526bfe88").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				var confirmPopup = $ionicPopup.confirm({
					title: "Confirm Exit",
					template: "Are you sure you want to exit?"
				});
				confirmPopup.then(function (close){
					if(close){
						ionic.Platform.exitApp();
					}
				});
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
	$translateProvider.preferredLanguage("id");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("id");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("wwme_indonesia",{
		url: "/wwme_indonesia",
			abstract: true,
			templateUrl: "templates/wwme_indonesia-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("wwme_indonesia.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.bookmarks", {
		url: "/bookmarks",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.categories", {
		url: "/categories",
		cache:true,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-categories.html",
						controller: "categoriesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.dashboard", {
		url: "/dashboard",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.download_pdf", {
		url: "/download_pdf",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-download_pdf.html",
						controller: "download_pdfCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.e_relasi", {
		url: "/e_relasi",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-e_relasi.html",
						controller: "e_relasiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.erelasi", {
		url: "/erelasi",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-erelasi.html",
						controller: "erelasiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.event_me", {
		url: "/event_me",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-event_me.html",
						controller: "event_meCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.faqs", {
		url: "/faqs",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-faqs.html",
						controller: "faqsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.form_data_wwme_indonesia", {
		url: "/form_data_wwme_indonesia",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-form_data_wwme_indonesia.html",
						controller: "form_data_wwme_indonesiaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.language", {
		url: "/language",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-language.html",
						controller: "languageCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.pengurus_relasi", {
		url: "/pengurus_relasi",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-pengurus_relasi.html",
						controller: "pengurus_relasiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.post_bookmark", {
		url: "/post_bookmark",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-post_bookmark.html",
						controller: "post_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.post_singles", {
		url: "/post_singles/:id",
		cache:true,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-post_singles.html",
						controller: "post_singlesCtrl"
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

	.state("wwme_indonesia.posts", {
		url: "/posts/:categories",
		cache:true,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-posts.html",
						controller: "postsCtrl"
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

	.state("wwme_indonesia.radio", {
		url: "/radio",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-radio.html",
						controller: "radioCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.tag", {
		url: "/tag",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-tag.html",
						controller: "tagCtrl"
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

	.state("wwme_indonesia.tag_bookmark", {
		url: "/tag_bookmark",
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-tag_bookmark.html",
						controller: "tag_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.tag_singles", {
		url: "/tag_singles/:id",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-tag_singles.html",
						controller: "tag_singlesCtrl"
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

	.state("wwme_indonesia.tentang_kami", {
		url: "/tentang_kami",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-tentang_kami.html",
						controller: "tentang_kamiCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("wwme_indonesia.users", {
		url: "/users",
		cache:false,
		views: {
			"wwme_indonesia-side_menus" : {
						templateUrl:"templates/wwme_indonesia-users.html",
						controller: "usersCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/wwme_indonesia/dashboard");
});
