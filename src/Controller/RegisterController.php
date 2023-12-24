<?php

namespace App\Controller;

use App\Database\UserDatabase;
use App\Model\User;

final class RegisterController
{
    public function index()
    {
        // Charge la vue pour la page d'inscription
        include '../views/register/index.html.php';
    }

    public function addUser()
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

        // Redirige vers la page de connexion ou une autre page si nécessaire
        header('Location: /connexion');
        exit;
    }
}
