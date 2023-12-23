<?php

use App\Router\{Route, Router};
use App\Controller\{
    UserController,
    MovieController
};

function registerRoutes(Router $router) {
    $router->addRoute(new Route('/connexion', UserController::class, 'index'));
    $router->addRoute(new Route('/dashboard', MovieController::class, 'index'));
}
