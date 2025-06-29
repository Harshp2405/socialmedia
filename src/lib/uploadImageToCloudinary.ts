export async function uploadImageToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data?.data?.secure_url) {
        throw new Error("Upload failed");
    }

    return data.data.secure_url;
}
