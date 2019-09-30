function sendMessage(t) {  
    Bots.sendMessage(t);
}

function order() {
    Bots.sendMessage('Sales Order'); 
}
function exportToCSV(csvText,filename){
	console.log(csvText);
	$.ajax({
		type: "POST",
		url: "convert-csv",
		data: {"csvtext": csvText,
				"filename": "ts.csv"},
		success: function(result){
			console.log("Success CSV");
			openUrl();
			console.log("opened");
		}
	});
}
function openUrl(url){
	window.open("http://localhost:8080/cache/ts.csv");
}
function offers() {
    Bots.sendMessage('Instance URL'); 
}

function reportIssue() {
    //alert('reporting an issue');
    Bots.sendMessage('Procurement Process Document'); 
}

function enableComments(comments) {
    comments.style.display='inline';   
}

// Slider Images
function imgurl(n)
{
if(n==1)
window.open("https://www.infosys.com");
else if(n==2)
window.open("https://fnimphiu.github.io/OracleTechExchange/#Tutorials");
else if(n==3)
window.open("hhttps://fnimphiu.github.io/OracleTechExchange/#AdvancedTraining2018");
else if(n==4)
window.open("https://fnimphiu.github.io/OracleTechExchange/tutorials/agentIntegration_032019_1/index.html");
else if(n==5)
window.open("https://docs.oracle.com/en/cloud/paas/digital-assistant/use-chatbot/overview-digital-assistants-and-skills.html#GUID-386AB33B-C131-4A0A-9138-6732AE841BD8");
}


var slideIndex = 1;

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {

    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    var i;
    var slides = messengerDocument.getElementsByClassName("mySlides");
    
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
    }
    
    slides[slideIndex - 1].style.display = 'block';
    
}

