<?php

require '../config/autoloader.php';
require '../config/parameters.php';
require '../config/routes.php';

use App\config\Autoloader;
use App\Router\Router;

$router = new Router();
registerRoutes($router);
$router->resolve();
var_dump($router);
