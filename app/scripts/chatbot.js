var ChatBotClientApp = ChatBotClientApp || {}; 
function inIframe(){
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}
function getUser(){
	var userName = "";
	var userStr = document.location.search;                                                
	if(userStr){
					userStr = userStr.replace("?","");
					userStr = userStr.split("=");
					if(userStr.length>1 && userStr[0] == "user"){
									userName = userStr[1];
					}
	}
	return userName;
}
  
function clickOnLink(linkVal, level){
$('.chat-history .chat-message .chat-message-content .welcome-msg-options ul').empty();
																						
	
	if(level != 1){
		 
		$('#txtsendtext').val(linkVal);
		$('#chatform').submit();
  
	}else{
	$('.chat-history .chat-message .chat-message-content .welcome-msg-options ul').empty();
																					   
		var welcomeOptions = ChatBotClientApp.ChatWindow.configData.WelcomeOptions;
	  
		if(welcomeOptions){
			var buttons = welcomeOptions[linkVal].buttons;
			var tooltip = welcomeOptions[linkVal].tooltipText;
			if(welcomeOptions[linkVal].notConfigured){
			
			}else if(buttons.length > 0){
				$('.chat-history .chat-message .chat-message-content .welcome-msg-options .msg-text').html(welcomeOptions[linkVal].btnText);				
				for(var btn in buttons){
					if(buttons.hasOwnProperty(btn)){
   
						$('.chat-history .chat-message .chat-message-content .welcome-msg-options ul').append($('<li class="chat-list-item"><a href="javascript:clickOnLink(\''+buttons[btn]+'\',2)" class="chat-list-link">'+buttons[btn]+'</a></li>'));
					}
				}
				$('.chat-history .chat-message .chat-message-content .welcome-msg-options').show();
			}else{
				$('#txtsendtext').val(linkVal);
				$('#chatform').submit();
			}
		}
	}
	$(".chat-history").animate({ scrollTop: ($(".chat-message.clearfix").height()+60) }, 100);
}									 

