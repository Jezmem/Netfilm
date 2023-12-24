<?php

namespace App\Controller;

use App\Database\UserDatabase;
use App\Model\User;


class UserController extends AbstractController
{
    private $userDatabase;

    public function __construct()
    {
        $this->userDatabase = new UserDatabase();
    }

    public function index(): string
    {
        return $this->render('connect/index.html.php');
    }

    public function getAllUsers()
    {
        // Récupérer tous les utilisateurs
        return $this->userDatabase->findAll();
    }
}
