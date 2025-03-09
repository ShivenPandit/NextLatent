// var firebaseConfig = {
//         apiKey: "AIzaSyDkaU5im4Hj7QsqQDFVkM3_kKyF1YGQI4Q",
//         authDomain: "remo-e30b0.firebaseapp.com",
//         databaseURL: "https://remo-e30b0.firebaseio.com",
//         projectId: "remo-e30b0",
//         storageBucket: "remo-e30b0.appspot.com",
//         messagingSenderId: "318553256084",
//         appId: "1:318553256084:web:955bfc1a10af2b009d4481"
// };

// firebase.initializeApp(firebaseConfig);

var firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "nextlatent.firebaseapp.com",
    databaseURL: "https://nextlatent.firebaseio.com",
    projectId: "nextlatent",
    storageBucket: "nextlatent.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var database = firebase.database();
var firebaseOrdersCollection = database.ref().child('Interview_details');

const KEY_SIZE = 15;

var rand = random(KEY_SIZE);

// Email Configuration
const EMAIL_CONFIG = {
    host: "smtp.gmail.com",
    username: process.env.EMAIL_USERNAME,
    password: process.env.EMAIL_PASSWORD,
    from: "interviews@nextlatent.com"
};

// EmailJS Configuration
const EMAIL_SERVICE_ID = "service_n3m64lm";
const EMAIL_TEMPLATE_IDS = {
    INTERVIEW_CONFIRMATION: "template_5keiu43",
    CONTACT_FORM: "template_2dblpbb"
};

document.getElementById("schedule-form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("schedule-submit-btn").innerHTML = `sending...`;
    sendmail();
});

function sendmail() {
    rand = random(KEY_SIZE);
    submitdetails();
}

function random(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return (result);
}

function submitdetails() {
    var details = {
        Interviewer_name: $('#P1name').val(),
        Interviewee_name: $('#P2name').val(),
        Interviewee_email: $("#P2email").val(),
        Interviewer_email: $("#P1email").val(),
        Date_: $("#date-time").val(),
        Key: rand,
    };

    firebaseOrdersCollection.child(rand).set(details);

    // Send to interviewer
    sendInterviewEmail($("#P1email").val(), $("#P1name").val(), $("#P2name").val(), rand + "R", "interviewer");
    // Send to interviewee
    sendInterviewEmail($("#P2email").val(), $("#P2name").val(), $("#P1name").val(), rand + "E", "interviewee");
}

function sendInterviewEmail(toEmail, toName, otherPartyName, roomKey, role) {
    const templateParams = {
        name: toName,
        email: toEmail,
        date: $("#date-time").val().split("T")[0],
        time: $("#date-time").val().split("T")[1],
        key: roomKey,
        other_name: otherPartyName,
        user_type: role
    };

    try {
        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_IDS.INTERVIEW_CONFIRMATION, templateParams)
            .then(
                function(response) {
                    console.log("Email sent successfully to " + role, response);
                    if (role === "interviewee") {
                        showSuccessMessage();
                    }
                },
                function(error) {
                    console.error("Failed to send email to " + role, error);
                    alert(`Failed to send email to ${role}. Error: ${error.text}`);
                }
            );
    } catch (error) {
        console.error("Error sending email:", error);
        alert(`Error sending email: ${error.message}`);
    }
}

function showSuccessMessage() {
    document.getElementById("schedule-submit-btn").innerHTML = `
        <audio autoplay>
            <source src="./assets/insight.mp3#t=00:00:01" type="audio/ogg">
        </audio>
        SENT
        <svg class="tick-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
        </svg>`;
    setTimeout(function() { 
        document.getElementById("schedule-submit-btn").innerHTML = `SEND`;
        document.getElementById("schedule-form").reset(); 
    }, 3000);
}

//---- contact us -------

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("contact-submit-btn").innerHTML = `sending...`;

    const contactParams = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    try {
        emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_IDS.CONTACT_FORM, contactParams)
            .then(
                function(response) {
                    console.log("Contact form sent successfully", response);
                    document.getElementById("contact-submit-btn").innerHTML = `
                        <audio autoplay>
                            <source src="./assets/insight.mp3#t=00:00:01" type="audio/ogg">
                        </audio>
                        SENT
                        <svg class="tick-svg" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24">
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                        </svg>`;
                    setTimeout(function() { 
                        document.getElementById("contact-submit-btn").innerHTML = `SEND`;
                        document.getElementById("contact-form").reset(); 
                    }, 3000);
                },
                function(error) {
                    console.error("Failed to send contact form", error);
                    alert(`Failed to send message. Error: ${error.text}`);
                }
            );
    } catch (error) {
        console.error("Error sending contact form:", error);
        alert(`Error sending contact form: ${error.message}`);
    }
});