function onPushNotificationReceived(e) {
    alert(JSON.stringify(e));
    alert("Basic Test");
};







function alertDismissed() {
        // do something
    }
    //Works but hard coded values. Not from backend.
    /*
    var onAndroidPushReceived = function (args) {
        navigator.notification.alert(
            'You are the winner!', // message
            alertDismissed, // callback
            'Game Over', // title
            'Done' // buttonName
        );
    };
    */

/* Formatted Works
var onPushNotificationReceived = function (args) {
    var str = JSON.stringify(args);
    var obj = $.parseJSON(str);

    navigator.notification.alert(
        obj.payload.message, // message
        alertDismissed, // callback
        obj.payload.title, // title
        'Done' // buttonName
    );
};

*/



(function () {
    // store a reference to the application object that will be created
    // later on so that we can use it if need be
    var app = {
        data: {},
        onDeviceReady: function () {
            //app.receivedEvent('deviceready');
            navigator.splashscreen.hide();

            //**********************************************************
            var everlive = new Everlive({
                apiKey: 'fVu2MUaaCYHk9fL7',
                scheme: 'http' // switch this to 'https' if you'd like to use TLS/SSL encryption and if it is included in your subscription tier
            });


            //Test
            var groceryDataSource = new kendo.data.DataSource({
                type: "everlive",
                transport: {
                    typeName: "Test"
                }
            });
            //Test End            

            var devicePushSettings = {
                iOS: {
                    badge: 'true',
                    sound: 'true',
                    alert: 'true'
                },
                android: {
                    projectNumber: '488561349376'
                },
                wp8: {
                    channelName: 'EverlivePushChannel'
                },
                notificationCallbackIOS: onPushNotificationReceived,
                notificationCallbackAndroid: onPushNotificationReceived,
                notificationCallbackWP8: onPushNotificationReceived
            };

            everlive.push.register(devicePushSettings, function () {
                //Basic alert to notify that app is ready to accept push notifications.
                alert("Successful registration in Backend Services. You are ready to receive push notifications.");
            }, function (err) {
                alert("Error: " + err.message);
            });
            //**********************************************************
        },
    };

    var bootstrap = function () {
        $(function () {
            app.mobileApp = new kendo.mobile.Application(document.body, {

                // comment out the following line to get a UI which matches the look
                // and feel of the operating system
                skin: 'flat',
                // the application needs to know which view to load first
                //initial: 'home/view.html',
                initial: 'home/view.html',
                statusBarStyle: 'black-translucent'
            });
        });
    };
// Test Login
// Test Login End    
    
    //Test Add
    window.addView = kendo.observable({
        add: function () {
            if (!this.grocery) {
                navigator.notification.alert("Please provide a grocery.");
                return;
            }

            groceryDataSource.add({
                Name: this.grocery
            });
            groceryDataSource.one("sync", this.close);
            groceryDataSource.sync();
        },
        close: function () {
            $("#add").data("kendoMobileModalView").close();
            this.grocery = "";
        }
    });
    //Test End    

    if (window.cordova) {
        // this function is called by Cordova when the application is loaded by the device
        document.addEventListener('deviceready', function () {

            // hide the splash screen as soon as the app is ready. otherwise
            // Cordova will wait 5 very long seconds to do it for you.
            if (navigator && navigator.splashscreen) {
                navigator.splashscreen.hide();
            }

            app.onDeviceReady(); // this method will be called after the deviceready event is received
            bootstrap();
        }, false);
    } else {
        bootstrap();
    }

    window.app = app;

    app.isOnline = function () {
        if (!navigator || !navigator.connection) {
            return true;
        } else {
            return navigator.connection.type !== 'none';
        }
    };
}());