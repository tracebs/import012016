<?php
if(isset($_POST)) {
	#Массив с параметрами, которые нужно передать методом POST к API системы
	$user=array(
		'USER_LOGIN'=>'vs@tracebs.ru', #Ваш логин (электронная почта)
		'USER_HASH'=>'6a5441fe78eb16cd0c41d70ee80443c4' #Хэш для доступа к API (смотрите в профиле пользователя)
	);
 
	$subdomain='trace'; #Наш аккаунт - поддомен
 
 
	#		авторизовались 
 
	#Формируем ссылку для запроса
	$link='https://'.$subdomain.'.amocrm.ru/private/api/auth.php?type=json';
	foreach ($_POST as $postval) {
		$i = $i+1;
		if ($i==1) {
			$link2 = $postval;
		}
	}
	//$link2 = implode("!",$_POST);
	@file_put_contents("hash.txt",$link2);
	$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
	#Устанавливаем необходимые опции для сеанса cURL
	curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
	curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
	curl_setopt($curl,CURLOPT_URL,$link);
	curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'POST');
	curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($user));
	curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
	curl_setopt($curl,CURLOPT_HEADER,false);
	curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
	curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
	curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
 
	$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
	$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
	curl_close($curl); #Завершаем сеанс cURL

	$Response=json_decode($out,true);
	$Response=$Response['response'];
	if(isset($Response['auth'])) {
		#Флаг авторизации доступен в свойстве "auth"
		
		#	получили гетом содержимое ссылки
  
		$link='https://www.amocrm.ru/partners/private/works/detail/'.$num;
		$link = implode("!",$_POST);	

		$curl=curl_init(); #Сохраняем дескриптор сеанса cURL
		#Устанавливаем необходимые опции для сеанса cURL
		curl_setopt($curl,CURLOPT_RETURNTRANSFER,true);
		curl_setopt($curl,CURLOPT_USERAGENT,'amoCRM-API-client/1.0');
		curl_setopt($curl,CURLOPT_URL,$link2);
		curl_setopt($curl,CURLOPT_CUSTOMREQUEST,'GET');
		curl_setopt($curl,CURLOPT_POSTFIELDS,json_encode($user));
		//curl_setopt($curl,CURLOPT_HTTPHEADER,array('Content-Type: application/json'));
		//curl_setopt($curl,CURLOPT_HEADER,false);
		curl_setopt($curl,CURLOPT_COOKIEFILE,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
		curl_setopt($curl,CURLOPT_COOKIEJAR,dirname(__FILE__).'/cookie.txt'); #PHP>5.3.6 dirname(__FILE__) -> __DIR__
		curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
		curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);
 
		$out=curl_exec($curl); #Инициируем запрос к API и сохраняем ответ в переменную
		$code=curl_getinfo($curl,CURLINFO_HTTP_CODE); #Получим HTTP-код ответа сервера
		curl_close($curl); #Завершаем сеанс cURL
		//echo "<html><head></head>";
		//echo "<body>";
		//echo "авторизация - ок";
		//echo implode("!",$_POST);
		//echo "</body>";
		//echo "</html>";
		echo $link2;
		echo $out;
	} else {
		echo "<html><head></head>";
		echo "<body>";
		echo "no auth";	
		echo "</body>";
		echo "</html>";
	}
# в OUT - нужный html  
}  else {
	echo "<html><head></head>";
	echo "<body>";
	echo "no post";	
	echo "</body>";
	echo "</html>";
}
  
  ?>