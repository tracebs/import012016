define(['jquery'], function($){
    var CustomWidget = function () {
    	var self = this;

    	var ddnumber;
		var daynum;
		var monthnum;
		var yearnum;
		var zfullname;
		var wdays;
		var zprice;
		var requisite;


		this.callbacks = {
			render: function(){
				//console.log('render'); test 7zip

				var template = '<div><h1>Импорт</h1>'+
                    '<button class="button-input" id="importhtml">Загрузить</button>'+
					'<button class="button-input" id="createleadcontact">Импорт</button>'+
                    '<div id="send_result"></div>'+
                    '</div>';

                self.render_template({
                    caption:{
                        class_name:'js-ac-caption',
                        html:''
                    },
                    body:'',
                    render :  template
                });

				return true;
			},
			init: function(){

				return true;
			},
			bind_actions: function(){
				$('#createtaskfromlead').on('click', function(){

					self.callbacks.getData();
					console.log('Start-OnClick-createtaskfromlead');
					
					console.log('Finish-OnClick-createtaskfromlead');

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
					self.ddnumber = $('input[name="CFV[813270]"]').val();
					var today = new Date();
					self.daynum = "" + today.getDate();
					self.monthnum = "" + (today.getMonth()+1); //January is 0!
					self.yearnum = "" + today.getFullYear();
					self.startdogdate = $('input[name="CFV[685758]"]').val(); //дата начала обучения
					self.leadid = $('input[name="MAIN_ID"]').val(); //id сделки MAIN_ID или lead_id
					self.zfullname = $('input[name="contact[NAME]"]').val();
					tmpwdays = $('input[name="CFV[813354]"]').val();
					if (tmpwdays=='1948330') {
						self.wdays = 2;
						self.zprice = 7800;
					} else if (tmpwdays=='1948332') {
						self.wdays = 10;
						self.zprice = 25800;
					} else if (tmpwdays=='1948334') {
						self.wdays = 21;
						self.zprice = 45800;
					} else {

					}
					self.requisite = $('textarea[name="CFV[813368]"]').val();
					console.log('FinishGetData');
			},
			updateTextarea: function(txt, msg){
				console.log('UpdateTextArea');
				$('#send_result').html("");
				var restxt =txt+" ";
				restxt = restxt+" : ";
				restxt = restxt+msg.dl_link;
				$('.note-edit__body > textarea').trigger('focusin').val(restxt);
				$('.note-edit__actions__submit').removeClass('button-input-disabled').trigger('click');
			},
			updateLink: function(msg){
				console.log('UpdateLink v1:');
				$('#send_result').html("");
				var restxt = "" + msg.dl_link;
				console.log('UpdateLink v2:' + restxt);
				$('input[name="CFV[813398]"]').val(restxt);
			},
			checkdate2812: function(dat1,jsonstr) {
				//console.log( 'checkdate2812  dat1: ' + dat1 + ' json: '+jsonstr);
				var mnum1 = "" + (dat1.getMonth()+1);
				var ynum1 = "" + dat1.getFullYear();
				//console.log( 'checkdatestart mnum: ' + mnum1 + ' ynum: ' + ynum1);
				obj = $.parseJSON( jsonstr );
				//console.log( 'checkdatefor1:'+JSON.stringify(obj.data["2003"]["1"]));
				sourcestr1 = JSON.stringify(obj.data[ynum1][mnum1]);
				searchstr1 = '"'+ dat1.getDate() + '":{"isWorking":2}';
				if(sourcestr1.indexOf(searchstr1)>=0) {
					return false;
					//console.log( 'dat1 - выходной');
				} else {
					//return true;
					//console.log( 'dat1 - рабочий день');
					if ((dat1.getDay()==0) || (dat1.getDay()==6)) {
						//это вокресенье или суббота
						return false;
						//console.log( 'dat1 - рабочий день');
					} else {
						return true;
						//console.log( 'dat1 - рабочий день');
					}
				}
				//console.log( 'checkdate2812  finish');
			},
			getnext2812: function(dat2,jsonstr) {
				//console.log( 'getnext2812:'+ dat2.getDay()); //sunday = 0
				dat2.setDate(dat2.getDate() + 1);
				var mnum2 = "" + (dat2.getMonth()+1);
				var ynum2 = "" + dat2.getFullYear();

				obj2 = $.parseJSON( jsonstr );
				//console.log( 'checkdatefor1:'+JSON.stringify(obj2.data["2003"]["1"]));
				sourcestr2 = JSON.stringify(obj2.data[ynum2][mnum2]);
				searchstr2 = '"'+dat2.getDate()+'":{"isWorking":2}';
				if(sourcestr2.indexOf(searchstr2)>=0) {
					newdat = self.callbacks.getnext2812(dat2,jsonstr);
					return newdat;
					//console.log( 'dat2 - выходной');
				} else {
					if ((dat2.getDay()==0) || (dat2.getDay()==6)) {
						//это вокресенье или суббота
						newdat = self.callbacks.getnext2812(dat2,jsonstr);
						return newdat;
						//console.log( 'dat2 - рабочий день');
					} else {
						return dat2;
						//console.log( 'dat2 - рабочий день');
					}
				}

			}
		};
		return this;
    };


return CustomWidget;
});