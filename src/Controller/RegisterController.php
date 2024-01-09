<?php

namespace App\Controller;

use App\Database\UserDatabase;
use App\Model\User;


class RegisterController extends AbstractController
{
    private $userDatabase;

    public function __construct()
    {
        $this->userDatabase = new UserDatabase();
    }

    public function index(): string
    {
        return $this->render('register/index.html.php');
    }
    public function getAllUsers()
    {
        // Récupérer tous les utilisateurs
        return $this->userDatabase->findAll();
    }
    public function add()
    {
        // Récupère les données du formulaire
        $lastName = $_POST['last_name'];
        $firstName = $_POST['first_name'];
        $username = $_POST['username'];
        $password = $_POST['password'];

        // Crée un nouvel objet User
        $user = new User(null, $lastName, $firstName, $username, $password);

        // Ajoute l'utilisateur à la base de données
        UserDatabase::add($user);

        // Redirige vers la page de connexion
        header('Location: /connexion');
        exit;
    }
}