function Close()
{

    
    Bots.destroy();
    clearChat();
    var appId = window.localStorage.getItem("appId");

    initBots(appId)
        .then(function() {
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function(err) {
            console.log(err);
        });
}

function Close()
{
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display="grid";
    messengerDocument.getElementById("conversation").style.opacity="0.2";
    messengerDocument.getElementById("selfin").style.opacity="0.2";
    messengerDocument.getElementById("textintro").style.opacity="0.2";
    messengerDocument.getElementById("cslider").style.opacity="0.2";
    messengerDocument.getElementById("footer").style.opacity="0.2";
    messengerDocument.getElementById("headerEl").style.opacity="0.2";
    messengerDocument.getElementById("conversation").style.pointerEvents ="none";
    messengerDocument.getElementById("selfin").style.pointerEvents ="none";
    messengerDocument.getElementById("textintro").style.pointerEvents ="none";
    messengerDocument.getElementById("cslider").style.pointerEvents ="none";
    messengerDocument.getElementById("footer").style.pointerEvents ="none";
    messengerDocument.getElementById("headerEl").style.pointerEvents ="none";
}
function CloseYes()
{
 Bots.destroy();
    clearChat();
    var appId = window.localStorage.getItem("appId");

    initBots(appId)
        .then(function() {
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function(err) {
            console.log(err);
        });
}
function CloseNo()
{
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
    messengerDocument.getElementById("prompt").style.display="none";
    messengerDocument.getElementById("conversation").style.opacity="1";
    messengerDocument.getElementById("selfin").style.opacity="1";
    messengerDocument.getElementById("textintro").style.opacity="1";
    messengerDocument.getElementById("cslider").style.opacity="1";
    messengerDocument.getElementById("footer").style.opacity="1";
    messengerDocument.getElementById("headerEl").style.opacity="1";
    messengerDocument.getElementById("conversation").style.pointerEvents ="all";
    messengerDocument.getElementById("selfin").style.pointerEvents ="all";
    messengerDocument.getElementById("textintro").style.pointerEvents ="all";
    messengerDocument.getElementById("cslider").style.pointerEvents ="all";
    messengerDocument.getElementById("footer").style.pointerEvents ="all";
    messengerDocument.getElementById("headerEl").style.pointerEvents ="all";
}

function minimize()
{
	Close();
    Bots.close();
}  
// to get the url paramters
function getUrlData() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    
    return vars["bot"];
}

function openSkype() {
	var RequestAdvisorId = "shubham.ganguly@infosys.com"
	window.location = "sip:"+RequestAdvisorId;
}
function queryReqDate(){
	var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
	var conversationElement = messengerDocument.getElementById('conversation');
	var fromdate = messengerDocument.getElementById('fromdate');
	var todate= messengerDocument.getElementById('todate');
	sendMessage(fromdate.value.toString()+" to "+todate.value.toString());
}
function showChatButton() {

    console.log('Show Bot');
    
    clearChat();
    if (window.sessionStorage.getItem('chatEnabled') === null) {
        clearChat();
    }

    var appId = window.localStorage.getItem("appId");

    console.log('calling initBots');
    
    initBots(appId)
        .then(function() {
            console.log("init complete");
            window.sessionStorage.setItem('chatEnabled', 'true');
        })
        .catch(function(err) {
            console.log(err);
        });

}

function customUI() {
     // access messenger iframe document element
    var messengerDocument = document.getElementById('web-messenger-container').contentDocument;
	var messengerElement = document.getElementById('web-messenger-container');
	messengerElement.insertAdjacentHTML("afterend","<div class=\"popup-prompt overlay\"><div class=\"prompt-container row\"><div id=\"prompt-element\"></div></br><button id=\"close-button\" onclick=\"closePrompt()\">Close</button></div></div>")
	//popup-prompt overlay //prompt-container row //prompt-element
    // Add the custom CSS to the message container frame.
    messengerDocument.head.innerHTML += "\n<link rel='stylesheet' href='./styles/customUI.css' type='text/css'></link>\n";

    var headerElement = messengerDocument.getElementById('header');
    var introElement = messengerDocument.querySelector('.intro-pane');
	var footerElement = messengerDocument.getElementById('footer');
	var conservationElement = messengerDocument.getElementById('conversation');
	var downloadButton = messengerDocument.getElementById('download-button');
    var messageVid = messengerDocument.getElementById('message-vid');
	if(messageVid){
		messageVid.pause();
	}
    // Hide the Introductio Header.
    introElement.style.display='';
    headerElement.innerText = '';
	
    // DO NOT ADD the buttons to the intro section.
    headerElement.innerHTML = introElement.innerHTML + headerElement.innerHTML;
    
    //quick response button
    headerElement.insertAdjacentHTML("afterend", "<div id='selfin-container'><div id='selfin'></div></div>");
    //conversation intro text
    headerElement.insertAdjacentHTML("afterend", "<div id='textintro'><b>Hi Shubham! </b>How can I help you today?</div>");
    //with next prev button slider
    headerElement.insertAdjacentHTML("afterend", "<div id='cslider'> <div class='slideshow-container'> <div class='mySlides fade'> <div class='numbertext'>1 / 5</div><a class='tooltip' href='javascript:window.parent.imgurl(1)' ;><img src='./images/slider/logo-infosys.png' id ='infosys-img' style='width:100%'><span class='tooltiptext'>Infosys</span></a> <div class='text'></div></div><div class='mySlides fade'></div>");
    //our customized header
    headerElement.insertAdjacentHTML("afterend","<div id='headerEl' class='header-wrapper' style='background-color: rgb(0, 153, 204);'><img class='app-icon' alt='App icon' src='./images/virtual-assistant.png'><div class='app-name'>Oracle, MCE</div><div class='intro-text'>How do I help you?</div><div><div id='min' class='close-handle close-hidden'><a href='javascript:window.parent.openSkype();'><img class='skype-icon' src='http://localhost:8080/images/skype-icon.jpg'></i></a>&emsp;<a href='javascript:window.parent.minimize();'><i class='fa fa-minus'></i></a>&emsp;<a href='javascript:window.parent.Close();'><i class='fa fa-times'></i></a></div></div></div>")
    window.parent.currentSlide(1);
    headerElement.insertAdjacentHTML("afterend","<div id='prompt'>Do you want to end the conversation? <br><br>This will clear your chat history.<a class='selfin-style' href='javascript:window.parent.CloseYes();'>Yes</a><a class='selfin-style' href='javascript:window.parent.CloseNo();'>No</a></div>");
	footerElement.insertAdjacentHTML("afterend","<b>Suggestions:<b><div id='suggestion-container'><div id='suggestion-box'><left><p id='spara'></p><a class='suggestion-style' href='javascript:window.parent.order();'>Sales Order</a><a class='suggestion-style' href='javascript:window.parent.offers();'>Instance URLs</a><a class='suggestion-style' href='javascript:window.parent.reportIssue();'>Procurement Process Document</a></div></div>");
    
    //The sample demo shipped with the Web SDK (app.js) can be modified to include this
    
    Bots.setDelegate({
    beforeDisplay: (message) => {
      // if message contains something specific about web view.
        if(message.text == 'DUMMY') {
            // Do additional checks
            var payL;
            if(message.actions[0] != null && message.actions[0].payload != null) {
                payL = JSON.parse(message.actions[0].payload);
                if(payL != null && payL.isHidden) {
                    
                // Make message text empty
                message.text = "";

                message.actions = [{
                    type: 'webview', // type of message action
                    text: payL.title, // button label
                    uri: payL.video, //some frame to be loaded in the Web SDK UI
                    fallback: payL.video, //in case the channel/browser doesn't WebViews
                    openOnReceive: true
                }];

                }
            } 
        }
      return message;
    }
  });
}