if (typeof(ChatBotClientApp.ChatWindow) === "undefined"){
	
	ChatBotClientApp.ChatWindow = (function(){
		
		function ChatWindow()
		{
			this.readResponse = false;
			this.isAudioInput = false;
			this.sessionId = "";
			this.timer= null;
			this.user = "";
			this.configData = {};			
			
			this.GetConfigData();			
		}
		
		//function for audio output
		ChatWindow.prototype.Speech = function(say,isAudioInput){
			if ('speechSynthesis' in window && (this.readResponse || this.isAudioInput)) {				
				if(say){
					var synth = window.speechSynthesis;
					var text = $('<div></div>').html(say).text().trim();
					var voices = synth.getVoices();
					var utterance = new SpeechSynthesisUtterance(text);
					utterance.voice = voices[8];
					speechSynthesis.speak(utterance);
				}
			}
		};
		
		ChatWindow.prototype.GetConfigData = function(){
			$.ajax({
				url: "ui-config.json",
				type: "GET",
				async:false,
				timeout: 30000,
				dataType: "json", // "xml", "json"
				contentType: "application/json",
				context: this,
				success: function(data) {
					if(data){
						this.configData = data;
						console.log(this.configData);
						this.UpdateUI();
					}
				},
				error: function(jqXHR, textStatus, ex) {
					console.log("error: "+textStatus);                                                             
				}
			});
		};
		ChatWindow.prototype.UpdateUI = function(){
			//Add FAQs
			var faqs = this.configData.FAQs;
			if(faqs){
				for(var faq in faqs){
					if(faqs.hasOwnProperty(faq)){
						$('#live-chat .frequentQueries .freqQueryPopup ul').append($('<li><span class="fa fa-angle-right"></span><span class="link">'+faqs[faq]+'</span></li>'));
					}
				}			
			}
			//welcome message
			var welcomeOptions = this.configData.WelcomeOptions;
			if(welcomeOptions){
				for(var opt in welcomeOptions){
					if(welcomeOptions.hasOwnProperty(opt)){
						var tooltip = welcomeOptions[opt].tooltipText;
						var tooltipHtml = "";
						if(tooltip){
							tooltipHtml = '<span class="tooltiptext">'+tooltip+'</span>'
						}
						$('.chat-history .chat-message .chat-message-content .welcome-msg ul').append($('<li class="chat-list-item '+( tooltip? "tooltip":"")+'" ><a href="javascript:clickOnLink(\''+opt+'\',1)" class="chat-list-link" >'+welcomeOptions[opt].displayValue+'</a>'+tooltipHtml+'</li>'));
					}
			}
			}			
		};
	//function to add events to Chat UI
		ChatWindow.prototype.AddEvents = function(){			
			if(inIframe()){
                    this.user = getUser();
					console.log("Username="+this.user);
                }
			var _this = this;
			_this.isLoaded = _this.isLoaded || false;	
			//minimize chat window on click of header
			//$('#live-chat header').off('click').on('click',{ctx:this},function(e) {
				$('#live-chat header,#live-chat .chatbot_icon').off('click').on('click',{ctx:this},function(e) { 
				//$('.chat').slideToggle(300, 'swing');
				$('#live-chat').toggleClass("on",0, "easeInQuart");
				if(inIframe()){
						var height = $('#live-chat').hasClass('on')? 420 : 100;
						var width = $('#live-chat').hasClass('on')? 323 : 100;
																						  
																				 
						window.parent.postMessage(["setHeight", height,width], "*");
					} 
				if($('#live-chat').hasClass('on')){
					setTimeout(function(){
						$('#txtsendtext').focus();
					},500);
				}
				if(!_this.isLoaded){
					var firstName = '';
					var defaultMessage = 'How can I help you today?'
					
					_this.isLoaded = true;
				}
			});	
			
			//Close FAQ popup on click of icon
			$('#live-chat .frequentQueries>.link,#live-chat .frequentQueries .freqQueryPopup .closePopup').off('click').on('click', function() {
				$(this).parents('.frequentQueries').find('.freqQueryPopup').slideToggle(300, 'swing');
			});

			//Open FAQ popup on click of icon
			$('#live-chat .faq-icon').off('click').on('click', function(e) {
				$('#live-chat .frequentQueries .freqQueryPopup').slideToggle(300, 'swing');
				if($('#live-chat').hasClass('on')){
					e.preventDefault();
					e.stopPropagation();
				}
			});
			
			//Open skype on click of request advisor
			$('#live-chat .request-advisor').off('click').on('click',{ctx:this}, function(e) {
				if(e.data.ctx.configData.RequestAdvisorId){
					window.location = "sip:"+e.data.ctx.configData.RequestAdvisorId;
				}
				if($('#live-chat').hasClass('on')){
					e.preventDefault();
					e.stopPropagation();
				}
			});
			
			//Enable disable audio output
			$('#live-chat .volume-icon').off('click').on('click', {ctx:this}, function(e) {
				$(this).toggleClass('fa-volume-off').toggleClass('fa-volume-up');				
				_this.readResponse = $(this).hasClass("fa-volume-up")? true : false;			
				e.preventDefault();
				e.stopPropagation();
			});
			//Show and hide confirmation message when user clicks on close icon.
			$('#live-chat #close-button').off('click').on('click', {ctx:this}, function(e) {
				$('#modal').addClass("visiblediv").removeClass("modal-box"); 
				$('#chat-history').css("overflow","hidden");
				$('#panel-footer').hide(); 		
				e.preventDefault();
				e.stopPropagation();
			});
			
			//Fire query on click of frequent queries
			$('#live-chat .frequentQueries .freqQueryPopup').delegate(".link",'click',{ctx:this}, function(event) {
				var query = $(this).text();
				$('#txtsendtext').val(query);
				$('#chatform').submit();
				$(this).parents('.freqQueryPopup').slideToggle(300, 'swing');
			});
			
			//On click of mic icon start audio recorder
			$('#live-chat .fa.fa-microphone').off('click').on('click',function(){
				if(!$(this).hasClass("active")){
					$(this).toggleClass("active").toggleClass("listening");			
					$('#live-chat .chat-feedback').text("Listening...").show();
					_this.StartAudioRecorder();
				}					
			});
			
			//send request on click of send button or enter key press
			$('#chatform').on("submit", function(){
				_this.SendRequest();
				return false;
			});

					
   
									
											  
												   
								  
										 
							
				 
				 //Autosuggestion 
			
		$( "#txtsendtext" ).autocomplete({
			source: this.configData.AutocompleteSearch,
			position: { my : "left bottom", at: "left top"},
			select: function( event, ui ) {
				$('#txtsendtext').val(ui.item.label);
				$('#chatform').submit();
				return false;
			}
		});
			
			$('#live-chat').resizable({
				animate: true
			});
	
	 
   
		};
		
		//function to start audio recorder
		ChatWindow.prototype.StartAudioRecorder = function(){
			if('webkitSpeechRecognition' in window){
				var transcript = "";
				var recognition = new webkitSpeechRecognition();
				var _this = this;
				
				recognition.lang="en-IN";//lang="en-GB";
				recognition.onresult = function(event){					
					//btn.toggleClass("active");
					transcript = event.results[0][0].transcript;

					var value = $("#txtsendtext").val();					
					var transcript1 = value + " " + transcript;
					$("#txtsendtext").val(transcript1);
					_this.isAudioInput = true;
					_this.SendRequest();
				};
				recognition.onerror = function(event) {
					console.log(event.error);
					var message = "";
					
					if("not-allowed" == event.error){
						message = "Microphone has been blocked for this page or it is not present, please contact your system administrator.";
					}else if("no-speech" == event.error){
						message = "No speech has been received, please try again";
					}
					_this.isAudioInput = true;
					_this.ShowMessage(message, "response");
				};
				recognition.onend = function(event) {					
					$('#live-chat .fa.fa-microphone').toggleClass("active").toggleClass("listening");
					//console.log("end");
					$('#live-chat .chat-feedback').hide();
				};
				
				recognition.start();
			}	
		};
		
		//function to show message in Chat UI		
		ChatWindow.prototype.ShowMessage = function(msg,type){
			var date = new Date();
			var time = date.toLocaleTimeString();
			var userText = ' user">';
			var chtabotText = ' chat-bot"><span class="user-icon"></span>';
			
			var chatmessage = '<div class="message-box'+((type == "request")? userText: chtabotText)+
			'<p>'+ msg + '</p><div class="time-container"><span class="chat-time">'+ time + '</div></span></div><div>';
			$(".chat-message.clearfix").append(chatmessage);
			$(".chat-history").animate({ scrollTop: ($(".chat-message.clearfix").height()+60) }, 100);
			
			if(type == "response"){
				$(".chat-feedback").hide();	
				this.Speech(msg);
		 
							   
			}else{
				$(".chat-feedback").show();
			}
   
		};
		ChatWindow.prototype.SetTimer = function(){
			this.ClearTimer();
			var _this = this;
			this.timer = setTimeout(function()
			{
				_this.ChatExitConfirmation();
				},120000);
		};
		ChatWindow.prototype.ClearTimer = function(){
			if(this.timer){
			clearTimeout(this.timer);
			}
		};
		//Show and hide confirmation message when user timeout occurs.
			ChatWindow.prototype.ChatExitConfirmation = function() {
				$('#timeout-modal').addClass("visiblediv").removeClass("timeout-modal-box"); 
				$('#chat-history').css("overflow","hidden");
				$('#panel-footer').hide(); 	
			};
		//function to send request to server
		ChatWindow.prototype.SendRequest = function(){
			
			var _this = this;
			var userInput = $('#txtsendtext').val();
			if(userInput){
				userInput = userInput.trim();
				_this.ShowMessage(userInput, "request");
				
				$.ajax({
					type: "POST",
					url: "api/chatbot-request",
					data: {inputText:userInput,sessionId:_this.sessionId, user:_this.user},
					success: function(resp){
						console.log("Success");
						console.log(resp);
						if(resp.outputCode == "Success"){
							
							console.log(resp.outputText);
							console.log(typeof resp.outputText);
							if(typeof resp.outputText === "object" && resp.outputText.length>1){
								for(var msg in resp.outputText){
									if(resp.outputText.hasOwnProperty(msg)){
										_this.ShowMessage(resp.outputText[msg], "response");
									}
								}
							}else{
								_this.ShowMessage(resp.outputText, "response");
							}						
							
							_this.sessionId = resp.sessionId;
							//console.log("resp.respType",resp.respType);
							console.log("resp.data",resp.data);
							
							if(resp.respType == "CSV"){
								//if((resp.data !="Sales Order Not Found" || resp.data!="Delivery Not Found")){
									if(resp.data !="No data available to download" ){
									console.log("CALL expostcsv");
									exportTOCSV(resp.data,resp.entity);
								}								
								
							}else if(resp.respType == "POPUP" ){
								if(resp.data !="Sales Order not found" || resp.data!="Deliver Not Found"){
									console.log("display popup");
									displayPopup(resp.data);
								}
								
								
							}
						}
					},
					error:function(error){
						console.log("Error");
						console.log(error);
					}
				});
			}	
			$('#txtsendtext').val("");
		};		
		
		return new ChatWindow;
	}());	
}

