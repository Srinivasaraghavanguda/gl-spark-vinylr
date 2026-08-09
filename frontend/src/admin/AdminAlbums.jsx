import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { catalogService } from "../api/catalogService";

export default function AdminAlbums() {

    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAlbum, setEditingAlbum] = useState(null);
const [isEditMode, setIsEditMode] = useState(false);

    const [showForm, setShowForm] = useState(false);

    const [newAlbum, setNewAlbum] = useState({
        title: "",
        artist: "",
        genre: "",
        description: "",
        imageUrl: "",
        releaseYear: "",
        price: "",
        stock: ""
    });

    useEffect(() => {
        loadAlbums();
    }, []);

    const loadAlbums = async () => {
    try {
        const data = await catalogService.getAllAlbums();

        const sortedAlbums = [...data].sort((a, b) => {
            const stockA = Number(a.stock || 0);
            const stockB = Number(b.stock || 0);

            if (stockA > 0 && stockB <= 0) return -1;
            if (stockA <= 0 && stockB > 0) return 1;

            return 0;
        });

        setAlbums(sortedAlbums);

    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
};

const saveAlbum = async () => {

    try {

        const albumData = {

            ...newAlbum,

            releaseYear: Number(newAlbum.releaseYear),

            price: Number(newAlbum.price),

            stock: Number(newAlbum.stock)

        };

        if (isEditMode) {

            await catalogService.updateAlbum(
                editingAlbum.id,
                albumData
            );

        } else {

            await catalogService.addAlbum(albumData);

        }

        await loadAlbums();

        setShowForm(false);

        setIsEditMode(false);

        setEditingAlbum(null);

        setNewAlbum({
            title: "",
            artist: "",
            genre: "",
            description: "",
            imageUrl: "",
            releaseYear: "",
            price: "",
            stock: ""
        });

    } catch (err) {

        console.error(err);

        alert("Unable to save album.");

    }

};

const deleteAlbum = async (id) => {

    const confirmDelete = window.confirm(
        "Delete this album?"
    );

    if (!confirmDelete) return;

    try {

        await catalogService.deleteAlbum(id);

        await loadAlbums();

    } catch (err) {

        console.error(err);

        alert("Unable to delete album.");

    }

};

    if (loading) {
        return (
            <div className="min-h-screen bg-[#080808] flex items-center justify-center text-white text-2xl">
                Loading Albums...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#080808] text-white pt-28 lg:pt-32 px-4 sm:px-6 lg:px-10 pb-10">

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-5xl font-bold">
                        Admin Albums
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Manage your VinylR album catalog
                    </p>

                </div>

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#E11D2E] hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold"
                >
                    + Add Album
                </button>

            </div>

            <div className="overflow-x-auto rounded-2xl border border-gray-700">

                <table className="w-full">

                    <thead className="bg-[#151515]">

                        <tr>

                            <th className="p-4">ID</th>
                            <th className="p-4">Title</th>
                            <th className="p-4">Artist</th>
                            <th className="p-4">Genre</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Stock</th>
                            <th className="p-4">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {albums.map(album => (

                            <tr
                                key={album.id}
                                className="border-t border-gray-700 hover:bg-[#111111]"
                            >

                                <td className="p-4">{album.id}</td>

                                <td className="p-4">{album.title}</td>

                                <td className="p-4">{album.artist}</td>

                                <td className="p-4">{album.genre}</td>

                                <td className="p-4">
                                    ₹{album.price}
                                </td>

                                <td className="p-4">
                                    {album.stock}
                                </td>

                                <td className="p-4">

    <button
    onClick={() => {

        setIsEditMode(true);

        setEditingAlbum(album);

        setNewAlbum(album);

        setShowForm(true);

    }}
    className="bg-blue-600 px-4 py-2 rounded-lg mr-2 hover:bg-blue-700"
>
    Edit
</button>

    <button
    onClick={() => deleteAlbum(album.id)}
    className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700"
>
    Delete
</button>

</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {showForm && (

                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                    <div className="bg-[#121212] rounded-3xl w-[700px] p-8">

                        <div className="flex justify-between items-center mb-8">

                            <h2 className="text-3xl font-bold">
    {isEditMode ? "Edit Album" : "Add Album"}
</h2>

                            <button
                                onClick={() => setShowForm(false)}
                            >
                                <X size={30} />
                            </button>

                        </div>

                        <div className="grid grid-cols-2 gap-5">

                            <input
                                placeholder="Title"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.title}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        title: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Artist"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.artist}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        artist: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Genre"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.genre}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        genre: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Release Year"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.releaseYear}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        releaseYear: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Price"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.price}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        price: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Stock"
                                className="bg-[#1A1A1A] rounded-xl p-4"
                                value={newAlbum.stock}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        stock: e.target.value
                                    })
                                }
                            />

                            <input
                                placeholder="Image URL"
                                className="bg-[#1A1A1A] rounded-xl p-4 col-span-2"
                                value={newAlbum.imageUrl}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        imageUrl: e.target.value
                                    })
                                }
                            />

                            <textarea
                                placeholder="Description"
                                rows={4}
                                className="bg-[#1A1A1A] rounded-xl p-4 col-span-2"
                                value={newAlbum.description}
                                onChange={(e) =>
                                    setNewAlbum({
                                        ...newAlbum,
                                        description: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="flex justify-end gap-4 mt-8">

                            <button
                                onClick={() => setShowForm(false)}
                                className="px-6 py-3 rounded-xl bg-gray-700"
                            >
                                Cancel
                            </button>

                            <button
    onClick={saveAlbum}
    className="px-8 py-3 rounded-xl bg-[#E11D2E] hover:bg-red-700"
>
    Save Album
</button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}