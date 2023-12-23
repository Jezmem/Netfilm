<?php

namespace App\Model;

class Movie
{
    private $id;
    private $title;
    private $producer;
    private $synopsis;
    private $genre;
    private $scriptwriter;
    private $production;
    private $releaseYear;
    private $image;
    private $picture;

    public function __construct($id, $title, $producer, $synopsis, $genre, $scriptwriter, $production, $releaseYear, $image, $picture)
    {
        $this->id = $id;
        $this->title = $title;
        $this->producer = $producer;
        $this->synopsis = $synopsis;
        $this->genre = $genre;
        $this->scriptwriter = $scriptwriter;
        $this->production = $production;
        $this->releaseYear = $releaseYear;
        $this->image = $image;
        $this->picture = $picture;
    }

    // Getters
    public function getId()
    {
        return $this->id;
    }

    public function getTitle()
    {
        return $this->title;
    }

    public function getProducer()
    {
        return $this->producer;
    }

    public function getSynopsis()
    {
        return $this->synopsis;
    }

    public function getGenre()
    {
        return $this->genre;
    }

    public function getScriptwriter()
    {
        return $this->scriptwriter;
    }

    public function getProduction()
    {
        return $this->production;
    }

    public function getReleaseYear()
    {
        return $this->releaseYear;
    }

    public function getImage()
    {
        return $this->image;
    }

    public function getPicture()
    {
        return $this->picture;
    }

    // Setters
    public function setTitle($title)
    {
        $this->title = $title;
    }

    public function setProducer($producer)
    {
        $this->producer = $producer;
    }

    public function setSynopsis($synopsis)
    {
        $this->synopsis = $synopsis;
    }

    public function setGenre($genre)
    {
        $this->genre = $genre;
    }

    public function setScriptwriter($scriptwriter)
    {
        $this->scriptwriter = $scriptwriter;
    }

    public function setProduction($production)
    {
        $this->production = $production;
    }

    public function setReleaseYear($releaseYear)
    {
        $this->releaseYear = $releaseYear;
    }

    public function setImage($image)
    {
        $this->image = $image;
    }

    public function setPicture($picture)
    {
        $this->picture = $picture;
    }
}
