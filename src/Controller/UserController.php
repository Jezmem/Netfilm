<?php

namespace App\Controller;

use App\Database\UserDatabase;
use App\Model\User;
use App\Database\UserDatabase;
use App\View\View;



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

    public function verify(): string
    {
        // Vérifie si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['login'])) {
            $username = $_POST['username'];
            $password = $_POST['password'];

            // Appelle la fonction verifyPassword du UserDatabase pour vérifier les informations
            if (UserDatabase::verifyPassword($username, $password)) {
                // L'utilisateur est authentifié avec succès
                // Redirige vers le tableau de bord ou effectue d'autres actions nécessaires
                header('Location: /project/Netfilm/dashboard/');
                exit;
            } else {
                // L'authentification a échoué
                // Affiche un message d'erreur
                $errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect.';
            }
        }

        // Rend la vue avec le message d'erreur
        return (new View('connect/index.html.php'))->render(['errorMessage' => $errorMessage ?? '']);
    }
}
