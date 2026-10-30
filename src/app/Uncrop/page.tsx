"use client";
import { useState } from "react";

const UncropImage = () => {
    const [image, setImage] = useState<File | null>(null);
    const [extendLeft, setExtendLeft] = useState<number>(0);
    const [extendDown, setExtendDown] = useState<number>(0);

    const [extendRight, setExtendRight] = useState<number>(0);
    const [extendTop, setExtendTop] = useState<number>(0);

    const [image64, setImage64] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Handle file selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImage(e.target.files[0]);
        }
    };

    // Handle extend_left and extend_down changes
    const handleExtendLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtendLeft(Number(e.target.value));
    };

    const handleExtendDownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtendDown(Number(e.target.value));
    };
    const handleExtendTopChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtendTop(Number(e.target.value));
    };

    const handleExtendRightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setExtendRight(Number(e.target.value));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            setError("Please select an image.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("image_file", image);
        formData.append("extend_left", extendLeft.toString());
        formData.append("extend_down", extendDown.toString());
        formData.append("extend_up", extendTop.toString());
        formData.append("extend_right", extendRight.toString());

        try {
            const response = await fetch("/api/uncrop", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok && data.image64) {
                setImage64(data.image64);
            } else {
                setError(data.error || "Something went wrong.");
            }
        } catch (err) {
            console.error("Error during image uncrop:", err);
            setError("An error occurred while processing the image.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Uncrop Image</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="image_file"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Select Image
                    </label>
                    <input
                        type="file"
                        id="image_file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                        required
                    />
                </div>
                <div>
                    <label
                        htmlFor="extend_left"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Extend Left (px)
                    </label>
                    <input
                        type="number"
                        id="extend_left"
                        value={extendLeft}
                        onChange={handleExtendLeftChange}
                        className="block w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                </div>
                <div>
                    <label
                        htmlFor="extend_right"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Extend Right (px)
                    </label>
                    <input
                        type="number"
                        id="extend_right"
                        value={extendRight}
                        onChange={handleExtendRightChange}
                        className="block w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                </div>
                <div>
                    <label
                        htmlFor="extend_down"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Extend Down (px)
                    </label>
                    <input
                        type="number"
                        id="extend_down"
                        value={extendDown}
                        onChange={handleExtendDownChange}
                        className="block w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                </div>
                <div>
                    <label
                        htmlFor="extend_up"
                        className="block text-lg font-medium text-gray-700 mb-2"
                    >
                        Extend Top (px)
                    </label>
                    <input
                        type="number"
                        id="extend_up"
                        value={extendTop}
                        onChange={handleExtendTopChange}
                        className="block w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-700"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg disabled:opacity-50"
                >
                    {loading ? "Processing..." : "Submit"}
                </button>
            </form>

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}

            {image64 && (
                <div className="mt-6 text-center">
                    <h3 className="text-2xl font-medium text-gray-800 mb-4">
                        Processed Image
                    </h3>
                    <img
                        src={image64}
                        alt="Processed Uncropped"
                        className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            )}
             <div className="mt-4 flex flex-inline gap-4">
                         <button
                            onClick={() => setImage64(null)}
                            className="py-2 px-6 bg-gray-500 text-white font-semibold rounded-lg transition-all hover:bg-gray-600 focus:ring-4 focus:ring-gray-500"
                        >
                            Clear
                        </button>
                        <a
                            href={image64 ?? ""}
                            download="clipdrop-image.jpg"
                            style={{
                                display: 'inline-block',
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            Download Image
                        </a>
                    </div>
        </div>
    );
};

export default UncropImage;

// "use client";
// import { useState } from "react";

// const UncropImage = () => {
//     const [image, setImage] = useState<File | null>(null);
//     const [extendLeft, setExtendLeft] = useState<number>(0);
//     const [extendDown, setExtendDown] = useState<number>(0);
//     const [image64, setImage64] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);

//     // Handle file selection
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files) {
//             setImage(e.target.files[0]);
//         }
//     };

//     // Handle extend_left and extend_down changes
//     const handleExtendLeftChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setExtendLeft(Number(e.target.value));
//     };

//     const handleExtendDownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setExtendDown(Number(e.target.value));
//     };

//     // Handle form submission
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!image) {
//             setError("Please select an image.");
//             return;
//         }

//         setLoading(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append("image_file", image);
//         formData.append("extend_left", extendLeft.toString());
//         formData.append("extend_down", extendDown.toString());

//         try {
//             const response = await fetch("/api/uncrop", {
//                 method: "POST",
//                 body: formData,
//             });

//             const data = await response.json();
//             if (response.ok && data.image64) {
//                 setImage64(data.image64);
//             } else {
//                 setError(data.error || "Something went wrong.");
//             }
//         } catch (err) {
//             console.error("Error during image uncrop:", err);
//             setError("An error occurred while processing the image.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="max-w-lg mx-auto p-8 bg-white shadow-xl rounded-xl">
//             <h2 className="text-3xl font-semibold text-center mb-8 text-gray-800">
//                 Uncrop Your Image
//             </h2>

//             {/* Form Section */}
//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="flex flex-col">
//                     <label htmlFor="image_file" className="text-lg font-medium text-gray-700 mb-2">
//                         Select Image
//                     </label>
//                     <input
//                         type="file"
//                         id="image_file"
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                         required
//                     />
//                 </div>

//                 {/* Extend Left */}
//                 <div className="flex flex-col">
//                     <label htmlFor="extend_left" className="text-lg font-medium text-gray-700 mb-2">
//                         Extend Left (px)
//                     </label>
//                     <input
//                         type="number"
//                         id="extend_left"
//                         value={extendLeft}
//                         onChange={handleExtendLeftChange}
//                         className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>

//                 {/* Extend Down */}
//                 <div className="flex flex-col">
//                     <label htmlFor="extend_down" className="text-lg font-medium text-gray-700 mb-2">
//                         Extend Down (px)
//                     </label>
//                     <input
//                         type="number"
//                         id="extend_down"
//                         value={extendDown}
//                         onChange={handleExtendDownChange}
//                         className="block w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-gray-50 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                 </div>

//                 {/* Submit Button */}
//                 <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all hover:bg-blue-700 focus:ring-4 focus:ring-blue-500 disabled:bg-blue-300"
//                 >
//                     {loading ? (
//                         <div className="flex justify-center items-center">
//                             <div className="w-6 h-6 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
//                         </div>
//                     ) : (
//                         "Submit"
//                     )}
//                 </button>
//             </form>

//             {/* Error Message */}
//             {error && (
//                 <div className="mt-4 p-4 text-red-800 bg-red-200 border border-red-400 rounded-lg flex items-center">
//                     <svg
//                         className="w-5 h-5 mr-3"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M18 12H6M12 6v12"
//                         />
//                     </svg>
//                     <span>{error}</span>
//                 </div>
//             )}

//             {/* Image Preview */}
//             {image64 && (
//                 <div className="mt-6 text-center">
//                     <h3 className="text-2xl font-medium text-gray-800 mb-4">Processed Image</h3>
//                     <div className="border-4 border-gray-300 rounded-lg p-4 inline-block">
//                         <img
//                             src={image64}
//                             alt="Processed Uncropped"
//                             className="max-w-full h-auto rounded-lg shadow-lg"
//                         />

//                     </div>
//                     <div className="mt-4 flex flex-inline gap-4">
//                         <button
//                             onClick={() => setImage64(null)}
//                             className="py-2 px-6 bg-gray-500 text-white font-semibold rounded-lg transition-all hover:bg-gray-600 focus:ring-4 focus:ring-gray-500"
//                         >
//                             Clear
//                         </button>
//                         <a
//                             href={image64}
//                             download="clipdrop-image.jpg"
//                             style={{
//                                 display: 'inline-block',
//                                 padding: '10px 20px',
//                                 backgroundColor: '#28a745',
//                                 color: '#fff',
//                                 textDecoration: 'none',
//                                 borderRadius: '5px',
//                             }}
//                         >
//                             Download Image
//                         </a>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default UncropImage;
