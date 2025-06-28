import React from 'react';
import PaginateIndicator from "./PaginateIndicator.jsx";
import Movie from "./Movie.jsx";

const Index = () => {
    return (
        <div className="relative">
            <Movie />
            <PaginateIndicator />
        </div>

    );
};

export default Index;