<?php

Class APIData{

    private $status = "success";
    private $errorMessage = "null";
    private $format = "json";
    private $keys = array();
    private $values = array();

    public function __construct(){

    }

    private function trimSTR($string){
      return str_replace("\'", "'", addSlashes(trim(preg_replace('/\s+/', ' ', nl2br($string))))); 
    }

    public function add($key, $value){
        $value = $this->trimSTR($value);
        array_push($this->keys, $key);
        array_push($this->values, '"'.$value.'"');
    }

    public function addArray($key, $array){
        array_push($this->keys, $key);
        $value = "[";
        for($i = 0; $i<sizeof($array); $i++){
            $value .= '"' . $this->trimSTR($array[$i]) . '", ';
        }
        if(count($array) != 0){
        $value = substr($value, 0, -2);
        }
        $value .= "]";
        array_push($this->values, $value);

    }

    public function setFormat($format){
        $this->format = $format;
    }

    public function error($text){
        $this->status = "error";
        $this->errorMessage = '"'.$text.'"';
    }

    public function getOutput(){
        switch($this->format){
            case 'json':
            return $this->constructJSON();
            break;
        }
    }

    private function constructJSON(){
        $return = "";

        $return .= "{ \n";
        $return .= '  "status": "' . $this->status . '",' . "\n";

        $return .= '  "data": ' . $this->getJSONData() . ",";
        $return .= "\n" . '  "message": ' . $this->getErrorMessage() . '';
        $return .= "\n}";
        return $return;
    }

    private function getJSONData(){
        if(sizeof($this->keys) == 0 || $this->status == "error") {
            return "null";
        }
        $return = "{ \n";
        for($i = 0; $i < sizeof($this->keys); $i++){
            $return .= '    "' . $this->keys[$i] . '": ' . $this->values[$i] . '' . ",\n";
        }
        $return = substr($return, 0, -2);
        $return .= "\n";
        $return .= "  }";

        return $return;
    }

    private function getErrorMessage(){
        return $this->errorMessage;
    }


}

?>
