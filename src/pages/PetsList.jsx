import { useEffect, useState } from "react";
import API from "../api/axios";

const PetsList = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        API.get("/pets/available") // Only fetch available pets
            .then((res) => setPets(res.data))
            .catch((err) => console.error("Failed to fetch pets", err));
    }, []);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">Available Pets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pets.filter(pet => !pet.adopted).map((pet) => (
                    <div key={pet.id} className="border p-4 rounded shadow-md">
                        <h3 className="text-lg font-bold">{pet.name}</h3>
                        <p>Breed: {pet.breed}</p>
                        <p>Age: {pet.age}</p>
                        <p>Status: {pet.adopted ? "Adopted" : "Available"}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PetsList;
