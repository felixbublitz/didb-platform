<?php

if(file_exists('../api_access.php'))
require_once('../api/access.php');


if(file_exists('access.php'))
require_once('access.php');

require_once('../config/credentials.php');



class Database {

	private $host;
	private $username;
	private $password;
	private $database;



	public function __construct(){

		$access = new Access();

		if(isset($access) && $access->permitted()){
			$this->host = 'localhost';
			$this->username = Credentials::$DB_USER_RW;
			$this->password = Credentials::$DB_PASSWORD_RW;
			$this->database = 'didb';
		}else{
			$this->host = 'localhost';
			$this->username = Credentials::$DB_USER_R;
			$this->password = Credentials::$DB_PASSWORD_R;
			$this->database = 'didb';
		}

	}

	public function allowWriting(){
		$this->host = 'localhost';
		$this->username = Credentials::$DB_USER_RW;
		$this->password = Credentials::$DB_PASSWORD_RW;
		$this->database = 'didb';
	}

	private function connect() {

		mysql_connect($this->host, $this->username, $this->password)
			or die("Sql Connection Error");
		mysql_select_db($this->database)
				or die("Sql Connection Error");
                    mysql_query('set names utf8');

	}

	private function disconnect(){

		mysql_close()
				or die("Sql Disconnect Error");

	}

	public function createTable($name,$element){
			$args='';

		foreach ($element as $arg) {
			$args .=  $arg . ',';
		}
		//Letztes Komma abschneiden
		$args = substr($args, 0, -1);

		$this->query("CREATE TABLE ".$name." (".$args.");");
		return true;


	}

	public function tableExist($table) {
		$this->connect();
		if (mysql_num_rows(mysql_query("SHOW TABLES LIKE '$table'")) >= 1){
			$result= true;
		}else{
			$result= false;
		}
		$this->disconnect();

		return $result;
	}

	public function query($sql) {
		$this->connect();
		$db_erg = mysql_query($sql);
			//or die("$db_ergo = mysql_error()");
		$this->disconnect();
		return $db_erg;
	}

	public function queryAndGetRow($sql) {
		$this->connect();
		$db_erg = mysql_query($sql)
			or die(mysql_error());
		$id = mysql_insert_id();
		$this->disconnect();
		return $id;
	}

	public function select($select,$from,$where="",$otherArgs="",$selectSuffix=''){
		$this->connect();
		$args="";
                $output="";
		foreach ($select as $arg) {
			$args .=  $arg . ',';
		}
		//Letztes Komma abschneiden
		$args = substr($args, 0, -1);

		if ($where!="" and $otherArgs!=""){
			$sql = mysql_query("SELECT $selectSuffix $args FROM $from WHERE $where $otherArgs");
		}else if($otherArgs!=""){
			$sql = mysql_query("SELECT $selectSuffix $args FROM $from $otherArgs");
		}elseif($where!=""){
			$sql = mysql_query("SELECT $selectSuffix $args FROM $from WHERE $where");
		}else{
			$sql = mysql_query("SELECT $selectSuffix $args FROM $from");
		}
		$countSql=0;
		//var_dump("SELECT $selectSuffix $args FROM $from WHERE $where $otherArgs");

		 if(!mysql_error()){
		while ($row = mysql_fetch_object($sql)) {
			foreach ($select as $arg) {
				$output[$countSql][$arg]=$row->$arg;
			}
			$countSql += 1;
		}
		$this->disconnect();
		 }else{

		 }
		return $output;
	}

	public function delete($table,$where){
		$this->query("DELETE FROM $table WHERE $where");

	}

	public function update($table,$set,$where){
		$args='';
		foreach ($set as $arg) {
			$args .=  $arg . ',';
		}
		//Letztes Komma abschneiden
		$args = substr($args, 0, -1);



		$this->query("UPDATE $table Set $args WHERE $where");

	}

	public function insert($table,$fields,$values){
	    $args="";
	    $args2="";
		foreach ($fields as $arg) {
			$args .=  $arg . ',';
		}
		//Letztes Komma abschneiden
		$args = substr($args, 0, -1);

		foreach ($values as $arg) {
			$args2 .= "'". $arg . "',";
		}
		//Letztes Komma abschneiden
		$args2 = substr($args2, 0, -1);

		return $this->queryAndGetRow("INSERT INTO $table ($args) VALUES ($args2)");

	}
}
?>
