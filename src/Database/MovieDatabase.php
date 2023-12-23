<?php

namespace App\Database;

use App\Model\Movie;

final readonly class MovieDatabase
{
    private static function databaseName(): string
    {
        return 'movie';
    }

    public static function add(Movie $movie): bool
    {
        $connexion = Database::getInstance();
        $request = $connexion->prepare('INSERT INTO movie (title, producer, synopsis, genre, scriptwriter, production, release_year, image, picture)
        VALUES (:title, :producer, :synopsis, :genre, :scriptwriter, :production, :release_year, :image, :picture);');

        $movieTitle = $movie->getTitle();
        $movieProducer = $movie->getProducer();
        $movieSynopsis = $movie->getSynopsis();
        $movieGenre = $movie->getGenre();
        $movieScriptwriter = $movie->getScriptwriter();
        $movieProduction = $movie->getProduction();
        $movieRealeaseYears = $movie->getReleaseYear();
        $movieImage = $movie->getImage();
        $moviePicture = $movie->getPicture();

        $request->bindParam('title', $movieTitle);
        $request->bindParam('producer', $movieProducer);
        $request->bindParam('synopsis', $movieGenre);
        $request->bindParam('scripwriter', $movieScriptwriter);
        $request->bindParam('production', $movieProduction);
        $request->bindParam('release_year', $movieRealeaseYears);
        $request->bindParam('image', $movieImage);
        $request->bindParam('picture', $moviePicture);

        return $request->execute();
    }

    public static function findAll(): array
    {
        $connection = Database::getInstance();

        $query = sprintf("SELECT * FROM movie ORDER BY title;", self::databaseName());
        $query = $connection->prepare($query);
        $query->execute();

        $results = $query->fetchAll();

        $players = [];

        foreach ($results as $result) {
            $players[] = Movie::fromArray($result);
        }

        return $players;
    }

    public static function edit(Movie $movie): bool
    {
        $connexion = Database::getInstance();
        $request = $connexion->prepare('UPDATE movie SET title = :title, producer = :producer, synopsis = :synopsis, 
        genre = :genre, scriptwriter = :scriptwriter, production = :production, release_year = :release_year, 
        image = :image, picture = :picture WHERE id = :id;');

        $movieId = $movie->getId();
        $movieTitle = $movie->getTitle();
        $movieProducer = $movie->getProducer();
        $movieSynopsis = $movie->getSynopsis();
        $movieGenre = $movie->getGenre();
        $movieScriptwriter = $movie->getScriptwriter();
        $movieProduction = $movie->getProduction();
        $movieReleaseYear = $movie->getReleaseYear();
        $movieImage = $movie->getImage();
        $moviePicture = $movie->getPicture();

        $request->bindParam(':id', $movieId);
        $request->bindParam(':title', $movieTitle);
        $request->bindParam(':producer', $movieProducer);
        $request->bindParam(':synopsis', $movieSynopsis);
        $request->bindParam(':genre', $movieGenre);
        $request->bindParam(':scriptwriter', $movieScriptwriter);
        $request->bindParam(':production', $movieProduction);
        $request->bindParam(':release_year', $movieReleaseYear);
        $request->bindParam(':image', $movieImage);
        $request->bindParam(':picture', $moviePicture);

        return $request->execute();
    }
}
