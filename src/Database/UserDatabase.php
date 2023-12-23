<?php

namespace App\Database;

use App\Model\User;

final class UserDatabase
{
    private static function databaseName(): string
    {
        return 'user';
    }

    public static function add(User $user): bool
    {
        $connexion = Database::getInstance();
        $request = $connexion->prepare('INSERT INTO user (last_name, first_name, username, password)
        VALUES (:last_name, :first_name, :username, :password);');

        $lastName = $user->getLastName();
        $firstName = $user->getFirstName();
        $username = $user->getUsername();
        $password = $user->getPassword();

        $request->bindParam(':last_name', $lastName);
        $request->bindParam(':first_name', $firstName);
        $request->bindParam(':username', $username);
        $request->bindParam(':password', $password);

        return $request->execute();
    }

    public static function findAll(): array
    {
        $connection = Database::getInstance();

        $query = sprintf("SELECT * FROM user ORDER BY last_name;");
        $query = $connection->prepare($query);
        $query->execute();

        $results = $query->fetchAll();

        $users = [];

        foreach ($results as $result) {
            $users[] = User::fromArray($result);
        }

        return $users;
    }

    public static function edit(User $user): bool
    {
        $connexion = Database::getInstance();
        $request = $connexion->prepare('UPDATE user SET last_name = :last_name, first_name = :first_name, 
        username = :username, password = :password WHERE id = :id;');

        $userId = $user->getId();
        $lastName = $user->getLastName();
        $firstName = $user->getFirstName();
        $username = $user->getUsername();
        $password = $user->getPassword();

        $request->bindParam(':id', $userId);
        $request->bindParam(':last_name', $lastName);
        $request->bindParam(':first_name', $firstName);
        $request->bindParam(':username', $username);
        $request->bindParam(':password', $password);

        return $request->execute();
    }
    public static function verifyPassword($username, $password): bool
    {
        $connexion = Database::getInstance();
        $request = $connexion->prepare('SELECT id, password FROM user WHERE username = :username;');
        $request->bindParam(':username', $username);
        $request->execute();

        $result = $request->fetch();

        if ($result) {
            // Vérifie si le mot de passe correspond
            return password_verify($password, $result['password']);
        }

        return false;
    }
}
