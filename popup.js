const GEMINI_API_KEY = "AIzaSyAFn6MBIoO9K_h9dfmxABJ-ujUfhhJSiP0";

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Popup.js Loaded Successfully!");

  const imageUpload = document.getElementById("imageUpload");
  const generateButton = document.getElementById("generate");
  const preview = document.getElementById("preview");
  const hashtagsArea = document.getElementById("hashtags");
  const copyButton = document.getElementById("copyButton");

  if (!imageUpload || !generateButton || !preview || !hashtagsArea || !copyButton) {
    console.error("❌ Error: Some elements are missing in popup.html.");
    return;
  }

  imageUpload.addEventListener("change", function (event) {
    console.log("📸 Image Selected");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        preview.setAttribute("data-base64", e.target.result.split(",")[1]);
        console.log("✅ Image Loaded Successfully.");
      };
      reader.readAsDataURL(file);
    }
  });

  generateButton.addEventListener("click", async () => {
    console.log("🚀 Generate Hashtags Button Clicked");

    const base64Image = preview.getAttribute("data-base64");
    if (!base64Image) {
      alert(" Please upload an image first.");
      console.log("❌ No image data found.");
      return;
    }

    try {
      console.log("📡 Sending request to Gemini API with Image...");

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image,
                  },
                },
                {
                  text: "Generate popular and trending hashtags for this image. Only provide hashtags and a short relevant caption.",
                },
              ],
            },
          ],
        }),
      });

      console.log("📡 HTTP Status:", response.status);

      if (!response.ok) {
        throw new Error(`API Request Failed (${response.status} - ${response.statusText})`);
      }

      const data = await response.json();
      console.log("📩 Parsed Response:", data);

      const hashtags =
        data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") || "No hashtags found.";
      hashtagsArea.value = hashtags;
      console.log("✅ Hashtags Generated:", hashtags);
    } catch (error) {
      console.error("❌ API Request Error:", error);
    }
  });


  copyButton.addEventListener("click", () => {
    if (hashtagsArea.value.trim() === "") {
      alert(" No hashtags to copy!");
      return;
    }

    hashtagsArea.select();
    document.execCommand("copy");
    alert("Hashtags copied to clipboard!");
  });
});