$(document).ready(function(){
	ChatBotClientApp.ChatWindow.AddEvents();
	/*var response = "Hi, I am Ricoh Assistant. How can I help you?";
	ChatBotClientApp.ChatWindow.ShowMessage(response, "response");*/
});

function displayPopup(data){
	console.log("*****",data);
	
	var content=data.split("\n");
		
  var myDialog = document.createElement("dialog");
  myDialog.setAttribute("id", "d1");
  document.body.appendChild(myDialog)
  //var text = document.createTextNode(data);
  
  for (i = 0; i < content.length; i++){

	  var lineData=content[i];
	  var newData= lineData.replace(/~/g,"\xa0");
	  console.log("----@@@@",newData);
	  
	  myDialog.appendChild(document.createTextNode(newData));
	  myDialog.appendChild(document.createElement("br"));
	  
  }
  
  myDialog.style.background="#dcf2fa";
  myDialog.style.border="solid 1.5px grey";
   myDialog.style.font="12px Droid Sans, sans-serif";
   
   
   var buttonnode= document.createElement('input');
buttonnode.setAttribute('type','button');
buttonnode.setAttribute('value','Ok');
buttonnode.setAttribute('style','float: right;color:white;background:#ec5151;font:12px Droid Sans, sans-serif;');//style="float: right;"
buttonnode.setAttribute('onclick','closep()');
myDialog.appendChild(buttonnode);
  myDialog.showModal();
 
}

