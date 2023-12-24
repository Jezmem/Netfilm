<?php

namespace App\Controller;

use App\Database\MovieDatabase;
use App\Model\Movie;

class MovieController extends AbstractController
{
    private $movieDatabase;

    public function __construct()
    {
        $this->movieDatabase = new MovieDatabase();
    }

    public function index(): string
    {
        return $this->render('dashboard/index.html.php');
    }

    public function getAllMovies()
    {
        // Récupérer tous les films
        return $this->movieDatabase->findAll();
    }

    public function addMovie($title, $producer, $synopsis, $genre, $scriptwriter, $production, $releaseYear, $image, $picture)
    {
        // Ajouter un nouveau film
        $newMovie = new Movie(null, $title, $producer, $synopsis, $genre, $scriptwriter, $production, $releaseYear, $image, $picture);
        return $this->movieDatabase->add($newMovie);
    }

    public function editMovie($id, $title, $producer, $synopsis, $genre, $scriptwriter, $production, $releaseYear, $image, $picture)
    {
        // Modifier un film existant
        $editedMovie = new Movie($id, $title, $producer, $synopsis, $genre, $scriptwriter, $production, $releaseYear, $image, $picture);
        return $this->movieDatabase->edit($editedMovie);
    }
}
