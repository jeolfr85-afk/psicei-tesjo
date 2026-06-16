<?php
require_once __DIR__ . '/../API/config.php';
psiceiStartSession();
psiceiDestroySession();
header('Location: ' . psiceiLoginUrlPath());
exit();
