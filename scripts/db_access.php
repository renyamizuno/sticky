<?php
class DBAccess {
  private $db;
  function __construct() {
    $db = new PDO("sqlite:../db/sticky");
  }

  function select_id($hash) {
    $stmt = $db->prepare("select id from team_stickys where hash = ?");
    $stmt->execute(array($hash));
    $res = $stmt->fetch(PDO::FETCH_ASSOC);
    return $res["id"];
  }
}