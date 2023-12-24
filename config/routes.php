<?php

use App\Router\{Route, Router};
use App\Controller\{
    UserController,
    MovieController,
    RegisterController
};

function registerRoutes(Router $router)
{
    $router->addRoute(new Route('/php/Netfilm/Netfilm/public/', UserController::class, 'index'));
    $router->addRoute(new Route('/php/Netfilm/Netfilm/public/dashboard', MovieController::class, 'index'));
    $router->addRoute(new Route('/php/Netfilm/Netfilm/public/register', RegisterController::class, 'index'));
    $router->addRoute(new Route('/php/Netfilm/Netfilm/public/register/add', RegisterController::class, 'addUser', 'POST'));
}
