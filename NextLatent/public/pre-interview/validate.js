// var firebaseConfig = {
//     apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
//     authDomain: "remo-e30b0.firebaseapp.com",
//     databaseURL: "https://remo-e30b0.firebaseio.com",
//     projectId: "remo-e30b0",
//     storageBucket: "remo-e30b0.appspot.com",
//     messagingSenderId: "318553256084",
//     appId: "1:318553256084:web:955bfc1a10af2b009d4481",
// };

// firebase.initializeApp(firebaseConfig);

// Firebase Configuration
var firebaseConfig = {
    apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
    authDomain: "nextlatent.firebaseapp.com",
    databaseURL: "https://nextlatent-default-rtdb.firebaseio.com",
    projectId: "nextlatent",
    storageBucket: "nextlatent.appspot.com",
    messagingSenderId: "318553256084",
    appId: "1:318553256084:web:955bfc1a10af2b009d4481"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let database = firebase.database();
let fire = database.ref().child("Interview_details");
var val;

function validate() {
    val = document.getElementById("room_key").value;
    if (!val) {
        alert("Please enter a room key");
        return;
    }

    valname = document.getElementById("room_name").value;
    if (!valname) {
        alert("Please enter your name");
        return;
    }

    window.localStorage.setItem('name', valname);
    
    // Check if user is interviewer or interviewee
    let role = '';
    if (val.endsWith('R')) {
        window.localStorage.setItem('interviewer', '1');
        role = 'interviewer';
    } else if (val.endsWith('E')) {
        window.localStorage.setItem('interviewer', '0');
        role = 'interviewee';
    } else {
        alert("Invalid room key format. Key should end with 'R' for interviewer or 'E' for interviewee.");
        return;
    }
    
    // Remove the role identifier from key
    let roomKey = val.slice(0, -1);
    console.log("Checking room key:", roomKey);
    
    // Store the original key for debugging
    window.localStorage.setItem('originalKey', val);
    window.localStorage.setItem('roomKey', roomKey);
    window.localStorage.setItem('role', role);
    
    // Don't reset the form until we know the redirect will happen
    // document.getElementById("form").reset();

    // Validate room key
    fire.once("value")
        .then(function(snapshot) {
            let data = snapshot.val();
            console.log("Firebase data:", data);
            
            if (!data) {
                alert("No active rooms found. Please check your room key.");
                return;
            }
            
            let keys = Object.keys(data);
            console.log("Available keys:", keys);
            
            var present = keys.includes(roomKey);
            if (present) {
                console.log("Room found, redirecting to room.html with key:", roomKey);
                
                // Set a success flag in localStorage
                window.localStorage.setItem('roomFound', 'true');
                
                // Create direct link to room
                let roomUrl = "../Room/room.html?key=" + roomKey;
                
                // Show loading indicator
                document.querySelector('button[onclick="validate()"]').innerHTML = 'Joining...';
                
                // Now it's safe to reset the form
                document.getElementById("form").reset();
                
                console.log("Redirecting to:", roomUrl);
                
                // Use a slight delay to ensure localStorage is set before navigation
                setTimeout(function() {
                    window.location.href = roomUrl;
                }, 500);
            } else {
                console.error("Room key not found:", roomKey);
                alert("Invalid room key. Please check and try again.");
            }
        })
        .catch(function(error) {
            console.error("Error checking room:", error);
            alert("Error checking room key: " + error.message);
        });
}
