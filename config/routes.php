<?php

use App\Router\{Route, Router};
use App\Controller\{
    UserController,
    MovieController,
    RegisterController
};

function registerRoutes(Router $router)
{
    $router->addRoute(new Route('/public/', UserController::class, 'index'));
    $router->addRoute(new Route('/public/dashboard', MovieController::class, 'index'));
    $router->addRoute(new Route('/public/register', RegisterController::class, 'index'));
    $router->addRoute(new Route('/public/register/add', RegisterController::class, 'addUser', 'POST'));
}
