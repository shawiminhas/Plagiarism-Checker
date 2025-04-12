import { useState } from "react";
import { notification } from "antd";
import mammoth from "mammoth";
import axios from "axios";
import PlagiarismCheckButton from "./PlagiarismCheckButton";
import FileUploader from "./FileUploader";
import DownloadReportButton from "./DownloadReportButton";

function isValidFileExtension(fileExtension) {
	return ["doc", "docx", "txt"].includes(fileExtension);
}

export default function InputForm() {
	const [selectedFileName, setSelectedFileName] = useState("");
	const [text, setText] = useState("");
	const [api, contextHolder] = notification.useNotification();
	const [checkingForPlagiarism, setCheckingForPlagiarism] = useState(false);
	const [plagiarismBlob, setPlagiarismBlob] = useState(null);

	async function fetchPlagiarismPDF() {
		try {
			setCheckingForPlagiarism(true);
			const response = await axios.post(
				"http://localhost:5000/check-plagiarism",
				{ content: text },
				{
					responseType: "blob",
					headers: { "Content-Type": "application/json" },
				}
			);

			if (response.status < 200 || response.status >= 300) {
				throw new Error(`Error checking for plagiarism: ${response.status}`);
			}

			const contentType = response.headers["content-type"];
			if (!contentType || !contentType.includes("application/pdf")) {
				throw new Error("Invalid response type, expected a PDF.");
			}

			const pdfBlob = new Blob([response.data], { type: "application/pdf" });
			setPlagiarismBlob(pdfBlob);

			const message = "Successfully Generated Plagiarism Report";
			const description = "Press below to generate your plagiarism report.";
			showNotification(message, description, "success");
		} catch (e) {
			unableToGeneratePDFError();
			console.error(e);
		} finally {
			setCheckingForPlagiarism(false);
		}
	}

	function showNotification(title, description, type) {
		api[type]({ message: title, description, pauseOnHover: true });
	}

	function insufficientWordError(numberOfWords, minimumWords) {
		const message = "Insufficient Word Count";
		const description = `Your input contains ${numberOfWords} ${
			numberOfWords !== 1 ? "words" : "word"
		}. A minimum of ${minimumWords} words is required. You need ${minimumWords - numberOfWords} more ${
			minimumWords - numberOfWords === 1 ? "word" : "words"
		} to proceed.`;
		showNotification(message, description, "error");
	}

	function unableToGeneratePDFError() {
		const message = "Unable To Generate Plagiarism Report";
		const description = "Currently unable to generate plagiarism report at this time, please try again later.";
		showNotification(message, description, "error");
	}

	function insufficientCharacterError(numberOfCharacters, minimumCharacters) {
		const message = "Insufficient Character Count";
		const description = `Your input contains ${numberOfCharacters} ${
			numberOfCharacters === 1 ? "character" : "characters"
		}. A minimum of ${minimumCharacters} characters is required. You need 
			${minimumCharacters - numberOfCharacters} more ${
			minimumCharacters - numberOfCharacters === 1 ? "character" : "characters"
		} to proceed.`;
		showNotification(message, description, "error");
	}

	function handleSubmit(e) {
		e.preventDefault();
		validateForm();
	}

	function validateForm() {
		const minimumWords = 40;
		const minimumCharacters = 200;
		const numberOfWords = text.split(" ").length;
		const numberOfCharacters = text.length;

		if (!text.trim()) {
			insufficientWordError(0, minimumWords);
			return;
		} else if (numberOfWords < minimumWords) {
			insufficientWordError(numberOfWords, minimumWords);
			return;
		} else if (numberOfCharacters < minimumCharacters) {
			insufficientCharacterError(numberOfCharacters, minimumCharacters);
			return;
		} else {
			fetchPlagiarismPDF();
		}
	}

	function readFileContent(file, fileExtension) {
		const reader = new FileReader();

		reader.onerror = () => {
			const message = "Unable to Read File";
			const description = "There was an error reading the file. Please try again later.";
			showNotification(message, description, "error");
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
					const message = "File Processing Error";
					const description = "Unable to process the file. Please try again later.";
					showNotification(message, description, "error");
				}
			};

			reader.readAsArrayBuffer(file);
		}
	}

	function handleFileChange(e) {
		const file = e.target.files[0];

		if (!file) {
			setSelectedFileName("");
			setText("");
			setPlagiarismBlob(null);
			return;
		}

		const fileName = file.name;
		const fileExtension = fileName.split(".").pop().toLowerCase();

		if (!isValidFileExtension(fileExtension)) {
			const message = "Unsupported File Type";
			const description = "Error: Unsupported file type. Only .docx, .doc, and .txt files are allowed.";
			showNotification(message, description, "error");
			return;
		}

		readFileContent(file, fileExtension);
		setSelectedFileName(fileName);
		setPlagiarismBlob(null);
	}

	function handleTextAreaChange(e) {
		setText(e.target.value);
		setPlagiarismBlob(null);
	}

	return (
		<>
			{contextHolder}
			<form
				className="flex flex-col items-center p-8 m-20 bg-slate-100 rounded-lg shadow-lg w-full max-w-2xl"
				onSubmit={handleSubmit}>
				<textarea
					value={text}
					onChange={handleTextAreaChange}
					className="w-full h-40 p-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
					placeholder="Enter text or upload file to check for plagiarism"></textarea>
				<div className="flex gap-4 m-6 w-full justify-center">
					<PlagiarismCheckButton checkingForPlagiarism={checkingForPlagiarism} onClick={handleSubmit} />
					<FileUploader selectedFileName={selectedFileName} handleFileChange={handleFileChange} />
				</div>
				{plagiarismBlob && <DownloadReportButton plagiarismBlob={plagiarismBlob} showNotification={showNotification} />}
			</form>
		</>
	);
}
