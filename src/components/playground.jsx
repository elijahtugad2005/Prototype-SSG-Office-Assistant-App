
import React , {useState} from "react";

function Playground() {
    // 1 & 2. Correctly declare useState inside the function.
    // We use an array to store image objects for display (src and label).
    const [images, setImages] = useState([]); 

    const convertAndDisplayImage = (e) => {
        // 4. Initialize FileReader
        const reader = new FileReader(); 

        // 3. Access 'files' property correctly
        const file = e.target.files[0];

        if (!file) return;

        reader.onload = function (e) {
            const dataUrl = e.target.result;
            const base64Data = dataUrl.split(',')[1];
            
            console.log("File type:", file.type);
            console.log("File size:", file.size, "bytes");
            console.log("Base64 length:", base64Data.length, "characters");
            
            // Reconstruct the Data URL from Base64
            const reconstructedUrl = `data:${file.type};base64,${base64Data}`;

            // 5 & 6. Update the state with the data needed for rendering.
            setImages([
                { src: dataUrl, label: "Original via Data URL" },
                { src: reconstructedUrl, label: "Reconstructed from Base64" }
            ]);
        };
        
        reader.readAsDataURL(file);
    };

    return (
        <>
            <h2>🖼️ Image to Base64 Converter</h2>
            <input 
                type="file" 
                id="imageInput" 
                accept="image/*" 
                onChange={convertAndDisplayImage}
            />

            {/* 5. Render images from state using React's JSX */}
            <div id="imageContainer" style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {images.map((img, index) => (
                    <div key={index}>
                        <h3>{img.label}</h3>
                        <img 
                            src={img.src} 
                            alt={img.label} 
                            style={{ maxWidth: '300px', border: '1px solid #ccc' }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
}
    
export default Playground;