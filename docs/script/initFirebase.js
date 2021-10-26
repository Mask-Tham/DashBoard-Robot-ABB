// document.addEventListener('DOMContentLoaded', function () {
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
    // // The Firebase SDK is initialized and available here!
    //
    // firebase.auth().onAuthStateChanged(user => { });
    // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
    // firebase.messaging().requestPermission().then(() => { });
    // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
    //
    // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

    var firebaseConfig = {
        apiKey: "AIzaSyCgo0482ztq4TrYyx4qmob4MxJ2O4r7hMU",
        authDomain: "use-floline.firebaseapp.com",
        databaseURL: "https://use-floline-default-rtdb.firebaseio.com",
        projectId: "use-floline",
        storageBucket: "use-floline.appspot.com",
        messagingSenderId: "1070273474599",
        appId: "1:1070273474599:web:9e11f121235641bd5cde02"
      };
      // Initialize Firebase
      firebase.initializeApp(firebaseConfig);
    //firebase.analytics();
    



    try {
        let app = firebase.app();
        let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
        
        //var database = firebase.database();
        //firebase.database.enableLogging(true, true);
    } catch (e) {
        console.error(e);
        
    }
// });



