define(['jquery'], function($){
    var CustomWidget = function () {
		//===============================================
		//виджет для импорта данных в AMO CRM 
		//весь код работает по кнопке id=#importhtml
		//===============================================
    	var self = this;
    	var ddnumber;
		var daynum;
		var monthnum;
		var yearnum;
		var datestamp;
		var respuserid;


		this.callbacks = {
			render: function(){
				//console.log('render'); test 7zip
				w_code = self.get_settings().widget_code; //в данном случае w_code='new-widget'
				var template = '<div><div class="whitebackground"><div class="widgetback1">'+
					'<p>Для импорта заявки из личного кабинета amoCRM проделайте следующие шаги:</p>'+
					'<p>1. Перейдите по этой ссылке <a href="#">(ссылка на ЛК)</a></p>'+
					'<p>2. Поставьте галочку "Proxy"</p>'+
					'<p>3. Скопируйте ссылку из адресной строки в поле ниже и нажмите "Добавить"</p>'+
					'</div><hr>'+
					'<textarea id="linkfield" class="widgetta1"></textarea><br />'+
					'<p><input type="checkbox" class="widgetcheckclass1" id="proxycheck" value="1">&nbsp;proxy</p>'+	
                    '<center><button class="button-input" class="widgetbutton1" id="importhtml">Загрузить</button></center>'+											
					'</div>'+
                    '<div id="parsehtml"></div>'+
                    '</div>'+
					'<link type="text/css" rel="stylesheet" href="/upl/'+w_code+'/widget/style.css" >';

                self.render_template({
                    caption:{
                        class_name:'js-ac-caption',
                        html:''
                    },
                    body:'',
                    render :  template
                });
				//простановка версии виджета в div id=#parsehtml
				$jsonurl = '/upl/'+w_code+'/widget/manifest.json';
				$.getJSON( $jsonurl, function( data ) {
					vers19011 = data.widget.version;
					$('#parsehtml').html('v.'+vers19011);					
				});
				return true;
			},
			init: function(){
				console.log('Init:');
				return true;
			},
			bind_actions: function(){
				$('#importhtml').on('click', function(){
					self.callbacks.getData();
					// ====================================================
					// =======параметры виджета============================
					// ====================================================
					// id полей для импорта
					var idtags = [ "CONTACT_NAME", "CONTACT_EMAIL", "CONTACT_PHONE", "CONTACT_COMPANY", "BRIEF_BRANCH", "BRIEF_SPECIALIZATION", "BRIEF_ROUGH_COST", "BRIEF_TIME_LIMIT", "BRIEF_COMMENT" ];
					// id полей в АМО
					// сущность ответсвенный пользователь==================
					// см. self.respuserid в getData
					// сущность контакт====================================
					// "CONTACT_NAME"
					// нет параметра					
					// "CONTACT_EMAIL"
					stridcontactemail = "861028";
					// "CONTACT_PHONE"
					stridcontactph = "861026";
					// "CONTACT_COMPANY" - в сущность компания=============
					// нет параметра
					// сущность сделка=====================================
					// "Имя сделки"
					strleadname = 'Сделка(импорт) '+self.datestamp;
					// "BRIEF_BRANCH"
					stridbriefbranch = "861116";
					// "BRIEF_SPECIALIZATION"
					strbriefspec = "861118";
					// "BRIEF_ROUGH_COST"
					stridbriefrough = "861122";
					// "BRIEF_TIME_LIMIT"
					stridbrieftime = "861120";
					// сущность Примечание к сделке========================
					// "BRIEF_COMMENT"
					// нет параметра					
					// прокси url с авторизацией
					strurlproxy = 'http://rsdim.dlinkddns.com/trace/post1/post1.php';
					// ===конец параметров==================================
					
					
					console.log('Start-OnClick-importhtml:');
					htmlvar = { res: $('#linkfield').val()}		
					
					
					if ($('#linkfield').val()==="") {
						alert("Адрес не может быть пустой строкой");
					} else {
						//обработка input
						$('#parsehtml').hide();
						console.log("gethtml start linkfield:" + $('#linkfield').val());
						
						if ($("#proxycheck").prop("checked")) {
							adress = strurlproxy;
						} else {
							adress = $('#linkfield').val();							
						}
						console.log("adress qqq:"+adress);
						self.crm_post (
							adress,
							htmlvar,
							function(data) {
								//подрезка строчки
								datastr = "" + data;
								console.log( 'datastr:'+ datastr);
								pos1 = datastr.indexOf('<body>')+6;
								pos2 = datastr.indexOf('</body>');
								console.log( 'Pos1:'+pos1 +' Pos2:'+pos2);
								data2 = datastr.slice(pos1,pos2);
								//чистим js тэги
								data3 = data2.replace(/script/g,"")
								//console.log( 'data3:'+ data3);
								//console.log( 'data3:==============================');
								$('#parsehtml').html(data3);
								
								itexts = "";
								itextsid = "";
								arritexts = [];
								arritextsid = [];
								console.log( 'each1' );
								$('#parsehtml').each(function(){
									console.log( 'each2' );
									//получаем все input внутри div
									$(this).find($( ":input" )).each(function(){	
										//фильтр в цикле
										currentid = ""+$(this).attr("id");
										for (var k14 = 0; k14 < idtags.length; k14++) {
											tmpk = ""+ idtags[k14];
											if (tmpk==currentid) {
												cval = ""+$(this).val();
												cid = ""+$(this).attr("id");
												itextsid = itextsid+cid+"!-!";									
												itexts = itexts+cval+"!-!";
												arritexts.push(cval);
												arritextsid.push(cid);
											}
										}
									});	
									//===все textarea======
									$(this).find($( "textarea" )).each(function(){	
										//фильтр в цикле
										currentid = ""+$(this).attr("id");
										for (var k14 = 0; k14 < idtags.length; k14++) {
											tmpk = ""+ idtags[k14];
											if (tmpk==currentid) {
												cval = ""+$(this).val();
												cid = ""+$(this).attr("id");
												itextsid = itextsid+cid+"!-!";									
												itexts = itexts+cval+"!-!";
												arritexts.push(cval);
												arritextsid.push(cid);
											}
										}
									});	
								});					
								console.log( 'arritextsid:'+arritextsid.join("---") );		
								console.log( 'arritexts:'+arritexts.join("---") );
								//генерация responsible id
								//создание контакта 
								flag15 = "";
								contacts1 = "";
								emailsarr = [];
								emails = "";
								phonesarr = [];
								phones = "";
								contactname = "";
								for (var k14 = 0; k14 < arritextsid.length; k14++) {
									if (arritextsid[k14]=='CONTACT_EMAIL') {
										flag15 = "1";
										emailsarr.push(arritexts[k14]);
										//emails = emails+arritexts[k14]+',';
									}
									if (arritextsid[k14]=='CONTACT_PHONE') {
										flag15 = "1";
										phonesarr.push(arritexts[k14])
										//phones = phones+arritexts[k14]+',';
									}
									//CONTACT_NAME
									if (arritextsid[k14]=='CONTACT_NAME') {										
										contactname = arritexts[k14];
									}
								}	
								emails = emailsarr.join();
								phones = phonesarr.join();
								console.log( 'pe:'+emails+"-----"+phones );
								if (flag15 == "1") {
									//861026 - id телефона 861028-id email
									if (emails=="") {
										
									} else {
										contacts1 = '{"id":'+stridcontactemail+',"values":[{"value":"'+emails+'","enum":"WORK"}]}';
									}
									if (emails=="" || phones=="") {
										
									} else {
										contacts1 = contacts1 + ',';
									}
									if (phones=="") {
										
									} else {
										contacts1 = contacts1 + '{"id":'+stridcontactph+',"values":[{"value":"'+phones+'","enum":"WORK"}]}';
									}									
									contacts1 = ',"custom_fields":  ['+contacts1+']';
									
								}
								if (contactname=="") {
									contactname = "Контакт не указан";
								}
								contacts1 = '{"name":"'+contactname+'","responsible_user_id":"'+self.respuserid+'"'+contacts1+'}';
								contacts1 = '{"request":{"contacts":{"add":['+contacts1+']}}}';
								contactdata = JSON.parse(contacts1);
								console.log( 'contacts:'+contacts1 );
								userid = "";
								$.post(
									"https://new569657cfe698c.amocrm.ru/private/api/v2/json/contacts/set",
									contactdata,
									function( msgdata ) {
										//получаем id созданного контакта
										console.log( 'contactdata:'+JSON.stringify(msgdata) );
										cdata15 = JSON.parse(JSON.stringify(msgdata));
										userid = ""+cdata15.response.contacts.add[0].id;
										srvtime = parseInt(cdata15.response.server_time);
										console.log( 'srvtime:'+srvtime );
										//==============
										//создание сделок 10060455 -первичнй контакт 142 - успешно реализовано
										branch1 = "";
										spec1 = "";
										rough1 = "";
										time1 = "";
										arrtime1 = [];
										
										
										for (var k14 = 0; k14 < arritextsid.length; k14++) {
											if (arritextsid[k14]=='BRIEF_BRANCH') {												
												branch1 = arritexts[k14];
											}
											if (arritextsid[k14]=='BRIEF_SPECIALIZATION') {
												spec1 = arritexts[k14];
											}
											if (arritextsid[k14]=='BRIEF_ROUGH_COST') {
												rough1 = arritexts[k14];
											}
											if (arritextsid[k14]=='BRIEF_TIME_LIMIT') {
												//time1 = time1+arritexts[k14];
												arrtime1.push(arritexts[k14]);
											}
											
										}
										time1 = arrtime1.join();
										
										//заполнение custom fields
										leads1 = "";
										if ((branch1+spec1+rough1+time1)=='') {
											
										} else {
											if (branch1=="") {
										
											} else {
												leads1 = '{"id":"'+stridbriefbranch+'","values":[{"value":"'+branch1.replace(/"/g,"'")+'"}]}';
											}
											if (spec1=="") {
										
											} else {
												leads1 = leads1 + ',';
											}
											if (spec1=="") {
										
											} else {
												leads1 = leads1 + '{"id":"'+strbriefspec+'","values":[{"value":"'+spec1.replace(/"/g,"'")+'"}]}';												
											}
											if (rough1=="") {
										
											} else {
												leads1 = leads1 + ',';
											}
											if (rough1=="") {
										
											} else {
												leads1 = leads1 + '{"id":"'+stridbriefrough+'","values":[{"value":"'+rough1.replace(/"/g,"'")+'"}]}';												
											}
											if (time1=="") {
										
											} else {
												leads1 = leads1 + ',';
											}
											if (time1=="") {
										
											} else {
												leads1 = leads1 + '{"id":"'+stridbrieftime+'","values":[{"value":"'+time1.replace(/"/g,"'")+'"}]}';												
											}											
											//if (comment1=="") {
										//
											//} else {
											//	leads1 = leads1 + ',';
											//	leads1 = leads1 + '{"id":"861124","values":[{"value":"'+comment1.replace(/"/g,"'").replace (/[\n\r]/g, ' ').replace (/\s{2,}/g, ' ').trim()+'"}]}';												
											//}
									
											leads1 = ',"custom_fields":  ['+leads1+']';
										}
										//================================
										console.log('userid:'+userid);
										leads1 = '{"name":"'+strleadname+'","responsible_user_id":"'+self.respuserid+'","status_id":10060455'+leads1+'}';
										leads1 = '{"request":{"leads":{"add":['+leads1+']}}}';
										console.log('leads1:'+leads1);
										leaddata = JSON.parse(leads1);
										
										$.post(
											"https://new569657cfe698c.amocrm.ru/private/api/v2/json/leads/set",
											leaddata,
											function( msgdata ) {
												//сделка создана
												console.log( 'leads msgdata:'+JSON.stringify(msgdata) );
												leadresponce15 = JSON.parse(JSON.stringify(msgdata));
												leadid = ""+leadresponce15.response.leads.add[0].id;
												srvtime = parseInt(leadresponce15.response.server_time);
												console.log( 'srvtime2:'+srvtime );
												stime = new Date().getTime();
												stime = Math.round(stime/1000)+10;
												//======
												stime = srvtime+2;
												setTimeout(function(){
													//после 2х секунд паузы создаем примечание к сделке и компанию
													//примечание
													comment1 = "";
													arrcomment1 = [];
													for (var k14 = 0; k14 < arritextsid.length; k14++) {
														if (arritextsid[k14]=='BRIEF_COMMENT') {
															//comment1 = comment1+arritexts[k14]+',';
															arrcomment1.push(arritexts[k14]);
														}
													}	
													comment1 = arrcomment1.join().replace(/"/g,"'").replace (/[\n\r]/g, ' ').replace (/\s{2,}/g, ' ').trim();
													note1 = '';
													//"element_type":"2" - привязываем к сделке "element_type":"1" - привязываем к контакту
													note1 = '{"element_id":"'+leadid+'","element_type":"2","note_type":"4","responsible_user_id":"'+self.respuserid+'","text":"'+comment1+'"}';
													note1 = '{"request":{"notes":{"add":['+note1+']}}}';													
													notesdata = JSON.parse(note1);
													console.log( 'note1:'+JSON.stringify(notesdata) );			
													$.post(
														"https://new569657cfe698c.amocrm.ru/private/api/v2/json/notes/set",
														notesdata,
														function( noterespdata ) {
															console.log( 'noterespdata:'+JSON.stringify(noterespdata));
														},
														"json"
													);	
													
													//компания
													updatecontactdatastr = '{"request":{"contacts":{"update":[{"id":"'+userid+'","linked_leads_id":["'+leadid+'"],"last_modified":"'+stime+'"}]}}}';
													console.log('update contact:'+updatecontactdatastr);
													updatecontactdata = JSON.parse(updatecontactdatastr);
													$.post(
														"https://new569657cfe698c.amocrm.ru/private/api/v2/json/contacts/set",
														updatecontactdata,
														function( upddata ) {
															console.log( 'upddata:'+JSON.stringify(upddata) );
															//создание компании при успешном апдейте
															srvtime = parseInt(upddata.response.server_time);
															console.log( 'srvtime3:'+srvtime );
															compan1 = "";
															for (var k14 = 0; k14 < arritextsid.length; k14++) {
																if (arritextsid[k14]=='CONTACT_COMPANY') {
																	compan1 = ""+arritexts[k14];
																}
															}	
															compname = compan1.replace(/"/g,"'");
															
															console.log( 'srvtime3:'+srvtime );
															if (compan1=="") { 
																console.log( 'compan1=0' );
															}
															else {
																compan1 = '{"name":"'+compname+'","responsible_user_id":"'+self.respuserid+'","linked_leads_id":["'+leadid+'"]}';
																compan1 = '{"request":{"contacts":{"add":['+compan1+']}}}';																
																compandata = JSON.parse(compan1);
																console.log( 'compan1:'+JSON.stringify(compandata) );
																$.post(
																	"https://new569657cfe698c.amocrm.ru/private/api/v2/json/company/set",
																	compandata,
																	function( cmpdata ) {
																		//update контакта при создании компании
																		console.log( 'compandata:'+JSON.stringify(cmpdata) );
																		companid15 = JSON.parse(JSON.stringify(cmpdata));
																		companid = ""+companid15.response.contacts.add[0].id;
																		srvtime = parseInt(companid15.response.server_time);
																		console.log( 'srvtime4:'+srvtime );
																		stime = new Date().getTime();
																		stime = Math.round(stime/1000)+20;
																		stime = srvtime+2;
																		
																		updatecontactdatastr = '{"request":{"contacts":{"update":[{"id":"'+userid+'","company_name":"'+compname+'","last_modified":"'+stime+'"}]}}}';
																		console.log( 'updcontact2.1:'+updatecontactdatastr );
																		updatecontactdata = JSON.parse(updatecontactdatastr);
																		$.post(
																			"https://new569657cfe698c.amocrm.ru/private/api/v2/json/contacts/set",
																			updatecontactdata,
																			function( updcontact2 ) {
																				console.log( 'updcontact2.2:'+JSON.stringify(updcontact2) );
																				
																			},
																			"json"
																		);
																	},
																	"json"
																);
															}
															//===компания===============
														},
														"json"
													);
													//=================
												}, 2000);												
											},
											"json"
										);
										//==============
									},
									"json"
								);
								
							},
							'text'
						);
						
			
					}					
					console.log('Finish-OnClick-importhtml');

				});

				//console.log(self.system().area);


				return true;
			},
			settings: function(){

				return true;
			},
			onSave: function(){

				return true;
			},
			destroy: function(){

			},
			contacts: {
					//select contacts in list and clicked on widget name
					selected: function(){

					}
				},
			leads: {
					//select leads in list and clicked on widget name
					selected: function(){

					}
				},
			tasks: {
					//select taks in list and clicked on widget name
					selected: function(){

					}
				},
			getData: function(){
					console.log('StartGetData');					
					var today = new Date();
					self.mins = "" + today.getMinutes();
					self.hour = "" + today.getHours();
					self.daynum = "" + today.getDate();
					self.monthnum = "" + (today.getMonth()+1); //January is 0!
					self.yearnum = "" + today.getFullYear();	
					self.datestamp = "" + today.getFullYear() + "-"+(today.getMonth()+1)+"-"+today.getDate()+" "+today.getHours()+":"+ today.getMinutes();
					rndval = Math.round(Math.random());
					if (rndval == 0) {
						self.respuserid = "680745";
					} else {
						self.respuserid = "513807";
					}
					console.log('FinishGetData');
			}
		};
		return this;
    };


return CustomWidget;
});