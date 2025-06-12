import axios from "axios"

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post("/api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })

    return response.data.url
  } catch (error) {
    throw new Error("Failed to upload image")
  }
}
