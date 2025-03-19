import { useState } from "react";
import { notification } from "antd";
import mammoth from "mammoth";

function isValidFileExtension(fileExtension) {
	return ["doc", "docx", "txt"].includes(fileExtension);
}

export default function InputForm() {
	const [selectedFileName, setSelectedFileName] = useState("");
	const [text, setText] = useState("");
	const [api, contextHolder] = notification.useNotification();

	function validateForm() {
		const minimumWords = 40;
		const minimumCharacters = 200;
		const numberOfWords = text.split(" ").length;
		const numberOfCharacters = text.length;

		if (numberOfWords < minimumWords) {
			api.error({
				message: "Insufficient Word Count",
				description: `Your input contains only ${numberOfWords} words. A minimum of ${minimumWords} words is required. You need ${
					minimumWords - numberOfWords
				} more words to proceed.`,
				pauseOnHover: true,
			});
			return;
		} else if (numberOfCharacters < minimumCharacters) {
			api.error({
				message: "Insufficient Character Count",
				description: `Your input contains only ${numberOfCharacters} characters. A minimum of ${minimumCharacters} characters is required. You need ${
					minimumCharacters - numberOfCharacters
				} more characters to proceed.`,
				pauseOnHover: true,
			});
			return;
		} else {
			// send content to backend
		}
	}

	function readFileContent(file, fileExtension) {
		const reader = new FileReader();

		reader.onerror = () => {
			api.error({
				message: "Unable to Read File",
				description: "There was an error reading the file. Please try again later.",
				pauseOnHover: true,
			});
		};

		if (fileExtension === "txt") {
			reader.onload = (e) => {
				const fileContent = e.target.result;
				setText(fileContent);
			};

			reader.readAsText(file);
		} else {
			reader.onload = async (e) => {
				try {
					const arrayBuffer = e.target.result;
					const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
					const fileContent = result.value;
					setText(fileContent);
				} catch (e) {
					api.error({
						message: "File Processing Error",
						description: "Unable to process the file. Please try again later.",
						pauseOnHover: true,
					});
				}
			};

			reader.readAsArrayBuffer(file);
		}
	}

	function handleFileChange(e) {
		const file = e.target.files[0];
		if (file) {
			const fileName = file.name;
			const fileExtension = fileName.split(".").pop().toLowerCase();
			if (isValidFileExtension(fileExtension)) {
				readFileContent(file, fileExtension);
				setSelectedFileName(fileName);
			} else {
				api.error({
					message: "Unsupported File Type",
					description: "Error: Unsupported file type. Only .docx, .doc, and .txt files are allowed.",
					pauseOnHover: true,
				});
			}
		} else {
			setSelectedFileName("");
		}
	}

	return (
		<>
			{contextHolder}
			<form
				className="flex flex-col items-center p-8 m-20 bg-slate-100 rounded-lg shadow-lg w-full max-w-2xl"
				action={validateForm}>
				<textarea
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
					placeholder="Enter text or upload file to check for plagiarism"></textarea>
				<div className="flex gap-4 mt-6 w-full justify-center">
					<button
						type="submit"
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer">
						Check for Plagiarism
					</button>
					<label
						className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer flex items-center justify-center"
						htmlFor="file-upload">
						{selectedFileName || "Choose File"}
						<input id="file-upload" className="hidden" type="file" onChange={handleFileChange} />
					</label>
				</div>
			</form>
		</>
	);
}
