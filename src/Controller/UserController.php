<?php

namespace App\Controller;

use App\Database\UserDatabase;

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
        return $this->userDatabase->getAllUsers();
    }

    public function addUser($lastName, $firstName, $username, $password)
    {
        // Ajouter un nouvel utilisateur
        $newUser = new User(null, $lastName, $firstName, $username, $password);
        return $this->userDatabase->addUser($newUser);
    }

    public function editUser($id, $lastName, $firstName, $username, $password)
    {
        // Modifier un utilisateur existant
        $editedUser = new User($id, $lastName, $firstName, $username, $password);
        return $this->userDatabase->editUser($editedUser);
    }

}
