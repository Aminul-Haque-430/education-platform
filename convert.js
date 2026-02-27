const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");

const inputDir = path.join(__dirname, "applications");
const outputDir = path.join(__dirname, "html-applications");

// Create output folder if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

function convertWordToHTML() {
    const files = fs.readdirSync(inputDir);

    files.forEach(file => {
        if (path.extname(file).toLowerCase() === ".docx") {
            const inputPath = path.join(inputDir, file);
            const outputFileName = file.replace(".docx", ".html");
            const outputPath = path.join(outputDir, outputFileName);

            mammoth.convertToHtml({ path: inputPath })
                .then(result => {
                    fs.writeFileSync(outputPath, result.value);
                    console.log(`✅ Converted: ${file}`);
                })
                .catch(err => {
                    console.error(`❌ Error converting ${file}:`, err);
                });
        }
    });
}

convertWordToHTML();