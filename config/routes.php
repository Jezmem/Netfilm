<?php

use App\Router\{Route, Router};
use App\Controller\{
    UserController,
    MovieController,
    RegisterController
};

function registerRoutes(Router $router)
{
    $router->addRoute(new Route('/project/Netfilm/public/', UserController::class, 'index'));

    $router->addRoute(new Route('/project/Netfilm/register/', RegisterController::class, 'index'));
}
