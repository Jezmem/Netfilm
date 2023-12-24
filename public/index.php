<?php

require '../config/autoloader.php';
require '../config/parameters.php';
require '../config/routes.php';
require 'script.php';

use App\Router\Router;

$router = new Router();
registerRoutes($router);
$router->resolve();
