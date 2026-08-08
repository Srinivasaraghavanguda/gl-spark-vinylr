import React, { useEffect, useState } from "react";
import { catalogService } from "../api/catalogService";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminMerch() {

    const [merch, setMerch] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        category: "",
        description: "",
        imageUrl: "",
        price: "",
        stock: "",
        variant: ""
    });

    // ==========================
    // LOAD MERCH
    // ==========================
    const loadMerch = async () => {

        try {

            setLoading(true);

            const data = await catalogService.getAllMerch();

            setMerch(data);

        } catch (error) {

            console.error(error);

            toast.error("Unable to load merch");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadMerch();
    }, []);

    // ==========================
    // FORM CHANGE
    // ==========================
    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==========================
    // RESET FORM
    // ==========================
    const resetForm = () => {

        setForm({
            name: "",
            category: "",
            description: "",
            imageUrl: "",
            price: "",
            stock: "",
            variant: ""
        });

        setEditingId(null);
        setShowForm(false);
    };

    // ==========================
    // ADD / UPDATE
    // ==========================
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const payload = {
                name: form.name,
                category: form.category,
                description: form.description,
                imageUrl: form.imageUrl,
                price: Number(form.price),
                stock: Number(form.stock),
                variant: form.variant
            };

            if (editingId) {

                await catalogService.updateMerch(
                    editingId,
                    payload
                );

                toast.success("Merch updated successfully");

            } else {

                await catalogService.addMerch(payload);

                toast.success("Merch added successfully");
            }

            resetForm();

            await loadMerch();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Operation failed"
            );
        }
    };

    // ==========================
    // EDIT
    // ==========================
    const handleEdit = (item) => {

        setEditingId(item.id);

        setForm({
            name: item.name || "",
            category: item.category || "",
            description: item.description || "",
            imageUrl: item.imageUrl || "",
            price: item.price ?? "",
            stock: item.stock ?? "",
            variant: item.variant || ""
        });

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================
    // DELETE
    // ==========================
    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this merch?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await catalogService.deleteMerch(id);

            toast.success("Merch deleted successfully");

            await loadMerch();

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Unable to delete merch"
            );
        }
    };

    return (

        <div className="min-h-screen bg-[#080808] text-white p-8">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

                <div>

                    <h1 className="text-4xl font-bold">
                        Admin Merch
                    </h1>

                    <p className="text-gray-400 mt-2">
                        Manage VinylR merchandise
                    </p>

                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowForm(true);
                    }}
                    className="bg-[#E11D2E] hover:bg-red-700 px-6 py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition"
                >
                    <Plus size={20} />
                    Add Merch
                </button>

            </div>


            {/* ==========================
                ADD / EDIT FORM
            ========================== */}

            {showForm && (

                <div className="bg-[#151515] border border-white/10 rounded-2xl p-6 mb-10">

                    <div className="flex items-center justify-between mb-6">

                        <h2 className="text-2xl font-bold">

                            {editingId
                                ? "Edit Merch"
                                : "Add New Merch"}

                        </h2>

                        <button
                            onClick={resetForm}
                            className="text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                    </div>


                    <form
                        onSubmit={handleSubmit}
                        className="grid md:grid-cols-2 gap-5"
                    >

                        {/* NAME */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* CATEGORY */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Category
                            </label>

                            <input
                                type="text"
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                required
                                placeholder="hoodies"
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* DESCRIPTION */}

                        <div className="md:col-span-2">

                            <label className="block text-sm text-gray-400 mb-2">
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="3"
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* IMAGE URL */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Image URL
                            </label>

                            <input
                                type="text"
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* VARIANT */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Variant
                            </label>

                            <input
                                type="text"
                                name="variant"
                                value={form.variant}
                                onChange={handleChange}
                                placeholder="Black XL"
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* PRICE */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* STOCK */}

                        <div>

                            <label className="block text-sm text-gray-400 mb-2">
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                min="0"
                                required
                                className="w-full bg-[#0c0c0c] border border-white/10 rounded-lg px-4 py-3 outline-none focus:border-[#E11D2E]"
                            />

                        </div>


                        {/* BUTTONS */}

                        <div className="md:col-span-2 flex gap-3 pt-2">

                            <button
                                type="submit"
                                className="bg-[#E11D2E] hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
                            >
                                {editingId
                                    ? "Update Merch"
                                    : "Add Merch"}
                            </button>

                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>
            )}


            {/* ==========================
                MERCH TABLE
            ========================== */}

            {loading ? (

                <div className="text-center py-20 text-gray-400">
                    Loading merch...
                </div>

            ) : merch.length === 0 ? (

                <div className="text-center py-20 text-gray-400">
                    No merch found.
                </div>

            ) : (

                <div className="overflow-x-auto rounded-2xl border border-white/10">

                    <table className="w-full">

                        <thead className="bg-[#151515]">

                            <tr>

                                <th className="text-left px-6 py-4">
                                    ID
                                </th>

                                <th className="text-left px-6 py-4">
                                    Name
                                </th>

                                <th className="text-left px-6 py-4">
                                    Category
                                </th>

                                <th className="text-left px-6 py-4">
                                    Variant
                                </th>

                                <th className="text-left px-6 py-4">
                                    Price
                                </th>

                                <th className="text-left px-6 py-4">
                                    Stock
                                </th>

                                <th className="text-left px-6 py-4">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {merch.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t border-white/10 hover:bg-white/5"
                                >

                                    <td className="px-6 py-4">
                                        {item.id}
                                    </td>

                                    <td className="px-6 py-4 font-semibold">
                                        {item.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.category}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.variant || "-"}
                                    </td>

                                    <td className="px-6 py-4">
                                        ₹{item.price}
                                    </td>

                                    <td className="px-6 py-4">
                                        {item.stock}
                                    </td>

                                    <td className="px-6 py-4">

                                        <div className="flex items-center gap-3">

                                            <button
                                                onClick={() =>
                                                    handleEdit(item)
                                                }
                                                className="p-2 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white transition"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="p-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}