function exportTOCSV(content, entity){
	console.log("exporttoCSV");
	console.log("entity",entity);
	var file_name=entity+".csv";
	try{
		const rows = content;
		//console.log("resp.data",rows);
let csvContent = "data:text/csv;charset=utf-8,";
//let csvContent = "data:application/vnd.ms-excel";
rows.forEach(function(rowArray){
   let row = rowArray.join(",");
   csvContent += row + "\r\n";
}); 
console.log(csvContent);
var encodedUri=encodeURI(csvContent);
							 
					 
									  
																								   
  
						   
									   
		
var link = document.createElement("a");
			//if(link.download !== undefined){
				//var url = URL.createObjectURL(blob);
				link.setAttribute("href",encodedUri);
				link.setAttribute("download",file_name);
				link.style.visibility='hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);			
		 
	   
	}catch(error){
		console.log("Error:"+error);
	}
}
function closep() {
  
	document.getElementById('d1').onclick = function(){
        this.parentNode
        .removeChild(this);
        return false;
    };

}



// Adding custom functions to support UI functionalities in Index.html
		// Function to displaycurrent date and time in the chat window
		window.onload = function() {
			var months = [ 'January', 'February', 'March', 'April', 'May',
					'June', 'July', 'August', 'September', 'October',
					'November', 'December' ];
			var date = new Date();
			var currentHour = date.getHours();
			var currentMinute = date.getMinutes();
			var currentMonth = date.getMonth();
			var month = months[currentMonth].slice(0, 3);
			var date = date.getDate();
			document.getElementById('getcurrenthour').innerHTML = currentHour;
			document.getElementById('getcurrentmin').innerHTML = currentMinute;
			document.getElementById('getcurrentmonth').innerHTML = month;
			document.getElementById('getcurrentdate').innerHTML = date;
			document.getElementById('getcurrenthour1').innerHTML = currentHour;
			document.getElementById('getcurrentmin1').innerHTML = currentMinute;
			document.getElementById('getcurrentmonth1').innerHTML = month;
			document.getElementById('getcurrentdate1').innerHTML = date;
		};
		function show() {
			document.getElementById('order-types').style.display='block'; 
		}
		//Function to close the confirmation window when user clicks on No button 
		function closeWindow() {
			document.getElementById('live-chat').className = 'hiddendiv';
		}
		//Function to close the chat window when user clicks on Yes button 
		function closemodal() {
			document.getElementById('modal').className = 'hiddendiv';
			document.getElementById('panel-footer').style.display= 'block';
			document.getElementById('chat-history').style.overflow = 'auto';
		}
		//Function to close the time-out confirmation window when user clicks on Yes button 
		function closetimeoutmodal() {
			document.getElementById('timeout-modal').className = 'hiddendiv';
			document.getElementById('panel-footer').style.display= 'block';
			document.getElementById('chat-history').style.overflow = 'auto';
			ChatBotClientApp.ChatWindow