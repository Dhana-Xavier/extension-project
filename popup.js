const GEMINI_API_KEY = "AIzaSyAFn6MBIoO9K_h9dfmxABJ-ujUfhhJSiP0";

document.addEventListener("DOMContentLoaded", () => {
  

  const imageUpload = document.getElementById("imageUpload");
  const generateButton = document.getElementById("generate");
  const preview = document.getElementById("preview");
  const hashtagsArea = document.getElementById("hashtags");
  const copyButton = document.getElementById("copyButton");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const promptSuggestion = document.getElementById("promptSuggestion");
  const promptList = document.getElementById("promptList");
  const askImageButton = document.getElementById("askImage");
  const customPromptInput = document.getElementById("customPrompt");
  const submitPromptButton = document.getElementById("submitPrompt");


  const isDarkMode = localStorage.getItem("darkMode") === "true";
  document.body.classList.toggle("dark-mode", isDarkMode);
  darkModeToggle.classList.toggle("active", isDarkMode);

  
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.classList.toggle("active");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
  });

 
  imageUpload.addEventListener("change", function (event) {
   
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove("hidden");
        preview.setAttribute("data-base64", e.target.result.split(",")[1]);
       
      };
      reader.readAsDataURL(file);
    }
  });

 
  generateButton.addEventListener("click", async () => {
    await generateContent("Generate popular and trending hashtags for this image. Provide only hashtags and a short caption.");
  });

    
  // askImageButton.addEventListener("click", async () => {
  //   await generateContent("Describe the content of this image in detail.");
  // });

 
  submitPromptButton.addEventListener("click", async () => {
    const customPrompt = customPromptInput.value.trim();
    if (!customPrompt) {
      alert(" Please enter a prompt first.");
      return;
    }
    await generateContent(customPrompt);
  });

  
  async function generateContent(prompt) {
   

    const base64Image = preview.getAttribute("data-base64");
    if (!base64Image) {
      alert(" Please upload an image first.");
      return;
    }

    try {
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
                { text: prompt },
              ],
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API Request Failed (${response.status})`);

      const data = await response.json();
     

      const generatedContent =
        data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n") || "❌ No content generated.";
      hashtagsArea.value = generatedContent;
    
    } catch (error) {
      
      alert("Error generating content.");
    }
  }

  
  copyButton.addEventListener("click", () => {
    if (hashtagsArea.value.trim() === "") {
      alert(" No content to copy!");
      return;
    }

    navigator.clipboard.writeText(hashtagsArea.value).then(() => {
      alert(" Hashtags and caption copied to clipboard!");
    });
  });

  
  const prompts = [
    "Describe the mood and elements in this image.",
    "Generate a caption for Instagram with emojis.",
    "Suggest 5 viral hashtags for this image.",
    "List target audience for this content.",
    "Provide alternate hashtags for better reach.",
    "Turn this image into a viral meme idea",
  ];

  promptSuggestion.classList.remove("hidden");
  prompts.forEach((prompt) => {
    const li = document.createElement("li");
    li.textContent = prompt;
    li.addEventListener("click", () => {
      customPromptInput.value = prompt;
    });
    promptList.appendChild(li);
  });
});
