import { apiClient } from "../../vars/axios-var.ts";

export const sendReport = async (
  file: File,
  data: { email: string; name: string }
): Promise<void> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", data.name);
    formData.append("email", data.email);

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
