import { apiClient } from "../../vars/axios-var.ts";

export const sendReport = async (file: File, email: string, name: string): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("name", name);

    const response = await apiClient.post("/mail/send", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending file:", error);
    throw error;
  }
};